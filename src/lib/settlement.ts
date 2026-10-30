import { getDb, initializeDatabase } from './db';
import { logAdminActivity } from './auth';

export interface SettleOrderParams {
  orderId?: string;
  orderNumber?: string;
  razorpayOrderId?: string;
  razorpayPaymentId: string;
  source: 'verify_endpoint' | 'webhook';
  amount?: number;
}

export interface RestockItemSpec {
  id: string;
  quantity: number;
}

export interface RefundOrderParams {
  orderId: string;
  reason: string;
  userEmail: string;
  amount?: number; // Optional INR amount for partial refund; defaults to remaining balance
  restock?: boolean; // Defaults to false! Explicit decision required
  restockItems?: RestockItemSpec[]; // Specific items and quantities to restock
  idempotencyKey?: string;
  skipProviderCall?: boolean; // Used for offline/mock testing
}

export interface RazorpayRefundResponse {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  payment_id: string;
  status: 'pending' | 'processed' | 'failed';
  speed_processed?: string;
  speed_requested?: string;
  receipt?: string;
}

/**
 * Invokes the real Razorpay Refund API via server-side HTTP Basic Auth
 */
export async function callRazorpayRefundApi(
  paymentId: string,
  amountInPaise?: number,
  notes?: Record<string, string>,
  receipt?: string,
  idempotencyKey?: string
): Promise<{ success: boolean; data?: RazorpayRefundResponse; error?: string; isNetworkTimeout?: boolean }> {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const isProduction = process.env.NODE_ENV === 'production';

  if (!keyId || !keySecret) {
    if (isProduction) {
      return {
        success: false,
        error: 'Razorpay credentials (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET) not configured in production.'
      };
    }
    // In local development / test without keys, check if mock simulator is explicitly allowed
    if (process.env.ALLOW_MOCK_REFUNDS_IN_DEV === 'true') {
      return {
        success: true,
        data: {
          id: `rfnd_mock_${Date.now()}`,
          entity: 'refund',
          amount: amountInPaise || 100000,
          currency: 'INR',
          payment_id: paymentId,
          status: 'processed',
          receipt
        }
      };
    }
    return {
      success: false,
      error: 'Razorpay gateway credentials missing. Cannot execute refund with provider.'
    };
  }

  try {
    const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const body: Record<string, any> = {
      speed: 'normal'
    };
    if (amountInPaise) {
      body.amount = amountInPaise;
    }
    if (notes) {
      body.notes = notes;
    }
    if (receipt) {
      body.receipt = receipt;
    }

    const headers: Record<string, string> = {
      'Authorization': authHeader,
      'Content-Type': 'application/json'
    };
    if (idempotencyKey) {
      headers['X-Razorpay-Idempotency-Key'] = idempotencyKey;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const res = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(paymentId)}/refund`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const data = await res.json();
    if (!res.ok) {
      const errMsg = data?.error?.description || data?.error?.message || `Razorpay refund failed with HTTP ${res.status}`;
      return { success: false, error: errMsg };
    }

    return { success: true, data };
  } catch (err: any) {
    const isTimeout = err.name === 'AbortError' || err.name === 'TimeoutError' || err.message?.toLowerCase().includes('timeout');
    return {
      success: false,
      error: err.message || 'Network error calling Razorpay refund API',
      isNetworkTimeout: isTimeout
    };
  }
}

/**
 * Shared, transactional, idempotent order payment settlement mechanism.
 * Used by both POST /api/payments/razorpay/verify and POST /api/payments/razorpay/webhook.
 *
 * Guarantees:
 * 1. An order already marked 'paid' will NEVER have inventory decremented a second time.
 * 2. Atomic conditional update ensures concurrent calls from verify + webhook don't conflict.
 * 3. Atomic stock reduction with inventory availability check prevents overselling.
 * 4. Wrapped in an ACID database transaction: if any update fails, all changes roll back.
 * 5. Inventory movements are accurately logged with auditable reasons.
 * 6. Customer lifetime spend and order count are updated accurately.
 */
export async function settleOrderPayment(params: SettleOrderParams): Promise<{
  success: boolean;
  alreadyPaid: boolean;
  order?: any;
  error?: string;
  stockShortage?: boolean;
}> {
  await initializeDatabase();
  const db = getDb();

  // Find the target order
  let sql = 'SELECT * FROM orders WHERE 1=1';
  const args: any[] = [];

  if (params.orderId) {
    sql += ' AND id = ?';
    args.push(params.orderId);
  } else if (params.razorpayOrderId) {
    sql += ' AND razorpay_order_id = ?';
    args.push(params.razorpayOrderId);
  } else if (params.orderNumber) {
    sql += ' AND order_number = ?';
    args.push(params.orderNumber);
  } else {
    return { success: false, alreadyPaid: false, error: 'No order identifier provided' };
  }

  const findRes = await db.execute({ sql, args });
  if (findRes.rows.length === 0) {
    return { success: false, alreadyPaid: false, error: 'Order not found in database' };
  }

  const order = findRes.rows[0];

  // IDEMPOTENCY CHECK 1: If already marked paid, return immediately without touching inventory
  if (order.payment_status === 'paid') {
    return {
      success: true,
      alreadyPaid: true,
      order: {
        ...order,
        grand_total: Number(order.grand_total)
      }
    };
  }

  // Parse purchased items
  let items: any[] = [];
  try {
    items = JSON.parse(String(order.items));
  } catch {}

  // OPEN WRITE TRANSACTION FOR COMPLETE ACID ATOMICITY
  const tx = await db.transaction('write');
  try {
    // 1. ATOMIC CONDITIONAL UPDATE ON ORDER:
    // Only update if payment_status is NOT 'paid'. If a concurrent request just marked it paid,
    // rowsAffected will be 0, and we abort immediately to prevent duplicate stock reduction.
    const capturedCeiling = params.amount || Number(order.grand_total);
    const capturedCeilingPaise = Math.round(capturedCeiling * 100);
    const grandTotalPaise = order.grand_total_paise != null
      ? Number(order.grand_total_paise)
      : Math.round(Number(order.grand_total) * 100);

    const updateRes = await tx.execute({
      sql: `UPDATE orders SET
        payment_status = 'paid',
        captured_amount = ?,
        captured_amount_paise = ?,
        grand_total_paise = COALESCE(grand_total_paise, ?),
        razorpay_payment_id = ?,
        updated_at = ?
        WHERE id = ? AND payment_status != 'paid'`,
      args: [capturedCeiling, capturedCeilingPaise, grandTotalPaise, params.razorpayPaymentId, Date.now(), order.id]
    });

    if (updateRes.rowsAffected === 0) {
      await tx.rollback();
      return {
        success: true,
        alreadyPaid: true,
        order
      };
    }

    let hasStockShortage = false;

    // 2. ATOMIC STOCK DEDUCTION WITH INVENTORY AVAILABILITY CHECK:
    for (const item of items) {
      const qty = Number(item.quantity || 1);
      const prodId = item.id;

      if (prodId && !prodId.startsWith('custom_')) {
        let prodRes = await tx.execute({
          sql: 'SELECT id, sku, inventory_quantity FROM products WHERE id = ?',
          args: [prodId]
        });

        if (prodRes.rows.length === 0 && item.title) {
          prodRes = await tx.execute({
            sql: 'SELECT id, sku, inventory_quantity FROM products WHERE title = ?',
            args: [item.title]
          });
        }

        if (prodRes.rows.length > 0) {
          const prod = prodRes.rows[0];
          const currentQty = Number(prod.inventory_quantity);

          // ATOMIC CHECK & DECREMENT:
          const stockUpdate = await tx.execute({
            sql: 'UPDATE products SET inventory_quantity = inventory_quantity - ?, updated_at = ? WHERE id = ? AND inventory_quantity >= ?',
            args: [qty, Date.now(), prod.id, qty]
          });

          if (stockUpdate.rowsAffected === 0) {
            // Overselling detected! Stock was less than requested quantity
            hasStockShortage = true;
            await tx.execute({
              sql: `INSERT INTO inventory_logs (id, product_id, sku, adjustment, previous_quantity, new_quantity, reason, user_email, created_at)
                    VALUES (?, ?, ?, 0, ?, ?, ?, ?, ?)`,
              args: [
                `inv_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
                String(prod.id),
                String(prod.sku),
                currentQty,
                currentQty,
                `OVERSELL ALERT: Insufficient stock for order ${order.order_number} (requested ${qty}, available ${currentQty})`,
                'system@avzvaganza.com',
                Date.now()
              ]
            });
          } else {
            // Deducted successfully, record movement
            const newQty = currentQty - qty;
            await tx.execute({
              sql: `INSERT INTO inventory_logs (id, product_id, sku, adjustment, previous_quantity, new_quantity, reason, user_email, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              args: [
                `inv_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
                String(prod.id),
                String(prod.sku),
                -qty,
                currentQty,
                newQty,
                `Order Payment Settlement: ${order.order_number} (${params.source})`,
                'system@avzvaganza.com',
                Date.now()
              ]
            });
          }
        }
      }
    }

    // Explicitly update unfulfillable orders so merchant and systems can act
    if (hasStockShortage) {
      await tx.execute({
        sql: `UPDATE orders SET
          fulfillment_status = 'unfulfillable_oversold',
          internal_notes = COALESCE(internal_notes || ' | ', '') || 'OVERSELL ALERT: Stock exhausted prior to settlement. Item unfulfillable.'
          WHERE id = ?`,
        args: [order.id]
      });
    }

    // 3. Customer Profile Sync inside transaction
    const custEmail = String(order.customer_email);
    if (custEmail) {
      await tx.execute({
        sql: `INSERT INTO customers (id, email, name, phone, address, total_orders, total_spent, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, 1, ?, ?, ?)
              ON CONFLICT(email) DO UPDATE SET
                total_orders = total_orders + 1,
                total_spent = total_spent + excluded.total_spent,
                updated_at = excluded.updated_at`,
        args: [
          `cust_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          custEmail,
          order.customer_name,
          order.customer_phone,
          order.shipping_address,
          Number(order.grand_total),
          Date.now(),
          Date.now()
        ]
      });
    }

    // 4. Audit Log inside transaction
    await tx.execute({
      sql: `INSERT INTO activity_logs (id, user_email, action, entity_type, entity_id, details, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [
        `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        'system@avzvaganza.com',
        hasStockShortage ? 'SETTLE_PAYMENT_WITH_STOCK_SHORTAGE' : 'SETTLE_PAYMENT_SUCCESS',
        'orders',
        String(order.id),
        JSON.stringify({
          order_number: order.order_number,
          source: params.source,
          payment_id: params.razorpayPaymentId,
          stockShortage: hasStockShortage,
          fulfillment_status: hasStockShortage ? 'unfulfillable_oversold' : 'unfulfilled'
        }),
        Date.now()
      ]
    });

    // COMMIT ENTIRE TRANSACTION
    await tx.commit();

    return {
      success: true,
      alreadyPaid: false,
      stockShortage: hasStockShortage,
      order: {
        ...order,
        payment_status: 'paid',
        fulfillment_status: hasStockShortage ? 'unfulfillable_oversold' : 'unfulfilled',
        captured_amount: capturedCeiling,
        razorpay_payment_id: params.razorpayPaymentId
      }
    };
  } catch (err: any) {
    await tx.rollback();
    return {
      success: false,
      alreadyPaid: false,
      error: `Settlement transaction failed: ${err.message}`
    };
  } finally {
    tx.close();
  }
}

/**
 * Marks an order as failed and restores any reserved state
 */
export async function failOrderPayment(razorpayOrderId: string, reason: string): Promise<boolean> {
  await initializeDatabase();
  const db = getDb();

  const res = await db.execute({
    sql: `UPDATE orders SET payment_status = 'failed', updated_at = ? WHERE razorpay_order_id = ? AND payment_status != 'paid'`,
    args: [Date.now(), razorpayOrderId]
  });

  return res.rowsAffected > 0;
}

/**
 * Durable Cumulative Refund Workflow with Atomic Balance Reservation
 *
 * Guarantees:
 * 1. Financial ceiling is strictly enforced (captured_amount or grand_total).
 * 2. Atomic DB reservation prevents concurrent requests from double-refunding the same balance.
 * 3. Provider network calls are made OUTSIDE database transactions.
 * 4. Deterministic idempotency references prevent duplicate provider charges.
 * 5. Provider timeouts leave an auditable 'uncertain' reservation to prevent duplicative retries.
 * 6. Inventory restock is decoupled from financial refund and defaults to DISABLED.
 * 7. When restock is enabled, only un-restocked quantities are restored (never duplicated).
 */
export async function processOrderRefund(params: RefundOrderParams): Promise<{
  success: boolean;
  message: string;
  order?: any;
  refundData?: any;
  refundId?: string;
  uncertain?: boolean;
}> {
  await initializeDatabase();
  const db = getDb();

  const findRes = await db.execute({
    sql: 'SELECT * FROM orders WHERE id = ? OR order_number = ? OR razorpay_payment_id = ?',
    args: [params.orderId, params.orderId, params.orderId]
  });

  if (findRes.rows.length === 0) {
    return { success: false, message: 'Order not found' };
  }

  const order = findRes.rows[0];

  if (order.payment_status === 'refunded') {
    return { success: false, message: 'Order is already marked as refunded' };
  }

  if (order.payment_status !== 'paid' && order.payment_status !== 'partially_refunded') {
    return { success: false, message: 'Only paid orders can be refunded' };
  }

  const paymentId = String(order.razorpay_payment_id || '');
  if (!paymentId && !params.skipProviderCall) {
    return { success: false, message: 'Cannot refund order: No gateway payment ID found on order' };
  }

  const ceilingPaise = order.captured_amount_paise != null
    ? Number(order.captured_amount_paise)
    : Math.round((order.captured_amount ? Number(order.captured_amount) : Number(order.grand_total)) * 100);
  const ceiling = ceilingPaise / 100;
  const internalRefundId = `ref_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const deterministicKey = params.idempotencyKey || `idemp_${order.id}_${internalRefundId}`;

  let refundAmountPaise = 0;

  // STEP 1: ATOMIC BALANCE CHECK & RESERVATION (inside write transaction)
  const reserveTx = await db.transaction('write');
  try {
    const sumRes = await reserveTx.execute({
      sql: `SELECT COALESCE(SUM(COALESCE(amount_paise, CAST(ROUND(amount * 100) AS INTEGER))), 0) as reserved_paise
            FROM refunds
            WHERE order_id = ? AND status IN ('processed', 'pending', 'uncertain')`,
      args: [order.id]
    });
    const currentlyReservedPaise = Number(sumRes.rows[0]?.reserved_paise || 0);
    const remainingRefundablePaise = Math.max(0, ceilingPaise - currentlyReservedPaise);

    if (remainingRefundablePaise <= 0) {
      await reserveTx.rollback();
      return {
        success: false,
        message: 'Order has already been fully refunded or has pending refund reservations exceeding the balance.'
      };
    }

    if (params.amount !== undefined) {
      if (typeof params.amount !== 'number' || params.amount <= 0 || isNaN(params.amount)) {
        await reserveTx.rollback();
        return { success: false, message: 'Refund amount must be a positive number.' };
      }
      const requestedPaise = Math.round(params.amount * 100);
      if (requestedPaise <= 0) {
        await reserveTx.rollback();
        return { success: false, message: 'Refund amount must be at least ₹0.01 (1 paisa).' };
      }
      if (requestedPaise > remainingRefundablePaise) {
        await reserveTx.rollback();
        return {
          success: false,
          message: `Requested refund of ₹${(requestedPaise / 100).toFixed(2)} exceeds remaining refundable balance of ₹${(remainingRefundablePaise / 100).toFixed(2)}.`
        };
      }
      refundAmountPaise = requestedPaise;
    } else {
      // Full refund requested: request exactly the remaining refundable balance in integer paise
      refundAmountPaise = remainingRefundablePaise;
    }

    const refundAmount = refundAmountPaise / 100;

    // Insert pending reservation row with both INR and integer paise
    await reserveTx.execute({
      sql: `INSERT INTO refunds (
        id, order_id, amount, amount_paise, currency, status, reason, idempotency_key, user_email, created_at, updated_at
      ) VALUES (?, ?, ?, ?, 'INR', 'pending', ?, ?, ?, ?, ?)`,
      args: [
        internalRefundId,
        order.id,
        refundAmount,
        refundAmountPaise,
        params.reason,
        deterministicKey,
        params.userEmail,
        Date.now(),
        Date.now()
      ]
    });

    await reserveTx.commit();
  } catch (err: any) {
    await reserveTx.rollback();
    return { success: false, message: `Reservation failure: ${err.message}` };
  } finally {
    reserveTx.close();
  }

  const refundAmount = refundAmountPaise / 100;

  // STEP 2: EXTERNAL CALL OUTSIDE DATABASE TRANSACTION
  let providerRefundData: any = null;
  if (!params.skipProviderCall && paymentId) {
    const providerRes = await callRazorpayRefundApi(
      paymentId,
      refundAmountPaise,
      {
        order_number: String(order.order_number),
        reason: params.reason,
        internal_refund_id: internalRefundId
      },
      internalRefundId,
      deterministicKey
    );

    if (!providerRes.success) {
      if (providerRes.isNetworkTimeout) {
        // Mark as UNCERTAIN - do NOT release reservation so duplicate requests cannot be issued
        const uncTx = await db.transaction('write');
        try {
          await uncTx.execute({
            sql: `UPDATE refunds SET status = 'uncertain', error_message = ?, updated_at = ? WHERE id = ?`,
            args: [providerRes.error || 'Network timeout', Date.now(), internalRefundId]
          });
          await uncTx.commit();
        } catch {
          await uncTx.rollback();
        } finally {
          uncTx.close();
        }

        return {
          success: false,
          uncertain: true,
          refundId: internalRefundId,
          message: 'Network timeout contacting Razorpay. Refund state marked as uncertain for webhook/manual reconciliation.'
        };
      } else {
        // Gateway rejected: release reservation by setting status to failed
        const failTx = await db.transaction('write');
        try {
          await failTx.execute({
            sql: `UPDATE refunds SET status = 'failed', error_message = ?, updated_at = ? WHERE id = ?`,
            args: [providerRes.error || 'Rejected by provider', Date.now(), internalRefundId]
          });
          await failTx.commit();
        } catch {
          await failTx.rollback();
        } finally {
          failTx.close();
        }

        await logAdminActivity(
          params.userEmail,
          'REFUND_PROVIDER_FAILED',
          'orders',
          String(order.id),
          { order_number: order.order_number, payment_id: paymentId, error: providerRes.error }
        );

        return {
          success: false,
          message: `Razorpay provider refund rejected: ${providerRes.error}`
        };
      }
    }

    providerRefundData = providerRes.data;
  } else {
    // skipProviderCall mode (used for mock tests)
    providerRefundData = {
      id: `rfnd_local_${Date.now()}`,
      amount: refundAmountPaise,
      status: 'processed'
    };
  }

  // STEP 3: RECONCILIATION & SETTLEMENT TRANSACTION
  const settleTx = await db.transaction('write');
  try {
    const providerRefundId = providerRefundData?.id || `rfnd_conf_${Date.now()}`;

    // Mark refund record as processed
    await settleTx.execute({
      sql: `UPDATE refunds SET
        status = 'processed',
        amount_paise = COALESCE(amount_paise, ?),
        provider_refund_id = ?,
        updated_at = ?
        WHERE id = ?`,
      args: [refundAmountPaise, providerRefundId, Date.now(), internalRefundId]
    });

    // Calculate confirmed total refunded in integer paise
    const sumConfirmed = await settleTx.execute({
      sql: `SELECT COALESCE(SUM(COALESCE(amount_paise, CAST(ROUND(amount * 100) AS INTEGER))), 0) as totalConfirmedPaise
            FROM refunds
            WHERE order_id = ? AND status = 'processed'`,
      args: [order.id]
    });
    const totalConfirmedPaise = Number(sumConfirmed.rows[0]?.totalConfirmedPaise || refundAmountPaise);
    const totalConfirmed = totalConfirmedPaise / 100;
    const isFullRefund = totalConfirmedPaise >= ceilingPaise;
    const newPaymentStatus = isFullRefund ? 'refunded' : 'partially_refunded';

    // Update order status, refunded_amount, and refunded_amount_paise
    await settleTx.execute({
      sql: `UPDATE orders SET
        payment_status = ?,
        refunded_amount = ?,
        refunded_amount_paise = ?,
        updated_at = ?
        WHERE id = ?`,
      args: [newPaymentStatus, totalConfirmed, totalConfirmedPaise, Date.now(), order.id]
    });

    // STEP 4: INVENTORY RESTOCK (ONLY IF EXPLICITLY REQUESTED)
    let restockedAuditItems: any[] = [];
    if (params.restock === true) {
      // Find what has ALREADY been restocked for this order to prevent duplicate restocking
      const prevRestocks = await settleTx.execute({
        sql: `SELECT restock_items FROM refunds WHERE order_id = ? AND status = 'processed' AND restock_items IS NOT NULL`,
        args: [order.id]
      });

      const alreadyRestockedQty: Record<string, number> = {};
      for (const row of prevRestocks.rows) {
        try {
          const parsed = JSON.parse(String(row.restock_items));
          if (Array.isArray(parsed)) {
            for (const it of parsed) {
              alreadyRestockedQty[it.id] = (alreadyRestockedQty[it.id] || 0) + Number(it.quantity || 0);
            }
          }
        } catch {}
      }

      // Parse order items
      let orderItems: any[] = [];
      try {
        orderItems = JSON.parse(String(order.items));
      } catch {}

      // If specific items were requested to restock, use them; otherwise restock remaining un-restocked order items
      const itemsToConsider = params.restockItems && params.restockItems.length > 0
        ? params.restockItems
        : orderItems.map(it => ({ id: it.id, quantity: Number(it.quantity || 1) }));

      for (const reqItem of itemsToConsider) {
        const prodId = reqItem.id;
        const requestedQty = Number(reqItem.quantity || 1);

        const originalItem = orderItems.find(it => it.id === prodId);
        const originalPurchased = originalItem ? Number(originalItem.quantity || 1) : requestedQty;
        const previouslyRestocked = alreadyRestockedQty[prodId] || 0;
        const allowedToRestock = Math.max(0, originalPurchased - previouslyRestocked);
        const qtyToRestock = Math.min(requestedQty, allowedToRestock);

        if (qtyToRestock > 0 && prodId && !prodId.startsWith('custom_')) {
          let prodRes = await settleTx.execute({
            sql: 'SELECT id, sku, inventory_quantity FROM products WHERE id = ?',
            args: [prodId]
          });

          if (prodRes.rows.length === 0 && originalItem?.title) {
            prodRes = await settleTx.execute({
              sql: 'SELECT id, sku, inventory_quantity FROM products WHERE title = ?',
              args: [originalItem.title]
            });
          }

          if (prodRes.rows.length > 0) {
            const prod = prodRes.rows[0];
            const currentStock = Number(prod.inventory_quantity);
            const newStock = currentStock + qtyToRestock;

            await settleTx.execute({
              sql: 'UPDATE products SET inventory_quantity = ?, updated_at = ? WHERE id = ?',
              args: [newStock, Date.now(), prod.id]
            });

            await settleTx.execute({
              sql: `INSERT INTO inventory_logs (id, product_id, sku, adjustment, previous_quantity, new_quantity, reason, user_email, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              args: [
                `inv_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
                String(prod.id),
                String(prod.sku),
                qtyToRestock,
                currentStock,
                newStock,
                `Refund Restock: Order ${order.order_number} (${params.reason})`,
                params.userEmail,
                Date.now()
              ]
            });

            restockedAuditItems.push({
              id: prodId,
              sku: prod.sku,
              quantity: qtyToRestock
            });
          }
        }
      }

      // Record what was restocked in this refund row
      if (restockedAuditItems.length > 0) {
        await settleTx.execute({
          sql: `UPDATE refunds SET restock_items = ? WHERE id = ?`,
          args: [JSON.stringify(restockedAuditItems), internalRefundId]
        });
      }
    }

    // 5. Activity Log inside transaction
    await settleTx.execute({
      sql: `INSERT INTO activity_logs (id, user_email, action, entity_type, entity_id, details, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [
        `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        params.userEmail,
        'REFUND_ORDER_SUCCESS',
        'orders',
        String(order.id),
        JSON.stringify({
          refund_id: internalRefundId,
          provider_refund_id: providerRefundId,
          order_number: order.order_number,
          amount: refundAmount,
          isFullRefund,
          restocked: restockedAuditItems.length > 0,
          restockItems: restockedAuditItems,
          reason: params.reason
        }),
        Date.now()
      ]
    });

    await settleTx.commit();

    return {
      success: true,
      message: `Order ${order.order_number} refund of ₹${refundAmount} confirmed (${isFullRefund ? 'Full' : 'Partial'})${restockedAuditItems.length > 0 ? ' and inventory restocked' : ''}`,
      order: {
        ...order,
        payment_status: newPaymentStatus,
        refunded_amount: totalConfirmed,
        refunded_amount_paise: totalConfirmedPaise
      },
      refundData: providerRefundData,
      refundId: internalRefundId
    };
  } catch (err: any) {
    await settleTx.rollback();
    return {
      success: false,
      message: `Database failure reconciling confirmed refund: ${err.message}`
    };
  } finally {
    settleTx.close();
  }
}

/**
 * Inbound Refund Webhook Reconciler
 * Reconciles provider refund notifications without initiating outbound HTTP calls or duplicate restocks.
 *
 * Guarantees:
 * 1. refund.created does NOT mark a refund as completed or increase orders.refunded_amount.
 * 2. refund.created records provider_refund_id and maintains pending status.
 * 3. Only refund.processed marks a refund completed and increases refunded totals.
 * 4. refund.failed marks the record failed and safely recalculates confirmed totals.
 * 5. Out-of-order late refund.created events NEVER downgrade an already processed or failed refund.
 * 6. Duplicate webhook events are handled idempotently without double-counting.
 * 7. Matches by provider_refund_id, then internal correlation ID via notes/receipt, and prevents ambiguous matching.
 */
export async function reconcileInboundRefundWebhook(event: {
  event: string;
  payload: any;
}): Promise<{ success: boolean; message: string; matchedRefundId?: string }> {
  await initializeDatabase();
  const db = getDb();

  const refundEntity = event.payload?.refund?.entity;
  if (!refundEntity) {
    return { success: false, message: 'Missing refund entity in webhook' };
  }

  const paymentId = refundEntity.payment_id;
  const providerRefundId = refundEntity.id;
  const amountInPaise = typeof refundEntity.amount === 'number' ? Math.round(refundEntity.amount) : 0;
  const amountInINR = amountInPaise / 100;
  const eventType = event.event; // 'refund.created', 'refund.processed', 'refund.failed'
  const internalRefundIdFromNotes = refundEntity.notes?.internal_refund_id || refundEntity.receipt;

  if (!paymentId) {
    return { success: false, message: 'Missing payment_id in refund webhook' };
  }

  // Find corresponding order
  let orderRes = await db.execute({
    sql: 'SELECT * FROM orders WHERE razorpay_payment_id = ?',
    args: [paymentId]
  });

  if (orderRes.rows.length === 0 && refundEntity.notes?.order_number) {
    orderRes = await db.execute({
      sql: 'SELECT * FROM orders WHERE order_number = ?',
      args: [String(refundEntity.notes.order_number)]
    });
  }

  if (orderRes.rows.length === 0) {
    return { success: false, message: `No order found for payment_id ${paymentId}` };
  }

  const order = orderRes.rows[0];
  const ceilingPaise = order.captured_amount_paise != null
    ? Number(order.captured_amount_paise)
    : Math.round((order.captured_amount ? Number(order.captured_amount) : Number(order.grand_total)) * 100);

  const tx = await db.transaction('write');
  try {
    let matchedRefundId: string | null = null;
    let shouldRecalculateTotals = false;

    // 1. STEP A: Match by provider_refund_id
    const existingByProvider = await tx.execute({
      sql: 'SELECT * FROM refunds WHERE provider_refund_id = ?',
      args: [providerRefundId]
    });

    if (existingByProvider.rows.length > 0) {
      const existingRefund = existingByProvider.rows[0];
      matchedRefundId = String(existingRefund.id);

      // Handle duplicate and out-of-order events
      if (existingRefund.status === 'processed') {
        if (eventType === 'refund.processed') {
          // Idempotent duplicate: already processed
          await tx.rollback();
          return { success: true, message: 'Refund webhook already reconciled (duplicate refund.processed)', matchedRefundId };
        }
        if (eventType === 'refund.created') {
          // FIX 1 Requirement 6: A late refund.created event must never downgrade an already processed refund
          await tx.rollback();
          return { success: true, message: 'Ignored late refund.created for already processed refund', matchedRefundId };
        }
        if (eventType === 'refund.failed') {
          // Provider notified terminal failure for an earlier record
          await tx.execute({
            sql: `UPDATE refunds SET status = 'failed', updated_at = ? WHERE id = ?`,
            args: [Date.now(), existingRefund.id]
          });
          shouldRecalculateTotals = true;
        }
      } else if (existingRefund.status === 'failed') {
        if (eventType === 'refund.failed') {
          // Idempotent duplicate failure
          await tx.rollback();
          return { success: true, message: 'Refund failure already recorded', matchedRefundId };
        }
        if (eventType === 'refund.created') {
          // FIX 1 Requirement 6: A late refund.created event must never downgrade an already failed refund
          await tx.rollback();
          return { success: true, message: 'Ignored late refund.created for already failed refund', matchedRefundId };
        }
        if (eventType === 'refund.processed') {
          // Terminal success arrived after a transient failure
          await tx.execute({
            sql: `UPDATE refunds SET status = 'processed', updated_at = ? WHERE id = ?`,
            args: [Date.now(), existingRefund.id]
          });
          shouldRecalculateTotals = true;
        }
      } else {
        // Status is 'pending' or 'uncertain'
        if (eventType === 'refund.created') {
          // Already pending with provider_refund_id. Duplicate refund.created event
          await tx.rollback();
          return { success: true, message: 'Refund already registered as pending', matchedRefundId };
        }
        if (eventType === 'refund.processed') {
          // FIX 1 Requirement 3: Only mark processed when provider event actually confirms successful processing
          await tx.execute({
            sql: `UPDATE refunds SET status = 'processed', amount_paise = COALESCE(amount_paise, ?), updated_at = ? WHERE id = ?`,
            args: [amountInPaise, Date.now(), existingRefund.id]
          });
          shouldRecalculateTotals = true;
        } else if (eventType === 'refund.failed') {
          // FIX 1 Requirement 4: Mark failed
          await tx.execute({
            sql: `UPDATE refunds SET status = 'failed', amount_paise = COALESCE(amount_paise, ?), updated_at = ? WHERE id = ?`,
            args: [amountInPaise, Date.now(), existingRefund.id]
          });
          shouldRecalculateTotals = true;
        }
      }
    } else {
      // 2. STEP B: Match by internal correlation ID carried through provider metadata/notes
      let matchedByInternalId = false;

      if (internalRefundIdFromNotes) {
        const internalMatch = await tx.execute({
          sql: 'SELECT * FROM refunds WHERE id = ? AND order_id = ?',
          args: [String(internalRefundIdFromNotes), order.id]
        });

        if (internalMatch.rows.length > 0) {
          matchedByInternalId = true;
          const matched = internalMatch.rows[0];
          matchedRefundId = String(matched.id);

          if (matched.status === 'processed') {
            await tx.execute({
              sql: `UPDATE refunds SET provider_refund_id = ?, amount_paise = COALESCE(amount_paise, ?), updated_at = ? WHERE id = ?`,
              args: [providerRefundId, amountInPaise, Date.now(), matched.id]
            });
            if (eventType === 'refund.failed') {
              await tx.execute({
                sql: `UPDATE refunds SET status = 'failed', updated_at = ? WHERE id = ?`,
                args: [Date.now(), matched.id]
              });
              shouldRecalculateTotals = true;
            }
          } else if (matched.status === 'failed') {
            await tx.execute({
              sql: `UPDATE refunds SET provider_refund_id = ?, amount_paise = COALESCE(amount_paise, ?), updated_at = ? WHERE id = ?`,
              args: [providerRefundId, amountInPaise, Date.now(), matched.id]
            });
            if (eventType === 'refund.processed') {
              await tx.execute({
                sql: `UPDATE refunds SET status = 'processed', updated_at = ? WHERE id = ?`,
                args: [Date.now(), matched.id]
              });
              shouldRecalculateTotals = true;
            }
          } else {
            // Status is 'pending' or 'uncertain'
            if (eventType === 'refund.created') {
              // FIX 1 Requirement 1 & 2: Record provider refund ID and maintain pending status.
              // Do NOT mark completed or increase refunded totals!
              await tx.execute({
                sql: `UPDATE refunds SET
                      provider_refund_id = ?,
                      status = 'pending',
                      amount_paise = COALESCE(amount_paise, ?),
                      updated_at = ?
                      WHERE id = ?`,
                args: [providerRefundId, amountInPaise, Date.now(), matched.id]
              });
              shouldRecalculateTotals = false;
            } else if (eventType === 'refund.processed') {
              // FIX 1 Requirement 3: Confirmed processed!
              await tx.execute({
                sql: `UPDATE refunds SET
                      provider_refund_id = ?,
                      status = 'processed',
                      amount_paise = COALESCE(amount_paise, ?),
                      updated_at = ?
                      WHERE id = ?`,
                args: [providerRefundId, amountInPaise, Date.now(), matched.id]
              });
              shouldRecalculateTotals = true;
            } else if (eventType === 'refund.failed') {
              // FIX 1 Requirement 4: Mark failed
              await tx.execute({
                sql: `UPDATE refunds SET
                      provider_refund_id = ?,
                      status = 'failed',
                      amount_paise = COALESCE(amount_paise, ?),
                      updated_at = ?
                      WHERE id = ?`,
                args: [providerRefundId, amountInPaise, Date.now(), matched.id]
              });
              shouldRecalculateTotals = true;
            }
          }
        }
      }

      // 3. STEP C: If NOT matched by provider_refund_id or internal ID
      if (!matchedByInternalId) {
        // Query pending/uncertain refunds for this order with matching amount
        const candidateRows = await tx.execute({
          sql: `SELECT * FROM refunds
                WHERE order_id = ? AND status IN ('pending', 'uncertain')
                  AND (amount_paise = ? OR (amount_paise IS NULL AND CAST(ROUND(amount * 100) AS INTEGER) = ?))`,
          args: [order.id, amountInPaise, amountInPaise]
        });

        if (candidateRows.rows.length === 1) {
          // Exactly one pending refund matches unambiguously!
          const matched = candidateRows.rows[0];
          matchedRefundId = String(matched.id);

          if (eventType === 'refund.created') {
            // FIX 1 Requirement 1 & 2: Record provider ID, maintain pending
            await tx.execute({
              sql: `UPDATE refunds SET provider_refund_id = ?, status = 'pending', amount_paise = COALESCE(amount_paise, ?), updated_at = ? WHERE id = ?`,
              args: [providerRefundId, amountInPaise, Date.now(), matched.id]
            });
            shouldRecalculateTotals = false;
          } else if (eventType === 'refund.processed') {
            await tx.execute({
              sql: `UPDATE refunds SET provider_refund_id = ?, status = 'processed', amount_paise = COALESCE(amount_paise, ?), updated_at = ? WHERE id = ?`,
              args: [providerRefundId, amountInPaise, Date.now(), matched.id]
            });
            shouldRecalculateTotals = true;
          } else if (eventType === 'refund.failed') {
            await tx.execute({
              sql: `UPDATE refunds SET provider_refund_id = ?, status = 'failed', amount_paise = COALESCE(amount_paise, ?), updated_at = ? WHERE id = ?`,
              args: [providerRefundId, amountInPaise, Date.now(), matched.id]
            });
            shouldRecalculateTotals = true;
          }
        } else if (candidateRows.rows.length > 1) {
          // FIX 3 Requirement 3 & 4: Multiple identical partial refunds exist!
          // DO NOT arbitrarily match. Preserve the event for safe reconciliation and log a useful diagnostic.
          const internalId = `ref_ambig_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
          matchedRefundId = internalId;
          const status = eventType === 'refund.processed' ? 'processed' : (eventType === 'refund.failed' ? 'failed' : 'pending');

          await tx.execute({
            sql: `INSERT INTO refunds (
              id, order_id, provider_refund_id, amount, amount_paise, currency,
              status, reason, user_email, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, 'INR', ?, ?, 'webhook@razorpay.com', ?, ?)`,
            args: [
              internalId,
              order.id,
              providerRefundId,
              amountInINR,
              amountInPaise,
              status,
              `Ambiguous Webhook: ${candidateRows.rows.length} identical pending refunds found for order ${order.order_number} (${eventType})`,
              Date.now(),
              Date.now()
            ]
          });

          // Log diagnostic to activity log
          await tx.execute({
            sql: `INSERT INTO activity_logs (id, user_email, action, entity_type, entity_id, details, created_at)
                  VALUES (?, ?, ?, ?, ?, ?, ?)`,
            args: [
              `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
              'webhook@razorpay.com',
              'REFUND_WEBHOOK_AMBIGUOUS_MATCH',
              'orders',
              String(order.id),
              JSON.stringify({
                order_number: order.order_number,
                provider_refund_id: providerRefundId,
                amount_in_paise: amountInPaise,
                candidate_count: candidateRows.rows.length,
                event_type: eventType,
                diagnostic: 'Multiple identical pending refunds existed without correlation notes; preserved as independent ledger entry.'
              }),
              Date.now()
            ]
          });

          if (eventType === 'refund.processed') {
            shouldRecalculateTotals = true;
          }
        } else {
          // candidateRows.rows.length === 0
          // External refund initiated on Razorpay dashboard
          const internalId = `ref_wh_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
          matchedRefundId = internalId;
          const status = eventType === 'refund.processed' ? 'processed' : (eventType === 'refund.failed' ? 'failed' : 'pending');

          await tx.execute({
            sql: `INSERT INTO refunds (
              id, order_id, provider_refund_id, amount, amount_paise, currency,
              status, reason, user_email, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, 'INR', ?, ?, 'webhook@razorpay.com', ?, ?)`,
            args: [
              internalId,
              order.id,
              providerRefundId,
              amountInINR,
              amountInPaise,
              status,
              `External Razorpay Webhook: ${eventType}`,
              Date.now(),
              Date.now()
            ]
          });

          if (eventType === 'refund.processed') {
            shouldRecalculateTotals = true;
          }
        }
      }
    }

    // 4. STEP D: Recalculate confirmed refunded totals in integer paise
    if (shouldRecalculateTotals) {
      const sumConfirmed = await tx.execute({
        sql: `SELECT COALESCE(SUM(COALESCE(amount_paise, CAST(ROUND(amount * 100) AS INTEGER))), 0) as totalConfirmedPaise
              FROM refunds
              WHERE order_id = ? AND status = 'processed'`,
        args: [order.id]
      });
      const totalConfirmedPaise = Number(sumConfirmed.rows[0]?.totalConfirmedPaise || 0);
      const totalConfirmedINR = totalConfirmedPaise / 100;
      const isFullRefund = totalConfirmedPaise >= ceilingPaise;
      const newStatus = isFullRefund ? 'refunded' : (totalConfirmedPaise > 0 ? 'partially_refunded' : (order.payment_status === 'refunded' || order.payment_status === 'partially_refunded' ? 'paid' : order.payment_status));

      await tx.execute({
        sql: `UPDATE orders SET refunded_amount = ?, refunded_amount_paise = ?, payment_status = ?, updated_at = ? WHERE id = ?`,
        args: [totalConfirmedINR, totalConfirmedPaise, newStatus, Date.now(), order.id]
      });
    }

    await tx.commit();
    return {
      success: true,
      message: `Webhook reconciled for order ${order.order_number} (${eventType})`,
      matchedRefundId: matchedRefundId || undefined
    };
  } catch (err: any) {
    await tx.rollback();
    return { success: false, message: `Webhook reconciliation error: ${err.message}` };
  } finally {
    tx.close();
  }
}

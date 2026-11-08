import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/src/lib/auth-better';
import { getDb, initializeDatabase } from '@/src/lib/db';
import { isValidEmail, sanitizeText } from '@/src/lib/security';
import { sendOrderCancellationEmail } from '@/src/lib/email';
import { callRazorpayRefundApi } from '@/src/lib/settlement';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, orderNumber, reason, userEmail: bodyEmail } = body;

    if (!orderId && !orderNumber) {
      return NextResponse.json({ error: 'Order identifier (orderId or orderNumber) is required.' }, { status: 400 });
    }

    await initializeDatabase();
    const db = getDb();

    // 1. Authenticate user identity
    const session = await getServerSession();
    let authEmail = session?.user?.email?.trim().toLowerCase();

    if (!authEmail) {
      const emailHeader = req.headers.get('x-user-email')?.trim().toLowerCase();
      if (emailHeader && isValidEmail(emailHeader)) {
        authEmail = emailHeader;
      } else if (bodyEmail && isValidEmail(bodyEmail)) {
        authEmail = bodyEmail.trim().toLowerCase();
      }
    }

    if (!authEmail) {
      return NextResponse.json({ error: 'Authentication required to cancel order.' }, { status: 401 });
    }

    // 2. Fetch the target order
    const findRes = await db.execute({
      sql: 'SELECT * FROM orders WHERE id = ? OR order_number = ?',
      args: [orderId || orderNumber, orderNumber || orderId]
    });

    if (findRes.rows.length === 0) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }

    const order = findRes.rows[0];
    const orderCustomerEmail = String(order.customer_email || '').trim().toLowerCase();

    // Verify ownership
    if (orderCustomerEmail !== authEmail) {
      return NextResponse.json({ error: 'Unauthorized: You can only cancel your own orders.' }, { status: 403 });
    }

    // 3. Verify cancellation eligibility
    const fulfillment = String(order.fulfillment_status || 'unfulfilled');
    const payment = String(order.payment_status || 'pending');

    if (fulfillment === 'shipped' || fulfillment === 'delivered') {
      return NextResponse.json(
        { error: 'This order has already departed the studio and cannot be cancelled online. Please contact our WhatsApp concierge.' },
        { status: 400 }
      );
    }

    if (fulfillment === 'cancelled' || payment === 'cancelled') {
      return NextResponse.json({ error: 'This order is already cancelled.' }, { status: 400 });
    }

    // Parse items to restock
    let items: any[] = [];
    try {
      items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
    } catch {}

    const cleanReason = sanitizeText(reason || 'Customer cancellation via account portal', 300);
    const now = Date.now();

    // 4. ATOMIC DATABASE TRANSACTION FOR CANCELLATION & RESTOCK
    const tx = await db.transaction('write');
    try {
      // Update order state
      await tx.execute({
        sql: `UPDATE orders SET
          fulfillment_status = 'cancelled',
          payment_status = 'cancelled',
          cancellation_reason = ?,
          cancelled_at = ?,
          updated_at = ?
          WHERE id = ?`,
        args: [cleanReason, now, now, order.id]
      });

      // Restock inventory for each item
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
            const newQty = currentQty + qty;

            await tx.execute({
              sql: 'UPDATE products SET inventory_quantity = inventory_quantity + ?, updated_at = ? WHERE id = ?',
              args: [qty, now, prod.id]
            });

            await tx.execute({
              sql: `INSERT INTO inventory_logs (id, product_id, sku, adjustment, previous_quantity, new_quantity, reason, user_email, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              args: [
                `inv_${now}_${Math.random().toString(36).substring(2, 5)}`,
                String(prod.id),
                String(prod.sku),
                qty,
                currentQty,
                newQty,
                `Order Cancellation Restock: ${order.order_number}`,
                authEmail,
                now
              ]
            });
          }
        }
      }

      // Record Activity Log
      await tx.execute({
        sql: `INSERT INTO activity_logs (id, user_email, action, entity_type, entity_id, details, created_at)
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
        args: [
          `act_${now}_${Math.random().toString(36).substring(2, 6)}`,
          authEmail,
          'CANCEL_ORDER_CUSTOMER',
          'orders',
          String(order.id),
          JSON.stringify({ order_number: order.order_number, reason: cleanReason }),
          now
        ]
      });

      await tx.commit();
    } catch (txErr: any) {
      await tx.rollback();
      throw txErr;
    }

    // 5. If order was paid online via Razorpay, trigger automated refund or record refund ledger
    let refundInfo = null;
    if (order.razorpay_payment_id && payment === 'paid') {
      try {
        const refundRes = await callRazorpayRefundApi(
          String(order.razorpay_payment_id),
          order.grand_total_paise ? Number(order.grand_total_paise) : Math.round(Number(order.grand_total) * 100),
          { order_number: String(order.order_number), reason: cleanReason }
        );
        refundInfo = refundRes;
      } catch (refErr) {
        console.warn('[REFUND NOTICE]: Gateway refund call failed or deferred:', refErr);
      }
    }

    // 6. Send Resend Order Cancellation Email
    sendOrderCancellationEmail(
      {
        order_number: String(order.order_number),
        customer_name: String(order.customer_name),
        customer_email: orderCustomerEmail,
        items,
        grand_total: Number(order.grand_total),
        payment_method: String(order.payment_method || ''),
        payment_status: payment,
        cancellation_reason: cleanReason,
        cancelled_at: now
      },
      cleanReason
    ).catch((err) => console.warn('[EMAIL NOTICE]: Failed to send cancellation email:', err));

    return NextResponse.json({
      success: true,
      message: `Order ${order.order_number} has been cancelled successfully. Items have been restocked.`,
      orderNumber: order.order_number,
      cancellationReason: cleanReason,
      refundInfo
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to cancel order' }, { status: 500 });
  }
}

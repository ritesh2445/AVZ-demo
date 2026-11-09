import { NextResponse } from 'next/server';
import { getAdminSession, logAdminActivity } from '@/src/lib/auth';
import { getDb, initializeDatabase } from '@/src/lib/db';
import { sendFulfillmentDispatchEmail, sendOrderCancellationEmail } from '@/src/lib/email';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    await initializeDatabase();
    const db = getDb();

    const res = await db.execute({
      sql: 'SELECT * FROM orders WHERE id = ? OR order_number = ?',
      args: [id, id]
    });

    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const row = res.rows[0];

    const refundsRes = await db.execute({
      sql: 'SELECT * FROM refunds WHERE order_id = ? ORDER BY created_at DESC',
      args: [String(row.id)]
    });

    const order = {
      ...row,
      subtotal: Number(row.subtotal),
      discount: Number(row.discount),
      shipping_fee: Number(row.shipping_fee),
      tax: Number(row.tax),
      grand_total: Number(row.grand_total),
      shipping_address: (() => { try { return JSON.parse(String(row.shipping_address)); } catch { return {}; } })(),
      items: (() => { try { return JSON.parse(String(row.items)); } catch { return []; } })(),
      refunds: refundsRes.rows.map(ref => ({
        ...ref,
        amount: Number(ref.amount),
        amount_paise: Number(ref.amount_paise || 0),
        restock: Boolean(ref.restock)
      }))
    };

    return NextResponse.json({ success: true, order });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const { fulfillment_status, carrier, tracking_number, dispatch_date, internal_notes } = body;

    await initializeDatabase();
    const db = getDb();

    // Check order existence
    const existing = await db.execute({
      sql: 'SELECT * FROM orders WHERE id = ? OR order_number = ?',
      args: [id, id]
    });

    if (existing.rows.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const current = existing.rows[0];

    const newFulfillment = fulfillment_status ?? current.fulfillment_status;
    const newCarrier = carrier ?? current.carrier;
    const newTracking = tracking_number ?? current.tracking_number;
    const newDispatch = dispatch_date ? Number(dispatch_date) : (newFulfillment === 'shipped' && !current.dispatch_date ? Date.now() : current.dispatch_date);
    const newNotes = internal_notes ?? current.internal_notes;

    await db.execute({
      sql: `UPDATE orders SET
        fulfillment_status = ?,
        carrier = ?,
        tracking_number = ?,
        dispatch_date = ?,
        internal_notes = ?,
        updated_at = ?
        WHERE id = ?`,
      args: [newFulfillment, newCarrier, newTracking, newDispatch, newNotes, Date.now(), current.id]
    });

    await logAdminActivity(session.email, 'UPDATE_ORDER_FULFILLMENT', 'orders', String(current.id), {
      order_number: current.order_number,
      fulfillment_status: newFulfillment,
      carrier: newCarrier,
      tracking_number: newTracking
    });

    if (newFulfillment === 'shipped' && current.fulfillment_status !== 'shipped' && current.customer_email) {
      sendFulfillmentDispatchEmail(
        {
          order_number: String(current.order_number),
          customer_name: String(current.customer_name),
          customer_email: String(current.customer_email),
          grand_total: Number(current.grand_total)
        },
        newCarrier || 'Blue Dart / Delhivery Express',
        newTracking || 'Standard Track'
      ).catch((err) => console.warn('[EMAIL NOTICE]: Failed to send dispatch email:', err));
    }

    if (newFulfillment === 'cancelled' && current.fulfillment_status !== 'cancelled') {
      const now = Date.now();
      await db.execute({
        sql: `UPDATE orders SET
          payment_status = 'cancelled',
          cancellation_reason = COALESCE(cancellation_reason, 'Cancelled by studio administrator'),
          cancelled_at = COALESCE(cancelled_at, ?),
          updated_at = ?
          WHERE id = ?`,
        args: [now, now, current.id]
      });

      // Restock products
      let items: any[] = [];
      try {
        items = typeof current.items === 'string' ? JSON.parse(current.items) : current.items;
      } catch {}

      for (const item of items) {
        const qty = Number(item.quantity || 1);
        if (item.id && !String(item.id).startsWith('custom_')) {
          await db.execute({
            sql: 'UPDATE products SET inventory_quantity = inventory_quantity + ?, updated_at = ? WHERE id = ?',
            args: [qty, now, item.id]
          });
          await db.execute({
            sql: `INSERT INTO inventory_logs (id, product_id, sku, adjustment, previous_quantity, new_quantity, reason, user_email, created_at)
                  VALUES (?, ?, ?, ?, 0, 0, ?, ?, ?)`,
            args: [
              `inv_${now}_${Math.random().toString(36).substring(2, 5)}`,
              String(item.id),
              String(item.sku || 'AVZ'),
              qty,
              `Admin Order Cancellation Restock: ${current.order_number}`,
              session.email,
              now
            ]
          });
        }
      }

      // Send cancellation email
      if (current.customer_email) {
        sendOrderCancellationEmail(
          {
            order_number: String(current.order_number),
            customer_name: String(current.customer_name),
            customer_email: String(current.customer_email),
            items,
            grand_total: Number(current.grand_total),
            payment_method: String(current.payment_method || ''),
            payment_status: String(current.payment_status || ''),
            cancellation_reason: 'Cancelled by studio administrator',
            cancelled_at: now
          },
          'Cancelled by studio administrator'
        ).catch((err) => console.warn('[EMAIL NOTICE]: Failed to send cancellation email:', err));
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      fulfillment_status: newFulfillment,
      tracking_number: newTracking
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.role !== 'owner') {
    return NextResponse.json({ error: 'Only owners can delete orders' }, { status: 403 });
  }

  const { id } = await params;

  try {
    await initializeDatabase();
    const db = getDb();

    const existing = await db.execute({
      sql: 'SELECT id, order_number FROM orders WHERE id = ? OR order_number = ?',
      args: [id, id]
    });

    if (existing.rows.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const orderId = String(existing.rows[0].id);
    const orderNumber = String(existing.rows[0].order_number);

    await db.execute({
      sql: 'DELETE FROM refunds WHERE order_id = ?',
      args: [orderId]
    });

    await db.execute({
      sql: 'DELETE FROM orders WHERE id = ?',
      args: [orderId]
    });

    await logAdminActivity(session.email, 'DELETE_ORDER', 'orders', orderId, { order_number: orderNumber });

    return NextResponse.json({ success: true, message: `Order ${orderNumber} deleted successfully` });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

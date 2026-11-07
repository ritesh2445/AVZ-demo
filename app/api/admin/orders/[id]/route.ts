import { NextResponse } from 'next/server';
import { getAdminSession, logAdminActivity } from '@/src/lib/auth';
import { getDb, initializeDatabase } from '@/src/lib/db';

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

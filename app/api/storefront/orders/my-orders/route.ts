import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/src/lib/auth-better';
import { getDb, initializeDatabase } from '@/src/lib/db';
import { isValidEmail } from '@/src/lib/security';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/storefront/orders/my-orders
 * Fetches previous orders for the authenticated patron up to 6 months.
 * Compliant with DPDP Act 2023 & AVZ Vaganza Privacy Policy.
 */
export async function GET(req: NextRequest) {
  try {
    await initializeDatabase();
    const db = getDb();

    // 1. Determine user identity: Server session OR verified client email header
    const session = await getServerSession();
    let userEmail = session?.user?.email?.trim().toLowerCase();

    if (!userEmail) {
      const emailHeader = req.headers.get('x-user-email')?.trim().toLowerCase();
      if (emailHeader && isValidEmail(emailHeader)) {
        userEmail = emailHeader;
      }
    }

    if (!userEmail) {
      return NextResponse.json(
        { error: 'Authentication required to view order history.' },
        { status: 401 }
      );
    }

    // 2. Six-month rolling retention window (180 days)
    const SIX_MONTHS_MS = 180 * 24 * 60 * 60 * 1000;
    const cutoffTimestamp = Date.now() - SIX_MONTHS_MS;

    const res = await db.execute({
      sql: `SELECT * FROM orders
            WHERE (customer_email = ? OR internal_notes LIKE ?)
              AND created_at >= ?
            ORDER BY created_at DESC`,
      args: [userEmail, `%"${userEmail}"%`, cutoffTimestamp]
    });

    const orders = res.rows.map((row) => {
      let items = [];
      try {
        items = typeof row.items === 'string' ? JSON.parse(row.items) : row.items;
      } catch {}

      let shippingAddress = {};
      try {
        shippingAddress = typeof row.shipping_address === 'string' ? JSON.parse(row.shipping_address) : row.shipping_address;
      } catch {}

      const fulfillmentStatus = String(row.fulfillment_status || 'unfulfilled');
      const paymentStatus = String(row.payment_status || 'pending');

      const isShippedOrDelivered = fulfillmentStatus === 'shipped' || fulfillmentStatus === 'delivered';
      const isCancelled = fulfillmentStatus === 'cancelled' || paymentStatus === 'cancelled';
      const canCancel = !isShippedOrDelivered && !isCancelled;

      return {
        id: row.id,
        orderNumber: row.order_number,
        createdAt: Number(row.created_at),
        customerName: row.customer_name,
        customerEmail: row.customer_email,
        customerPhone: row.customer_phone,
        items,
        subtotal: Number(row.subtotal || row.grand_total),
        discount: Number(row.discount || 0),
        shippingFee: Number(row.shipping_fee || 0),
        grandTotal: Number(row.grand_total),
        currency: row.currency || 'INR',
        paymentStatus,
        paymentMethod: row.payment_method,
        fulfillmentStatus,
        carrier: row.carrier,
        trackingNumber: row.tracking_number,
        dispatchDate: row.dispatch_date ? Number(row.dispatch_date) : null,
        shippingAddress,
        canCancel,
        cancellationReason: row.cancellation_reason,
        cancelledAt: row.cancelled_at ? Number(row.cancelled_at) : null
      };
    });

    return NextResponse.json({
      success: true,
      orders,
      retentionPolicy: '6 months rolling access',
      count: orders.length
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to retrieve order history' }, { status: 500 });
  }
}

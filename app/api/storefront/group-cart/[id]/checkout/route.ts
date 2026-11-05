import { NextResponse } from 'next/server';
import { getDb, initializeDatabase } from '@/src/lib/db';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      buyerName,
      buyerEmail,
      buyerPhone,
      shippingAddress,
      paymentMethod = 'UPI / Card'
    } = body;

    if (!buyerName || !buyerEmail || !shippingAddress) {
      return NextResponse.json({ error: 'Shipping details and contact information are required' }, { status: 400 });
    }

    await initializeDatabase();
    const db = getDb();

    const res = await db.execute({
      sql: 'SELECT * FROM group_carts WHERE id = ? OR share_code = ?',
      args: [id, id.toUpperCase()]
    });

    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'Group order not found' }, { status: 404 });
    }

    const row: any = res.rows[0];
    const membersData: any[] = JSON.parse(row.members_data || '[]');

    // Collect all items across all members
    const allItems: any[] = [];
    const participantEmails: string[] = [buyerEmail.toLowerCase()];
    let subtotal = 0;

    for (const member of membersData) {
      if (member.userEmail && !participantEmails.includes(member.userEmail.toLowerCase())) {
        participantEmails.push(member.userEmail.toLowerCase());
      }
      for (const item of (member.items || [])) {
        const itemQty = Number(item.quantity || 1);
        const itemPrice = Number(item.price || 0);
        subtotal += itemPrice * itemQty;
        allItems.push({
          ...item,
          addedBy: member.userName,
          addedByEmail: member.userEmail
        });
      }
    }

    if (allItems.length === 0) {
      return NextResponse.json({ error: 'Group cart is empty' }, { status: 400 });
    }

    const orderNumber = `AVZ-GRP-${Math.floor(10000 + Math.random() * 90000)}`;
    const orderId = `ord_grp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    // Group order discount (complimentary 10% squad benefit for collective orders)
    const discount = Math.round(subtotal * 0.10);
    const grandTotal = subtotal - discount;

    const groupMeta = JSON.stringify({
      isGroupOrder: true,
      groupCartId: row.id,
      shareCode: row.share_code,
      participantEmails,
      membersSummary: membersData.map((m: any) => ({
        name: m.userName,
        email: m.userEmail,
        itemCount: m.items?.length || 0
      }))
    });

    await db.execute({
      sql: `INSERT INTO orders (
        id, order_number, customer_name, customer_email, customer_phone,
        shipping_address, items, subtotal, discount, shipping_fee, tax,
        grand_total, currency, payment_status, payment_method,
        fulfillment_status, internal_notes, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?, 'INR', 'paid', ?, 'unfulfilled', ?, ?, ?)`,
      args: [
        orderId,
        orderNumber,
        buyerName.trim(),
        buyerEmail.trim(),
        buyerPhone || null,
        typeof shippingAddress === 'string' ? shippingAddress : JSON.stringify(shippingAddress),
        JSON.stringify(allItems),
        subtotal,
        discount,
        grandTotal,
        paymentMethod,
        groupMeta,
        Date.now(),
        Date.now()
      ]
    });

    // Mark group cart as completed and link order
    await db.execute({
      sql: 'UPDATE group_carts SET status = ?, order_id = ?, updated_at = ? WHERE id = ?',
      args: ['completed', orderId, Date.now(), row.id]
    });

    return NextResponse.json({
      success: true,
      orderId,
      orderNumber,
      grandTotal,
      participantEmails,
      message: 'Group order successfully reserved for all collective members!'
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error checking out group cart' }, { status: 500 });
  }
}

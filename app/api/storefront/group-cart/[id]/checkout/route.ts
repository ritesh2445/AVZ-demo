import { NextResponse } from 'next/server';
import { getDb, initializeDatabase, ensureGroupCartsTable } from '@/src/lib/db';
import { PRODUCTS } from '@/src/data/brandData';
import { isValidEmail, isValidPhone, sanitizeText } from '@/src/lib/security';

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
      paymentMethod = 'Cash on Delivery (COD Verified)',
      razorpayOrderId,
      razorpayPaymentId
    } = body;

    const isOnlinePayment = paymentMethod.includes('UPI') || paymentMethod.includes('Razorpay') || paymentMethod.includes('Cards');
    if (isOnlinePayment && !razorpayPaymentId) {
      return NextResponse.json({
        error: 'Online payment verification required. Please complete payment via Razorpay before confirming.'
      }, { status: 400 });
    }

    if (!buyerName || !buyerEmail || !shippingAddress) {
      return NextResponse.json({ error: 'Shipping details and contact information are required' }, { status: 400 });
    }

    if (!isValidEmail(buyerEmail)) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
    }

    if (buyerPhone && !isValidPhone(buyerPhone)) {
      return NextResponse.json({ error: 'Please provide a valid 10-digit phone number.' }, { status: 400 });
    }

    await initializeDatabase();
    const db = getDb();
    await ensureGroupCartsTable(db);

    const res = await db.execute({
      sql: 'SELECT * FROM group_carts WHERE id = ? OR share_code = ?',
      args: [id, id.toUpperCase()]
    });

    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'Group order not found' }, { status: 404 });
    }

    const row: any = res.rows[0];
    if (row.status !== 'open') {
      return NextResponse.json({ error: 'This group cart session is already checked out.' }, { status: 400 });
    }

    const membersData: any[] = JSON.parse(row.members_data || '[]');

    // Collect all items across all members and re-verify authoritative prices from server database
    const allItems: any[] = [];
    const participantEmails: string[] = [buyerEmail.toLowerCase()];
    let subtotal = 0;

    for (const member of membersData) {
      if (member.userEmail && !participantEmails.includes(member.userEmail.toLowerCase())) {
        participantEmails.push(member.userEmail.toLowerCase());
      }
      for (const item of (member.items || [])) {
        const itemQty = Math.max(1, Math.min(10, Number(item.quantity || 1)));

        // Look up authoritative product price from database or catalog
        let verifiedPrice = Number(item.price || 0);
        const prodRes = await db.execute({
          sql: 'SELECT price FROM products WHERE id = ?',
          args: [item.id || '']
        });

        if (prodRes.rows.length > 0) {
          verifiedPrice = Number(prodRes.rows[0].price);
        } else {
          const brandMatch = PRODUCTS.find((p) => String(p.id) === String(item.id));
          if (brandMatch) {
            verifiedPrice = Number(brandMatch.price);
          } else {
            verifiedPrice = Math.max(1000, Number(item.price) || 1000);
          }
        }

        subtotal += verifiedPrice * itemQty;
        allItems.push({
          ...item,
          price: verifiedPrice,
          quantity: itemQty,
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

    const finalPaymentStatus = isOnlinePayment ? 'paid' : 'pending_cod';

    await db.execute({
      sql: `INSERT INTO orders (
        id, order_number, customer_name, customer_email, customer_phone,
        shipping_address, items, subtotal, discount, shipping_fee, tax,
        grand_total, currency, payment_status, payment_method,
        razorpay_order_id, razorpay_payment_id,
        fulfillment_status, internal_notes, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?, 'INR', ?, ?, ?, ?, 'unfulfilled', ?, ?, ?)`,
      args: [
        orderId,
        orderNumber,
        sanitizeText(buyerName.trim(), 100),
        buyerEmail.trim().toLowerCase(),
        buyerPhone ? buyerPhone.trim() : 'Not provided',
        typeof shippingAddress === 'string' ? sanitizeText(shippingAddress, 300) : JSON.stringify(shippingAddress),
        JSON.stringify(allItems),
        subtotal,
        discount,
        grandTotal,
        finalPaymentStatus,
        sanitizeText(paymentMethod || 'Cash on Delivery (COD Verified)', 60),
        razorpayOrderId || null,
        razorpayPaymentId || null,
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


import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getDb, initializeDatabase } from '@/src/lib/db';

export async function POST(request: Request) {
  try {
    await initializeDatabase();
    const db = getDb();

    // 1. Enforce Storefront Purchasing Controls (Backend enforcement)
    const settingsRes = await db.execute({
      sql: "SELECT value FROM storefront_settings WHERE key = 'purchases_enabled'",
      args: []
    });

    if (settingsRes.rows.length > 0) {
      try {
        const parsed = JSON.parse(String(settingsRes.rows[0].value));
        if (parsed.enabled === false) {
          return NextResponse.json(
            { error: parsed.disabled_message || 'Purchases are currently paused by the atelier.' },
            { status: 403 }
          );
        }
      } catch {}
    }

    const body = await request.json();
    const { items, customer, discountCode } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart cannot be empty' }, { status: 400 });
    }

    if (!customer || !customer.email || !customer.name || !customer.phone) {
      return NextResponse.json({ error: 'Customer contact information is required' }, { status: 400 });
    }

    // 2. Authoritative Price Calculation & Inventory Check from Database
    let calculatedSubtotal = 0;
    const verifiedItems: any[] = [];

    for (const cartItem of items) {
      // Find in DB
      const prodRes = await db.execute({
        sql: 'SELECT id, title, price, sku, inventory_quantity, status FROM products WHERE id = ? OR title = ?',
        args: [cartItem.id || '', cartItem.name || cartItem.title || '']
      });

      if (prodRes.rows.length > 0) {
        const prod = prodRes.rows[0];
        const unitPrice = Number(prod.price);
        const qty = Number(cartItem.quantity || 1);

        // Check stock
        if (Number(prod.inventory_quantity) < qty && prod.status === 'published') {
          // Alert low/out of stock
          console.warn(`Limited inventory for ${prod.title}`);
        }

        calculatedSubtotal += unitPrice * qty;
        verifiedItems.push({
          id: prod.id,
          title: prod.title,
          sku: prod.sku,
          price: unitPrice,
          quantity: qty,
          size: cartItem.size || 'Standard'
        });
      } else {
        // Fallback for custom bespoke commission
        const unitPrice = Number(cartItem.price || 2500);
        const qty = Number(cartItem.quantity || 1);
        calculatedSubtotal += unitPrice * qty;
        verifiedItems.push({
          id: cartItem.id || `custom_${Date.now()}`,
          title: cartItem.name || cartItem.title || 'Bespoke Atelier Commission',
          sku: 'AVZ-BESPOKE-01',
          price: unitPrice,
          quantity: qty,
          size: cartItem.size || 'Custom'
        });
      }
    }

    // 3. Discount calculation
    let discountAmount = 0;
    if (discountCode) {
      const promoRes = await db.execute({
        sql: 'SELECT * FROM promotions WHERE code = ? AND is_active = 1',
        args: [discountCode.trim().toUpperCase()]
      });

      if (promoRes.rows.length > 0) {
        const promo = promoRes.rows[0];
        if (calculatedSubtotal >= Number(promo.min_order_value || 0)) {
          if (promo.discount_type === 'percentage') {
            discountAmount = (calculatedSubtotal * Number(promo.discount_value)) / 100;
          } else {
            discountAmount = Number(promo.discount_value);
          }
        }
      }
    }

    // 4. Shipping Calculation: Free above ₹5000, else flat ₹250 domestic
    const freeShippingThreshold = 5000;
    const shippingFee = (calculatedSubtotal - discountAmount) >= freeShippingThreshold ? 0 : 250;
    const grandTotal = Math.max(0, calculatedSubtotal - discountAmount + shippingFee);

    // 5. Generate Order Identifiers
    const orderNumber = `AVZ-${Math.floor(10000 + Math.random() * 90000)}`;
    const grandTotalPaise = Math.round(grandTotal * 100);
    const isProduction = process.env.NODE_ENV === 'production';
    const keyId = process.env.RAZORPAY_KEY_ID?.trim();
    const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();

    // Production Security: Strictly fail closed if credentials are missing, blank, or placeholder
    if (isProduction) {
      if (!keyId || !keySecret || keyId === '' || keySecret === '' || keyId.includes('placeholder')) {
        return NextResponse.json(
          { error: 'Payment gateway unconfigured in production environment. Please reach out to concierge support on WhatsApp.' },
          { status: 500 }
        );
      }
    }

    let razorpayOrderId = '';

    // If real Razorpay credentials exist, create genuine Razorpay Order with provider
    if (keyId && keySecret && !keyId.includes('placeholder')) {
      try {
        const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');
        const rzpOrderRes = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            amount: grandTotalPaise,
            currency: 'INR',
            receipt: orderNumber,
            notes: {
              customer_name: customer.name,
              customer_email: customer.email,
              customer_phone: customer.phone,
              order_number: orderNumber
            }
          })
        });

        if (rzpOrderRes.ok) {
          const rzpOrderData = await rzpOrderRes.json();
          if (rzpOrderData.id) {
            razorpayOrderId = rzpOrderData.id;
          } else {
            console.error('Razorpay Order API returned 200 without order ID');
            return NextResponse.json(
              { error: 'Payment gateway returned invalid order response' },
              { status: 502 }
            );
          }
        } else {
          const errData = await rzpOrderRes.json().catch(() => ({}));
          console.error('Razorpay Order API creation error: HTTP', rzpOrderRes.status, errData?.error?.description || '');
          return NextResponse.json(
            { error: errData?.error?.description || 'Failed to initialize payment gateway order' },
            { status: 502 }
          );
        }
      } catch (err: any) {
        console.error('Razorpay Order API network error:', err.message || 'Connection error');
        return NextResponse.json(
          { error: 'Payment gateway connection error. Please try again or reach out on WhatsApp.' },
          { status: 502 }
        );
      }
    } else {
      // Local development sandbox only
      if (isProduction) {
        return NextResponse.json(
          { error: 'Cannot create mock payment orders in production environment.' },
          { status: 500 }
        );
      }
      razorpayOrderId = `order_${crypto.randomBytes(8).toString('hex')}`;
    }

    // 6. Create Pending Order in Database
    const orderId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    await db.execute({
      sql: `INSERT INTO orders (
        id, order_number, customer_name, customer_email, customer_phone,
        shipping_address, items, subtotal, discount, shipping_fee, tax,
        grand_total, grand_total_paise, currency, payment_status, payment_method,
        razorpay_order_id, fulfillment_status, customer_notes,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        orderId,
        orderNumber,
        customer.name.trim(),
        customer.email.trim(),
        customer.phone.trim(),
        JSON.stringify(customer.address || {}),
        JSON.stringify(verifiedItems),
        calculatedSubtotal,
        discountAmount,
        shippingFee,
        0,
        grandTotal,
        grandTotalPaise,
        'INR',
        'pending',
        'Razorpay',
        razorpayOrderId,
        'unfulfilled',
        customer.notes || null,
        Date.now(),
        Date.now()
      ]
    });

    return NextResponse.json({
      success: true,
      orderNumber,
      orderId,
      razorpayOrderId,
      amount: grandTotalPaise, // in paise for Razorpay
      currency: 'INR',
      keyId: isProduction ? keyId : (keyId || 'rzp_test_placeholder'),
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone
      }
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to initialize payment' }, { status: 500 });
  }
}

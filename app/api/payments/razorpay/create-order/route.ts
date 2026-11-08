import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getDb, initializeDatabase } from '@/src/lib/db';
import { PRODUCTS } from '@/src/data/brandData';
import { getClientIp, checkRateLimit, isValidEmail, isValidPhone, sanitizeText } from '@/src/lib/security';
import { sendOrderConfirmationEmail } from '@/src/lib/email';

export async function POST(request: Request) {
  try {
    // 0. Defense Against Automated Order Flooding (Rate Limiting)
    const clientIp = getClientIp(request);
    const rateCheck = checkRateLimit(`order_create_${clientIp}`, 10, 60000); // Max 10 order initiations per minute
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: `Too many checkout requests. Please wait ${rateCheck.resetInSeconds} seconds before trying again.` },
        { status: 429 }
      );
    }

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
            { error: parsed.disabled_message || 'Purchases are currently paused by the studio.' },
            { status: 403 }
          );
        }
      } catch {}
    }

    const body = await request.json();
    const { items, customer, discountCode, paymentMethod } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart cannot be empty' }, { status: 400 });
    }

    if (!customer || !customer.email || !customer.name || !customer.phone) {
      return NextResponse.json({ error: 'Customer contact information is required' }, { status: 400 });
    }

    // Input Validation & Sanitization
    if (!isValidEmail(customer.email)) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
    }

    if (!isValidPhone(customer.phone)) {
      return NextResponse.json({ error: 'Please provide a valid 10-digit phone number.' }, { status: 400 });
    }

    const cleanCustomerName = sanitizeText(customer.name, 100);
    const cleanCustomerEmail = customer.email.trim().toLowerCase();
    const cleanCustomerPhone = customer.phone.replace(/[^0-9+]/g, '');

    // 2. Authoritative Price Calculation & Inventory Check
    let calculatedSubtotal = 0;
    const verifiedItems: any[] = [];

    for (const cartItem of items) {
      // Validate integer quantity to prevent arithmetic underflow / negative price injection
      const rawQty = cartItem.quantity !== undefined ? Number(cartItem.quantity) : 1;
      if (!Number.isInteger(rawQty) || rawQty < 1 || rawQty > 20) {
        return NextResponse.json(
          { error: 'Invalid product quantity. Quantity must be a whole number between 1 and 20.' },
          { status: 400 }
        );
      }
      const qty = rawQty;

      // Check database products first
      const prodRes = await db.execute({
        sql: 'SELECT id, title, price, sku, inventory_quantity, status FROM products WHERE id = ? OR title = ?',
        args: [cartItem.id || '', cartItem.name || cartItem.title || '']
      });

      if (prodRes.rows.length > 0) {
        const prod = prodRes.rows[0];
        const unitPrice = Number(prod.price);

        if (isNaN(unitPrice) || unitPrice <= 0) {
          return NextResponse.json({ error: 'Invalid product pricing configuration.' }, { status: 500 });
        }

        // Check stock
        if (Number(prod.inventory_quantity) < qty && prod.status === 'published') {
          console.warn(`Limited inventory for ${prod.title}`);
        }

        calculatedSubtotal += unitPrice * qty;
        verifiedItems.push({
          id: prod.id,
          title: prod.title,
          sku: prod.sku,
          price: unitPrice,
          quantity: qty,
          size: sanitizeText(cartItem.size || 'Standard', 30)
        });
      } else {
        // Check authoritative brand catalog
        const brandMatch = PRODUCTS.find(
          p => String(p.id) === String(cartItem.id) || p.title?.toLowerCase() === (cartItem.name || cartItem.title || '').toLowerCase()
        );

        if (brandMatch) {
          const unitPrice = Number(brandMatch.price);
          calculatedSubtotal += unitPrice * qty;
          verifiedItems.push({
            id: brandMatch.id,
            title: brandMatch.title,
            sku: brandMatch.sku || `AVZ-${brandMatch.id}`,
            price: unitPrice,
            quantity: qty,
            size: sanitizeText(cartItem.size || 'Standard', 30)
          });
        } else {
          // Genuine custom commission piece
          // Enforce studio minimum price tier (₹1,000) to prevent arbitrary ₹1 sub-rupee tampering
          const clientPrice = Number(cartItem.price);
          const STUDIO_MIN_TIER_INR = 1000;
          
          if (isNaN(clientPrice) || clientPrice < STUDIO_MIN_TIER_INR) {
            return NextResponse.json(
              { error: `Custom studio commissions start at minimum ₹${STUDIO_MIN_TIER_INR.toLocaleString('en-IN')}. Please contact atelier on WhatsApp for custom billing.` },
              { status: 400 }
            );
          }

          const unitPrice = Math.round(clientPrice);
          calculatedSubtotal += unitPrice * qty;
          verifiedItems.push({
            id: cartItem.id || `custom_${Date.now()}`,
            title: sanitizeText(cartItem.name || cartItem.title || 'Custom Studio Commission', 120),
            sku: 'AVZ-CUSTOM-01',
            price: unitPrice,
            quantity: qty,
            size: sanitizeText(cartItem.size || 'Custom', 30)
          });
        }
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

    // 4. Shipping Calculation: Free above â‚¹5000, else flat â‚¹250 domestic
    // 4. Shipping Calculation: Dynamic from storefront_settings (Express Courier configuration)
    let expressFee = 250;
    let freeThreshold = 5000;
    let freeThresholdEnabled = true;

    try {
      const shipSetting = await db.execute("SELECT value FROM storefront_settings WHERE key = 'shipping_rates'");
      if (shipSetting.rows.length > 0) {
        const parsed = JSON.parse(String(shipSetting.rows[0].value));
        if (typeof parsed.express_courier_fee === 'number') expressFee = parsed.express_courier_fee;
        if (typeof parsed.free_threshold === 'number') freeThreshold = parsed.free_threshold;
        if (typeof parsed.free_threshold_enabled === 'boolean') freeThresholdEnabled = parsed.free_threshold_enabled;
      }
    } catch (e) {
      console.warn('[SHIPPING RATES DB FETCH WARN]:', e);
    }

    const shippingFee = (freeThresholdEnabled && (calculatedSubtotal - discountAmount) >= freeThreshold) ? 0 : expressFee;
    const grandTotal = Math.max(0, calculatedSubtotal - discountAmount + shippingFee);

    // 5. Generate Order Identifiers
    const orderNumber = `AVZ-${Math.floor(10000 + Math.random() * 90000)}`;
    const grandTotalPaise = Math.round(grandTotal * 100);
    const isProduction = process.env.NODE_ENV === 'production';
    const isCOD = paymentMethod === 'Cash on Delivery (COD Verified)' || 
                  paymentMethod === 'COD' || 
                  paymentMethod === 'Cash on Delivery' || 
                  /cash on delivery/i.test(paymentMethod || '');

    // Handle Cash on Delivery directly: persist to DB immediately without calling Razorpay
    if (isCOD) {
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
          cleanCustomerName,
          cleanCustomerEmail,
          cleanCustomerPhone,
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
          'Cash on Delivery',
          null,
          'unfulfilled',
          customer.notes ? sanitizeText(customer.notes, 500) : null,
          Date.now(),
          Date.now()
        ]
      });

      // Dispatch Resend Order Confirmation Email for Cash on Delivery Order
      sendOrderConfirmationEmail({
        order_number: orderNumber,
        customer_name: cleanCustomerName,
        customer_email: cleanCustomerEmail,
        customer_phone: cleanCustomerPhone,
        shipping_address: customer.address || {},
        items: verifiedItems,
        subtotal: calculatedSubtotal,
        discount: discountAmount,
        shipping_fee: shippingFee,
        grand_total: grandTotal,
        payment_method: 'Cash on Delivery (COD Verified)',
        payment_status: 'pending',
        created_at: Date.now()
      }).catch((err) => console.warn('[EMAIL NOTICE]: Failed to send COD confirmation email:', err));

      return NextResponse.json({
        success: true,
        isCOD: true,
        orderNumber,
        orderId,
        amount: grandTotalPaise,
        currency: 'INR',
        customer: {
          name: customer.name,
          email: customer.email,
          phone: customer.phone
        }
      });
    }

    const keyId = process.env.RAZORPAY_KEY_ID?.trim();
    const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();

    // Production Security: Inform user if Razorpay Key ID is not configured
    if (isProduction) {
      if (!keyId || !keySecret || keyId === '' || keySecret === '' || keyId.includes('placeholder')) {
        return NextResponse.json(
          { error: 'Razorpay online gateway is pending key configuration. Please choose Cash on Delivery or reach out to our concierge on WhatsApp to complete your order.' },
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
        cleanCustomerName,
        cleanCustomerEmail,
        cleanCustomerPhone,
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
        customer.notes ? sanitizeText(customer.notes, 500) : null,
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

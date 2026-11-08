/**
 * AVZ Vaganza — Atelier Transactional Email Service
 * Powered by Resend API (HTTP-based for full Cloudflare Workers & Node.js runtime compatibility)
 */

export interface OrderItemSummary {
  id?: string;
  name?: string;
  title?: string;
  size?: string;
  quantity?: number;
  price?: number;
}

export interface CustomerShippingAddress {
  address?: string;
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
  postalCode?: string;
  [key: string]: any;
}

export interface OrderEmailPayload {
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  shipping_address?: CustomerShippingAddress | string;
  items?: OrderItemSummary[] | string;
  subtotal?: number;
  discount?: number;
  shipping_fee?: number;
  grand_total: number;
  payment_method?: string;
  payment_status?: string;
  created_at?: number;
  cancellation_reason?: string;
  cancelled_at?: number;
  carrier?: string;
  tracking_number?: string;
}

function parseItems(raw: any): OrderItemSummary[] {
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
  }
  return [];
}

function parseAddress(raw: any): string {
  if (!raw) return 'Physical delivery address on file';
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed === 'object' && parsed !== null) {
        return formatAddressObject(parsed);
      }
      return raw;
    } catch {
      return raw;
    }
  }
  if (typeof raw === 'object') {
    return formatAddressObject(raw);
  }
  return String(raw);
}

function formatAddressObject(addr: Record<string, any>): string {
  const parts = [
    addr.street || addr.address || addr.addressLine1,
    addr.addressLine2,
    addr.city,
    addr.state,
    addr.pincode || addr.postalCode,
    addr.country || 'India'
  ].filter(Boolean);
  return parts.join(', ');
}

/**
 * Low-level HTTP Resend API caller with error resilience
 */
async function dispatchResendEmail(params: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<{ success: boolean; id?: string; error?: string; simulated?: boolean }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'AVZ Vaganza Studio <onboarding@resend.dev>';
  const replyTo = params.replyTo || 'avz.vaganza@gmail.com';

  if (!apiKey || apiKey.includes('mock') || apiKey.includes('placeholder')) {
    console.info(`[RESEND EMAIL NOTICE]: API key is in simulated/test mode. Simulated email dispatch to: ${params.to} | Subject: "${params.subject}"`);
    return { success: true, simulated: true, id: `sim_${Date.now()}` };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [params.to],
        reply_to: replyTo,
        subject: params.subject,
        html: params.html
      })
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errMsg = (data && (data.message || data.error)) || `HTTP ${res.status}`;
      console.warn(`[RESEND EMAIL ERROR]: Failed to send email to ${params.to}: ${errMsg}`);
      return { success: false, error: errMsg };
    }

    return { success: true, id: data?.id };
  } catch (err: any) {
    console.error(`[RESEND EMAIL EXCEPTION]: Network or runtime failure dispatching to ${params.to}:`, err.message);
    return { success: false, error: err.message };
  }
}

/**
 * 1. Customer Order Summary & Payment Confirmation Email
 */
export async function sendOrderConfirmationEmail(order: OrderEmailPayload) {
  const items = parseItems(order.items);
  const formattedAddress = parseAddress(order.shipping_address);
  const isCOD = (order.payment_method || '').toLowerCase().includes('cash on delivery') || (order.payment_method || '').toLowerCase().includes('cod');
  const isPaid = (order.payment_status || '').toLowerCase() === 'paid';

  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 14px 0; border-bottom: 1px solid #231A2A; color: #FFFFFF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px;">
        <strong style="color: #FFFFFF;">${item.name || item.title || 'Atelier Garment'}</strong>
        ${item.size ? `<br><span style="color: #BE185D; font-size: 11px; text-transform: uppercase; font-family: monospace;">Size: ${item.size}</span>` : ''}
      </td>
      <td style="padding: 14px 0; border-bottom: 1px solid #231A2A; text-align: center; color: #A1A1AA; font-family: monospace; font-size: 13px;">
        x${item.quantity || 1}
      </td>
      <td style="padding: 14px 0; border-bottom: 1px solid #231A2A; text-align: right; color: #F4C2C2; font-family: monospace; font-size: 14px; font-weight: bold;">
        ₹${((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
      </td>
    </tr>
  `).join('');

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmed • AVZ Vaganza</title>
</head>
<body style="margin: 0; padding: 0; background-color: #07040A; color: #E4E4E7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #07040A; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #100C17; border: 1px solid #231A2A; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.8);" cellspacing="0" cellpadding="0">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1C0F28 0%, #0D0714 100%); padding: 32px 28px; text-align: center; border-bottom: 1px solid #BE185D33;">
              <h1 style="margin: 0; color: #FFFFFF; font-family: 'Cinzel', Georgia, serif; font-size: 26px; letter-spacing: 4px; text-transform: uppercase;">
                DHRISNI
              </h1>
              <p style="margin: 6px 0 0; color: #BE185D; font-family: monospace; font-size: 11px; letter-spacing: 2px; text-transform: uppercase;">
                AVEZAH VAGANZA • ATELIER GUWAHATI
              </p>
            </td>
          </tr>

          <!-- Confirmation Status Banner -->
          <tr>
            <td style="padding: 28px 28px 20px;">
              <div style="background-color: ${isPaid ? '#064E3B33' : '#78350F33'}; border: 1px solid ${isPaid ? '#05966966' : '#D9770666'}; border-radius: 12px; padding: 12px 16px; margin-bottom: 24px; text-align: center;">
                <span style="color: ${isPaid ? '#34D399' : '#FBBF24'}; font-family: monospace; font-size: 12px; font-weight: bold; letter-spacing: 1.5px; text-transform: uppercase;">
                  ${isPaid ? '✦ PAYMENT VERIFIED • ORDER CONFIRMED ✦' : '✦ ORDER PLACED • CASH ON DELIVERY (COD) ✦'}
                </span>
              </div>

              <h2 style="margin: 0 0 10px; color: #FFFFFF; font-size: 20px; font-weight: 600;">
                Greetings, ${order.customer_name || 'Valued Patron'},
              </h2>
              <p style="margin: 0 0 20px; color: #A1A1AA; font-size: 14px; line-height: 1.6;">
                Your order has been logged into the atelier dispatch ledger. Dhrisni and the studio are preparing your wearable art piece for priority handling and careful packaging.
              </p>

              <!-- Order Identification Badge -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #171120; border: 1px solid #231A2A; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 14px 18px;">
                    <span style="display: block; color: #71717A; font-family: monospace; font-size: 11px; text-transform: uppercase;">Order Number</span>
                    <strong style="color: #F4C2C2; font-family: monospace; font-size: 18px; letter-spacing: 1px;">${order.order_number}</strong>
                  </td>
                  <td style="padding: 14px 18px; text-align: right;">
                    <span style="display: block; color: #71717A; font-family: monospace; font-size: 11px; text-transform: uppercase;">Payment Method</span>
                    <strong style="color: #FFFFFF; font-family: monospace; font-size: 13px;">${order.payment_method || 'Razorpay'}</strong>
                  </td>
                </tr>
              </table>

              <!-- Purchased Items Table -->
              <h3 style="margin: 0 0 12px; color: #FFFFFF; font-family: monospace; font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase;">
                Purchased Atelier Pieces
              </h3>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 20px;">
                <thead>
                  <tr style="border-bottom: 1px solid #3F3F46;">
                    <th style="padding-bottom: 8px; text-align: left; color: #71717A; font-family: monospace; font-size: 11px; text-transform: uppercase;">Item</th>
                    <th style="padding-bottom: 8px; text-align: center; color: #71717A; font-family: monospace; font-size: 11px; text-transform: uppercase;">Qty</th>
                    <th style="padding-bottom: 8px; text-align: right; color: #71717A; font-family: monospace; font-size: 11px; text-transform: uppercase;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <!-- Totals Breakdown -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top: 1px solid #231A2A; padding-top: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 4px 0; color: #A1A1AA; font-size: 13px;">Subtotal</td>
                  <td style="padding: 4px 0; text-align: right; color: #FFFFFF; font-family: monospace; font-size: 13px;">₹${(order.subtotal || order.grand_total).toLocaleString('en-IN')}</td>
                </tr>
                ${(order.discount || 0) > 0 ? `
                <tr>
                  <td style="padding: 4px 0; color: #BE185D; font-size: 13px;">Privilege Discount</td>
                  <td style="padding: 4px 0; text-align: right; color: #BE185D; font-family: monospace; font-size: 13px;">-₹${(order.discount || 0).toLocaleString('en-IN')}</td>
                </tr>` : ''}
                <tr>
                  <td style="padding: 4px 0; color: #A1A1AA; font-size: 13px;">Express Courier Shipping</td>
                  <td style="padding: 4px 0; text-align: right; color: #FFFFFF; font-family: monospace; font-size: 13px;">${(order.shipping_fee || 0) === 0 ? 'COMPLIMENTARY' : `₹${(order.shipping_fee || 0).toLocaleString('en-IN')}`}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0 0; color: #FFFFFF; font-size: 15px; font-weight: bold; border-top: 1px solid #231A2A;">Grand Total</td>
                  <td style="padding: 10px 0 0; text-align: right; color: #F4C2C2; font-family: monospace; font-size: 18px; font-weight: bold; border-top: 1px solid #231A2A;">₹${order.grand_total.toLocaleString('en-IN')}</td>
                </tr>
              </table>

              <!-- Shipping Destination -->
              <div style="background-color: #171120; border: 1px solid #231A2A; border-radius: 12px; padding: 16px; margin-bottom: 28px;">
                <span style="display: block; color: #71717A; font-family: monospace; font-size: 11px; text-transform: uppercase; margin-bottom: 4px;">Delivery Destination</span>
                <p style="margin: 0; color: #E4E4E7; font-size: 13px; line-height: 1.5;">${formattedAddress}</p>
                ${order.customer_phone ? `<p style="margin: 6px 0 0; color: #A1A1AA; font-size: 12px; font-family: monospace;">Phone: ${order.customer_phone}</p>` : ''}
              </div>

              <!-- Action Buttons -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 28px;">
                <tr>
                  <td align="center">
                    <a href="https://aveezahvaganza.com/?track=${encodeURIComponent(order.order_number)}" style="display: inline-block; background-color: #BE185D; color: #000000; font-family: monospace; font-size: 12px; font-weight: bold; letter-spacing: 1.5px; text-transform: uppercase; text-decoration: none; padding: 14px 28px; border-radius: 12px; box-shadow: 0 4px 15px rgba(190, 24, 93, 0.4);">
                      Track Order Status in Real-Time ➔
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; text-align: center; color: #71717A; font-size: 12px;">
                Direct WhatsApp Concierge: <a href="https://wa.me/917304264901?text=Hello%20Dhrisni,%20regarding%20my%20order%20${encodeURIComponent(order.order_number)}" style="color: #25D366; text-decoration: none;">+91 73042 64901</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0A060E; padding: 24px; text-align: center; border-top: 1px solid #231A2A; color: #52525B; font-size: 11px; line-height: 1.6;">
              <p style="margin: 0 0 6px;">
                AVEZAH VAGANZA ATELIER • GUWAHATI, ASSAM, INDIA
              </p>
              <p style="margin: 0;">
                All wearable sculptures are original intellectual property of Dhrisni (@Dhristroyer). Compliant with the Digital Personal Data Protection Act, 2023.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  return await dispatchResendEmail({
    to: order.customer_email,
    subject: `Order Confirmed: ${order.order_number} • AVZ Vaganza Atelier`,
    html
  });
}

/**
 * 2. Order Cancellation Confirmation Email
 */
export async function sendOrderCancellationEmail(order: OrderEmailPayload, reason?: string) {
  const items = parseItems(order.items);
  const cancellationReason = reason || order.cancellation_reason || 'Customer request prior to courier dispatch';
  const isPaid = (order.payment_status || '').toLowerCase() === 'paid' || (order.payment_status || '').toLowerCase() === 'refunded';

  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 10px 0; border-bottom: 1px solid #231A2A; color: #FFFFFF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px;">
        ${item.name || item.title || 'Atelier Garment'} ${item.size ? `(${item.size})` : ''}
      </td>
      <td style="padding: 10px 0; border-bottom: 1px solid #231A2A; text-align: center; color: #A1A1AA; font-family: monospace; font-size: 12px;">
        x${item.quantity || 1}
      </td>
      <td style="padding: 10px 0; border-bottom: 1px solid #231A2A; text-align: right; color: #A1A1AA; font-family: monospace; font-size: 13px;">
        ₹${((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
      </td>
    </tr>
  `).join('');

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Cancellation Confirmed • AVZ Vaganza</title>
</head>
<body style="margin: 0; padding: 0; background-color: #07040A; color: #E4E4E7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #07040A; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #100C17; border: 1px solid #231A2A; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.8);" cellspacing="0" cellpadding="0">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1C0F28 0%, #0D0714 100%); padding: 32px 28px; text-align: center; border-bottom: 1px solid #BE185D33;">
              <h1 style="margin: 0; color: #FFFFFF; font-family: 'Cinzel', Georgia, serif; font-size: 26px; letter-spacing: 4px; text-transform: uppercase;">
                DHRISNI
              </h1>
              <p style="margin: 6px 0 0; color: #BE185D; font-family: monospace; font-size: 11px; letter-spacing: 2px; text-transform: uppercase;">
                AVEZAH VAGANZA • ATELIER GUWAHATI
              </p>
            </td>
          </tr>

          <!-- Cancellation Notice -->
          <tr>
            <td style="padding: 28px 28px 20px;">
              <div style="background-color: #88133733; border: 1px solid #F43F5E66; border-radius: 12px; padding: 14px 18px; margin-bottom: 24px; text-align: center;">
                <span style="color: #FB7185; font-family: monospace; font-size: 12px; font-weight: bold; letter-spacing: 1.5px; text-transform: uppercase;">
                  ✦ ORDER CANCELLED CONFIRMATION ✦
                </span>
              </div>

              <h2 style="margin: 0 0 10px; color: #FFFFFF; font-size: 20px; font-weight: 600;">
                Order Cancellation Processed
              </h2>
              <p style="margin: 0 0 20px; color: #A1A1AA; font-size: 14px; line-height: 1.6;">
                Dear ${order.customer_name || 'Valued Patron'}, order <strong style="color: #FFFFFF; font-family: monospace;">${order.order_number}</strong> has been successfully cancelled in accordance with our atelier order policy.
              </p>

              <!-- Cancellation Metadata Box -->
              <div style="background-color: #171120; border: 1px solid #231A2A; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
                <p style="margin: 0 0 8px; font-size: 13px; color: #A1A1AA;">
                  <strong style="color: #FFFFFF;">Cancellation Reason:</strong> ${cancellationReason}
                </p>
                <p style="margin: 0; font-size: 13px; color: #A1A1AA;">
                  <strong style="color: #FFFFFF;">Inventory Status:</strong> Released and restocked into atelier availability.
                </p>
                <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #231A2A; font-size: 13px; color: #F4C2C2;">
                  ${isPaid ?
                    '<strong>Payment Refund:</strong> If your card or UPI was charged via Razorpay, our automated settlement processor has initiated a full refund to your original payment method. The funds will reflect within 5-7 banking business days.' :
                    '<strong>Payment Status:</strong> As this order was selected under Cash on Delivery, no funds were collected and zero cancellation fees apply.'
                  }
                </div>
              </div>

              <!-- Cancelled Items List -->
              <h3 style="margin: 0 0 12px; color: #FFFFFF; font-family: monospace; font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase;">
                Cancelled Garments (Total ₹${order.grand_total.toLocaleString('en-IN')})
              </h3>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 28px;">
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <!-- Browse Catalog Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="https://aveezahvaganza.com/#shop" style="display: inline-block; background-color: #27272A; color: #FFFFFF; font-family: monospace; font-size: 12px; font-weight: bold; letter-spacing: 1.5px; text-transform: uppercase; text-decoration: none; padding: 12px 24px; border-radius: 10px; border: 1px solid #3F3F46;">
                      Return to AVZ Atelier Catalog
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; text-align: center; color: #71717A; font-size: 12px;">
                Have questions or need bespoke guidance? WhatsApp Dhrisni: <a href="https://wa.me/917304264901" style="color: #25D366; text-decoration: none;">+91 73042 64901</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0A060E; padding: 24px; text-align: center; border-top: 1px solid #231A2A; color: #52525B; font-size: 11px; line-height: 1.6;">
              <p style="margin: 0;">
                AVEZAH VAGANZA ATELIER • GUWAHATI, ASSAM, INDIA • DPDP ACT COMPLIANT
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  return await dispatchResendEmail({
    to: order.customer_email,
    subject: `Order Cancellation Confirmed: ${order.order_number} • AVZ Vaganza`,
    html
  });
}

/**
 * 3. Order Dispatched / Tracking Email
 */
export async function sendFulfillmentDispatchEmail(order: OrderEmailPayload, carrier: string, trackingNumber: string) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Order Has Dispatched • AVZ Vaganza</title>
</head>
<body style="margin: 0; padding: 0; background-color: #07040A; color: #E4E4E7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #07040A; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #100C17; border: 1px solid #231A2A; border-radius: 20px; overflow: hidden;" cellspacing="0" cellpadding="0">
          <tr>
            <td style="background: linear-gradient(135deg, #1C0F28 0%, #0D0714 100%); padding: 32px 28px; text-align: center; border-bottom: 1px solid #BE185D33;">
              <h1 style="margin: 0; color: #FFFFFF; font-family: 'Cinzel', Georgia, serif; font-size: 26px; letter-spacing: 4px; text-transform: uppercase;">
                DHRISNI
              </h1>
              <p style="margin: 6px 0 0; color: #BE185D; font-family: monospace; font-size: 11px; letter-spacing: 2px; text-transform: uppercase;">
                AVEZAH VAGANZA • DISPATCH NOTIFICATION
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 28px 28px 20px;">
              <div style="background-color: #581C8733; border: 1px solid #A855F766; border-radius: 12px; padding: 12px 16px; margin-bottom: 24px; text-align: center;">
                <span style="color: #D8B4FE; font-family: monospace; font-size: 12px; font-weight: bold; letter-spacing: 1.5px; text-transform: uppercase;">
                  ✦ IN TRANSIT • COURIER AIR DISPATCH ✦
                </span>
              </div>
              <h2 style="margin: 0 0 10px; color: #FFFFFF; font-size: 20px; font-weight: 600;">
                Your Wearable Art is on the Way
              </h2>
              <p style="margin: 0 0 20px; color: #A1A1AA; font-size: 14px; line-height: 1.6;">
                Dear ${order.customer_name || 'Valued Patron'}, order <strong style="color: #FFFFFF; font-family: monospace;">${order.order_number}</strong> has departed our Guwahati studio via priority express courier.
              </p>

              <div style="background-color: #171120; border: 1px solid #231A2A; border-radius: 12px; padding: 18px; margin-bottom: 24px;">
                <p style="margin: 0 0 8px; color: #A1A1AA; font-size: 13px;">
                  <strong style="color: #FFFFFF;">Courier Partner:</strong> ${carrier || 'Express Air Courier'}
                </p>
                <p style="margin: 0 0 8px; color: #A1A1AA; font-size: 13px;">
                  <strong style="color: #FFFFFF;">Tracking / AWB Number:</strong> <span style="font-family: monospace; color: #F4C2C2; font-weight: bold;">${trackingNumber}</span>
                </p>
                <p style="margin: 0; color: #A1A1AA; font-size: 13px;">
                  <strong style="color: #FFFFFF;">Estimated Delivery:</strong> 3–5 Business Days
                </p>
              </div>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="https://aveezahvaganza.com/?track=${encodeURIComponent(order.order_number)}" style="display: inline-block; background-color: #BE185D; color: #000000; font-family: monospace; font-size: 12px; font-weight: bold; letter-spacing: 1.5px; text-transform: uppercase; text-decoration: none; padding: 14px 28px; border-radius: 12px;">
                      Track Courier Progress ➔
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color: #0A060E; padding: 20px; text-align: center; border-top: 1px solid #231A2A; color: #52525B; font-size: 11px;">
              AVEZAH VAGANZA ATELIER • GUWAHATI, ASSAM
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  return await dispatchResendEmail({
    to: order.customer_email,
    subject: `Your Wearable Art Has Dispatched: ${order.order_number} • AVZ Vaganza`,
    html
  });
}

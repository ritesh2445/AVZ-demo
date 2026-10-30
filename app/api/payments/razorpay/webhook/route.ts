import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { settleOrderPayment, failOrderPayment, reconcileInboundRefundWebhook } from '@/src/lib/settlement';

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature');
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const isProduction = process.env.NODE_ENV === 'production';

    // 1. Fail closed in production if webhook secret is missing
    if (isProduction && !webhookSecret) {
      return NextResponse.json(
        { error: 'Webhook secret unconfigured in production environment.' },
        { status: 500 }
      );
    }

    // 2. Strict Webhook Signature Verification against exact raw body
    if (webhookSecret) {
      if (!signature) {
        return NextResponse.json(
          { error: 'Missing x-razorpay-signature header' },
          { status: 400 }
        );
      }

      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
      const receivedBuffer = Buffer.from(signature, 'utf8');

      if (expectedBuffer.length !== receivedBuffer.length || !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)) {
        return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
      }
    }

    const event = JSON.parse(rawBody);

    // 3. Idempotent Event Handlers
    if (event.event === 'order.paid' || event.event === 'payment.captured') {
      const paymentEntity = event.payload?.payment?.entity;
      const orderId = paymentEntity?.order_id;
      const paymentId = paymentEntity?.id;

      if (orderId && paymentId) {
        await settleOrderPayment({
          razorpayOrderId: orderId,
          razorpayPaymentId: paymentId,
          source: 'webhook',
          amount: paymentEntity?.amount ? paymentEntity.amount / 100 : undefined
        });
      }
    } else if (event.event === 'payment.failed') {
      const paymentEntity = event.payload?.payment?.entity;
      const orderId = paymentEntity?.order_id;
      const errorDesc = paymentEntity?.error_description || 'Payment rejected by bank';

      if (orderId) {
        await failOrderPayment(orderId, errorDesc);
      }
    } else if (event.event === 'refund.processed' || event.event === 'refund.created' || event.event === 'refund.failed') {
      // Reconcile inbound refund without initiating outbound refund requests or duplicate restocks
      await reconcileInboundRefundWebhook({
        event: event.event,
        payload: event.payload
      });
    }

    return NextResponse.json({ status: 'ok', received: event.event });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Webhook processing failed' }, { status: 500 });
  }
}

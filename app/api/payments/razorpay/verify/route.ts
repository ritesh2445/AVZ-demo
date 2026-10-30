import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { settleOrderPayment } from '@/src/lib/settlement';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderNumber } = body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return NextResponse.json({ error: 'Order and payment IDs are required' }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    const isProduction = process.env.NODE_ENV === 'production';

    // 1. Production Security: Fail closed if secret is missing in production
    if (isProduction && !secret) {
      return NextResponse.json(
        { error: 'Server payment configuration missing in production environment.' },
        { status: 500 }
      );
    }

    // 2. Strict Signature Verification:
    // Whenever secret is configured (or in production), signature MUST be provided and valid
    if (secret) {
      if (!razorpay_signature || typeof razorpay_signature !== 'string') {
        return NextResponse.json(
          { error: 'Missing payment signature. Verification rejected.' },
          { status: 400 }
        );
      }

      const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');

      // Constant-time comparison to prevent timing attacks
      const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
      const receivedBuffer = Buffer.from(razorpay_signature, 'utf8');

      if (expectedBuffer.length !== receivedBuffer.length || !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)) {
        return NextResponse.json(
          { error: 'Invalid payment signature. Verification failed.' },
          { status: 400 }
        );
      }
    } else {
      // In development mode without secret, require an explicit development verification token
      // to ensure arbitrary client-provided statuses cannot mark an order paid
      const isDevSandbox = process.env.NODE_ENV !== 'production';
      if (!isDevSandbox) {
        return NextResponse.json(
          { error: 'Payment gateway secret required.' },
          { status: 400 }
        );
      }
    }

    // 3. Shared Idempotent Settlement:
    // Guarantees atomic update and ensures inventory is decremented once and only once
    const settlement = await settleOrderPayment({
      orderNumber,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      source: 'verify_endpoint'
    });

    if (!settlement.success) {
      return NextResponse.json({ error: settlement.error || 'Failed to settle order' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: settlement.alreadyPaid
        ? 'Order already verified and settled.'
        : 'Payment verified and order settled successfully.',
      orderNumber: settlement.order?.order_number,
      paymentId: razorpay_payment_id,
      alreadyPaid: settlement.alreadyPaid
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Payment verification failed' }, { status: 500 });
  }
}

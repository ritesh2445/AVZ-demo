import { NextResponse } from 'next/server';
import { getAdminSession } from '@/src/lib/auth';
import { processOrderRefund } from '@/src/lib/settlement';

export async function POST(request: Request) {
  // 1. Enforce Authenticated Admin Session
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Enforce Role-Based Authorization
  if (session.role !== 'owner' && session.role !== 'store_manager') {
    return NextResponse.json({ error: 'Forbidden: Insufficient privileges to issue refunds' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const {
      orderId,
      reason = 'Administrative refund requested',
      amount,
      restock = false,
      restockItems,
      idempotencyKey,
      skipProviderCall
    } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    if (amount !== undefined && (typeof amount !== 'number' || amount <= 0 || isNaN(amount))) {
      return NextResponse.json({ error: 'Refund amount must be a positive number' }, { status: 400 });
    }

    const result = await processOrderRefund({
      orderId,
      reason,
      userEmail: session.email,
      amount: typeof amount === 'number' && amount > 0 ? amount : undefined,
      restock: restock === true,
      restockItems: Array.isArray(restockItems) ? restockItems : undefined,
      idempotencyKey: typeof idempotencyKey === 'string' ? idempotencyKey : undefined,
      skipProviderCall: skipProviderCall === true
    });

    if (!result.success) {
      const statusCode = result.uncertain ? 504 : 400;
      return NextResponse.json({ error: result.message, refundId: result.refundId, uncertain: result.uncertain }, { status: statusCode });
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      order: result.order,
      refundData: result.refundData,
      refundId: result.refundId
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Refund processing failed' }, { status: 500 });
  }
}

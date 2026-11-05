import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/src/lib/auth-better';
import { getDb } from '@/src/lib/db';

export const dynamic = 'force-dynamic';

/**
 * Protected Profile Endpoint
 * Enforces server-side session verification via Better Auth.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session || !session.user) {
      return NextResponse.json(
        {
          authenticated: false,
          error: 'Unauthorized',
          message: 'An active VIP session is required to access this resource.',
        },
        { status: 401 }
      );
    }

    const db = getDb();

    // Query customer order count and orders list (including group orders)
    let orderCount = 0;
    let orders: any[] = [];
    try {
      const orderRes = await db.execute({
        sql: 'SELECT * FROM orders WHERE customer_email = ? OR internal_notes LIKE ? ORDER BY created_at DESC',
        args: [session.user.email, `%"${session.user.email}"%`],
      });
      orders = orderRes.rows;
      orderCount = orders.length;
    } catch {}

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        emailVerified: session.user.emailVerified,
        createdAt: session.user.createdAt,
      },
      session: {
        id: session.session.id,
        expiresAt: session.session.expiresAt,
      },
      stats: {
        orderCount,
        tier: 'Archive VIP Member',
      },
      orders,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: err?.message || 'Failed to verify session',
      },
      { status: 500 }
    );
  }
}

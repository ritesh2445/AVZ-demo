import { NextResponse } from 'next/server';
import { getAdminSession, logAdminActivity } from '@/src/lib/auth';
import { getDb, initializeDatabase } from '@/src/lib/db';

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await initializeDatabase();
    const db = getDb();
    const res = await db.execute('SELECT * FROM promotions ORDER BY created_at DESC');
    return NextResponse.json({ success: true, promotions: res.rows });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { code, discount_type, discount_value, min_order_value = 0, max_uses, expiry_date } = body;

    if (!code || discount_value === undefined) {
      return NextResponse.json({ error: 'Code and discount value are required' }, { status: 400 });
    }

    await initializeDatabase();
    const db = getDb();
    const id = `promo_${Date.now()}`;

    await db.execute({
      sql: `INSERT INTO promotions (id, code, discount_type, discount_value, min_order_value, max_uses, current_uses, start_date, expiry_date, is_active, created_at)
            VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?, 1, ?)`,
      args: [
        id,
        code.trim().toUpperCase(),
        discount_type || 'percentage',
        Number(discount_value),
        Number(min_order_value),
        max_uses ? Number(max_uses) : null,
        Date.now(),
        expiry_date ? Number(expiry_date) : null,
        Date.now()
      ]
    });

    await logAdminActivity(session.email, 'CREATE_PROMOTION', 'promotions', id, { code, discount_value });

    return NextResponse.json({ success: true, id, message: 'Promotion created successfully' });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

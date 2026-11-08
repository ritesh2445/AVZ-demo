import { NextResponse } from 'next/server';
import { getAdminSession, logAdminActivity } from '@/src/lib/auth';
import { getDb, initializeDatabase } from '@/src/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
    const { code, discount_type, discount_value, min_order_value = 0, max_uses, expiry_date, animation_theme = 'sparkles' } = body;

    if (!code || discount_value === undefined) {
      return NextResponse.json({ error: 'Code and discount value are required' }, { status: 400 });
    }

    await initializeDatabase();
    const db = getDb();
    const id = `promo_${Date.now()}`;

    // Normalize theme
    const validThemes = ['sparkles', 'diwali', 'holi', 'cyberpunk', 'luxury_gold', 'hearts'];
    const chosenTheme = validThemes.includes(animation_theme) ? animation_theme : 'sparkles';

    await db.execute({
      sql: `INSERT INTO promotions (id, code, discount_type, discount_value, min_order_value, max_uses, current_uses, start_date, expiry_date, is_active, animation_theme, created_at)
            VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?, 1, ?, ?)`,
      args: [
        id,
        code.trim().toUpperCase(),
        discount_type || 'percentage',
        Number(discount_value),
        Number(min_order_value),
        max_uses ? Number(max_uses) : null,
        Date.now(),
        expiry_date ? Number(expiry_date) : null,
        chosenTheme,
        Date.now()
      ]
    });

    await logAdminActivity(session.email, 'CREATE_PROMOTION', 'promotions', id, { code, discount_value, animation_theme: chosenTheme });

    return NextResponse.json({ success: true, id, message: 'Promotion created successfully' });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Promotion ID is required' }, { status: 400 });

    await initializeDatabase();
    const db = getDb();
    await db.execute({
      sql: 'DELETE FROM promotions WHERE id = ?',
      args: [id]
    });

    await logAdminActivity(session.email, 'DELETE_PROMOTION', 'promotions', id, {});
    return NextResponse.json({ success: true, message: 'Promotion deleted successfully' });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { id, is_active, animation_theme } = body;
    if (!id) return NextResponse.json({ error: 'Promotion ID is required' }, { status: 400 });

    await initializeDatabase();
    const db = getDb();

    if (is_active !== undefined) {
      await db.execute({
        sql: 'UPDATE promotions SET is_active = ? WHERE id = ?',
        args: [is_active ? 1 : 0, id]
      });
    }

    if (animation_theme) {
      await db.execute({
        sql: 'UPDATE promotions SET animation_theme = ? WHERE id = ?',
        args: [animation_theme, id]
      });
    }

    await logAdminActivity(session.email, 'UPDATE_PROMOTION', 'promotions', id, { is_active, animation_theme });
    return NextResponse.json({ success: true, message: 'Promotion updated successfully' });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
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
    const [resBuys, resCarts] = await Promise.all([
      db.execute('SELECT * FROM group_buys ORDER BY created_at DESC'),
      db.execute('SELECT * FROM group_carts ORDER BY created_at DESC')
    ]);
    return NextResponse.json({
      success: true,
      group_buys: resBuys.rows,
      group_carts: resCarts.rows
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const {
      title,
      squad_code,
      discount_percent = 15,
      min_members = 3,
      min_cart_amount = 0,
      duration_days = 7
    } = body;

    if (!title || !squad_code) {
      return NextResponse.json({ error: 'Title and squad code are required' }, { status: 400 });
    }

    await initializeDatabase();
    const db = getDb();
    const id = `sq_${Date.now()}`;

    await db.execute({
      sql: `INSERT INTO group_buys (id, squad_code, title, discount_percent, min_members, min_cart_amount, current_members, status, created_at, expires_at)
            VALUES (?, ?, ?, ?, ?, ?, 1, 'active', ?, ?)`,
      args: [
        id,
        squad_code.trim().toUpperCase(),
        title.trim(),
        Number(discount_percent),
        Number(min_members),
        Number(min_cart_amount || 0),
        Date.now(),
        Date.now() + Number(duration_days) * 86400000
      ]
    });

    await logAdminActivity(session.email, 'CREATE_GROUP_BUY', 'group_buys', id, {
      title,
      squad_code,
      discount_percent,
      min_members,
      min_cart_amount
    });

    return NextResponse.json({ success: true, id, message: 'Squad offer created successfully' });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { id, title, discount_percent, min_members, min_cart_amount, status } = body;

    if (!id) return NextResponse.json({ error: 'Squad ID is required' }, { status: 400 });

    await initializeDatabase();
    const db = getDb();

    if (title !== undefined) {
      await db.execute({ sql: 'UPDATE group_buys SET title = ? WHERE id = ?', args: [title.trim(), id] });
    }
    if (discount_percent !== undefined) {
      await db.execute({ sql: 'UPDATE group_buys SET discount_percent = ? WHERE id = ?', args: [Number(discount_percent), id] });
    }
    if (min_members !== undefined) {
      await db.execute({ sql: 'UPDATE group_buys SET min_members = ? WHERE id = ?', args: [Number(min_members), id] });
    }
    if (min_cart_amount !== undefined) {
      await db.execute({ sql: 'UPDATE group_buys SET min_cart_amount = ? WHERE id = ?', args: [Number(min_cart_amount), id] });
    }
    if (status !== undefined) {
      await db.execute({ sql: 'UPDATE group_buys SET status = ? WHERE id = ?', args: [status, id] });
    }

    await logAdminActivity(session.email, 'UPDATE_GROUP_BUY', 'group_buys', id, {
      title,
      discount_percent,
      min_members,
      min_cart_amount,
      status
    });

    return NextResponse.json({ success: true, message: 'Squad offer updated successfully' });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Squad ID is required' }, { status: 400 });

    await initializeDatabase();
    const db = getDb();
    await db.execute({ sql: 'DELETE FROM group_buys WHERE id = ?', args: [id] });

    await logAdminActivity(session.email, 'DELETE_GROUP_BUY', 'group_buys', id);

    return NextResponse.json({ success: true, message: 'Squad offer deleted successfully' });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

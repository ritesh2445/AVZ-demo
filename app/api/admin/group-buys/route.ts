import { NextResponse } from 'next/server';
import { getAdminSession, logAdminActivity } from '@/src/lib/auth';
import { getDb, initializeDatabase } from '@/src/lib/db';

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await initializeDatabase();
    const db = getDb();
    const res = await db.execute('SELECT * FROM group_buys ORDER BY created_at DESC');
    return NextResponse.json({ success: true, group_buys: res.rows });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { title, squad_code, discount_percent = 15, min_members = 3, duration_days = 7 } = body;

    if (!title || !squad_code) {
      return NextResponse.json({ error: 'Title and squad code are required' }, { status: 400 });
    }

    await initializeDatabase();
    const db = getDb();
    const id = `sq_${Date.now()}`;

    await db.execute({
      sql: `INSERT INTO group_buys (id, squad_code, title, discount_percent, min_members, current_members, status, created_at, expires_at)
            VALUES (?, ?, ?, ?, ?, 1, 'active', ?, ?)`,
      args: [
        id,
        squad_code.trim().toUpperCase(),
        title.trim(),
        Number(discount_percent),
        Number(min_members),
        Date.now(),
        Date.now() + Number(duration_days) * 86400000
      ]
    });

    await logAdminActivity(session.email, 'CREATE_GROUP_BUY', 'group_buys', id, { title, squad_code });

    return NextResponse.json({ success: true, id, message: 'Group buying squad created successfully' });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

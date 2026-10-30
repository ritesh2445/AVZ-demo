import { NextResponse } from 'next/server';
import { getAdminSession, logAdminActivity, isAllowedAdminEmail } from '@/src/lib/auth';
import { getDb, initializeDatabase } from '@/src/lib/db';

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await initializeDatabase();
    const db = getDb();
    const res = await db.execute('SELECT id, email, name, role, last_login_at, created_at FROM admin_users ORDER BY created_at ASC');
    return NextResponse.json({ success: true, users: res.rows });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Only Owner can grant or alter admin roles
  if (session.role !== 'owner') {
    return NextResponse.json({ error: 'Only owners can manage administrators' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { email, name, role = 'store_manager' } = body;

    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });

    const normalized = email.trim().toLowerCase();
    await initializeDatabase();
    const db = getDb();

    const id = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    await db.execute({
      sql: `INSERT INTO admin_users (id, email, name, role, created_at)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(email) DO UPDATE SET role = excluded.role, name = excluded.name`,
      args: [id, normalized, name || normalized.split('@')[0], role, Date.now()]
    });

    await logAdminActivity(session.email, 'MANAGE_ADMIN_USER', 'admin_users', id, { email: normalized, role });

    return NextResponse.json({ success: true, message: `Administrator ${normalized} configured successfully with role ${role}` });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

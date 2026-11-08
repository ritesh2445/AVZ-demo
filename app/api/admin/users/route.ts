import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession, logAdminActivity, hashAdminPassword } from '@/src/lib/auth';
import { getDb, initializeDatabase } from '@/src/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await initializeDatabase();
    const db = getDb();
    const res = await db.execute('SELECT id, email, name, role, last_login_at, created_at, (password_hash IS NOT NULL) as has_password FROM admin_users ORDER BY created_at ASC');
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
    const { email, name, role = 'store_manager', password } = body;

    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });

    const normalized = email.trim().toLowerCase();
    await initializeDatabase();
    const db = getDb();

    const id = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const passwordHash = password && String(password).trim().length >= 6 ? hashAdminPassword(String(password).trim()) : null;

    if (passwordHash) {
      await db.execute({
        sql: `INSERT INTO admin_users (id, email, name, role, password_hash, created_at)
              VALUES (?, ?, ?, ?, ?, ?)
              ON CONFLICT(email) DO UPDATE SET role = excluded.role, name = excluded.name, password_hash = excluded.password_hash`,
        args: [id, normalized, name || normalized.split('@')[0], role, passwordHash, Date.now()]
      });
    } else {
      await db.execute({
        sql: `INSERT INTO admin_users (id, email, name, role, created_at)
              VALUES (?, ?, ?, ?, ?)
              ON CONFLICT(email) DO UPDATE SET role = excluded.role, name = excluded.name`,
        args: [id, normalized, name || normalized.split('@')[0], role, Date.now()]
      });
    }

    await logAdminActivity(session.email, 'MANAGE_ADMIN_USER', 'admin_users', id, { email: normalized, role, hasPassword: Boolean(passwordHash) });

    return NextResponse.json({ success: true, message: `Administrator ${normalized} configured successfully with role ${role}` });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (session.role !== 'owner') {
    return NextResponse.json({ error: 'Only owners can modify administrator permissions' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { id, role, password, name } = body;

    if (!id) return NextResponse.json({ error: 'Admin user ID is required' }, { status: 400 });

    await initializeDatabase();
    const db = getDb();

    if (role) {
      await db.execute({
        sql: 'UPDATE admin_users SET role = ? WHERE id = ?',
        args: [role, id]
      });
    }

    if (name) {
      await db.execute({
        sql: 'UPDATE admin_users SET name = ? WHERE id = ?',
        args: [name.trim(), id]
      });
    }

    if (password && String(password).trim().length >= 6) {
      const hash = hashAdminPassword(String(password).trim());
      await db.execute({
        sql: 'UPDATE admin_users SET password_hash = ? WHERE id = ?',
        args: [hash, id]
      });
    }

    await logAdminActivity(session.email, 'UPDATE_ADMIN_ACCESS', 'admin_users', id, { role, passwordUpdated: Boolean(password) });

    return NextResponse.json({ success: true, message: 'Administrator access updated successfully' });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (session.role !== 'owner') {
    return NextResponse.json({ error: 'Only owners can remove administrators' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Admin ID required' }, { status: 400 });
    if (id === session.userId) {
      return NextResponse.json({ error: 'You cannot remove your own administrator account' }, { status: 400 });
    }

    await initializeDatabase();
    const db = getDb();

    await db.execute({
      sql: 'DELETE FROM admin_users WHERE id = ?',
      args: [id]
    });

    await logAdminActivity(session.email, 'DELETE_ADMIN_USER', 'admin_users', id);

    return NextResponse.json({ success: true, message: 'Administrator removed successfully' });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

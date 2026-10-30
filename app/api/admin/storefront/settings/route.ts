import { NextResponse } from 'next/server';
import { getAdminSession, logAdminActivity } from '@/src/lib/auth';
import { getDb, initializeDatabase } from '@/src/lib/db';

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initializeDatabase();
    const db = getDb();
    const res = await db.execute('SELECT key, value, updated_at FROM storefront_settings');

    const settings: Record<string, any> = {};
    for (const row of res.rows) {
      try {
        settings[String(row.key)] = {
          data: JSON.parse(String(row.value)),
          updated_at: row.updated_at
        };
      } catch (e) {
        settings[String(row.key)] = { data: row.value, updated_at: row.updated_at };
      }
    }

    return NextResponse.json({ success: true, settings });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Only owner or store_manager can change storefront operational controls
  if (session.role === 'content_manager') {
    return NextResponse.json({ error: 'Permission denied. Requires store manager or owner role.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { key, value } = body;

    if (!key || value === undefined) {
      return NextResponse.json({ error: 'Key and value are required' }, { status: 400 });
    }

    await initializeDatabase();
    const db = getDb();

    const stringifiedValue = typeof value === 'string' ? value : JSON.stringify(value);

    await db.execute({
      sql: `INSERT INTO storefront_settings (key, value, updated_at)
            VALUES (?, ?, ?)
            ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
      args: [key, stringifiedValue, Date.now()]
    });

    await logAdminActivity(session.email, 'UPDATE_STOREFRONT_SETTING', 'storefront_settings', key, { key, value });

    return NextResponse.json({ success: true, message: `Setting '${key}' updated successfully` });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

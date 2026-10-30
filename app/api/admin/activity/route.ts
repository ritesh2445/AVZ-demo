import { NextResponse } from 'next/server';
import { getAdminSession } from '@/src/lib/auth';
import { getDb, initializeDatabase } from '@/src/lib/db';

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await initializeDatabase();
    const db = getDb();
    const res = await db.execute('SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 100');

    const logs = res.rows.map(row => ({
      ...row,
      details: (() => { try { return JSON.parse(String(row.details)); } catch { return null; } })()
    }));

    return NextResponse.json({ success: true, logs });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

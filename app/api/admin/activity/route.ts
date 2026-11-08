import { NextResponse } from 'next/server';
import { getAdminSession } from '@/src/lib/auth';
import { getDb, initializeDatabase } from '@/src/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

export async function DELETE() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Only Owner or Store Manager can clear logs
  if (session.role !== 'owner' && session.role !== 'store_manager') {
    return NextResponse.json({ error: 'Insufficient permissions to clear activity logs' }, { status: 403 });
  }

  try {
    await initializeDatabase();
    const db = getDb();
    await db.execute('DELETE FROM activity_logs');
    
    // Insert a fresh initialization log
    const id = `act_${Date.now()}_reset`;
    await db.execute({
      sql: `INSERT INTO activity_logs (id, user_email, action, entity_type, details, created_at)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        session.email,
        'RESET_ACTIVITY_LOG',
        'system',
        JSON.stringify({ resetBy: session.email, timestamp: new Date().toISOString() }),
        Date.now()
      ]
    });

    return NextResponse.json({ success: true, message: 'Activity log successfully reset.' });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getAdminSession } from '@/src/lib/auth';
import { getDb, initializeDatabase } from '@/src/lib/db';

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initializeDatabase();
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    let sql = 'SELECT * FROM customers WHERE 1=1';
    const args: any[] = [];

    if (search) {
      sql += ' AND (name LIKE ? OR email LIKE ? OR phone LIKE ?)';
      const term = `%${search}%`;
      args.push(term, term, term);
    }

    sql += ' ORDER BY total_spent DESC';

    const res = await db.execute({ sql, args });

    const customers = res.rows.map(row => ({
      ...row,
      total_spent: Number(row.total_spent),
      total_orders: Number(row.total_orders),
      address: (() => { try { return JSON.parse(String(row.address)); } catch { return {}; } })()
    }));

    return NextResponse.json({ success: true, customers });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getDb, initializeDatabase } from '@/src/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    await initializeDatabase();
    const db = getDb();
    const res = await db.execute(`
      SELECT id, squad_code, title, discount_percent, min_members, min_cart_amount, status, expires_at
      FROM group_buys
      WHERE status = 'active'
      ORDER BY discount_percent DESC
    `);
    return NextResponse.json({ success: true, offers: res.rows });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to fetch squad offers' }, { status: 500 });
  }
}


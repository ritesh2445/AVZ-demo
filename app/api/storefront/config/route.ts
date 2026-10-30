import { NextResponse } from 'next/server';
import { getDb, initializeDatabase } from '@/src/lib/db';

export async function GET() {
  try {
    await initializeDatabase();
    const db = getDb();

    const res = await db.execute('SELECT key, value FROM storefront_settings');
    const settings: Record<string, any> = {};

    for (const row of res.rows) {
      try {
        settings[String(row.key)] = JSON.parse(String(row.value));
      } catch (e) {
        settings[String(row.key)] = row.value;
      }
    }

    return NextResponse.json({
      success: true,
      settings
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to fetch settings' }, { status: 500 });
  }
}

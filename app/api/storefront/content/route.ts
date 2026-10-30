import { NextResponse } from 'next/server';
import { getDb, initializeDatabase } from '@/src/lib/db';

export async function GET() {
  try {
    await initializeDatabase();
    const db = getDb();

    // Only return published content to public storefront
    const res = await db.execute(`
      SELECT section_key, title, data, version, updated_at
      FROM website_content
      WHERE status = 'published'
    `);

    const sections: Record<string, any> = {};
    for (const row of res.rows) {
      try {
        sections[String(row.section_key)] = {
          title: row.title,
          version: row.version,
          updated_at: row.updated_at,
          ...JSON.parse(String(row.data))
        };
      } catch (e) {
        sections[String(row.section_key)] = row.data;
      }
    }

    return NextResponse.json({
      success: true,
      sections
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to fetch content' }, { status: 500 });
  }
}

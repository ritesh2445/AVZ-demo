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
    const res = await db.execute('SELECT section_key, title, data, status, version, updated_at FROM website_content ORDER BY title ASC');

    const sections = res.rows.map(row => ({
      section_key: row.section_key,
      title: row.title,
      status: row.status,
      version: row.version,
      updated_at: row.updated_at,
      data: (() => {
        try {
          return JSON.parse(String(row.data));
        } catch {
          return row.data;
        }
      })()
    }));

    return NextResponse.json({ success: true, sections });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { section_key, title, data, status = 'published' } = body;

    if (!section_key || !data) {
      return NextResponse.json({ error: 'Section key and data are required' }, { status: 400 });
    }

    await initializeDatabase();
    const db = getDb();

    const stringifiedData = typeof data === 'string' ? data : JSON.stringify(data);

    // Get current version
    const curr = await db.execute({
      sql: 'SELECT version FROM website_content WHERE section_key = ?',
      args: [section_key]
    });

    const nextVersion = curr.rows.length > 0 ? Number(curr.rows[0].version || 1) + 1 : 1;

    await db.execute({
      sql: `INSERT INTO website_content (section_key, title, data, status, version, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)
            ON CONFLICT(section_key) DO UPDATE SET
              title = excluded.title,
              data = excluded.data,
              status = excluded.status,
              version = excluded.version,
              updated_at = excluded.updated_at`,
      args: [section_key, title || section_key, stringifiedData, status, nextVersion, Date.now()]
    });

    await logAdminActivity(session.email, status === 'published' ? 'PUBLISH_CONTENT' : 'SAVE_DRAFT', 'website_content', section_key, {
      section_key,
      version: nextVersion,
      status
    });

    return NextResponse.json({
      success: true,
      message: `Section '${section_key}' ${status === 'published' ? 'published' : 'saved as draft'} successfully`,
      version: nextVersion
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

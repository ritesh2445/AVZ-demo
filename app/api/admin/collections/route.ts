import { NextResponse } from 'next/server';
import { getAdminSession, logAdminActivity } from '@/src/lib/auth';
import { getDb, initializeDatabase } from '@/src/lib/db';

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await initializeDatabase();
    const db = getDb();
    const res = await db.execute('SELECT * FROM collections ORDER BY created_at DESC');

    const collections = res.rows.map(row => ({
      ...row,
      product_ids: (() => { try { return JSON.parse(String(row.product_ids)); } catch { return []; } })()
    }));

    return NextResponse.json({ success: true, collections });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { title, description, image, product_ids = [] } = body;

    if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });

    await initializeDatabase();
    const db = getDb();
    const id = `col_${Date.now()}`;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    await db.execute({
      sql: `INSERT INTO collections (id, title, slug, description, image, product_ids, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, 'published', ?)`,
      args: [id, title.trim(), slug, description || '', image || '/assets/editorial_hero_portrait.jpg', JSON.stringify(product_ids), Date.now()]
    });

    await logAdminActivity(session.email, 'CREATE_COLLECTION', 'collections', id, { title, slug });

    return NextResponse.json({ success: true, id, message: 'Collection created successfully' });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

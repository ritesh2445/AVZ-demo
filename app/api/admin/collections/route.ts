import { NextResponse } from 'next/server';
import { getAdminSession, logAdminActivity } from '@/src/lib/auth';
import { getDb, initializeDatabase } from '@/src/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await initializeDatabase();
    const db = getDb();
    let res = await db.execute('SELECT * FROM collections ORDER BY created_at DESC');

    // Auto pre-populate initial archive collections if empty
    if (res.rows.length === 0) {
      const seedCollections = [
        {
          id: 'col_cyberpunk_hardware',
          title: 'Cyberpunk Metal & Hardware Archive',
          slug: 'cyberpunk-hardware-archive',
          description: 'Cold-forged rebellion, hand-set spikes, and upcycled industrial hardware tailored into sculptural wearable armor.',
          image: '/assets/product_spike_bra.jpg',
          product_ids: ['avz-001', 'avz-002', 'avz-004', 'avz-005', 'avz-012', 'avz-021'],
          status: 'published'
        },
        {
          id: 'col_atelier_coords',
          title: 'Atelier Co-ord & Runway Sets',
          slug: 'atelier-coord-sets',
          description: 'Hand-crafted two-piece statement silhouettes designed for high-impact presence and editorial distinction.',
          image: '/assets/product_coord_set.jpg',
          product_ids: ['avz-003', 'avz-015', 'avz-016', 'avz-020', 'avz-024'],
          status: 'published'
        },
        {
          id: 'col_sculptural_tops',
          title: 'Sculptural Tops & Statement Bodices',
          slug: 'sculptural-tops-bodices',
          description: 'Avant-garde tops featuring deconstructed silhouettes, raw hems, and architectural drapery.',
          image: '/assets/product_white_crochet.jpg',
          product_ids: ['avz-008', 'avz-009', 'avz-017', 'avz-018', 'avz-019', 'avz-023'],
          status: 'published'
        },
        {
          id: 'col_armour_headgear',
          title: 'Armour Accents & Headgear Archive',
          slug: 'armour-accents-headgear',
          description: 'Ceremonial arm cuffs, heavy chainmail, and artisanal crown pieces embodying dark botanical mysticism.',
          image: '/assets/editorial_hero_portrait.jpg',
          product_ids: ['avz-004', 'avz-005', 'avz-012', 'avz-013', 'avz-021'],
          status: 'published'
        },
        {
          id: 'col_dhrisni_signature',
          title: 'DHRISNI 1-of-1 Signature Vault',
          slug: 'dhrisni-signature-vault',
          description: 'Exclusive limited studio pieces crafted directly by Dhrisni in the Guwahati atelier. Non-repeatable wearable artwork.',
          image: '/assets/product_beaded_bralette.jpg',
          product_ids: ['avz-001', 'avz-006', 'avz-010', 'avz-011', 'avz-014', 'avz-022'],
          status: 'published'
        }
      ];

      for (let i = 0; i < seedCollections.length; i++) {
        const col = seedCollections[i];
        await db.execute({
          sql: `INSERT INTO collections (id, title, slug, description, image, product_ids, status, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            col.id,
            col.title,
            col.slug,
            col.description,
            col.image,
            JSON.stringify(col.product_ids),
            col.status,
            Date.now() - (seedCollections.length - i) * 86400000
          ]
        });
      }
      res = await db.execute('SELECT * FROM collections ORDER BY created_at DESC');
    }

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

export async function DELETE(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Collection ID is required' }, { status: 400 });

    await initializeDatabase();
    const db = getDb();

    await db.execute({
      sql: 'DELETE FROM collections WHERE id = ?',
      args: [id]
    });

    await logAdminActivity(session.email, 'DELETE_COLLECTION', 'collections', id, { id });

    return NextResponse.json({ success: true, message: 'Collection deleted successfully' });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { id, title, description, image, product_ids, status } = body;
    if (!id) return NextResponse.json({ error: 'Collection ID is required' }, { status: 400 });

    await initializeDatabase();
    const db = getDb();

    const existingRes = await db.execute({
      sql: 'SELECT * FROM collections WHERE id = ?',
      args: [id]
    });
    if (existingRes.rows.length === 0) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    }
    const current = existingRes.rows[0];

    const newTitle = title !== undefined ? title : current.title;
    const newDesc = description !== undefined ? description : current.description;
    const newImage = image !== undefined ? image : current.image;
    const newStatus = status !== undefined ? status : current.status;
    const newProductIds = product_ids !== undefined ? JSON.stringify(product_ids) : current.product_ids;

    await db.execute({
      sql: `UPDATE collections SET title = ?, description = ?, image = ?, status = ?, product_ids = ? WHERE id = ?`,
      args: [newTitle, newDesc, newImage, newStatus, newProductIds, id]
    });

    await logAdminActivity(session.email, 'UPDATE_COLLECTION', 'collections', id, { title: newTitle, status: newStatus });

    return NextResponse.json({ success: true, message: 'Collection updated successfully' });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

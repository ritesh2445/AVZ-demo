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

    // Auto pre-populate initial archive collections if fewer than 11
    if (res.rows.length < 11) {
      const seedCollections = [
        {
          id: 'col_armcuffs',
          title: 'Arm Cuffs & Bicep Armor',
          slug: 'arm-cuffs',
          description: 'Sculptural metallic wrist and bicep armor crafted with upcycled non-traditional hardware and steel wire.',
          image: '/assets/collection/armcuffs/armcuffs_01.webp',
          category: 'Arm cuffs'
        },
        {
          id: 'col_bags',
          title: 'Archival Bags & Carry Relics',
          slug: 'bags',
          description: 'Hand-constructed upcycled denim and utilitarian cyber carry pieces.',
          image: '/assets/collection/bags/bags_01.webp',
          category: 'Bags'
        },
        {
          id: 'col_belts',
          title: 'Hardware Belts & Waist Harnesses',
          slug: 'belts',
          description: 'Industrial buckle corsetry and distressed waist hardware relics.',
          image: '/assets/collection/belts/belts_01.webp',
          category: 'Belts'
        },
        {
          id: 'col_body_chainmail',
          title: 'Body Chainmail & Metal Cuirass',
          slug: 'body-chainmail',
          description: 'Hand-woven stainless steel and upcycled ringmail draped armor pieces.',
          image: '/assets/collection/body_chainmail/body_chainmail_01.webp',
          category: 'Body chainmail'
        },
        {
          id: 'col_bralettes',
          title: 'Spike Bralettes & Metal Bodices',
          slug: 'bralettes',
          description: 'Cold-forged spike brassieres, beaded hardware, and mechanical armor cups.',
          image: '/assets/collection/bralettes/bralettes_01.webp',
          category: 'Bralettes'
        },
        {
          id: 'col_co_ords',
          title: 'Two-Piece Co-ord Sets',
          slug: 'co-ords',
          description: 'High-impact runway matching statement sets sculpted for editorial distinction.',
          image: '/assets/collection/co_ords/co_ords_01.webp',
          category: 'Co-ord sets'
        },
        {
          id: 'col_corsets',
          title: 'Sculptural Corsetry & Stays',
          slug: 'corsets',
          description: 'Archival boned corsets, upcycled shoe bodices, and steel-riveted armor stays.',
          image: '/assets/collection/corsets/corsets_01.webp',
          category: 'Corsets'
        },
        {
          id: 'col_headgears',
          title: 'Cyber Headgears & Balaclavas',
          slug: 'headgears',
          description: 'Hand-knit spiked crowns, upcycled denim headwear, and ceremonial halos.',
          image: '/assets/collection/headgears/headgears_01.webp',
          category: 'Headgear'
        },
        {
          id: 'col_jackets',
          title: 'Deconstructed Jackets & Outerwear',
          slug: 'jackets',
          description: 'Heavy reworked denim armor jackets with jhumka accents and metal rivets.',
          image: '/assets/collection/jackets/jackets_01.webp',
          category: 'Jackets'
        },
        {
          id: 'col_skirts',
          title: 'Hardware Cargo Skirts',
          slug: 'skirts',
          description: 'Acid-wash distressed utilitarian cargo mini and midi skirts.',
          image: '/assets/collection/skirts/skirts_01.webp',
          category: 'Skirts'
        },
        {
          id: 'col_tops',
          title: 'Avant-Garde Architectural Tops',
          slug: 'tops',
          description: 'Deconstructed blouses, cross tape silhouettes, crochet drapery, and tube tops.',
          image: '/assets/collection/tops/tops_01.webp',
          category: 'Tops'
        }
      ];

      for (let i = 0; i < seedCollections.length; i++) {
        const col = seedCollections[i];
        await db.execute({
          sql: `INSERT OR REPLACE INTO collections (id, title, slug, description, image, product_ids, status, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            col.id,
            col.title,
            col.slug,
            col.description,
            col.image,
            JSON.stringify([]),
            'published',
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

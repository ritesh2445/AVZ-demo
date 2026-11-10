import { NextResponse } from 'next/server';
import { getAdminSession, logAdminActivity } from '@/src/lib/auth';
import { getDb, initializeDatabase } from '@/src/lib/db';
import { PRODUCTS as fallbackProducts } from '@/src/data/brandData';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
    const category = searchParams.get('category') || '';
    const status = searchParams.get('status') || '';

    // Auto-seed initial catalog only if database is completely empty
    try {
      const countCheck = await db.execute("SELECT COUNT(*) as count FROM products");
      const currentCount = Number(countCheck.rows[0]?.count || 0);

      if (currentCount === 0) {
        const statements: any[] = [];
        for (const p of fallbackProducts) {
          const sku = p.sku || `AVZ-${p.id}`;
          const imagesJson = JSON.stringify(p.images && p.images.length > 0 ? p.images : [p.image]);
          const materialsJson = JSON.stringify(p.materials || ['Upcycled Hardware', 'Reclaimed Metals']);
          const sizes = Array.isArray(p.sizes) && p.sizes.length > 0 ? p.sizes : ['One Size (Adjustable)'];
          const variantsJson = JSON.stringify(
            sizes.map((s: string) => ({
              size: s,
              stock: p.stock > 1 ? Math.ceil(p.stock / sizes.length) : (p.stock ?? 1),
              sku: `${sku}-${s.replace(/[^a-zA-Z0-9]/g, '')}`
            }))
          );

          statements.push({
            sql: `INSERT OR REPLACE INTO products (
              id, slug, title, description, price, compare_at_price, sku,
              inventory_quantity, category, materials, images, variants,
              status, is_featured, custom_made, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
              p.id,
              (p.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
              p.name,
              p.description || 'Handcrafted 1-of-1 wearable art by Dhrisni in our Studio.',
              p.price || 2500,
              p.compare_at_price || null,
              sku,
              p.stock ?? 1,
              p.category || 'Wearable Art',
              materialsJson,
              imagesJson,
              variantsJson,
              'published',
              p.featured ? 1 : 0,
              p.customMade ? 1 : 0,
              Date.now(),
              Date.now()
            ]
          });
        }

        for (let i = 0; i < statements.length; i += 50) {
          const chunk = statements.slice(i, i + 50);
          if (typeof (db as any).batch === 'function') {
            await (db as any).batch(chunk, 'write');
          } else {
            for (const stmt of chunk) {
              await db.execute(stmt);
            }
          }
        }
      }
    } catch (syncErr) {
      console.warn('Admin products sync note:', syncErr);
    }

    let sql = 'SELECT * FROM products WHERE 1=1';
    const args: any[] = [];

    if (search) {
      sql += ' AND (title LIKE ? OR sku LIKE ? OR description LIKE ?)';
      const term = `%${search}%`;
      args.push(term, term, term);
    }

    if (category && category !== 'All') {
      sql += ' AND category = ?';
      args.push(category);
    }

    if (status) {
      sql += ' AND status = ?';
      args.push(status);
    }

    sql += ' ORDER BY created_at DESC';

    const res = await db.execute({ sql, args });

    const products = res.rows.map(row => ({
      ...row,
      price: Number(row.price),
      compare_at_price: row.compare_at_price ? Number(row.compare_at_price) : null,
      inventory_quantity: Number(row.inventory_quantity),
      is_featured: Boolean(row.is_featured),
      custom_made: Boolean(row.custom_made),
      materials: (() => {
        try { return JSON.parse(String(row.materials)); } catch { return []; }
      })(),
      images: (() => {
        try { return JSON.parse(String(row.images)); } catch { return []; }
      })(),
      variants: (() => {
        try { return JSON.parse(String(row.variants)); } catch { return []; }
      })(),
      sizes: (() => {
        try {
          const v = JSON.parse(String(row.variants));
          if (Array.isArray(v)) return v.map((item: any) => typeof item === 'object' ? (item.size || item.name) : item).filter(Boolean);
          return [];
        } catch { return []; }
      })()
    }));

    return NextResponse.json({ success: true, products });
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
    const {
      title,
      description,
      price,
      compare_at_price,
      sku,
      inventory_quantity = 1,
      category = 'Wearable Art',
      materials = [],
      images = [],
      variants = [],
      sizes = [],
      status = 'published',
      is_featured = false,
      custom_made = false
    } = body;

    const variantsToSave = Array.isArray(sizes) && sizes.length > 0
      ? sizes.map((s: string) => ({ size: s, stock: 1, sku: `${sku}-${s.replace(/[^a-zA-Z0-9]/g, '')}` }))
      : (Array.isArray(variants) ? variants : []);

    if (!title || price === undefined || !sku) {
      return NextResponse.json({ error: 'Title, price, and SKU are required' }, { status: 400 });
    }

    await initializeDatabase();
    const db = getDb();

    // Check SKU collision
    const existingSku = await db.execute({
      sql: 'SELECT id FROM products WHERE sku = ?',
      args: [sku.trim()]
    });
    if (existingSku.rows.length > 0) {
      return NextResponse.json({ error: `SKU '${sku}' already exists.` }, { status: 409 });
    }

    const id = `prod_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + `-${Date.now().toString().slice(-4)}`;

    await db.execute({
      sql: `INSERT INTO products (
        id, slug, title, description, price, compare_at_price, sku,
        inventory_quantity, category, materials, images, variants,
        status, is_featured, custom_made, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        slug,
        title.trim(),
        description || '',
        Number(price),
        compare_at_price ? Number(compare_at_price) : null,
        sku.trim().toUpperCase(),
        Number(inventory_quantity),
        category,
        JSON.stringify(materials),
        JSON.stringify(images),
        JSON.stringify(variantsToSave),
        status,
        is_featured ? 1 : 0,
        custom_made ? 1 : 0,
        Date.now(),
        Date.now()
      ]
    });

    // Record initial inventory log
    await db.execute({
      sql: `INSERT INTO inventory_logs (id, product_id, sku, adjustment, previous_quantity, new_quantity, reason, user_email, created_at)
            VALUES (?, ?, ?, ?, 0, ?, 'Initial Product Creation', ?, ?)`,
      args: [
        `inv_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
        id,
        sku.trim().toUpperCase(),
        Number(inventory_quantity),
        Number(inventory_quantity),
        session.email,
        Date.now()
      ]
    });

    await logAdminActivity(session.email, 'CREATE_PRODUCT', 'products', id, { title, sku, price });

    return NextResponse.json({ success: true, id, message: 'Product created successfully' });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

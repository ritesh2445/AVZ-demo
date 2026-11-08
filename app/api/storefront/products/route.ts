import { NextResponse } from 'next/server';
import { getDb, initializeDatabase } from '@/src/lib/db';
import { PRODUCTS as fallbackProducts } from '@/src/data/brandData';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    await initializeDatabase();
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const forceSync = searchParams.get('sync') === 'true';

    // Auto-sync consolidated CSV products into database
    try {
      const validSkus = new Set(fallbackProducts.map((p: any) => p.sku));
      const countCheck = await db.execute("SELECT COUNT(*) as count FROM products");
      const currentCount = Number(countCheck.rows[0]?.count || 0);

      // Trigger sync if count doesn't match the 26 consolidated products, or if forced
      if (currentCount !== fallbackProducts.length || forceSync) {
        // Delete any legacy/redundant products not in the authentic CSV inventory
        const skuPlaceholders = fallbackProducts.map(() => '?').join(',');
        await db.execute({
          sql: `DELETE FROM products WHERE sku NOT IN (${skuPlaceholders})`,
          args: fallbackProducts.map((p: any) => p.sku)
        });

        const statements: any[] = [];

        for (const p of fallbackProducts) {
          const sku = p.sku || `AVZ-${p.id}`;
          const imagesJson = JSON.stringify(p.images && p.images.length > 0 ? p.images : [p.image]);
          const materialsJson = JSON.stringify(p.materials || ['Upcycled Hardware', 'Reclaimed Metals']);
          const sizes = Array.isArray(p.sizes) && p.sizes.length > 0 ? p.sizes : ['One Size (Adjustable)'];
          const variantsJson = JSON.stringify(
            sizes.map(s => ({
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
              p.description || 'Handcrafted 1-of-1 wearable art by Dhrisni in Guwahati.',
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

        // Execute in chunks of 50 to respect LibSQL batch limits
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
      console.warn('Collection sync to database note:', syncErr);
    }

    let sql = "SELECT * FROM products WHERE status = 'published'";
    const args: any[] = [];

    if (category && category !== 'All') {
      sql += ' AND category = ?';
      args.push(category);
    }

    if (featured === 'true' || featured === '1') {
      sql += ' AND is_featured = 1';
    }

    sql += ' ORDER BY is_featured DESC, created_at DESC';

    const res = await db.execute({ sql, args });

    if (res.rows.length === 0 && (!category || category === 'All')) {
      // Return fallback products if database was freshly initialized
      return NextResponse.json({
        success: true,
        products: fallbackProducts,
        source: 'static_fallback'
      }, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
        }
      });
    }

    const products = res.rows.map((row: any) => {
      const parsedImages = (() => {
        try {
          const imgs = JSON.parse(String(row.images));
          return Array.isArray(imgs) && imgs.length > 0 ? imgs : ['/assets/editorial_hero_portrait.jpg'];
        } catch {
          return ['/assets/editorial_hero_portrait.jpg'];
        }
      })();

      const parsedMaterials = (() => {
        try {
          const mats = JSON.parse(String(row.materials));
          return Array.isArray(mats) ? mats : [];
        } catch {
          return [];
        }
      })();

      const parsedVariants = (() => {
        try {
          const vars = JSON.parse(String(row.variants));
          return Array.isArray(vars) ? vars : [];
        } catch {
          return [];
        }
      })();

      const parsedSizes = (() => {
        if (Array.isArray(parsedVariants) && parsedVariants.length > 0) {
          return parsedVariants.map((v: any) => typeof v === 'object' ? (v.size || v.name) : v).filter(Boolean);
        }
        return ['One Size (Adjustable)'];
      })();

      const stockNum = Number(row.inventory_quantity);

      return {
        id: String(row.id),
        name: String(row.title),
        title: String(row.title),
        slug: String(row.slug),
        price: Number(row.price),
        originalPrice: row.compare_at_price ? Number(row.compare_at_price) : null,
        compare_at_price: row.compare_at_price ? Number(row.compare_at_price) : null,
        sku: String(row.sku),
        stock: stockNum,
        inventory_quantity: stockNum,
        inStock: stockNum > 0,
        tag: stockNum === 0 ? 'SOLD OUT' : stockNum === 1 ? '1 OF 1' : stockNum <= 3 ? 'FEW REMAINING' : 'AVAILABLE',
        category: String(row.category),
        image: parsedImages[0] || '/assets/editorial_hero_portrait.jpg',
        images: parsedImages,
        materials: parsedMaterials,
        variants: parsedVariants,
        sizes: parsedSizes,
        description: String(row.description),
        featured: Boolean(row.is_featured),
        is_featured: Boolean(row.is_featured),
        customMade: Boolean(row.custom_made),
        custom_made: Boolean(row.custom_made),
        status: String(row.status)
      };
    });

    return NextResponse.json({
      success: true,
      products,
      count: products.length,
      source: 'database'
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
      }
    });
  } catch (e: any) {
    console.error('Error fetching storefront products:', e);
    return NextResponse.json({
      success: true,
      products: fallbackProducts,
      source: 'error_fallback',
      error: e.message
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
      }
    });
  }
}

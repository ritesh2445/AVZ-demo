import { NextResponse } from 'next/server';
import { getDb, initializeDatabase } from '@/src/lib/db';
import { PRODUCTS as fallbackProducts } from '@/src/data/brandData';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    await initializeDatabase();
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');

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

      return {
        id: String(row.id),
        name: String(row.title),
        title: String(row.title),
        slug: String(row.slug),
        price: Number(row.price),
        originalPrice: row.compare_at_price ? Number(row.compare_at_price) : null,
        compare_at_price: row.compare_at_price ? Number(row.compare_at_price) : null,
        sku: String(row.sku),
        stock: Number(row.inventory_quantity),
        inventory_quantity: Number(row.inventory_quantity),
        inStock: Number(row.inventory_quantity) > 0,
        category: String(row.category),
        image: parsedImages[0] || '/assets/editorial_hero_portrait.jpg',
        images: parsedImages,
        materials: parsedMaterials,
        variants: parsedVariants,
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
    });
  } catch (e: any) {
    console.error('Error fetching storefront products:', e);
    return NextResponse.json({
      success: true,
      products: fallbackProducts,
      source: 'error_fallback',
      error: e.message
    });
  }
}

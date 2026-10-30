import { NextResponse } from 'next/server';
import { getAdminSession, logAdminActivity } from '@/src/lib/auth';
import { getDb, initializeDatabase } from '@/src/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    await initializeDatabase();
    const db = getDb();

    const res = await db.execute({
      sql: 'SELECT * FROM products WHERE id = ? OR slug = ?',
      args: [id, id]
    });

    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const row = res.rows[0];
    const product = {
      ...row,
      price: Number(row.price),
      compare_at_price: row.compare_at_price ? Number(row.compare_at_price) : null,
      inventory_quantity: Number(row.inventory_quantity),
      is_featured: Boolean(row.is_featured),
      custom_made: Boolean(row.custom_made),
      materials: (() => { try { return JSON.parse(String(row.materials)); } catch { return []; } })(),
      images: (() => { try { return JSON.parse(String(row.images)); } catch { return []; } })(),
      variants: (() => { try { return JSON.parse(String(row.variants)); } catch { return []; } })()
    };

    return NextResponse.json({ success: true, product });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    await initializeDatabase();
    const db = getDb();

    // Check existing
    const existing = await db.execute({
      sql: 'SELECT * FROM products WHERE id = ?',
      args: [id]
    });

    if (existing.rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const current = existing.rows[0];

    const title = body.title ?? current.title;
    const description = body.description ?? current.description;
    const price = body.price !== undefined ? Number(body.price) : Number(current.price);
    const compare_at_price = body.compare_at_price !== undefined ? (body.compare_at_price ? Number(body.compare_at_price) : null) : current.compare_at_price;
    const sku = (body.sku ?? current.sku).trim().toUpperCase();
    const inventory_quantity = body.inventory_quantity !== undefined ? Number(body.inventory_quantity) : Number(current.inventory_quantity);
    const category = body.category ?? current.category;
    const materials = body.materials ? JSON.stringify(body.materials) : current.materials;
    const images = body.images ? JSON.stringify(body.images) : current.images;
    const variants = body.variants ? JSON.stringify(body.variants) : current.variants;
    const status = body.status ?? current.status;
    const is_featured = body.is_featured !== undefined ? (body.is_featured ? 1 : 0) : current.is_featured;
    const custom_made = body.custom_made !== undefined ? (body.custom_made ? 1 : 0) : current.custom_made;

    // Track inventory adjustment if quantity changed
    if (inventory_quantity !== Number(current.inventory_quantity)) {
      const adjustment = inventory_quantity - Number(current.inventory_quantity);
      await db.execute({
        sql: `INSERT INTO inventory_logs (id, product_id, sku, adjustment, previous_quantity, new_quantity, reason, user_email, created_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          `inv_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          id,
          sku,
          adjustment,
          Number(current.inventory_quantity),
          inventory_quantity,
          body.adjustment_reason || 'Product Details Update',
          session.email,
          Date.now()
        ]
      });
    }

    await db.execute({
      sql: `UPDATE products SET
        title = ?, description = ?, price = ?, compare_at_price = ?, sku = ?,
        inventory_quantity = ?, category = ?, materials = ?, images = ?, variants = ?,
        status = ?, is_featured = ?, custom_made = ?, updated_at = ?
        WHERE id = ?`,
      args: [
        title, description, price, compare_at_price, sku,
        inventory_quantity, category, materials, images, variants,
        status, is_featured, custom_made, Date.now(), id
      ]
    });

    await logAdminActivity(session.email, 'UPDATE_PRODUCT', 'products', id, { title, sku, price, status });

    return NextResponse.json({ success: true, message: 'Product updated successfully' });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    await initializeDatabase();
    const db = getDb();

    // Check if product is in any orders
    const ordersWithProduct = await db.execute({
      sql: "SELECT id FROM orders WHERE items LIKE ?",
      args: [`%${id}%`]
    });

    if (ordersWithProduct.rows.length > 0) {
      // Safe archival to preserve historical orders
      await db.execute({
        sql: "UPDATE products SET status = 'archived', updated_at = ? WHERE id = ?",
        args: [Date.now(), id]
      });
      await logAdminActivity(session.email, 'ARCHIVE_PRODUCT', 'products', id, { reason: 'Preserving order history' });
      return NextResponse.json({ success: true, message: 'Product has order history. Safely archived instead of deleted.' });
    }

    await db.execute({
      sql: 'DELETE FROM products WHERE id = ?',
      args: [id]
    });

    await logAdminActivity(session.email, 'DELETE_PRODUCT', 'products', id);

    return NextResponse.json({ success: true, message: 'Product deleted permanently' });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

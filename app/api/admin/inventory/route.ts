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

    // Fetch products with stock
    const productsRes = await db.execute(`
      SELECT id, title, sku, inventory_quantity, price, status, images, category
      FROM products
      WHERE status != 'archived'
      ORDER BY inventory_quantity ASC
    `);

    const products = productsRes.rows.map(row => ({
      id: row.id,
      title: row.title,
      sku: row.sku,
      inventory_quantity: Number(row.inventory_quantity),
      price: Number(row.price),
      status: row.status,
      category: row.category,
      isLowStock: Number(row.inventory_quantity) <= 1,
      image: (() => {
        try {
          const imgs = JSON.parse(String(row.images));
          return Array.isArray(imgs) && imgs[0] ? imgs[0] : '/assets/editorial_hero_portrait.jpg';
        } catch {
          return '/assets/editorial_hero_portrait.jpg';
        }
      })()
    }));

    // Fetch recent inventory audit logs
    const logsRes = await db.execute(`
      SELECT il.*, p.title as product_title
      FROM inventory_logs il
      LEFT JOIN products p ON il.product_id = p.id
      ORDER BY il.created_at DESC
      LIMIT 50
    `);

    return NextResponse.json({
      success: true,
      products,
      logs: logsRes.rows
    });
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
    const { product_id, adjustment, reason } = body;

    if (!product_id || adjustment === undefined || !reason) {
      return NextResponse.json({ error: 'Product ID, adjustment amount, and reason are required' }, { status: 400 });
    }

    await initializeDatabase();
    const db = getDb();

    // Get current product
    const prodRes = await db.execute({
      sql: 'SELECT id, sku, inventory_quantity FROM products WHERE id = ?',
      args: [product_id]
    });

    if (prodRes.rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const currentQty = Number(prodRes.rows[0].inventory_quantity);
    const adjNum = Number(adjustment);
    const newQty = Math.max(0, currentQty + adjNum);

    // Atomic update
    await db.execute({
      sql: 'UPDATE products SET inventory_quantity = ?, updated_at = ? WHERE id = ?',
      args: [newQty, Date.now(), product_id]
    });

    // Write movement log
    const logId = `inv_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;
    await db.execute({
      sql: `INSERT INTO inventory_logs (id, product_id, sku, adjustment, previous_quantity, new_quantity, reason, user_email, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        logId,
        product_id,
        String(prodRes.rows[0].sku),
        adjNum,
        currentQty,
        newQty,
        reason.trim(),
        session.email,
        Date.now()
      ]
    });

    await logAdminActivity(session.email, 'ADJUST_INVENTORY', 'products', product_id, {
      previous: currentQty,
      adjustment: adjNum,
      new_quantity: newQty,
      reason
    });

    return NextResponse.json({
      success: true,
      new_quantity: newQty,
      message: `Inventory updated from ${currentQty} to ${newQty}`
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

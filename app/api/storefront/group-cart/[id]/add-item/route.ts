import { NextResponse } from 'next/server';
import { getDb, initializeDatabase, ensureGroupCartsTable } from '@/src/lib/db';
import { PRODUCTS } from '@/src/data/brandData';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { userId, userName, userEmail, item } = body;

    // User must be signed in to contribute to group cart
    if (!userId || !userName || !userEmail) {
      return NextResponse.json({
        error: 'Please sign in or create an account to contribute your piece to this group order'
      }, { status: 401 });
    }

    if (!item || !item.id) {
      return NextResponse.json({ error: 'Valid product item is required' }, { status: 400 });
    }

    await initializeDatabase();
    const db = getDb();
    await ensureGroupCartsTable(db);

    const res = await db.execute({
      sql: 'SELECT * FROM group_carts WHERE id = ? OR share_code = ?',
      args: [id, id.toUpperCase()]
    });

    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'Group order not found or expired' }, { status: 404 });
    }

    const row: any = res.rows[0];
    if (row.status !== 'open') {
      return NextResponse.json({ error: 'This group order has already been completed' }, { status: 400 });
    }

    // Authoritative Item Price & Details Verification (prevents client price spoofing)
    const prodRes = await db.execute({
      sql: 'SELECT id, title, price, sku, images FROM products WHERE id = ? OR title = ?',
      args: [item.id || '', item.name || item.title || '']
    });

    let verifiedPrice = 0;
    let verifiedTitle = item.name || item.title || 'Studio Piece';
    let verifiedSku = item.sku || `AVZ-${item.id}`;

    if (prodRes.rows.length > 0) {
      const prod = prodRes.rows[0];
      verifiedPrice = Number(prod.price);
      verifiedTitle = String(prod.title);
      verifiedSku = String(prod.sku);
    } else {
      const brandMatch = PRODUCTS.find(
        (p) => String(p.id) === String(item.id) || p.title?.toLowerCase() === (item.name || item.title || '').toLowerCase()
      );
      if (brandMatch) {
        verifiedPrice = Number(brandMatch.price);
        verifiedTitle = brandMatch.title;
        verifiedSku = brandMatch.sku || `AVZ-${brandMatch.id}`;
      } else {
        verifiedPrice = Math.max(1000, Number(item.price) || 1000);
      }
    }

    const sanitizedItem = {
      id: String(item.id),
      title: verifiedTitle,
      name: verifiedTitle,
      price: verifiedPrice,
      sku: verifiedSku,
      quantity: Math.max(1, Math.min(10, Number(item.quantity || 1))),
      selectedSize: String(item.selectedSize || 'Standard').slice(0, 30),
      image: item.image || item.images?.[0] || '/assets/editorial_hero_portrait.jpg'
    };

    let membersData: any[] = JSON.parse(row.members_data || '[]');

    // Find if member already exists (by userId or userEmail)
    let memberIndex = membersData.findIndex(
      (m: any) => m.userId === userId || m.userEmail?.toLowerCase() === userEmail.toLowerCase()
    );

    if (memberIndex === -1) {
      // Add new member
      membersData.push({
        userId,
        userName: userName.trim(),
        userEmail: userEmail.trim(),
        isCreator: false,
        items: [sanitizedItem]
      });
    } else {
      // Append item to existing member
      const existingItems = membersData[memberIndex].items || [];
      const itemKey = `${sanitizedItem.id}-${sanitizedItem.selectedSize || 'Standard'}`;
      const existingItemIndex = existingItems.findIndex(
        (i: any) => `${i.id}-${i.selectedSize || 'Standard'}` === itemKey
      );

      if (existingItemIndex > -1) {
        existingItems[existingItemIndex].quantity = (existingItems[existingItemIndex].quantity || 1) + (sanitizedItem.quantity || 1);
      } else {
        existingItems.push(sanitizedItem);
      }
      membersData[memberIndex].items = existingItems;
    }

    await db.execute({
      sql: 'UPDATE group_carts SET members_data = ?, updated_at = ? WHERE id = ?',
      args: [JSON.stringify(membersData), Date.now(), row.id]
    });

    return NextResponse.json({
      success: true,
      message: `Piece added under ${userName}'s collection!`,
      groupCart: {
        id: row.id,
        shareCode: row.share_code,
        creatorName: row.creator_name,
        membersData
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error updating group cart' }, { status: 500 });
  }
}


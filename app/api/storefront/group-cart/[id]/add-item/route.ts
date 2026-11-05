import { NextResponse } from 'next/server';
import { getDb, initializeDatabase, ensureGroupCartsTable } from '@/src/lib/db';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { userId, userName, userEmail, item } = body;

    // Point b requirement: User must be signed in to add items
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
        items: [item]
      });
    } else {
      // Append item to existing member
      const existingItems = membersData[memberIndex].items || [];
      const itemKey = `${item.id}-${item.selectedSize || 'Standard'}`;
      const existingItemIndex = existingItems.findIndex(
        (i: any) => `${i.id}-${i.selectedSize || 'Standard'}` === itemKey
      );

      if (existingItemIndex > -1) {
        existingItems[existingItemIndex].quantity = (existingItems[existingItemIndex].quantity || 1) + (item.quantity || 1);
      } else {
        existingItems.push(item);
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


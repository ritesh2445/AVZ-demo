import { NextResponse } from 'next/server';
import { getDb, initializeDatabase, ensureGroupCartsTable } from '@/src/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { creatorName, creatorEmail, creatorUserId, items = [] } = body;

    if (!creatorName || !creatorEmail) {
      return NextResponse.json({ error: 'Creator name and email are required' }, { status: 400 });
    }

    await initializeDatabase();
    const db = getDb();
    await ensureGroupCartsTable(db);

    // Generate unique short share code, e.g. grp-948a3c
    const id = `grp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const shareCode = `AVZ-GRP-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Structure members data: creator is member 0 with their items
    const membersData = [
      {
        userId: creatorUserId || `user_${Date.now()}`,
        userName: creatorName.trim(),
        userEmail: creatorEmail.trim(),
        isCreator: true,
        items: Array.isArray(items) ? items : []
      }
    ];

    await db.execute({
      sql: `INSERT INTO group_carts (id, share_code, creator_name, creator_email, creator_user_id, members_data, status, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, 'open', ?, ?)`,
      args: [
        id,
        shareCode,
        creatorName.trim(),
        creatorEmail.trim(),
        creatorUserId || null,
        JSON.stringify(membersData),
        Date.now(),
        Date.now()
      ]
    });

    return NextResponse.json({
      success: true,
      groupCartId: id,
      shareCode,
      message: 'Group order session created successfully'
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create group cart' }, { status: 500 });
  }
}


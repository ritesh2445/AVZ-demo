import { NextResponse } from 'next/server';
import { getDb, initializeDatabase } from '@/src/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Group Cart ID is required' }, { status: 400 });
    }

    await initializeDatabase();
    const db = getDb();

    const res = await db.execute({
      sql: 'SELECT * FROM group_carts WHERE id = ? OR share_code = ?',
      args: [id, id.toUpperCase()]
    });

    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'Group order not found or expired' }, { status: 404 });
    }

    const row: any = res.rows[0];
    const membersData = JSON.parse(row.members_data || '[]');

    return NextResponse.json({
      success: true,
      groupCart: {
        id: row.id,
        shareCode: row.share_code,
        creatorName: row.creator_name,
        creatorEmail: row.creator_email,
        membersData,
        orderId: row.order_id,
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error fetching group cart' }, { status: 500 });
  }
}

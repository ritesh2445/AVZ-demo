import { NextRequest, NextResponse } from 'next/server';
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
    const res = await db.execute('SELECT * FROM piece_requests ORDER BY created_at DESC LIMIT 200');
    return NextResponse.json({ success: true, requests: res.rows });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { id, status, notes } = body;
    if (!id) return NextResponse.json({ error: 'Request ID is required' }, { status: 400 });

    await initializeDatabase();
    const db = getDb();

    if (status !== undefined) {
      await db.execute({
        sql: 'UPDATE piece_requests SET status = ? WHERE id = ?',
        args: [status, id]
      });
    }

    if (notes !== undefined) {
      await db.execute({
        sql: 'UPDATE piece_requests SET notes = ? WHERE id = ?',
        args: [notes, id]
      });
    }

    await logAdminActivity(session.email, 'UPDATE_PIECE_REQUEST', 'piece_requests', id, { status, notes });

    return NextResponse.json({ success: true, message: 'Request status updated' });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Request ID is required' }, { status: 400 });

    await initializeDatabase();
    const db = getDb();
    await db.execute({
      sql: 'DELETE FROM piece_requests WHERE id = ?',
      args: [id]
    });

    await logAdminActivity(session.email, 'DELETE_PIECE_REQUEST', 'piece_requests', id);

    return NextResponse.json({ success: true, message: 'Piece request removed' });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}


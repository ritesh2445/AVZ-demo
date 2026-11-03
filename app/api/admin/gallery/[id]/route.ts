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
      sql: 'SELECT * FROM gallery_artworks WHERE id = ?',
      args: [id]
    });

    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'Artwork not found' }, { status: 404 });
    }

    const row: any = res.rows[0];
    let parsedMeta = {};
    try {
      parsedMeta = typeof row.metadata === 'string' ? JSON.parse(row.metadata) : (row.metadata || {});
    } catch (e) {
      parsedMeta = {};
    }

    return NextResponse.json({
      success: true,
      artwork: {
        ...row,
        metadata: parsedMeta
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
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

    const existing = await db.execute({
      sql: 'SELECT * FROM gallery_artworks WHERE id = ?',
      args: [id]
    });

    if (existing.rows.length === 0) {
      return NextResponse.json({ error: 'Artwork not found' }, { status: 404 });
    }

    const current: any = existing.rows[0];

    const title = body.title !== undefined ? String(body.title).trim() : current.title;
    const artist = body.artist !== undefined ? String(body.artist).trim() : current.artist;
    const image_url = body.image_url !== undefined ? String(body.image_url).trim() : current.image_url;
    const thumbnail_url = body.thumbnail_url !== undefined ? String(body.thumbnail_url).trim() : (image_url || current.thumbnail_url);
    const description = body.description !== undefined ? String(body.description).trim() : current.description;
    const year = body.year !== undefined ? String(body.year).trim() : current.year;
    const category = body.category !== undefined ? String(body.category).trim() : current.category;
    const frame_style = body.frame_style !== undefined ? String(body.frame_style) : current.frame_style;
    const aspect_ratio = body.aspect_ratio !== undefined ? String(body.aspect_ratio) : current.aspect_ratio;
    const width_px = body.width_px !== undefined ? Number(body.width_px) : current.width_px;
    const height_px = body.height_px !== undefined ? Number(body.height_px) : current.height_px;
    const display_order = body.display_order !== undefined ? Number(body.display_order) : current.display_order;
    const is_published = body.is_published !== undefined ? (body.is_published ? 1 : 0) : current.is_published;

    let metadataStr = current.metadata;
    if (body.metadata !== undefined) {
      metadataStr = typeof body.metadata === 'string' ? body.metadata : JSON.stringify(body.metadata);
    }

    const now = Date.now();

    await db.execute({
      sql: `UPDATE gallery_artworks SET
        title = ?,
        artist = ?,
        image_url = ?,
        thumbnail_url = ?,
        description = ?,
        year = ?,
        category = ?,
        frame_style = ?,
        aspect_ratio = ?,
        width_px = ?,
        height_px = ?,
        display_order = ?,
        is_published = ?,
        metadata = ?,
        updated_at = ?
      WHERE id = ?`,
      args: [
        title,
        artist,
        image_url,
        thumbnail_url,
        description,
        year,
        category,
        frame_style,
        aspect_ratio,
        width_px,
        height_px,
        display_order,
        is_published,
        metadataStr,
        now,
        id
      ]
    });

    await logAdminActivity(session.email, 'UPDATE_ARTWORK', 'gallery_artworks', id, {
      title,
      artist,
      frame_style,
      is_published
    });

    return NextResponse.json({
      success: true,
      message: 'Artwork and frame updated successfully'
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
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

    const existing = await db.execute({
      sql: 'SELECT title, artist FROM gallery_artworks WHERE id = ?',
      args: [id]
    });

    if (existing.rows.length === 0) {
      return NextResponse.json({ error: 'Artwork not found' }, { status: 404 });
    }

    const artwork: any = existing.rows[0];

    await db.execute({
      sql: 'DELETE FROM gallery_artworks WHERE id = ?',
      args: [id]
    });

    await logAdminActivity(session.email, 'DELETE_ARTWORK', 'gallery_artworks', id, {
      title: artwork.title,
      artist: artwork.artist
    });

    return NextResponse.json({
      success: true,
      message: 'Artwork dismounted and removed from gallery'
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


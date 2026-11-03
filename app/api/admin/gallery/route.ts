import { NextResponse } from 'next/server';
import { getAdminSession, logAdminActivity } from '@/src/lib/auth';
import { getDb, initializeDatabase, bootstrapDatabaseSchema } from '@/src/lib/db';
import { INITIAL_GALLERY_ARTWORKS } from '@/src/data/initialGalleryArtworks';

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initializeDatabase();
    const db = getDb();

    let res;
    try {
      res = await db.execute(`
        SELECT * FROM gallery_artworks 
        ORDER BY display_order ASC, created_at DESC
      `);
    } catch (dbErr: any) {
      if (String(dbErr).includes('no such table')) {
        await bootstrapDatabaseSchema();
        res = await db.execute(`
          SELECT * FROM gallery_artworks 
          ORDER BY display_order ASC, created_at DESC
        `);
      } else {
        throw dbErr;
      }
    }

    if (!res.rows || res.rows.length === 0) {
      const now = Date.now();
      for (const art of INITIAL_GALLERY_ARTWORKS) {
        try {
          await db.execute({
            sql: `INSERT OR IGNORE INTO gallery_artworks (
              id, title, artist, image_url, thumbnail_url, description, year, category,
              frame_style, aspect_ratio, width_px, height_px, display_order, is_published,
              metadata, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
              art.id,
              art.title,
              art.artist,
              art.image_url,
              art.thumbnail_url,
              art.description,
              art.year,
              art.category,
              art.frame_style,
              art.aspect_ratio,
              art.width_px,
              art.height_px,
              art.display_order,
              art.is_published,
              JSON.stringify(art.metadata),
              now,
              now
            ]
          });
        } catch (e) {}
      }

      res = await db.execute(`
        SELECT * FROM gallery_artworks 
        ORDER BY display_order ASC, created_at DESC
      `);
    }

    const artworks = (res.rows || []).map((row: any) => {
      let parsedMeta = {};
      try {
        parsedMeta = typeof row.metadata === 'string' ? JSON.parse(row.metadata) : (row.metadata || {});
      } catch (e) {
        parsedMeta = {};
      }
      return {
        ...row,
        metadata: parsedMeta
      };
    });

    return NextResponse.json({
      success: true,
      artworks: artworks.length > 0 ? artworks : INITIAL_GALLERY_ARTWORKS
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to fetch admin gallery' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      title,
      artist,
      image_url,
      thumbnail_url,
      description = '',
      year = new Date().getFullYear().toString(),
      category = 'Archival Haute Couture',
      frame_style = 'ornate_baroque',
      aspect_ratio = '3:4',
      width_px = 360,
      height_px = 480,
      display_order = 0,
      is_published = 1,
      metadata = {}
    } = body;

    if (!title?.trim() || !artist?.trim() || !image_url?.trim()) {
      return NextResponse.json(
        { error: 'Title, artist, and image URL are required' },
        { status: 400 }
      );
    }

    await initializeDatabase();
    const db = getDb();
    const id = `art_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = Date.now();

    const metaStr = typeof metadata === 'string' ? metadata : JSON.stringify(metadata);

    try {
      await db.execute({
        sql: `INSERT INTO gallery_artworks (
          id, title, artist, image_url, thumbnail_url, description, year, category,
          frame_style, aspect_ratio, width_px, height_px, display_order, is_published,
          metadata, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          id,
          title.trim(),
          artist.trim(),
          image_url.trim(),
          thumbnail_url?.trim() || image_url.trim(),
          description.trim(),
          year.trim(),
          category.trim(),
          frame_style,
          aspect_ratio,
          Number(width_px) || 360,
          Number(height_px) || 480,
          Number(display_order) || 0,
          is_published ? 1 : 0,
          metaStr,
          now,
          now
        ]
      });
    } catch (insertErr: any) {
      if (String(insertErr).includes('no such table')) {
        await bootstrapDatabaseSchema();
        await db.execute({
          sql: `INSERT INTO gallery_artworks (
            id, title, artist, image_url, thumbnail_url, description, year, category,
            frame_style, aspect_ratio, width_px, height_px, display_order, is_published,
            metadata, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            id,
            title.trim(),
            artist.trim(),
            image_url.trim(),
            thumbnail_url?.trim() || image_url.trim(),
            description.trim(),
            year.trim(),
            category.trim(),
            frame_style,
            aspect_ratio,
            Number(width_px) || 360,
            Number(height_px) || 480,
            Number(display_order) || 0,
            is_published ? 1 : 0,
            metaStr,
            now,
            now
          ]
        });
      } else {
        throw insertErr;
      }
    }

    await logAdminActivity(session.email, 'CREATE_ARTWORK', 'gallery_artworks', id, {
      title,
      artist,
      frame_style
    });

    return NextResponse.json({
      success: true,
      id,
      message: 'Painting mounted to gallery wall successfully'
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to create artwork' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { getDb, initializeDatabase, bootstrapDatabaseSchema } from '@/src/lib/db';
import { INITIAL_GALLERY_ARTWORKS } from '@/src/data/initialGalleryArtworks';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    await initializeDatabase();
    const db = getDb();

    let res;
    try {
      res = await db.execute(`
        SELECT * FROM gallery_artworks 
        WHERE is_published = 1
        ORDER BY display_order ASC, created_at DESC
      `);
    } catch (dbErr: any) {
      if (String(dbErr).includes('no such table')) {
        await bootstrapDatabaseSchema();
        res = await db.execute(`
          SELECT * FROM gallery_artworks 
          WHERE is_published = 1
          ORDER BY display_order ASC, created_at DESC
        `);
      } else {
        throw dbErr;
      }
    }

    // Auto-seed initial masterpieces only if database table is completely empty
    if (!res.rows || res.rows.length === 0) {
      const now = Date.now();
      for (const art of INITIAL_GALLERY_ARTWORKS) {
        try {
          await db.execute({
            sql: `INSERT INTO gallery_artworks (
              id, title, artist, image_url, thumbnail_url, description, year, category,
              frame_style, aspect_ratio, width_px, height_px, display_order, is_published,
              metadata, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
              title = excluded.title,
              artist = excluded.artist,
              image_url = excluded.image_url,
              thumbnail_url = excluded.thumbnail_url,
              description = excluded.description,
              year = excluded.year,
              category = excluded.category,
              frame_style = excluded.frame_style,
              aspect_ratio = excluded.aspect_ratio,
              width_px = excluded.width_px,
              height_px = excluded.height_px,
              display_order = excluded.display_order,
              is_published = excluded.is_published,
              metadata = excluded.metadata,
              updated_at = excluded.updated_at`,
            args: [
              art.id,
              art.title,
              art.artist,
              art.image_url,
              art.thumbnail_url || art.image_url,
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
        } catch (seedErr) {
          console.warn('[GALLERY SEED ERROR]:', seedErr);
        }
      }

      // Re-query complete artworks
      res = await db.execute(`
        SELECT * FROM gallery_artworks 
        WHERE is_published = 1 AND id NOT LIKE 'art-00%'
        ORDER BY display_order ASC, created_at ASC
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
      artworks: artworks.length > 0 ? artworks : INITIAL_GALLERY_ARTWORKS,
      wallConfig: {
        wallColor: '#4a0f18',
        title: 'THE VAULT ARCHIVE',
        subtitle: 'Handcrafted 1-of-1 Wearable Art • Studio',
        ambientSound: 'wooden_glide'
      }
    });
  } catch (err: any) {
    console.error('[STOREFRONT GALLERY API ERROR]:', err);
    return NextResponse.json({
      success: true,
      artworks: INITIAL_GALLERY_ARTWORKS,
      wallConfig: {
        wallColor: '#4a0f18',
        title: 'THE VAULT ARCHIVE',
        subtitle: 'Handcrafted 1-of-1 Wearable Art • Studio',
        ambientSound: 'wooden_glide'
      }
    });
  }
}

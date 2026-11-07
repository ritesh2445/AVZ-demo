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
        ORDER BY display_order ASC, created_at ASC
      `);
    } catch (dbErr: any) {
      if (String(dbErr).includes('no such table')) {
        await bootstrapDatabaseSchema();
        res = await db.execute(`
          SELECT * FROM gallery_artworks 
          WHERE is_published = 1 
          ORDER BY display_order ASC, created_at ASC
        `);
      } else {
        throw dbErr;
      }
    }

    // Auto-seed initial masterpieces if database table is empty
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
        } catch (seedErr) {
          console.warn('[GALLERY SEED ERROR]:', seedErr);
        }
      }

      // Re-query newly seeded artworks
      res = await db.execute(`
        SELECT * FROM gallery_artworks 
        WHERE is_published = 1 
        ORDER BY display_order ASC, created_at ASC
      `);
    } else {
      // If table already has rows with old AI titles, update them to authentic human studio copy
      const hasOldAiTitle = (res.rows || []).some((r: any) => 
        r.title?.includes('Cyber Empress') || 
        r.title?.includes('Allegory of') || 
        r.title?.includes('Study in Raw') ||
        r.title?.includes('Still Life with')
      );

      if (hasOldAiTitle) {
        const now = Date.now();
        for (const art of INITIAL_GALLERY_ARTWORKS) {
          try {
            await db.execute({
              sql: `UPDATE gallery_artworks 
                    SET title = ?, artist = ?, description = ?, category = ?, 
                        aspect_ratio = ?, width_px = ?, height_px = ?, display_order = ?,
                        metadata = ?, updated_at = ?
                    WHERE id = ?`,
              args: [
                art.title,
                art.artist,
                art.description,
                art.category,
                art.aspect_ratio,
                art.width_px,
                art.height_px,
                art.display_order,
                JSON.stringify(art.metadata),
                now,
                art.id
              ]
            });
          } catch (updateErr) {
            console.warn('[GALLERY COPY UPGRADE ERROR]:', updateErr);
          }
        }

        // Re-query with updated records
        res = await db.execute(`
          SELECT * FROM gallery_artworks 
          WHERE is_published = 1 
          ORDER BY display_order ASC, created_at ASC
        `);
      }
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
        subtitle: 'Handcrafted 1-of-1 Wearable Art • Guwahati Studio',
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
        subtitle: 'Handcrafted 1-of-1 Wearable Art • Guwahati Studio',
        ambientSound: 'wooden_glide'
      }
    });
  }
}

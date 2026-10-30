import { NextResponse } from 'next/server';
import { getAdminSession, logAdminActivity } from '@/src/lib/auth';
import { getDb, initializeDatabase } from '@/src/lib/db';

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await initializeDatabase();
    const db = getDb();
    const res = await db.execute('SELECT * FROM media_assets ORDER BY created_at DESC');

    const defaultAssets = [
      { id: 'm1', title: 'Editorial Hero Portrait', url: '/assets/editorial_hero_portrait.jpg', media_type: 'image', alt_text: 'Dhrisni high fashion portrait', tags: ['editorial', 'hero'] },
      { id: 'm2', title: 'Hero Video Reel (Desktop)', url: '/assets/hero_reel_desktop.mp4', media_type: 'video', alt_text: 'Kinetic runway fashion reel', tags: ['video', 'hero'] },
      { id: 'm3', title: 'Official AVZ Brand Emblem', url: '/assets/avz_logo_official.png', media_type: 'image', alt_text: 'AVZ Vaganza official logo', tags: ['branding', 'logo'] },
      { id: 'm4', title: 'Cyberpunk Spike Bodice', url: '/assets/product_spike_bra.jpg', media_type: 'image', alt_text: 'Handcrafted spike bodice', tags: ['product', 'top'] },
      { id: 'm5', title: 'Motherboard Tech Relic Cuff', url: '/assets/prod_motherboard_cuff.jpg', media_type: 'image', alt_text: 'Upcycled motherboard cuff', tags: ['hardware', 'accessory'] },
      { id: 'm6', title: 'Reworked Denim Armor Jacket', url: '/assets/product_reworked_jacket.jpg', media_type: 'image', alt_text: 'Heavy art archival jacket', tags: ['jacket', 'outerwear'] },
      { id: 'm7', title: 'Cyber Cat Mascot Companion', url: '/assets/cat_companion.png', media_type: 'image', alt_text: 'Interactive anime cat mascot', tags: ['mascot', 'ui'] }
    ];

    const dbAssets = res.rows.map(r => ({
      ...r,
      tags: (() => { try { return JSON.parse(String(r.tags)); } catch { return []; } })()
    }));

    return NextResponse.json({
      success: true,
      assets: [...dbAssets, ...defaultAssets],
      cloudinaryStatus: {
        configured: Boolean(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY),
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'Not Configured (Using Local & High-Res CDN)'
      }
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { title, url, media_type = 'image', alt_text, tags = [] } = body;

    if (!title || !url) {
      return NextResponse.json({ error: 'Title and URL are required' }, { status: 400 });
    }

    await initializeDatabase();
    const db = getDb();
    const id = `med_${Date.now()}`;

    await db.execute({
      sql: `INSERT INTO media_assets (id, title, url, media_type, alt_text, tags, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [id, title.trim(), url.trim(), media_type, alt_text || '', JSON.stringify(tags), Date.now()]
    });

    await logAdminActivity(session.email, 'ADD_MEDIA', 'media_assets', id, { title, url, media_type });

    return NextResponse.json({ success: true, id, message: 'Media asset added to library successfully' });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

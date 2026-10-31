import { NextResponse } from 'next/server';
import { getAdminSession, logAdminActivity } from '@/src/lib/auth';
import { getDb, initializeDatabase } from '@/src/lib/db';

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initializeDatabase();
    const db = getDb();
    let res = await db.execute('SELECT section_key, title, data, status, version, updated_at FROM website_content ORDER BY title ASC');

    if (res.rows.length === 0) {
      const defaultSections = [
        {
          section_key: 'hero',
          title: 'Hero Spatial Spotlight Section',
          data: JSON.stringify({
            headline_line1: 'WEARABLE ART.',
            headline_line2: 'NOT MADE TO REPEAT.',
            subheadline: 'Handcrafted high-fashion cyber couture, upcycled computer hardware, and archival 1-of-1 relics from Guwahati, Assam.',
            video_desktop: '/assets/hero_reel_desktop.mp4',
            video_mobile: '/assets/hero_reel_mobile.mp4',
            primary_cta_text: 'EXPLORE VAULT',
            primary_cta_link: '#shop',
            secondary_cta_text: 'CUSTOM ORDERS',
            secondary_cta_link: '#custom',
            badge_text: ''
          })
        },
        {
          section_key: 'founders',
          title: 'Founder & Artisan Manifesto',
          data: JSON.stringify({
            founder_name: 'Dhrisni (Dhristroyer)',
            alias: 'Dhristroyer',
            role: 'Creative Director & Founder',
            bio: 'Independent fashion designer, sculptor, and sustainable cyber-punk artisan.',
            quote: 'Building wearable art with my own two hands is the ultimate rebellion.',
            portrait_image: '/assets/editorial_hero_portrait.jpg'
          })
        },
        {
          section_key: 'museum',
          title: 'AVZ Museum Archive',
          data: JSON.stringify({
            headline: 'THE VAULT ARCHIVE',
            subheadline: 'A living museum of archived commissions and past milestone builds.',
            description: 'These sold-out pieces can be custom-recreated for you. Because each piece is hand-sculpted with upcycled hardware, no piece is ever an exact replica.'
          })
        },
        {
          section_key: 'custom_orders',
          title: 'Bespoke Atelier Commission Studio',
          data: JSON.stringify({
            headline: 'BESPOKE COMMISSIONS',
            tagline: 'Direct Dispatch to Master Artisan Dhrisni',
            whatsapp: '917099307255'
          })
        },
        {
          section_key: 'footer',
          title: 'Global Footer & Policies',
          data: JSON.stringify({
            tagline: 'High fashion brand made by baddies for baddies.',
            copyright: '© 2026 AVZ VAGANZA. ALL RIGHTS RESERVED.',
            business_email: 'orders@avzvaganza.com',
            packaging_note: 'Biodegradable velvet-lined archival keepsake boxes.'
          })
        }
      ];

      for (const s of defaultSections) {
        await db.execute({
          sql: `INSERT INTO website_content (section_key, title, data, status, version, updated_at) VALUES (?, ?, ?, 'published', 1, ?)`,
          args: [s.section_key, s.title, s.data, Date.now()]
        });
      }

      res = await db.execute('SELECT section_key, title, data, status, version, updated_at FROM website_content ORDER BY title ASC');
    }

    const sections = res.rows.map(row => ({
      section_key: row.section_key,
      title: row.title,
      status: row.status,
      version: row.version,
      updated_at: row.updated_at,
      data: (() => {
        try {
          return JSON.parse(String(row.data));
        } catch {
          return row.data;
        }
      })()
    }));

    return NextResponse.json({ success: true, sections });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { section_key, title, data, status = 'published' } = body;

    if (!section_key || !data) {
      return NextResponse.json({ error: 'Section key and data are required' }, { status: 400 });
    }

    await initializeDatabase();
    const db = getDb();

    const stringifiedData = typeof data === 'string' ? data : JSON.stringify(data);

    // Get current version
    const curr = await db.execute({
      sql: 'SELECT version FROM website_content WHERE section_key = ?',
      args: [section_key]
    });

    const nextVersion = curr.rows.length > 0 ? Number(curr.rows[0].version || 1) + 1 : 1;

    await db.execute({
      sql: `INSERT INTO website_content (section_key, title, data, status, version, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)
            ON CONFLICT(section_key) DO UPDATE SET
              title = excluded.title,
              data = excluded.data,
              status = excluded.status,
              version = excluded.version,
              updated_at = excluded.updated_at`,
      args: [section_key, title || section_key, stringifiedData, status, nextVersion, Date.now()]
    });

    await logAdminActivity(session.email, status === 'published' ? 'PUBLISH_CONTENT' : 'SAVE_DRAFT', 'website_content', section_key, {
      section_key,
      version: nextVersion,
      status
    });

    return NextResponse.json({
      success: true,
      message: `Section '${section_key}' ${status === 'published' ? 'published' : 'saved as draft'} successfully`,
      version: nextVersion
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

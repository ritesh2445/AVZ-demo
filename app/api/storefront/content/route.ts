import { NextResponse } from 'next/server';
import { getDb, initializeDatabase } from '@/src/lib/db';

export async function GET() {
  try {
    await initializeDatabase();
    const db = getDb();

    // Only return published content to public storefront
    let res = await db.execute(`
      SELECT section_key, title, data, version, updated_at
      FROM website_content
      WHERE status = 'published'
    `);

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

      res = await db.execute(`
        SELECT section_key, title, data, version, updated_at
        FROM website_content
        WHERE status = 'published'
      `);
    }

    const sections: Record<string, any> = {};
    for (const row of res.rows) {
      try {
        sections[String(row.section_key)] = {
          title: row.title,
          version: row.version,
          updated_at: row.updated_at,
          ...JSON.parse(String(row.data))
        };
      } catch (e) {
        sections[String(row.section_key)] = row.data;
      }
    }

    return NextResponse.json({
      success: true,
      sections
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to fetch content' }, { status: 500 });
  }
}

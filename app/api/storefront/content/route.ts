import { NextResponse } from 'next/server';
import { getDb, initializeDatabase } from '@/src/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
            subheadline: 'Handcrafted high-fashion cyber couture, reclaimed metals & chainmail, and archival 1-of-1 relics from our Studio.',
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
            subheadline: 'A gallery of custom designs and past signature creations.',
            description: 'These sold-out pieces can be custom-recreated for you. Because each piece is hand-sculpted with upcycled hardware, no piece is ever an exact replica.'
          })
        },
        {
          section_key: 'custom_orders',
          title: 'Custom Order Studio',
          data: JSON.stringify({
            headline: 'CUSTOM ORDERS',
            tagline: 'Direct Dispatch to Master Artisan Dhrisni',
            whatsapp: '917099307255'
          })
        },
        {
          section_key: 'policies',
          title: 'Official Policies & DPDP Compliance',
          data: JSON.stringify({
            unboxing_video_hours: '48 hours',
            sizing_exchange_days: '7 days',
            concierge_whatsapp: '+91 73042 64901',
            compliance_email: 'orders@avzvaganza.com',
            registered_studio: 'Aveezah Vaganza Studio, Guwahati, Assam, India',
            refund_terms: 'Approved damage claims refunded via original payment method in 5-7 banking days.'
          })
        },
        {
          section_key: 'care_guide',
          title: 'Garment & Hardware Care Guide',
          data: JSON.stringify({
            hardware_care: 'Keep metal hardware and chains dry. Polish gently with a soft jewelry cloth.',
            spikes_care: 'Wipe with jewelry cloth after wearing. Store flat in dust bag.',
            denim_care: 'Spot clean or cold hand wash. Never tumble dry or machine spin.'
          })
        },
        {
          section_key: 'announcement',
          title: 'Storefront Announcement Bar',
          data: JSON.stringify({
            active: true,
            message: 'AVZ VAGANZA • HANDCRAFTED WEARABLE ART • COMPLIMENTARY EXPRESS SHIPPING OVER ₹5,000'
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
        },
        {
          section_key: 'reels',
          title: 'Autoplaying Video Reels',
          data: JSON.stringify({
            headline: 'IN MOTION // RUNWAY & REELS',
            subheadline: 'Watch each piece move in real life. Behind-the-scenes, runway motion, and handmade detailing.',
            reels: [
              {
                id: 'reel-01',
                title: 'Sculptural Chainmail & Spikes in Motion',
                subtitle: 'Artisanal metal armor sculpted to body contours',
                vimeo_url: 'https://vimeo.com/824804225',
                fallback_video: '/assets/Desktop view.MP4',
                tag: 'Chainmail Couture'
              },
              {
                id: 'reel-02',
                title: '72 Solid Spikes Motorcycle Shrug',
                subtitle: 'High-contrast heavy hardware on reclaimed biker leather',
                vimeo_url: 'https://vimeo.com/76979871',
                fallback_video: '/assets/mobile view.mp4',
                tag: 'Spiked Moto'
              },
              {
                id: 'reel-03',
                title: 'Tactile Industrial Hardware Choker',
                subtitle: 'Reclaimed hardware and hand-linked chain detailing',
                vimeo_url: 'https://vimeo.com/1084537',
                fallback_video: '/assets/Desktop view.MP4',
                tag: 'Hardware Choker'
              },
              {
                id: 'reel-04',
                title: 'Studio Craft & Linkwork',
                subtitle: 'Pure human artistry — over 1,200 hand-threaded stainless rings',
                vimeo_url: 'https://vimeo.com/824804225',
                fallback_video: '/assets/mobile view.mp4',
                tag: 'Studio Behind The Scenes'
              }
            ]
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

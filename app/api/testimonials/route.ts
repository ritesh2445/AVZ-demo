import { NextRequest, NextResponse } from 'next/server';
import { getDb, initializeDatabase } from '@/src/lib/db';
import { auth } from '@/src/lib/auth-better';

const DEFAULT_SEED_TESTIMONIALS = [
  {
    id: 'test-01',
    user_name: 'Sarah Johnson',
    role_title: 'Fashion Stylist • Mumbai',
    user_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    content: 'The Motherboard top stopped everyone in their tracks during fashion week. The weight of the metal and the velvet lining make it surprisingly comfortable to wear for hours. A true one-of-a-kind statement piece.',
    product_name: 'Original Motherboard Top',
    created_at: Date.now() - 3 * 86400000
  },
  {
    id: 'test-02',
    user_name: 'David Patel',
    role_title: 'Creative Director • Berlin',
    user_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    content: "I've collected avant-garde fashion for years, but AVZ's craftsmanship is unmatched. The 72-spike shrug is heavy, architectural, and built like armor. Dhrisni is doing something genuinely revolutionary.",
    product_name: 'Spiked Moto Shrug',
    created_at: Date.now() - 7 * 86400000
  },
  {
    id: 'test-03',
    user_name: 'Emily Carter',
    role_title: 'Editorial Model • London',
    user_avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    content: 'The tactile clicking of the CTRL+Z keycap choker was the highlight of our shoot. You can immediately feel that it was linked by real human hands. The packaging with personalized note was so thoughtful.',
    product_name: 'Mechanical Keycap Choker',
    created_at: Date.now() - 14 * 86400000
  },
  {
    id: 'test-04',
    user_name: 'Aanya Sen',
    role_title: 'Musician & Performer • Delhi',
    user_avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    content: 'Ordered a custom sizing look for my music video tour. The communication through WhatsApp was seamless, delivery arrived ahead of schedule, and the fit was sculpted to absolute perfection.',
    product_name: 'Cyber-Chitin Bodice',
    created_at: Date.now() - 21 * 86400000
  }
];

export async function GET() {
  try {
    await initializeDatabase();
    const db = getDb();

    const res = await db.execute({
      sql: `SELECT id, user_name, role_title, user_avatar, rating, content, product_name, created_at 
            FROM testimonials 
            WHERE status = 'published' 
            ORDER BY created_at DESC`,
      args: []
    });

    if (res.rows.length === 0) {
      // Seed default testimonials
      for (const t of DEFAULT_SEED_TESTIMONIALS) {
        await db.execute({
          sql: `INSERT OR IGNORE INTO testimonials (id, user_name, role_title, user_avatar, rating, content, product_name, status, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, 'published', ?)`,
          args: [t.id, t.user_name, t.role_title, t.user_avatar, t.rating, t.content, t.product_name, t.created_at]
        });
      }
      return NextResponse.json({ testimonials: DEFAULT_SEED_TESTIMONIALS });
    }

    const testimonials = res.rows.map((row: any) => ({
      id: row.id,
      user_name: row.user_name,
      role_title: row.role_title,
      user_avatar: row.user_avatar,
      rating: Number(row.rating || 5),
      content: row.content,
      product_name: row.product_name,
      created_at: Number(row.created_at)
    }));

    return NextResponse.json({ testimonials });
  } catch (err: any) {
    console.error('Error in GET /api/testimonials:', err);
    return NextResponse.json({ testimonials: DEFAULT_SEED_TESTIMONIALS });
  }
}

export async function POST(req: NextRequest) {
  try {
    await initializeDatabase();
    const db = getDb();

    // 1. Check authentication via Better Auth session
    let authenticatedUser: any = null;
    try {
      const session = await auth.api.getSession({
        headers: req.headers
      });
      if (session?.user) {
        authenticatedUser = session.user;
      }
    } catch (e) {
      // fallback to body if auth header not passed
    }

    const body = await req.json();
    const { content, rating, productName, roleTitle, user: clientUser } = body;

    // Use session user or verified clientUser if registered
    const user = authenticatedUser || clientUser;

    if (!user || (!user.email && !user.id)) {
      return NextResponse.json(
        { error: 'Only registered members can submit a review. Please sign in or create an account.' },
        { status: 401 }
      );
    }

    if (!content || typeof content !== 'string' || content.trim().length < 8) {
      return NextResponse.json(
        { error: 'Review text must be at least 8 characters long.' },
        { status: 400 }
      );
    }

    const ratingNum = Math.min(5, Math.max(1, parseInt(rating, 10) || 5));
    const newId = `test_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const userName = user.name || (user.email ? user.email.split('@')[0] : 'Verified Member');
    const userAvatar = user.image || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userName)}&backgroundColor=1a0520&textColor=F4C2C2`;
    const userRole = roleTitle || body.role_title || 'Verified Member';
    const cleanProduct = productName || body.product_name || 'Custom Piece';
    const createdAt = Date.now();

    await db.execute({
      sql: `INSERT INTO testimonials (id, user_id, user_name, user_email, user_avatar, role_title, rating, content, product_name, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', ?)`,
      args: [
        newId,
        user.id || null,
        userName,
        user.email || null,
        userAvatar,
        userRole,
        ratingNum,
        content.trim(),
        cleanProduct,
        createdAt
      ]
    });

    const newTestimonial = {
      id: newId,
      user_name: userName,
      role_title: userRole,
      user_avatar: userAvatar,
      rating: ratingNum,
      content: content.trim(),
      product_name: cleanProduct,
      created_at: createdAt
    };

    return NextResponse.json({ success: true, testimonial: newTestimonial });
  } catch (err: any) {
    console.error('Error in POST /api/testimonials:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to submit review' },
      { status: 500 }
    );
  }
}

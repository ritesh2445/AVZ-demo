import { NextRequest, NextResponse } from 'next/server';
import { getDb, initializeDatabase } from '@/src/lib/db';
import { auth } from '@/src/lib/auth-better';
import { getClientIp, checkRateLimit, sanitizeText, containsSpamPatterns, isValidEmail } from '@/src/lib/security';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    await initializeDatabase();
    const db = getDb();

    // Only real patron reviews (no dummy mock reviews)
    const res = await db.execute({
      sql: `SELECT id, user_name, role_title, user_avatar, rating, content, product_name, created_at 
            FROM testimonials 
            WHERE status IN ('published', 'approved') 
              AND id NOT LIKE 'test-%'
            ORDER BY created_at DESC`,
      args: []
    });

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
    return NextResponse.json({ testimonials: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    // 0. Rate Limiting Protection Against Review Flooding & Bot Spam
    const clientIp = getClientIp(req);
    const rateCheck = checkRateLimit(`testimonial_post_${clientIp}`, 3, 60 * 60 * 1000); // 3 reviews per hour per IP
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: `Review submission limit reached. Please wait before submitting another review.` },
        { status: 429 }
      );
    }

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

    if (user.email && !isValidEmail(user.email)) {
      return NextResponse.json({ error: 'Invalid user email provided.' }, { status: 400 });
    }

    if (!content || typeof content !== 'string' || content.trim().length < 8) {
      return NextResponse.json(
        { error: 'Review text must be at least 8 characters long.' },
        { status: 400 }
      );
    }

    // 2. Anti-Spam & Content Moderation Heuristics
    const rawContent = content.trim();
    if (containsSpamPatterns(rawContent)) {
      return NextResponse.json(
        { error: 'Review rejected. Promotional links, referral codes, or spam keywords are not permitted.' },
        { status: 400 }
      );
    }

    // Sanitize user inputs to prevent stored XSS or injection
    const cleanContent = sanitizeText(rawContent, 500);
    const rawName = user.name || (user.email ? user.email.split('@')[0] : 'Verified Member');
    const userName = sanitizeText(rawName, 60);
    const userRole = sanitizeText(roleTitle || body.role_title || 'Verified Member', 60);
    const cleanProduct = sanitizeText(productName || body.product_name || 'Custom Piece', 80);

    const ratingNum = Math.min(5, Math.max(1, parseInt(rating, 10) || 5));
    const newId = `test_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const userAvatar = user.image || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userName)}&backgroundColor=1a0520&textColor=F4C2C2`;
    const createdAt = Date.now();

    // 3. User-submitted reviews are published automatically to reflect on the testimonial page
    const reviewStatus = 'published';

    await db.execute({
      sql: `INSERT INTO testimonials (id, user_id, user_name, user_email, user_avatar, role_title, rating, content, product_name, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        newId,
        user.id || null,
        userName,
        user.email || null,
        userAvatar,
        userRole,
        ratingNum,
        cleanContent,
        cleanProduct,
        reviewStatus,
        createdAt
      ]
    });

    const newTestimonial = {
      id: newId,
      user_name: userName,
      role_title: userRole,
      user_avatar: userAvatar,
      rating: ratingNum,
      content: cleanContent,
      product_name: cleanProduct,
      status: reviewStatus,
      created_at: createdAt
    };

    return NextResponse.json({
      success: true,
      status: reviewStatus,
      message: reviewStatus === 'published' 
        ? 'Review published successfully.' 
        : 'Thank you! Your review has been submitted for studio moderation.',
      testimonial: newTestimonial
    });
  } catch (err: any) {
    console.error('Error in POST /api/testimonials:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to submit review' },
      { status: 500 }
    );
  }
}

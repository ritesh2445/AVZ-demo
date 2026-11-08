import { NextRequest, NextResponse } from 'next/server';
import { getDb, initializeDatabase } from '@/src/lib/db';
import { isValidEmail, sanitizeText, getClientIp, checkRateLimit } from '@/src/lib/security';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    const rateCheck = checkRateLimit(`piece_request_${clientIp}`, 10, 60 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait before submitting another piece inquiry.' },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const {
      pieceId,
      pieceTitle,
      pieceImage,
      piecePrice,
      customerName,
      customerPhone,
      customerEmail,
      notes
    } = body;

    if (!customerName || typeof customerName !== 'string' || !customerName.trim()) {
      return NextResponse.json({ error: 'Please provide your full name.' }, { status: 400 });
    }

    if (!customerEmail || !isValidEmail(customerEmail)) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
    }

    if (!customerPhone || typeof customerPhone !== 'string') {
      return NextResponse.json({ error: 'Please provide a valid 10-digit WhatsApp/phone number.' }, { status: 400 });
    }

    const digitsOnly = customerPhone.replace(/\D/g, '');
    const cleanDigits = digitsOnly.length === 12 && digitsOnly.startsWith('91') ? digitsOnly.slice(2) : digitsOnly;
    if (cleanDigits.length !== 10) {
      return NextResponse.json({ error: 'Phone number must be strictly 10 digits.' }, { status: 400 });
    }

    if (!pieceTitle) {
      return NextResponse.json({ error: 'Requested piece title is required.' }, { status: 400 });
    }

    await initializeDatabase();
    const db = getDb();

    const id = `req_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const formattedPhone = customerPhone.startsWith('+') ? customerPhone.trim() : `+91 ${cleanDigits}`;

    await db.execute({
      sql: `INSERT INTO piece_requests (
        id, piece_id, piece_title, piece_image, piece_price,
        customer_name, customer_phone, customer_email,
        status, notes, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)`,
      args: [
        id,
        pieceId ? String(pieceId) : null,
        sanitizeText(String(pieceTitle).trim(), 120),
        pieceImage ? String(pieceImage).trim() : null,
        piecePrice ? Number(piecePrice) : null,
        sanitizeText(customerName.trim(), 100),
        sanitizeText(formattedPhone, 30),
        sanitizeText(customerEmail.trim().toLowerCase(), 100),
        notes ? sanitizeText(String(notes).trim(), 500) : null,
        Date.now()
      ]
    });

    return NextResponse.json({
      success: true,
      message: 'Request received! Founder Dhrisni and our studio team will reach out via WhatsApp/email.'
    });
  } catch (err: any) {
    console.error('Error submitting piece request:', err);
    return NextResponse.json({ error: err.message || 'Failed to submit piece request' }, { status: 500 });
  }
}


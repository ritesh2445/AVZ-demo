import { NextRequest, NextResponse } from 'next/server';
import { getDb, initializeDatabase } from '@/src/lib/db';
import { isValidEmail, sanitizeText } from '@/src/lib/security';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email') || req.headers.get('x-user-email');

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    await initializeDatabase();
    const db = getDb();
    const res = await db.execute({
      sql: 'SELECT email, name, phone, address, city, state, pincode, updated_at FROM user_profiles WHERE email = ?',
      args: [email.trim().toLowerCase()]
    });

    if (res.rows.length === 0) {
      return NextResponse.json({ success: true, profile: null });
    }

    return NextResponse.json({ success: true, profile: res.rows[0] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, name, phone, address, city, state, pincode } = body;

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    await initializeDatabase();
    const db = getDb();
    const normalizedEmail = email.trim().toLowerCase();

    await db.execute({
      sql: `INSERT INTO user_profiles (email, name, phone, address, city, state, pincode, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(email) DO UPDATE SET
              name = excluded.name,
              phone = excluded.phone,
              address = excluded.address,
              city = excluded.city,
              state = excluded.state,
              pincode = excluded.pincode,
              updated_at = excluded.updated_at`,
      args: [
        normalizedEmail,
        name ? sanitizeText(String(name).trim(), 100) : null,
        phone ? sanitizeText(String(phone).trim(), 30) : null,
        address ? sanitizeText(String(address).trim(), 300) : null,
        city ? sanitizeText(String(city).trim(), 80) : null,
        state ? sanitizeText(String(state).trim(), 80) : null,
        pincode ? sanitizeText(String(pincode).trim(), 20) : null,
        Date.now()
      ]
    });

    return NextResponse.json({
      success: true,
      message: 'Profile details saved successfully',
      profile: {
        email: normalizedEmail,
        name,
        phone,
        address,
        city,
        state,
        pincode
      }
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to save profile' }, { status: 500 });
  }
}


import { NextResponse } from 'next/server';
import { getDb, initializeDatabase } from '@/src/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawCode = (body.code || '').trim().toUpperCase();
    const subtotal = Number(body.subtotal || 0);

    if (!rawCode) {
      return NextResponse.json({ valid: false, error: 'Please enter a promotion code.' }, { status: 400 });
    }

    // 1. Check database promotions first
    try {
      await initializeDatabase();
      const db = getDb();
      const res = await db.execute({
        sql: 'SELECT * FROM promotions WHERE UPPER(code) = ? AND is_active = 1',
        args: [rawCode]
      });

      if (res.rows.length > 0) {
        const promo: any = res.rows[0];

        // Check date window
        const now = Date.now();
        if (promo.starts_at && Number(promo.starts_at) > now) {
          return NextResponse.json({ valid: false, error: 'This promotion has not started yet.' }, { status: 400 });
        }
        if (promo.expires_at && Number(promo.expires_at) < now) {
          return NextResponse.json({ valid: false, error: 'This promotion code has expired.' }, { status: 400 });
        }

        // Check max uses
        if (promo.max_uses && Number(promo.times_used) >= Number(promo.max_uses)) {
          return NextResponse.json({ valid: false, error: 'This promotion code has reached its maximum usage limit.' }, { status: 400 });
        }

        // Check min order value
        const minOrder = Number(promo.min_order_value || 0);
        if (minOrder > 0 && subtotal < minOrder) {
          return NextResponse.json({
            valid: false,
            error: `Code '${rawCode}' requires a minimum order of ₹${minOrder.toLocaleString('en-IN')}.`
          }, { status: 400 });
        }

        const discountType = promo.discount_type; // 'percentage' or 'fixed'
        const discountValue = Number(promo.discount_value);
        let offInr = 0;
        let percent = 0;

        if (discountType === 'percentage') {
          percent = discountValue;
          offInr = Math.round((subtotal * discountValue) / 100);
        } else {
          offInr = Math.min(subtotal, discountValue);
        }

        return NextResponse.json({
          valid: true,
          code: promo.code,
          discount_type: discountType,
          discount_value: discountValue,
          percent,
          offInr,
          description: promo.description || `Special discount of ${discountType === 'percentage' ? `${discountValue}%` : `₹${discountValue}`}`
        });
      }
    } catch (dbErr) {
      console.warn('Database promotion lookup warning:', dbErr);
    }

    // 2. Built-in legacy fallbacks
    if (rawCode === 'AVZ10' || rawCode === 'BADDIE10') {
      const percent = 10;
      return NextResponse.json({
        valid: true,
        code: rawCode,
        discount_type: 'percentage',
        discount_value: percent,
        percent,
        offInr: Math.round((subtotal * percent) / 100)
      });
    }

    if (rawCode === 'ARCHIVE15' || rawCode === 'SLAY') {
      if (subtotal < 3000) {
        return NextResponse.json({
          valid: false,
          error: `${rawCode} code requires a minimum order value of ₹3,000.`
        }, { status: 400 });
      }
      const percent = 15;
      return NextResponse.json({
        valid: true,
        code: rawCode,
        discount_type: 'percentage',
        discount_value: percent,
        percent,
        offInr: Math.round((subtotal * percent) / 100)
      });
    }

    if (rawCode === 'SQUAD') {
      const percent = 15;
      return NextResponse.json({
        valid: true,
        code: rawCode,
        discount_type: 'percentage',
        discount_value: percent,
        percent,
        offInr: Math.round((subtotal * percent) / 100)
      });
    }

    if (rawCode === 'FREESHIP') {
      return NextResponse.json({
        valid: true,
        code: rawCode,
        discount_type: 'fixed',
        discount_value: 0,
        percent: 0,
        offInr: 0,
        freeShipping: true
      });
    }

    return NextResponse.json({
      valid: false,
      error: 'Invalid promotional code. Please check and try again.'
    }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ valid: false, error: err.message || 'Error verifying promo code' }, { status: 500 });
  }
}

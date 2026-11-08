import { NextResponse } from 'next/server';
import { getDb, initializeDatabase } from '@/src/lib/db';
import { getClientIp, checkRateLimit } from '@/src/lib/security';

function resolveAnimationTheme(explicitTheme?: string, code?: string): string {
  if (explicitTheme && ['sparkles', 'diwali', 'holi', 'cyberpunk', 'luxury_gold', 'hearts'].includes(explicitTheme.toLowerCase().trim())) {
    return explicitTheme.toLowerCase().trim();
  }
  const c = (code || '').toUpperCase();
  if (c.includes('DIWALI') || c.includes('DEEPAVALI') || c.includes('DIYA') || c.includes('PATAKHA') || c.includes('CRACKER') || c.includes('FESTIVE')) return 'diwali';
  if (c.includes('HOLI') || c.includes('RANG') || c.includes('GULAL') || c.includes('COLOR') || c.includes('COLOUR') || c.includes('SPLASH')) return 'holi';
  if (c.includes('CYBER') || c.includes('MATRIX') || c.includes('NEON') || c.includes('TECH') || c.includes('GLITCH') || c.includes('BADDIES')) return 'cyberpunk';
  if (c.includes('GOLD') || c.includes('LUXURY') || c.includes('ROYAL') || c.includes('VIP') || c.includes('RICH') || c.includes('COIN') || c.includes('ATELIER')) return 'luxury_gold';
  if (c.includes('HEART') || c.includes('LOVE') || c.includes('VALENTINE') || c.includes('ROMANCE')) return 'hearts';
  return 'sparkles';
}

export async function POST(request: Request) {
  try {
    // Brute-force defense against discount code enumeration: Max 12 attempts per minute per IP
    const clientIp = getClientIp(request);
    const rateCheck = checkRateLimit(`promo_verify_${clientIp}`, 12, 60000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { valid: false, error: `Too many code verification attempts. Please wait ${rateCheck.resetInSeconds} seconds before trying again.` },
        { status: 429 }
      );
    }

    const body = await request.json();
    const rawCode = (body.code || '').trim().toUpperCase();
    const subtotal = Number(body.subtotal || 0);

    if (!rawCode) {
      return NextResponse.json({ valid: false, error: 'Please enter a promotion code.' }, { status: 400 });
    }

    if (rawCode.length > 30) {
      return NextResponse.json({ valid: false, error: 'Invalid promotion code format.' }, { status: 400 });
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
        const startDate = promo.start_date || promo.starts_at;
        if (startDate && Number(startDate) > now) {
          return NextResponse.json({ valid: false, error: 'This promotion has not started yet.' }, { status: 400 });
        }
        const expiryDate = promo.expiry_date || promo.expires_at;
        if (expiryDate && Number(expiryDate) < now) {
          return NextResponse.json({ valid: false, error: 'This promotion code has expired.' }, { status: 400 });
        }

        // Check max uses
        const timesUsed = Number(promo.current_uses ?? promo.times_used ?? 0);
        if (promo.max_uses && timesUsed >= Number(promo.max_uses)) {
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

        const theme = resolveAnimationTheme(promo.animation_theme, promo.code);

        return NextResponse.json({
          valid: true,
          code: promo.code,
          discount_type: discountType,
          discount_value: discountValue,
          percent,
          offInr,
          animation_theme: theme,
          description: promo.description || `Special discount of ${discountType === 'percentage' ? `${discountValue}%` : `₹${discountValue}`}`
        });
      }
    } catch (dbErr) {
      console.warn('Database promotion lookup warning:', dbErr);
    }

    // 2. Curated studio promotions fallback if database is cold-starting or empty
    const FOUNDATIONAL_PROMOS: Record<string, any> = {
      DIWALI20: {
        code: 'DIWALI20',
        discount_type: 'percentage',
        discount_value: 20,
        min_order_value: 2000,
        animation_theme: 'diwali',
        description: 'Shubh Diwali Auspicious Celebration • 20% OFF'
      },
      HOLISPLASH: {
        code: 'HOLISPLASH',
        discount_type: 'percentage',
        discount_value: 15,
        min_order_value: 1500,
        animation_theme: 'holi',
        description: 'Rangotsav Holi Special • 15% OFF'
      },
      BADDIES10: {
        code: 'BADDIES10',
        discount_type: 'percentage',
        discount_value: 10,
        min_order_value: 1500,
        animation_theme: 'cyberpunk',
        description: 'Atelier Squad Discount • 10% OFF'
      },
      ATELIER500: {
        code: 'ATELIER500',
        discount_type: 'fixed',
        discount_value: 500,
        min_order_value: 4000,
        animation_theme: 'luxury_gold',
        description: 'Royal Gold Privilege • ₹500 Flat OFF'
      },
      FREESHIP: {
        code: 'FREESHIP',
        discount_type: 'percentage',
        discount_value: 0,
        min_order_value: 0,
        animation_theme: 'sparkles',
        description: 'Complimentary Express Courier Shipping Unlocked'
      }
    };

    const fallbackPromo = FOUNDATIONAL_PROMOS[rawCode];
    if (fallbackPromo) {
      if (fallbackPromo.min_order_value > 0 && subtotal < fallbackPromo.min_order_value) {
        return NextResponse.json({
          valid: false,
          error: `Code '${rawCode}' requires a minimum order of ₹${fallbackPromo.min_order_value.toLocaleString('en-IN')}.`
        }, { status: 400 });
      }

      let offInr = 0;
      let percent = 0;
      if (fallbackPromo.discount_type === 'percentage') {
        percent = fallbackPromo.discount_value;
        offInr = Math.round((subtotal * percent) / 100);
      } else {
        offInr = Math.min(subtotal, fallbackPromo.discount_value);
      }

      return NextResponse.json({
        valid: true,
        code: fallbackPromo.code,
        discount_type: fallbackPromo.discount_type,
        discount_value: fallbackPromo.discount_value,
        percent,
        offInr,
        animation_theme: fallbackPromo.animation_theme,
        description: fallbackPromo.description
      });
    }

    return NextResponse.json({
      valid: false,
      error: 'Invalid promotional code. No active promotions match this code.'
    }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ valid: false, error: err.message || 'Error verifying promo code' }, { status: 500 });
  }
}


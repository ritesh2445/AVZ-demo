import crypto from 'crypto';
import { cookies, headers } from 'next/headers';
import { getDb, initializeDatabase } from './db';
import { getSupabaseAuthClient } from './supabase-auth';

const SESSION_COOKIE_NAME = 'avz_admin_session';

function getSessionSecret(): string {
  const isProd = process.env.NODE_ENV === 'production';
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (isProd) {
    if (!secret) {
      throw new Error('FATAL CONFIGURATION ERROR: ADMIN_SESSION_SECRET must be configured in production environment.');
    }
    if (secret.length < 32) {
      throw new Error('FATAL CONFIGURATION ERROR: ADMIN_SESSION_SECRET must be at least 32 characters long in production.');
    }
  }
  return secret || 'avz-development-only-session-secret-2026';
}

const ALLOWED_ADMINS = [
  'avz.vaganza@gmail.com',
  'aveezahstore@gmail.com',
  'dhrisni@aveezahvaganza.com'
];

export interface AdminSession {
  userId: string;
  email: string;
  name: string;
  role: 'owner' | 'store_manager' | 'content_manager';
  issuedAt: number;
  expiresAt: number;
}

/**
 * Signs payload using HMAC-SHA256
 */
export function signSessionPayload(payload: AdminSession): string {
  const jsonStr = JSON.stringify(payload);
  const base64Data = Buffer.from(jsonStr).toString('base64url');
  const hmac = crypto.createHmac('sha256', getSessionSecret()).update(base64Data).digest('base64url');
  return `${base64Data}.${hmac}`;
}

/**
 * Verifies and decodes session token
 */
export function verifySessionToken(token: string): AdminSession | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [base64Data, expectedHmac] = parts;

    const actualHmac = crypto.createHmac('sha256', getSessionSecret()).update(base64Data).digest('base64url');
    if (!crypto.timingSafeEqual(Buffer.from(expectedHmac), Buffer.from(actualHmac))) {
      return null;
    }

    const jsonStr = Buffer.from(base64Data, 'base64url').toString('utf8');
    const session = JSON.parse(jsonStr) as AdminSession;

    // Check expiration (24 hour session)
    if (Date.now() > session.expiresAt) {
      return null;
    }

    return session;
  } catch (e) {
    return null;
  }
}

/**
 * Checks if email is in administrator allowlist
 */
export function isAllowedAdminEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  if (ALLOWED_ADMINS.includes(normalized)) return true;
  // Also allow any admin configured in env
  const envAllowlist = (process.env.ADMIN_EMAIL_ALLOWLIST || '')
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);
  return envAllowlist.includes(normalized);
}

/**
 * Generates a 6-digit OTP and stores in database
 */
export async function generateAdminOtp(email: string): Promise<{ success: boolean; message: string; otp?: string }> {
  await initializeDatabase();
  const normalized = email.trim().toLowerCase();

  if (!isAllowedAdminEmail(normalized)) {
    return { success: false, message: 'Unauthorized email. Contact owner for access.' };
  }

  const db = getDb();
  // Find or create admin user
  const userQuery = await db.execute({
    sql: 'SELECT id, email, name, role, last_otp_requested_at, otp_request_count, otp_window_start FROM admin_users WHERE email = ?',
    args: [normalized]
  });

  let user: any = userQuery.rows[0];
  if (!user) {
    const newId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    await db.execute({
      sql: `INSERT INTO admin_users (id, email, name, role, created_at) VALUES (?, ?, ?, 'store_manager', ?)`,
      args: [newId, normalized, normalized.split('@')[0], Date.now()]
    });
    user = { id: newId, email: normalized, name: normalized.split('@')[0], role: 'store_manager' };
  }

  const now = Date.now();
  const COOLDOWN_MS = 60 * 1000; // 60 seconds minimum cooldown between OTP requests
  const WINDOW_MS = 60 * 60 * 1000; // 1 hour rolling window
  const MAX_PER_WINDOW = 5; // Maximum 5 OTP requests per hour

  const lastRequested = Number(user.last_otp_requested_at || 0);
  const windowStart = Number(user.otp_window_start || 0);
  const requestCount = Number(user.otp_request_count || 0);

  // 1. Initial Cooldown Check (Fast path)
  if (lastRequested > 0 && (now - lastRequested) < COOLDOWN_MS) {
    const remainingSeconds = Math.max(1, Math.ceil((COOLDOWN_MS - (now - lastRequested)) / 1000));
    return {
      success: false,
      message: `Please wait ${remainingSeconds} second${remainingSeconds === 1 ? '' : 's'} before requesting another passcode.`
    };
  }

  // 2. Longer Window Limit Check (Max 5 requests per hour)
  const isWithinWindow = windowStart > 0 && (now - windowStart) < WINDOW_MS;
  if (isWithinWindow && requestCount >= MAX_PER_WINDOW) {
    const remainingMinutes = Math.max(1, Math.ceil((WINDOW_MS - (now - windowStart)) / 60000));
    return {
      success: false,
      message: `Passcode request limit reached. Please try again in ${remainingMinutes} minute${remainingMinutes === 1 ? '' : 's'} or contact support.`
    };
  }

  // Generate 6 digit numeric code
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = now + 10 * 60 * 1000; // 10 minutes

  // 3. Atomic Database Update: Guarantees concurrency safety across serverless instances
  // Concurrent requests executing simultaneously will race on this single SQL update.
  // The first request will succeed; any subsequent request within 60s will match 0 rows and be rejected.
  const updateRes = await db.execute({
    sql: `UPDATE admin_users SET
      otp_code = ?,
      otp_expires_at = ?,
      otp_attempts = 0,
      last_otp_requested_at = ?,
      otp_request_count = CASE
        WHEN otp_window_start IS NULL OR (? - otp_window_start) > ? THEN 1
        ELSE otp_request_count + 1
      END,
      otp_window_start = CASE
        WHEN otp_window_start IS NULL OR (? - otp_window_start) > ? THEN ?
        ELSE otp_window_start
      END
    WHERE email = ?
      AND (last_otp_requested_at IS NULL OR (? - last_otp_requested_at) >= ?)
      AND (otp_window_start IS NULL OR (? - otp_window_start) > ? OR otp_request_count < ?)`,
    args: [
      otpCode,
      expiresAt,
      now,
      now, WINDOW_MS,
      now, WINDOW_MS, now,
      normalized,
      now, COOLDOWN_MS,
      now, WINDOW_MS, MAX_PER_WINDOW
    ]
  });

  if (updateRes.rowsAffected === 0) {
    return {
      success: false,
      message: 'Passcode request rate limit exceeded. Please wait 60 seconds before trying again.'
    };
  }

  // Log activity
  await logAdminActivity(normalized, 'REQUEST_OTP', 'admin_users', user.id as string, { email: normalized });

  const isProd = process.env.NODE_ENV === 'production';
  const supabase = getSupabaseAuthClient();

  // 1. Supabase Auth Email OTP Delivery (Preferred)
  if (supabase) {
    try {
      const { error: supabaseError } = await supabase.auth.signInWithOtp({
        email: normalized,
        options: {
          shouldCreateUser: true,
        },
      });

      if (supabaseError) {
        console.error('[SUPABASE OTP ERROR]:', supabaseError.message);
        if (isProd && process.env.ALLOW_DEV_ADMIN_OTP !== 'true') {
          await db.execute({
            sql: 'UPDATE admin_users SET otp_code = NULL, otp_expires_at = NULL WHERE email = ?',
            args: [normalized],
          });
          return {
            success: false,
            message: `Supabase email delivery failed: ${supabaseError.message}`,
          };
        }
      } else {
        console.log(`[SUPABASE OTP DISPATCHED]: Code delivered via Supabase to ${normalized}`);
        return {
          success: true,
          message: 'One-Time Passcode dispatched via Supabase to your authorized administrator address.',
        };
      }
    } catch (err: any) {
      console.error('[SUPABASE NETWORK ERROR]:', err?.message || err);
    }
  }

  const resendApiKey = process.env.RESEND_API_KEY;

  // In production, require email provider configuration or fail closed
  if (isProd && !resendApiKey) {
    // Clear the unsendable code from database
    await db.execute({
      sql: 'UPDATE admin_users SET otp_code = NULL, otp_expires_at = NULL WHERE email = ?',
      args: [normalized]
    });
    return {
      success: false,
      message: 'Production email delivery service unconfigured (RESEND_API_KEY missing). Contact administrator.'
    };
  }

  // If email provider is configured (required in production, optional in development):
  if (resendApiKey) {
    const fromAddress = process.env.RESEND_FROM_EMAIL || 'AVZ Vaganza Atelier <onboarding@resend.dev>';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: fromAddress,
          to: [normalized],
          subject: 'AVZ Vaganza Atelier // Security Access Code',
          html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0E0A14; color: #FFFFFF; padding: 32px; border-radius: 12px; border: 1px solid #301934; max-width: 520px; margin: 0 auto;">
            <h2 style="color: #F4C2C2; letter-spacing: 2px; margin-top: 0; font-size: 18px; text-transform: uppercase;">AVZ Vaganza Atelier</h2>
            <p style="color: #D1D5DB; font-size: 14px; line-height: 1.5;">Your single-use administrator authentication passcode is:</p>
            <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #FFFFFF; background-color: #1C1226; padding: 16px 24px; border-radius: 8px; border: 1px solid #BE185D; display: inline-block; margin: 16px 0; font-family: monospace;">
              ${otpCode}
            </div>
            <p style="color: #9CA3AF; font-size: 12px; line-height: 1.5; margin-bottom: 0;">This passcode expires in 10 minutes and can only be used once. If you did not request this code, no action is required.</p>
          </div>`,
          text: `AVZ VAGANZA ATELIER\n\nYour single-use administrator authentication passcode is: ${otpCode}\n\nThis passcode expires in 10 minutes. If you did not request this code, no action is required.`
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!emailRes.ok) {
        const errData = await emailRes.json().catch(() => ({}));
        console.error('Email dispatch provider rejected request: HTTP', emailRes.status, errData?.name || errData?.message || '');
        if (isProd && process.env.ALLOW_DEV_ADMIN_OTP !== 'true') {
          // Clear the undelivered code from database
          await db.execute({
            sql: 'UPDATE admin_users SET otp_code = NULL, otp_expires_at = NULL WHERE email = ?',
            args: [normalized]
          });
          return {
            success: false,
            message: 'Failed to deliver passcode via email service. Please check provider configuration or contact administrator.'
          };
        } else {
          console.warn('[DEV PASSCODE FALLBACK]: Email delivery unavailable. Using direct passcode for development access.');
        }
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      const isTimeout = err.name === 'AbortError' || err.message?.toLowerCase().includes('timeout');
      console.error('Email dispatch network error:', isTimeout ? 'Request timed out (10s)' : err.message || 'Unknown network error');
      if (isProd && process.env.ALLOW_DEV_ADMIN_OTP !== 'true') {
        // Clear the undelivered code from database
        await db.execute({
          sql: 'UPDATE admin_users SET otp_code = NULL, otp_expires_at = NULL WHERE email = ?',
          args: [normalized]
        });
        return {
          success: false,
          message: isTimeout
            ? 'Email delivery service timed out. Please try again shortly.'
            : 'Email delivery service unreachable. Please contact administrator.'
        };
      } else {
        console.warn('[DEV PASSCODE FALLBACK]: Email dispatch network error. Using direct passcode for development access.');
      }
    }
  }

  const allowOtpReturn = !isProd || process.env.ALLOW_DEV_ADMIN_OTP === 'true';

  return {
    success: true,
    message: allowOtpReturn
      ? 'One-Time Passcode generated successfully.'
      : 'One-Time Passcode dispatched to your authorized administrator address.',
    otp: allowOtpReturn ? otpCode : undefined
  };
}

/**
 * Verifies admin OTP and issues a signed session
 */
export async function verifyAdminOtp(email: string, code: string): Promise<{ success: boolean; message: string; session?: AdminSession; token?: string }> {
  await initializeDatabase();
  const normalized = email.trim().toLowerCase();
  const db = getDb();

  const res = await db.execute({
    sql: 'SELECT id, email, name, role, otp_code, otp_expires_at, otp_attempts FROM admin_users WHERE email = ?',
    args: [normalized]
  });

  if (res.rows.length === 0) {
    return { success: false, message: 'Invalid admin account.' };
  }

  const user = res.rows[0];
  const attempts = Number(user.otp_attempts || 0);

  if (attempts >= 5) {
    return { success: false, message: 'Maximum attempts exceeded. Please request a new OTP.' };
  }

  if (!user.otp_code || !user.otp_expires_at) {
    return { success: false, message: 'No active OTP request. Please request a new code.' };
  }

  if (Date.now() > Number(user.otp_expires_at)) {
    return { success: false, message: 'OTP has expired. Please request a new one.' };
  }

  // Increment attempt counter
  await db.execute({
    sql: 'UPDATE admin_users SET otp_attempts = otp_attempts + 1 WHERE id = ?',
    args: [user.id]
  });

  const supabase = getSupabaseAuthClient();
  let supabaseVerified = false;

  if (supabase) {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: normalized,
        token: code.trim(),
        type: 'email',
      });
      if (!error && data?.user) {
        supabaseVerified = true;
      } else if (error) {
        console.warn('[SUPABASE VERIFY NOTICE]:', error.message);
      }
    } catch (err: any) {
      console.warn('[SUPABASE VERIFY ERROR]:', err?.message || err);
    }
  }

  // Strict comparison against Supabase verification or local OTP record
  const isMatch = supabaseVerified || (user.otp_code && user.otp_code === code.trim());
  if (!isMatch) {
    return { success: false, message: 'Incorrect passcode. Please try again.' };
  }

  // Invalidate OTP immediately to ensure single-use
  await db.execute({
    sql: 'UPDATE admin_users SET otp_code = NULL, otp_expires_at = NULL, otp_attempts = 0, last_login_at = ? WHERE id = ?',
    args: [Date.now(), user.id]
  });

  const session: AdminSession = {
    userId: String(user.id),
    email: String(user.email),
    name: String(user.name),
    role: (user.role as any) || 'store_manager',
    issuedAt: Date.now(),
    expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  };

  const token = signSessionPayload(session);

  await logAdminActivity(normalized, 'LOGIN_SUCCESS', 'admin_users', String(user.id), { role: user.role });

  return {
    success: true,
    message: 'Authentication successful.',
    session,
    token
  };
}

/**
 * Authenticates the administrator using email and password directly (no OTP required)
 */
export async function loginAdminWithPassword(
  email: string,
  password: string
): Promise<{ success: boolean; message: string; session?: AdminSession; token?: string }> {
  await initializeDatabase();
  const normalized = email.trim().toLowerCase();

  if (!isAllowedAdminEmail(normalized)) {
    return { success: false, message: 'Invalid admin credentials.' };
  }

  const configuredPassword = process.env.ADMIN_PASSWORD || 'wyzrUz-9nifme-jijgu';

  // Constant-time comparison to prevent timing attacks
  const passBuffer = Buffer.from(password.trim());
  const expectedBuffer = Buffer.from(configuredPassword.trim());

  const isPasswordValid =
    passBuffer.length === expectedBuffer.length &&
    crypto.timingSafeEqual(passBuffer, expectedBuffer);

  if (!isPasswordValid) {
    return { success: false, message: 'Invalid email or password.' };
  }

  const db = getDb();
  // Ensure user exists in admin_users
  const userQuery = await db.execute({
    sql: 'SELECT id, email, name, role FROM admin_users WHERE email = ?',
    args: [normalized],
  });

  let user: any = userQuery.rows[0];
  if (!user) {
    const newId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    await db.execute({
      sql: `INSERT INTO admin_users (id, email, name, role, created_at) VALUES (?, ?, ?, 'owner', ?)`,
      args: [newId, normalized, 'AVZ Administrator', Date.now()],
    });
    user = { id: newId, email: normalized, name: 'AVZ Administrator', role: 'owner' };
  }

  // Update last login timestamp
  await db.execute({
    sql: 'UPDATE admin_users SET last_login_at = ? WHERE id = ?',
    args: [Date.now(), user.id],
  });

  const session: AdminSession = {
    userId: String(user.id),
    email: String(user.email),
    name: String(user.name || 'AVZ Administrator'),
    role: (user.role as any) || 'owner',
    issuedAt: Date.now(),
    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  };

  const token = signSessionPayload(session);

  await logAdminActivity(normalized, 'LOGIN_PASSWORD_SUCCESS', 'admin_users', String(user.id), { role: user.role });

  return {
    success: true,
    message: 'Authentication successful.',
    session,
    token,
  };
}

/**
 * Retrieves the current admin session from request cookies or Authorization header
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  let token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    try {
      const headerList = await headers();
      const authHeader = headerList.get('authorization') || '';
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7).trim();
      }
    } catch {}
  }

  if (!token) return null;
  return verifySessionToken(token);
}

/**
 * Audits every admin activity
 */
export async function logAdminActivity(
  userEmail: string,
  action: string,
  entityType: string,
  entityId?: string,
  details?: Record<string, any>
): Promise<void> {
  try {
    const db = getDb();
    await db.execute({
      sql: `INSERT INTO activity_logs (id, user_email, action, entity_type, entity_id, details, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [
        `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        userEmail,
        action,
        entityType,
        entityId || null,
        details ? JSON.stringify(details) : null,
        Date.now()
      ]
    });
  } catch (e) {
    console.error('Failed to write activity log:', e);
  }
}

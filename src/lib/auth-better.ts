import { betterAuth } from 'better-auth';
import { Kysely } from 'kysely';
import { LibsqlDialect } from '@libsql/kysely-libsql';
import { getDb } from './db';
import { headers } from 'next/headers';

/**
 * Resend email dispatch helper for verification and password reset emails.
 * Uses native fetch for compatibility across Node.js and Cloudflare Workers runtime.
 */
async function sendAuthEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(
      `[AUTH EMAIL NOTICE]: RESEND_API_KEY not configured. Simulating delivery to: ${to}`
    );
    console.warn(`[AUTH EMAIL CONTENT PREVIEW]:\n${text}`);
    return { success: true, simulated: true };
  }

  const fromAddress =
    process.env.EMAIL_FROM_ADDRESS ||
    process.env.RESEND_FROM_EMAIL ||
    'AVZ Vaganza Atelier <onboarding@resend.dev>';

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [to],
        subject,
        html,
        text,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error('[AUTH EMAIL PROVIDER ERROR]:', err);
      return { success: false, error: err };
    }
    return { success: true };
  } catch (err: any) {
    clearTimeout(timeoutId);
    console.error('[AUTH EMAIL NETWORK ERROR]:', err?.message || err);
    return { success: false, error: err };
  }
}

// Development secret fallback ensuring zero-friction local execution while enforcing production secrets
const isProd = process.env.NODE_ENV === 'production';
const authSecret =
  process.env.BETTER_AUTH_SECRET ||
  (isProd
    ? undefined
    : 'avz_vaganza_dev_auth_secret_32_bytes_super_secure_2026');

if (isProd && !process.env.BETTER_AUTH_SECRET) {
  console.warn(
    '[BETTER AUTH WARNING]: BETTER_AUTH_SECRET is not set in production. Configure this environment variable immediately.'
  );
}

const baseURL =
  process.env.BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  'http://localhost:3000';

// Lazy-evaluated client proxy to prevent build-time evaluation while preserving runtime Turso connection
const lazyClient = new Proxy({} as any, {
  get(_target, prop) {
    const db = getDb();
    const val = (db as any)[prop];
    if (typeof val === 'function') {
      return val.bind(db);
    }
    return val;
  },
});

const kyselyInstance = new Kysely<any>({
  dialect: new LibsqlDialect({ client: lazyClient }),
});

/**
 * Production-ready Better Auth instance configured for AVZ Vaganza.
 * Supports Google OAuth 2.0, Email/Password, Resend email workflows,
 * database-persisted sessions, and distributed rate limiting.
 */
export const auth = betterAuth({
  database: {
    db: kyselyInstance,
    type: 'sqlite',
  },
  secret: authSecret,
  baseURL,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Allows immediate VIP exploration; email verification can be triggered on demand
    sendResetPassword: async ({ user, url }, _request) => {
      const brand = 'AVZ VAGANZA ATELIER';
      const subject = `${brand} // Reset Your VIP Password`;
      const html = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0d0714; color: #ffffff; padding: 40px; border-radius: 16px; border: 1px solid rgba(244,194,194,0.2); max-width: 520px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #f4c2c2; font-size: 16px; letter-spacing: 0.25em; text-transform: uppercase; margin: 0;">AVZ VAGANZA</h1>
            <p style="color: #a1a1aa; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; margin-top: 4px;">HAUTE WEARABLE ART ATELIER</p>
          </div>
          <p style="color: #e4e4e7; font-size: 14px; line-height: 1.6;">Hello ${user.name || 'VIP Client'},</p>
          <p style="color: #a1a1aa; font-size: 13px; line-height: 1.6;">A password reset request was initiated for your AVZ client account (${user.email}). Click the button below to establish a new password:</p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${url}" style="background: linear-gradient(135deg, #f4c2c2, #c084fc); color: #000000; padding: 14px 28px; border-radius: 10px; font-weight: bold; font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; text-decoration: none; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color: #71717a; font-size: 11px; line-height: 1.5; border-top: 1px solid rgba(255,255,255,0.1); pt: 16px; margin-top: 24px;">
            This link is valid for 1 hour. If you did not request a password reset, you can safely disregard this notice.
          </p>
        </div>
      `;
      const text = `${brand}\n\nReset your password:\n${url}\n\nThis link is valid for 1 hour. If you did not request this, please disregard.`;
      await sendAuthEmail({ to: user.email, subject, html, text });
    },
  },
  emailVerification: {
    sendOnSignUp: false, // Can be triggered manually or via profile
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }, _request) => {
      const brand = 'AVZ VAGANZA ATELIER';
      const subject = `${brand} // Verify Your VIP Account`;
      const html = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0d0714; color: #ffffff; padding: 40px; border-radius: 16px; border: 1px solid rgba(244,194,194,0.2); max-width: 520px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #f4c2c2; font-size: 16px; letter-spacing: 0.25em; text-transform: uppercase; margin: 0;">AVZ VAGANZA</h1>
            <p style="color: #a1a1aa; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; margin-top: 4px;">HAUTE WEARABLE ART ATELIER</p>
          </div>
          <p style="color: #e4e4e7; font-size: 14px; line-height: 1.6;">Welcome ${user.name || 'VIP Client'},</p>
          <p style="color: #a1a1aa; font-size: 13px; line-height: 1.6;">Please confirm your email address to complete your VIP client verification and unlock runway drop previews:</p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${url}" style="background: linear-gradient(135deg, #f4c2c2, #c084fc); color: #000000; padding: 14px 28px; border-radius: 10px; font-weight: bold; font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; text-decoration: none; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          <p style="color: #71717a; font-size: 11px; line-height: 1.5; border-top: 1px solid rgba(255,255,255,0.1); pt: 16px; margin-top: 24px;">
            If you did not create an AVZ account with this address, please ignore this email.
          </p>
        </div>
      `;
      const text = `${brand}\n\nVerify your VIP account:\n${url}\n\nIf you did not sign up, please ignore this message.`;
      await sendAuthEmail({ to: user.email, subject, html, text });
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      enabled: Boolean(
        process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ),
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30-day persistent session
    updateAge: 60 * 60 * 24, // Refresh last-active timestamp daily
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5-minute fast-path cookie cache
    },
  },
  rateLimit: {
    enabled: true,
    storage: 'database', // Persistent rate limiting in Turso (no in-memory loss across serverless instances)
    window: 60,
    max: 100,
    customRules: {
      '/sign-in/email': {
        window: 60,
        max: 10, // 10 sign-in attempts per minute
      },
      '/sign-up/email': {
        window: 60,
        max: 5, // 5 registrations per minute
      },
      '/forget-password': {
        window: 60,
        max: 5, // 5 password reset requests per minute
      },
    },
  },
  advanced: {
    useSecureCookies: isProd,
    defaultCookieAttributes: {
      sameSite: 'lax',
      secure: isProd,
      httpOnly: true,
    },
  },
});

/**
 * Server-side helper to retrieve the active Better Auth session.
 */
export async function getServerSession() {
  try {
    const reqHeaders = await headers();
    return await auth.api.getSession({
      headers: reqHeaders,
    });
  } catch (err) {
    return null;
  }
}

/**
 * Server-side guard that throws an error or returns 401 if unauthenticated.
 */
export async function requireUserSession() {
  const session = await getServerSession();
  if (!session || !session.user) {
    throw new Error('UNAUTHORIZED');
  }
  return session;
}

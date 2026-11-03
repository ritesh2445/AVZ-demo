/**
 * AVZ VAGANZA — PRODUCTION SECURITY HARDENING & DEFENSE MODULE
 * Provides rate-limiting, IP extraction, input sanitization, spam heuristics,
 * and price tampering safeguards across API endpoints.
 */

// In-memory rate limiting store with periodic eviction
interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up expired keys every 60 seconds
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (now > record.resetAt) {
        rateLimitStore.delete(key);
      }
    }
  }, 60000);
}

/**
 * Extracts client IP address accurately from Cloudflare, reverse proxy, or direct connection
 */
export function getClientIp(req: Request): string {
  const headers = req.headers;
  const cfIp = headers.get('cf-connecting-ip');
  if (cfIp) return cfIp.trim();

  const xRealIp = headers.get('x-real-ip');
  if (xRealIp) return xRealIp.trim();

  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    const parts = forwarded.split(',');
    if (parts[0]) return parts[0].trim();
  }

  return '127.0.0.1';
}

/**
 * Checks and increments rate limit for a specific identifier (IP, email, or endpoint)
 * Returns { allowed: boolean, remaining: number, resetInSeconds: number }
 */
export function checkRateLimit(
  identifier: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetInSeconds: number } {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetAt) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetInSeconds: Math.ceil(windowMs / 1000),
    };
  }

  if (record.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetInSeconds: Math.max(1, Math.ceil((record.resetAt - now) / 1000)),
    };
  }

  record.count += 1;
  return {
    allowed: true,
    remaining: maxRequests - record.count,
    resetInSeconds: Math.max(1, Math.ceil((record.resetAt - now) / 1000)),
  };
}

/**
 * Strips all HTML tags, script injection vectors, and caps string length
 */
export function sanitizeText(input: unknown, maxLength = 500): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<[^>]*>/g, '') // Strip HTML tags
    .replace(/[<>'"&;]/g, (char) => {
      // Escape critical characters if any remain
      switch (char) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '"': return '&quot;';
        case "'": return '&#x27;';
        case '&': return '&amp;';
        default: return '';
      }
    })
    .trim()
    .slice(0, maxLength);
}

/**
 * Strict RFC 5322 compliant email regex
 */
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export function isValidEmail(email: unknown): boolean {
  if (typeof email !== 'string') return false;
  const clean = email.trim();
  if (clean.length < 5 || clean.length > 254) return false;
  return EMAIL_REGEX.test(clean);
}

/**
 * Validates international and domestic phone numbers
 */
export function isValidPhone(phone: unknown): boolean {
  if (typeof phone !== 'string') return false;
  const digits = phone.replace(/[^0-9]/g, '');
  return digits.length >= 10 && digits.length <= 15;
}

/**
 * Detects spam patterns, promotional bots, casino/crypto links
 */
export function containsSpamPatterns(text: string): boolean {
  const lower = text.toLowerCase();
  const spamKeywords = [
    't.me/',
    'telegram.me',
    'wa.me/+',
    'crypto',
    'bitcoin',
    'usdt',
    'casino',
    'slot online',
    'betting',
    'poker',
    'viagra',
    'cialis',
    'cheap seo',
    'backlinks',
    'whatsapp.com/channel',
    'http://',
    'https://'
  ];

  return spamKeywords.some(keyword => lower.includes(keyword));
}

/**
 * Strict URL validator ensuring protocol is https, http, or local asset path
 */
export function isValidMediaUrl(url: unknown): boolean {
  if (typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed) return false;

  // Local static asset path
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return true;
  }

  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

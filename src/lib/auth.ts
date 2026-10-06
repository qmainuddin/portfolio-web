import crypto from 'node:crypto';

export interface AdminUser {
  username: string;
}

const DEFAULT_ADMIN_USERNAME = 'qmain';
const DEFAULT_ADMIN_PASSWORD = 'D@ng3R-NZ';
const SESSION_COOKIE_NAME = 'admin_session';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getAdminCredentials() {
  const username = process.env.ADMIN_USERNAME || DEFAULT_ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET || 'mt-admin-portal-secure-secret-2026-auth';
  return { username, password, secret };
}

/**
 * Timing-safe string comparison that avoids buffer length mismatch exceptions.
 */
function safeStringCompare(a: string, b: string): boolean {
  const hashA = crypto.createHash('sha256').update(a).digest();
  const hashB = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

/**
 * Validates provided credentials against configured admin username/password.
 */
export function verifyCredentials(username?: string, password?: string): boolean {
  if (!username || !password) return false;
  const creds = getAdminCredentials();
  
  const userMatch = safeStringCompare(username.trim(), creds.username.trim());
  const passMatch = safeStringCompare(password.trim(), creds.password.trim());

  return userMatch && passMatch;
}

/**
 * Creates a signed session token: base64(username:timestamp:hmac)
 */
export function createSessionToken(username: string): string {
  const { secret } = getAdminCredentials();
  const timestamp = Date.now();
  const data = `${username}:${timestamp}`;
  const hmac = crypto.createHmac('sha256', secret).update(data).digest('hex');
  const tokenPayload = `${data}:${hmac}`;
  return Buffer.from(tokenPayload).toString('base64url');
}

/**
 * Verifies a signed session token.
 */
export function verifySessionToken(token: string): { valid: boolean; username?: string } {
  try {
    const { secret, username: expectedUsername } = getAdminCredentials();
    const decoded = Buffer.from(token, 'base64url').toString('utf-8');
    const [user, tsStr, hmac] = decoded.split(':');

    if (!user || !tsStr || !hmac) {
      return { valid: false };
    }

    // Verify username matches expected admin
    if (user !== expectedUsername) {
      return { valid: false };
    }

    // Check expiration
    const timestamp = parseInt(tsStr, 10);
    const ageSeconds = (Date.now() - timestamp) / 1000;
    if (ageSeconds > SESSION_MAX_AGE_SECONDS || isNaN(timestamp)) {
      return { valid: false };
    }

    // Verify HMAC signature
    const expectedHmac = crypto.createHmac('sha256', secret).update(`${user}:${tsStr}`).digest('hex');
    const hmacValid = safeStringCompare(hmac, expectedHmac);

    return { valid: hmacValid, username: hmacValid ? user : undefined };
  } catch {
    return { valid: false };
  }
}

/**
 * Extracts and validates admin session from incoming Astro/Node Request.
 */
export function verifyAdminSession(request: Request): { authenticated: boolean; username?: string } {
  // 1. Check Bearer Authorization header (for API testing)
  const authHeader = request.headers.get('authorization') || '';
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    const result = verifySessionToken(token);
    if (result.valid && result.username) {
      return { authenticated: true, username: result.username };
    }
  }

  // 2. Check Cookie
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = parseCookies(cookieHeader);
  const sessionToken = cookies[SESSION_COOKIE_NAME];

  if (!sessionToken) {
    return { authenticated: false };
  }

  const result = verifySessionToken(sessionToken);
  return { authenticated: result.valid, username: result.username };
}

/**
 * Returns Set-Cookie header string for creating admin session.
 */
export function createAdminSessionCookie(token: string): string {
  const isProd = process.env.NODE_ENV === 'production';
  const secureFlag = isProd ? '; Secure' : '';
  return `${SESSION_COOKIE_NAME}=${token}; Path=/; Max-Age=${SESSION_MAX_AGE_SECONDS}; HttpOnly; SameSite=Lax${secureFlag}`;
}

/**
 * Returns Set-Cookie header string for clearing admin session.
 */
export function clearAdminSessionCookie(): string {
  return `${SESSION_COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`;
}

function parseCookies(cookieHeader: string): Record<string, string> {
  const list: Record<string, string> = {};
  if (!cookieHeader) return list;

  cookieHeader.split(';').forEach(cookie => {
    const parts = cookie.split('=');
    if (parts.length >= 2) {
      const name = parts[0].trim();
      const val = parts.slice(1).join('=').trim();
      list[name] = decodeURIComponent(val);
    }
  });

  return list;
}

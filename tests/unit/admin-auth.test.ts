import { describe, it, expect } from 'vitest';
import {
  verifyCredentials,
  createSessionToken,
  verifySessionToken,
  verifyAdminSession,
  createAdminSessionCookie,
  clearAdminSessionCookie,
} from '@/lib/auth';

describe('Admin Authentication & Session Management', () => {
  it('validates correct admin credentials (qmain / D@ng3R-NZ)', () => {
    const isValid = verifyCredentials('qmain', 'D@ng3R-NZ');
    expect(isValid).toBe(true);
  });

  it('rejects invalid admin username or password', () => {
    expect(verifyCredentials('wronguser', 'D@ng3R-NZ')).toBe(false);
    expect(verifyCredentials('qmain', 'wrongpass')).toBe(false);
    expect(verifyCredentials('', '')).toBe(false);
    expect(verifyCredentials(undefined, undefined)).toBe(false);
  });

  it('creates and verifies a valid signed session token', () => {
    const token = createSessionToken('qmain');
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');

    const verified = verifySessionToken(token);
    expect(verified.valid).toBe(true);
    expect(verified.username).toBe('qmain');
  });

  it('rejects a tampered or invalid session token', () => {
    const invalidResult = verifySessionToken('invalid.token.payload');
    expect(invalidResult.valid).toBe(false);

    const tampered = createSessionToken('qmain') + 'tampered';
    expect(verifySessionToken(tampered).valid).toBe(false);
  });

  it('verifies admin session via Cookie header', () => {
    const token = createSessionToken('qmain');
    const mockRequest = new Request('http://localhost:4321/api/admin/session', {
      headers: {
        Cookie: `admin_session=${token}; other_cookie=123`,
      },
    });

    const session = verifyAdminSession(mockRequest);
    expect(session.authenticated).toBe(true);
    expect(session.username).toBe('qmain');
  });

  it('verifies admin session via Bearer Authorization header', () => {
    const token = createSessionToken('qmain');
    const mockRequest = new Request('http://localhost:4321/api/admin/session', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const session = verifyAdminSession(mockRequest);
    expect(session.authenticated).toBe(true);
    expect(session.username).toBe('qmain');
  });

  it('rejects unauthenticated requests without cookie or auth header', () => {
    const mockRequest = new Request('http://localhost:4321/api/admin/session');
    const session = verifyAdminSession(mockRequest);
    expect(session.authenticated).toBe(false);
  });

  it('generates Set-Cookie header strings for login and logout', () => {
    const loginCookie = createAdminSessionCookie('test-token');
    expect(loginCookie).toContain('admin_session=test-token');
    expect(loginCookie).toContain('HttpOnly');
    expect(loginCookie).toContain('Path=/');

    const logoutCookie = clearAdminSessionCookie();
    expect(logoutCookie).toContain('admin_session=');
    expect(logoutCookie).toContain('Max-Age=0');
  });
});

import type { APIRoute } from 'astro';
import { verifyCredentials, createSessionToken, createAdminSessionCookie } from '@/lib/auth';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { username, password } = body || {};

    if (!username || !password) {
      return new Response(
        JSON.stringify({ success: false, error: 'Username and password are required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const isValid = verifyCredentials(username, password);
    if (!isValid) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid username or password.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const token = createSessionToken(username.trim());
    const cookieHeader = createAdminSessionCookie(token);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Authentication successful.',
        user: { username: username.trim() },
        token, // also return token for header-based auth if needed
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': cookieHeader,
        },
      }
    );
  } catch (err: any) {
    console.error('[Admin Login Error]', err);
    return new Response(
      JSON.stringify({ success: false, error: 'An error occurred during authentication.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

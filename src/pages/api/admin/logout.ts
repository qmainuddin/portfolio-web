import type { APIRoute } from 'astro';
import { clearAdminSessionCookie } from '@/lib/auth';

export const prerender = false;

export const POST: APIRoute = async () => {
  const clearCookieHeader = clearAdminSessionCookie();

  return new Response(
    JSON.stringify({ success: true, message: 'Logged out successfully.' }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': clearCookieHeader,
      },
    }
  );
};

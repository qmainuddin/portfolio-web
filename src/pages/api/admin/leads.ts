import type { APIRoute } from 'astro';
import { verifyAdminSession } from '@/lib/auth';
import { getSupabaseClient, mockResumeRequests } from '@/lib/supabase';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const session = verifyAdminSession(request);
  if (!session.authenticated) {
    return new Response(
      JSON.stringify({ success: false, error: 'Unauthorized.' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('resume_requests')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (!error && data) {
        return new Response(
          JSON.stringify({ success: true, leads: data }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Fallback to in-memory mock leads
    return new Response(
      JSON.stringify({ success: true, leads: [...mockResumeRequests].reverse() }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message || 'Failed to fetch leads.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

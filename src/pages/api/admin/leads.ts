import type { APIRoute } from 'astro';
import { verifyAdminSession } from '@/lib/auth';
import { getSupabaseClient, readLocalLeads, mockResumeRequests } from '@/lib/supabase';

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
    let cloudLeads: any[] = [];
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('resume_requests')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);

        if (!error && data && data.length > 0) {
          cloudLeads = data;
        }
      } catch (err) {
        console.warn('[Admin Leads] Supabase query error:', err);
      }
    }

    if (cloudLeads.length > 0) {
      return new Response(
        JSON.stringify({ success: true, leads: cloudLeads, source: 'supabase' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Fallback to persistent local JSON and memory store
    const localLeads = readLocalLeads();
    const leadsList = localLeads.length > 0 ? localLeads : [...mockResumeRequests];

    return new Response(
      JSON.stringify({ success: true, leads: [...leadsList].reverse(), source: 'local' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message || 'Failed to fetch leads.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

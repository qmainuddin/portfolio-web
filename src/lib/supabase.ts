import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';

export interface ResumeRequestRecord {
  id?: string;
  name?: string | null;
  email: string;
  phone?: string | null;
  intent_raw: string;
  intent_category: 'Recruiter' | 'Client' | 'Engineering Peer' | 'Spam';
  intent_score: number;
  intent_summary?: string;
  user_agent?: string;
  ip_hash?: string;
  status?: 'pending' | 'sent' | 'failed' | 'flagged';
  created_at?: string;
}

// In-memory mock store for test and offline dev mode
export const mockResumeRequests: ResumeRequestRecord[] = [];

let supabaseClientInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const supabaseUrl = process.env.SUPABASE_URL;
  // Modern Supabase keys: SUPABASE_SECRET_KEY (Secret API Key), SUPABASE_PUBLISHABLE_KEY / SUPABASE_PUBLISHER_KEY (Publishable API Key)
  // Backwards-compatible legacy fallbacks: SUPABASE_SERVICE_ROLE_KEY / SUPABASE_ANON_KEY
  const supabaseKey =
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_PUBLISHER_KEY ||
    process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project-id')) {
    return null;
  }

  if (!supabaseClientInstance) {
    supabaseClientInstance = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });
  }

  return supabaseClientInstance;
}

/**
 * Persists a new resume request into Supabase or fallback mock storage.
 */
export async function saveResumeRequest(
  record: ResumeRequestRecord
): Promise<{ success: boolean; id: string; error?: string }> {
  const client = getSupabaseClient();

  if (!client) {
    // Graceful fallback for local development or testing
    const fallbackId = `mock-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const savedRecord: ResumeRequestRecord = {
      ...record,
      id: fallbackId,
      created_at: new Date().toISOString(),
      status: record.status || 'sent',
    };
    mockResumeRequests.push(savedRecord);
    return { success: true, id: fallbackId };
  }

  try {
    const payload: Record<string, any> = {
      email: record.email,
      phone: record.phone || null,
      intent_raw: record.intent_raw,
      intent_category: record.intent_category,
      intent_score: record.intent_score,
      intent_summary: record.intent_summary || null,
      user_agent: record.user_agent || null,
      ip_hash: record.ip_hash || null,
      status: record.status || 'sent',
    };

    if (record.name) {
      payload.name = record.name;
    }

    let insertRes = await client.from('resume_requests').insert([payload]).select('id').single();

    // Fallback if column 'name' does not exist in user's Supabase schema yet
    if (insertRes.error && insertRes.error.message.includes('name')) {
      delete payload.name;
      insertRes = await client.from('resume_requests').insert([payload]).select('id').single();
    }

    if (insertRes.error) {
      console.error('[Supabase Error] Failed to insert resume request:', insertRes.error.message);
      return { success: false, id: '', error: insertRes.error.message };
    }

    return { success: true, id: insertRes.data?.id || 'saved' };
  } catch (err: any) {
    console.error('[Supabase Exception]', err);
    return { success: false, id: '', error: err.message || 'Database error' };
  }
}

/**
 * Retrieves the resume PDF binary buffer.
 * Attempts Supabase Storage first, then falls back to local asset.
 */
export async function getResumePdfBuffer(): Promise<{ buffer: Buffer; filename: string }> {
  const bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'resumes';
  const filePath = process.env.SUPABASE_RESUME_FILE_PATH || 'mainuddin-talukdar-resume.pdf';
  const client = getSupabaseClient();

  if (client) {
    try {
      const { data, error } = await client.storage.from(bucketName).download(filePath);
      if (!error && data) {
        const arrayBuffer = await data.arrayBuffer();
        return {
          buffer: Buffer.from(arrayBuffer),
          filename: path.basename(filePath),
        };
      }
      if (error) {
        console.warn(`[Supabase Storage] File download failed (${error.message}), using local fallback.`);
      }
    } catch (err) {
      console.warn('[Supabase Storage] Exception while downloading resume, using local fallback:', err);
    }
  }

  // Local fallback resume
  const localOfficialPath = path.resolve(process.cwd(), 'public/assets/Mainuddin_Talukdar_Resume.pdf');
  if (fs.existsSync(localOfficialPath)) {
    return {
      buffer: fs.readFileSync(localOfficialPath),
      filename: 'Mainuddin-Talukdar-Resume.pdf',
    };
  }

  const localSamplePath = path.resolve(process.cwd(), 'public/assets/resume-sample.pdf');
  if (fs.existsSync(localSamplePath)) {
    return {
      buffer: fs.readFileSync(localSamplePath),
      filename: 'Mainuddin-Talukdar-Resume.pdf',
    };
  }

  // Minimal buffer in case file does not exist
  return {
    buffer: Buffer.from('%PDF-1.4 Minimal Resume Fallback'),
    filename: 'Mainuddin-Talukdar-Resume.pdf',
  };
}

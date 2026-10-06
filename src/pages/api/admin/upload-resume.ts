import type { APIRoute } from 'astro';
import { verifyAdminSession } from '@/lib/auth';
import { getSupabaseClient } from '@/lib/supabase';
import fs from 'node:fs';
import path from 'node:path';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    // 1. Authenticate admin request
    const session = verifyAdminSession(request);
    if (!session.authenticated) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized. Please log in first.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. Parse uploaded file from JSON or FormData
    let buffer: Buffer | null = null;
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const json = await request.json().catch(() => ({}));
      if (json.fileBase64) {
        // Strip data:application/pdf;base64, prefix if present
        const base64Data = json.fileBase64.replace(/^data:[^;]+;base64,/, '');
        buffer = Buffer.from(base64Data, 'base64');
      }
    } else {
      const formData = await request.formData().catch(() => null);
      if (formData) {
        const file = formData.get('file');
        if (file && file instanceof Blob) {
          const arrayBuffer = await file.arrayBuffer();
          buffer = Buffer.from(arrayBuffer);
        }
      }
    }

    if (!buffer || buffer.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'No PDF file provided.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 3. Validate PDF magic bytes (%PDF-)
    if (buffer.length < 5 || !buffer.subarray(0, 5).toString('ascii').startsWith('%PDF-')) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid file format. The file must be a valid PDF document.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Max file size: 20MB
    if (buffer.length > 20 * 1024 * 1024) {
      return new Response(
        JSON.stringify({ success: false, error: 'File size exceeds maximum limit of 20MB.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 4. Overwrite local asset files in public/assets/
    const publicAssetsDir = path.resolve(process.cwd(), 'public/assets');
    if (!fs.existsSync(publicAssetsDir)) {
      fs.mkdirSync(publicAssetsDir, { recursive: true });
    }

    const primaryResumePath = path.join(publicAssetsDir, 'Mainuddin_Talukdar_Resume.pdf');
    const sampleResumePath = path.join(publicAssetsDir, 'resume-sample.pdf');

    fs.writeFileSync(primaryResumePath, buffer);
    fs.writeFileSync(sampleResumePath, buffer);

    // 5. If running in production / dist directory, also copy to dist/client/assets so static file handler serves it immediately
    const distAssetsDir = path.resolve(process.cwd(), 'dist/client/assets');
    if (fs.existsSync(distAssetsDir)) {
      try {
        fs.writeFileSync(path.join(distAssetsDir, 'Mainuddin_Talukdar_Resume.pdf'), buffer);
        fs.writeFileSync(path.join(distAssetsDir, 'resume-sample.pdf'), buffer);
      } catch (err) {
        console.warn('[Admin Upload] Could not write to dist/client/assets directory:', err);
      }
    }

    // 6. If Supabase Storage is configured, upload & overwrite (upsert) in cloud storage
    let cloudSynced = false;
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'resumes';
        const remoteFilePath = process.env.SUPABASE_RESUME_FILE_PATH || 'mainuddin-talukdar-resume.pdf';

        const { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(remoteFilePath, buffer, {
            contentType: 'application/pdf',
            upsert: true,
          });

        if (!uploadError) {
          cloudSynced = true;
          console.info(`[Supabase Storage] Successfully synced uploaded resume to ${bucketName}/${remoteFilePath}`);
        } else {
          console.warn('[Supabase Storage] Upload error:', uploadError.message);
        }
      } catch (err) {
        console.warn('[Supabase Storage] Exception while syncing uploaded resume:', err);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Latest resume uploaded and published successfully!',
        data: {
          filename: 'Mainuddin_Talukdar_Resume.pdf',
          sizeBytes: buffer.length,
          sizeFormatted: `${(buffer.length / 1024).toFixed(1)} KB`,
          cloudSynced,
          updatedAt: new Date().toISOString(),
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('[Admin Upload Exception]', err);
    return new Response(
      JSON.stringify({ success: false, error: err.message || 'Failed to process resume upload.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

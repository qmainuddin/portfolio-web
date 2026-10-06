import type { APIRoute } from 'astro';
import { verifyAdminSession } from '@/lib/auth';
import fs from 'node:fs';
import path from 'node:path';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const session = verifyAdminSession(request);

  if (!session.authenticated) {
    return new Response(
      JSON.stringify({ authenticated: false }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Get active resume stats
  let resumeStats = {
    exists: false,
    filename: 'Mainuddin_Talukdar_Resume.pdf',
    sizeBytes: 0,
    sizeFormatted: '0 KB',
    lastModified: '',
  };

  const resumePath = path.resolve(process.cwd(), 'public/assets/Mainuddin_Talukdar_Resume.pdf');
  if (fs.existsSync(resumePath)) {
    const stat = fs.statSync(resumePath);
    resumeStats = {
      exists: true,
      filename: 'Mainuddin_Talukdar_Resume.pdf',
      sizeBytes: stat.size,
      sizeFormatted: `${(stat.size / 1024).toFixed(1)} KB`,
      lastModified: stat.mtime.toISOString(),
    };
  }

  return new Response(
    JSON.stringify({
      authenticated: true,
      user: { username: session.username },
      resume: resumeStats,
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};

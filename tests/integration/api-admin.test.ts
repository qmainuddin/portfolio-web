import { describe, it, expect } from 'vitest';
import { POST as loginPost } from '@/pages/api/admin/login';
import { POST as logoutPost } from '@/pages/api/admin/logout';
import { GET as sessionGet } from '@/pages/api/admin/session';
import { POST as uploadResumePost } from '@/pages/api/admin/upload-resume';
import { createSessionToken } from '@/lib/auth';

describe('Admin API Endpoints Integration', () => {
  it('authenticates valid credentials via POST /api/admin/login', async () => {
    const mockRequest = new Request('http://localhost:4321/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'qmain', password: 'D@ng3R-NZ' }),
    });

    const response = await loginPost({ request: mockRequest } as any);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.success).toBe(true);
    expect(json.user.username).toBe('qmain');
    expect(response.headers.get('Set-Cookie')).toContain('admin_session=');
  });

  it('rejects invalid credentials via POST /api/admin/login with 401', async () => {
    const mockRequest = new Request('http://localhost:4321/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'qmain', password: 'IncorrectPassword' }),
    });

    const response = await loginPost({ request: mockRequest } as any);
    expect(response.status).toBe(401);

    const json = await response.json();
    expect(json.success).toBe(false);
  });

  it('rejects unauthenticated access to GET /api/admin/session', async () => {
    const mockRequest = new Request('http://localhost:4321/api/admin/session');
    const response = await sessionGet({ request: mockRequest } as any);
    expect(response.status).toBe(401);
  });

  it('returns user and resume info on GET /api/admin/session when authenticated', async () => {
    const token = createSessionToken('qmain');
    const mockRequest = new Request('http://localhost:4321/api/admin/session', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const response = await sessionGet({ request: mockRequest } as any);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.authenticated).toBe(true);
    expect(json.user.username).toBe('qmain');
    expect(json.resume).toBeDefined();
  });

  it('rejects upload without authentication via POST /api/admin/upload-resume', async () => {
    const mockRequest = new Request('http://localhost:4321/api/admin/upload-resume', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileBase64: Buffer.from('%PDF-1.4 sample').toString('base64') }),
    });

    const response = await uploadResumePost({ request: mockRequest } as any);
    expect(response.status).toBe(401);
  });

  it('rejects upload of non-PDF file via POST /api/admin/upload-resume', async () => {
    const token = createSessionToken('qmain');
    const mockRequest = new Request('http://localhost:4321/api/admin/upload-resume', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ fileBase64: Buffer.from('plain text not a pdf').toString('base64') }),
    });

    const response = await uploadResumePost({ request: mockRequest } as any);
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.error).toContain('PDF');
  });

  it('successfully uploads and replaces resume via POST /api/admin/upload-resume', async () => {
    const token = createSessionToken('qmain');
    const validPdfContent = '%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF';
    const base64Pdf = Buffer.from(validPdfContent).toString('base64');

    const mockRequest = new Request('http://localhost:4321/api/admin/upload-resume', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ fileBase64: base64Pdf, filename: 'Mainuddin_Talukdar_Resume.pdf' }),
    });

    const response = await uploadResumePost({ request: mockRequest } as any);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.success).toBe(true);
    expect(json.message).toContain('uploaded and published');
    expect(json.data.filename).toBe('Mainuddin_Talukdar_Resume.pdf');
  });

  it('logs out and clears session via POST /api/admin/logout', async () => {
    const mockRequest = new Request('http://localhost:4321/api/admin/logout', {
      method: 'POST',
    });

    const response = await logoutPost({ request: mockRequest } as any);
    expect(response.status).toBe(200);
    expect(response.headers.get('Set-Cookie')).toContain('Max-Age=0');
  });
});

import { describe, it, expect, beforeEach } from 'vitest';
import { POST } from '@/pages/api/request-resume';
import { mockResumeRequests } from '@/lib/supabase';

describe('API Integration: POST /api/request-resume', () => {
  beforeEach(() => {
    mockResumeRequests.length = 0;
  });

  it('processes a valid resume request and returns 200 with metadata', async () => {
    const payload = {
      name: 'Jessica Pearson',
      email: 'recruiter@company.com',
      phone: '+64 21 555 1234',
      intent: 'We are hiring a Lead AI Architect for our platform and need to review your credentials.',
    };

    const mockRequest = new Request('http://localhost:4321/api/request-resume', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Vitest-Test-Runner',
        'X-Forwarded-For': '192.168.1.10',
      },
      body: JSON.stringify(payload),
    });

    const response = await POST({ request: mockRequest } as any);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.success).toBe(true);
    expect(json.data.category).toBe('Recruiter');
    expect(json.data.downloadUrl).toBeDefined();

    // Verify record was stored in mock store
    expect(mockResumeRequests.length).toBe(1);
    expect(mockResumeRequests[0].name).toBe('Jessica Pearson');
    expect(mockResumeRequests[0].email).toBe('recruiter@company.com');
    expect(mockResumeRequests[0].intent_category).toBe('Recruiter');
    expect(mockResumeRequests[0].user_agent).toBe('Vitest-Test-Runner');
  });

  it('returns 400 Bad Request when mandatory email is omitted', async () => {
    const invalidPayload = {
      phone: '+64 21 000 0000',
      intent: 'Checking out your resume.',
    };

    const mockRequest = new Request('http://localhost:4321/api/request-resume', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidPayload),
    });

    const response = await POST({ request: mockRequest } as any);
    expect(response.status).toBe(400);

    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json.details).toBeDefined();
    expect(json.details.some((d: any) => d.field === 'email')).toBe(true);
  });

  it('flags spam submissions and marks status as flagged without sending email', async () => {
    const spamPayload = {
      name: 'Crypto Spammer',
      email: 'spammer@promo.com',
      intent: 'Buy crypto and backlinks at discount prices!',
    };

    const mockRequest = new Request('http://localhost:4321/api/request-resume', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(spamPayload),
    });

    const response = await POST({ request: mockRequest } as any);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.success).toBe(true);
    expect(json.data.category).toBe('Spam');
    expect(json.data.emailDelivered).toBe(false);

    expect(mockResumeRequests.length).toBe(1);
    expect(mockResumeRequests[0].status).toBe('flagged');
  });

  it('handles multipart/form-data (FormData) submission successfully', async () => {
    const formData = new FormData();
    formData.append('name', 'Marcus Vance');
    formData.append('email', 'marcus@vancemedia.co');
    formData.append('intent', 'Looking for architectural advice on building an agentic platform.');

    const mockRequest = new Request('http://localhost:4321/api/request-resume', {
      method: 'POST',
      headers: {
        'User-Agent': 'Vitest-Browser-Agent',
        'X-Real-IP': '203.0.113.195',
      },
      body: formData,
    });

    const response = await POST({ request: mockRequest } as any);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.success).toBe(true);
    expect(json.data.category).toBeDefined();

    expect(mockResumeRequests.length).toBe(1);
    expect(mockResumeRequests[0].name).toBe('Marcus Vance');
    expect(mockResumeRequests[0].email).toBe('marcus@vancemedia.co');
    expect(mockResumeRequests[0].ip_hash).toBeDefined();
  });

  it('returns 400 Bad Request when phone number format is invalid', async () => {
    const payload = {
      name: 'Test User',
      email: 'test@example.com',
      phone: 'not-a-phone-number-12345-abcde',
      intent: 'Inquiring about full stack development services.',
    };

    const mockRequest = new Request('http://localhost:4321/api/request-resume', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const response = await POST({ request: mockRequest } as any);
    expect(response.status).toBe(400);

    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json.details.some((d: any) => d.field === 'phone')).toBe(true);
  });

  it('returns 400 Bad Request when intent explanation is too short', async () => {
    const payload = {
      name: 'Test User',
      email: 'test@example.com',
      intent: 'hi',
    };

    const mockRequest = new Request('http://localhost:4321/api/request-resume', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const response = await POST({ request: mockRequest } as any);
    expect(response.status).toBe(400);

    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json.details.some((d: any) => d.field === 'intent')).toBe(true);
  });
});

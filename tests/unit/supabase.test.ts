import { describe, it, expect, beforeEach } from 'vitest';
import {
  saveResumeRequest,
  getResumePdfBuffer,
  mockResumeRequests,
  type ResumeRequestRecord,
} from '@/lib/supabase';

describe('Supabase Database & Storage Operations', () => {
  beforeEach(() => {
    mockResumeRequests.length = 0;
  });

  it('saves a resume request in mock storage when live Supabase is unconfigured', async () => {
    const record: ResumeRequestRecord = {
      name: 'David Clark',
      email: 'david@clarkconsulting.com',
      phone: '+64 21 987 6543',
      intent_raw: 'Looking to hire for a freelance architecture consulting engagement.',
      intent_category: 'Client',
      intent_score: 0.9,
      intent_summary: 'Verified client consulting request',
      user_agent: 'Vitest-Agent/1.0',
      ip_hash: 'abc123hash',
      status: 'sent',
    };

    const result = await saveResumeRequest(record);
    expect(result.success).toBe(true);
    expect(result.id).toContain('mock-');

    expect(mockResumeRequests.length).toBe(1);
    const saved = mockResumeRequests[0];
    expect(saved.name).toBe('David Clark');
    expect(saved.email).toBe('david@clarkconsulting.com');
    expect(saved.intent_category).toBe('Client');
    expect(saved.status).toBe('sent');
    expect(saved.created_at).toBeDefined();
  });

  it('retrieves the resume PDF binary buffer and sets correct filename', async () => {
    const asset = await getResumePdfBuffer();

    expect(asset).toBeDefined();
    expect(asset.filename).toBe('Mainuddin-Talukdar-Resume.pdf');
    expect(Buffer.isBuffer(asset.buffer)).toBe(true);
    expect(asset.buffer.length).toBeGreaterThan(0);
  });
});

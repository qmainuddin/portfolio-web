import { describe, it, expect } from 'vitest';
import { generateResumeEmailHtml, sendResumeEmail } from '@/lib/email';

describe('Email Template Generator & Delivery', () => {
  it('generates HTML email with customized recruiter messaging', () => {
    const html = generateResumeEmailHtml('Recruiter');

    expect(html).toContain('Mainuddin Talukdar');
    expect(html).toContain('Inquiry Verified: Recruiter');
    expect(html).toContain('career and engineering leadership');
    expect(html).toContain('mainuddintalukdar.cloud');
  });

  it('generates HTML email with customized client messaging', () => {
    const html = generateResumeEmailHtml('Client');

    expect(html).toContain('Inquiry Verified: Client');
    expect(html).toContain('technical consulting and architectural delivery');
  });

  it('generates HTML email for engineering peers', () => {
    const html = generateResumeEmailHtml('Engineering Peer');

    expect(html).toContain('Inquiry Verified: Engineering Peer');
    expect(html).toContain('Agentic AI systems');
  });

  it('simulates sendResumeEmail successfully in mock mode without live credentials', async () => {
    const result = await sendResumeEmail({
      toEmail: 'test@example.com',
      intentCategory: 'Recruiter',
      pdfBuffer: Buffer.from('%PDF-1.4 sample'),
      pdfFilename: 'sample-resume.pdf',
    });

    expect(result.success).toBe(true);
    expect(result.messageId).toBeDefined();
  });
});

import { describe, it, expect } from 'vitest';
import { generateResumeEmailHtml, sendResumeEmail } from '@/lib/email';

describe('Email Template Generator & Delivery', () => {
  it('generates HTML email with customized recruiter messaging and personalized name', () => {
    const html = generateResumeEmailHtml('Recruiter', 'Sarah Jenkins');

    expect(html).toContain('Dear Sarah Jenkins,');
    expect(html).toContain('Mainuddin Talukdar');
    expect(html).toContain('Inquiry Verified: Recruiter');
    expect(html).toContain('career and engineering');
    expect(html).toContain('0221218409');
    expect(html).toContain('mainuddin.talukdar.global@gmail.com');
    expect(html).toContain('https://www.linkedin.com/in/mainuddintalukdar/');
    expect(html).toContain('https://github.com/qmainuddin');
    expect(html).toContain('mainuddintalukdar.cloud');
  });

  it('generates HTML email with customized client messaging', () => {
    const html = generateResumeEmailHtml('Client', 'Alex Vance');

    expect(html).toContain('Dear Alex Vance,');
    expect(html).toContain('Inquiry Verified: Client');
    expect(html).toContain('technical consulting and architectural delivery');
  });

  it('generates HTML email for engineering peers', () => {
    const html = generateResumeEmailHtml('Engineering Peer');

    expect(html).toContain('Hello,');
    expect(html).toContain('Inquiry Verified: Engineering Peer');
    expect(html).toContain('Agentic AI systems');
  });

  it('simulates sendResumeEmail successfully in mock mode without live credentials', async () => {
    const result = await sendResumeEmail({
      toName: 'Sarah Jenkins',
      toEmail: 'test@example.com',
      intentCategory: 'Recruiter',
      pdfBuffer: Buffer.from('%PDF-1.4 sample'),
      pdfFilename: 'sample-resume.pdf',
    });

    expect(result.success).toBe(true);
    expect(result.messageId).toBeDefined();
  });
});

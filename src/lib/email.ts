import { Resend } from 'resend';

export interface SendResumeEmailParams {
  toEmail: string;
  intentCategory: string;
  pdfBuffer: Buffer;
  pdfFilename: string;
}

export function generateResumeEmailHtml(intentCategory: string): string {
  const categoryGreetingMap: Record<string, string> = {
    Recruiter: "Thank you for reaching out regarding career and engineering leadership opportunities.",
    Client: "Thank you for your interest in technical consulting and architectural delivery.",
    'Engineering Peer': "Great to connect! I am always excited to discuss Agentic AI systems and distributed engineering.",
    Spam: "Thank you for visiting my portfolio.",
  };

  const introText = categoryGreetingMap[intentCategory] || "Thank you for requesting my resume.";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mainuddin Talukdar - Resume</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #07090e;
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #0b0f17;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    }
    .header {
      background: linear-gradient(135deg, #1e1b4b 0%, #0b0f17 100%);
      padding: 32px 32px 24px 32px;
      border-bottom: 1px solid rgba(99, 102, 241, 0.2);
    }
    .brand-title {
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -0.5px;
      color: #ffffff;
      margin: 0 0 6px 0;
    }
    .brand-sub {
      font-size: 13px;
      color: #818cf8;
      font-family: monospace;
      margin: 0;
    }
    .content {
      padding: 32px;
      line-height: 1.6;
      color: #94a3b8;
      font-size: 15px;
    }
    .content strong {
      color: #f8fafc;
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      font-size: 11px;
      font-weight: 600;
      border-radius: 9999px;
      background: rgba(99, 102, 241, 0.15);
      color: #818cf8;
      border: 1px solid rgba(99, 102, 241, 0.3);
      margin-bottom: 16px;
    }
    .highlight-card {
      background: #111726;
      border-left: 3px solid #6366f1;
      border-radius: 6px;
      padding: 16px;
      margin: 20px 0;
      color: #cbd5e1;
      font-size: 14px;
    }
    .button {
      display: inline-block;
      background: #4f46e5;
      color: #ffffff !important;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      padding: 12px 24px;
      border-radius: 8px;
      margin: 12px 0 20px 0;
    }
    .footer {
      padding: 24px 32px;
      background-color: #07090e;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      font-size: 12px;
      color: #64748b;
      text-align: center;
    }
    .footer a {
      color: #818cf8;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="brand-title">Mainuddin Talukdar</h1>
      <p class="brand-sub">Senior Full-Stack Architect & AI Systems Specialist</p>
    </div>
    <div class="content">
      <span class="badge">Inquiry Verified: ${intentCategory}</span>
      <p>Hello,</p>
      <p>${introText}</p>
      <p>As requested, my latest resume is attached directly to this email in PDF format.</p>
      <div class="highlight-card">
        <strong>Key Engineering Highlights:</strong>
        <ul style="margin: 8px 0 0 0; padding-left: 20px;">
          <li>Deterministic & observable Agentic AI workflow engineering</li>
          <li>High-throughput cloud architecture (AWS, GCP, Supabase, Docker)</li>
          <li>Performance-first frontend & SSR engineering (Astro, React, TypeScript)</li>
        </ul>
      </div>
      <p>Feel free to reply directly to this email to schedule a technical discussion or exploratory call.</p>
      <a href="https://mainuddintalukdar.cloud" class="button">Visit Online Portfolio &rarr;</a>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Mainuddin Talukdar &bull; <a href="https://mainuddintalukdar.cloud">mainuddintalukdar.cloud</a></p>
      <p>Sent automatically via the Portfolio & Lead Capture Platform.</p>
    </div>
  </div>
</body>
</html>
`;
}

/**
 * Dispatches the resume email to the recipient via Resend with fallback logger.
 */
export async function sendResumeEmail(
  params: SendResumeEmailParams
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'Mainuddin Talukdar <onboarding@resend.dev>';

  if (!apiKey || apiKey.startsWith('re_dummy') || apiKey.includes('123456789')) {
    console.info(
      `[Email Mock Mode] Resume email simulated for ${params.toEmail} (Category: ${params.intentCategory}, Attachment: ${params.pdfFilename}, Size: ${params.pdfBuffer.length} bytes)`
    );
    return { success: true, messageId: `mock-msg-${Date.now()}` };
  }

  try {
    const resend = new Resend(apiKey);
    const html = generateResumeEmailHtml(params.intentCategory);

    const data = await resend.emails.send({
      from: fromEmail,
      to: [params.toEmail],
      subject: 'Mainuddin Talukdar — Resume & Technical Overview',
      html,
      attachments: [
        {
          filename: params.pdfFilename || 'Mainuddin-Talukdar-Resume.pdf',
          content: params.pdfBuffer,
        },
      ],
    });

    if (data.error) {
      console.error('[Resend Error]', data.error);
      return { success: false, error: data.error.message };
    }

    return { success: true, messageId: data.data?.id };
  } catch (err: any) {
    console.error('[Resend Exception]', err);
    return { success: false, error: err.message || 'Email delivery failed' };
  }
}

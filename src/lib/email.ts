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
      background-color: #09130e;
      color: #f0f7f3;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #0e1d16;
      border: 1px solid rgba(82, 183, 136, 0.25);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
    }
    .header {
      background: linear-gradient(135deg, #1e382b 0%, #0e1d16 100%);
      padding: 32px 32px 24px 32px;
      border-bottom: 1px solid rgba(82, 183, 136, 0.2);
    }
    .brand-title {
      font-size: 22px;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #ffffff;
      margin: 0 0 6px 0;
    }
    .brand-sub {
      font-size: 13px;
      color: #95d5b2;
      font-family: monospace;
      margin: 0;
    }
    .content {
      padding: 32px;
      line-height: 1.6;
      color: #c3d9cc;
      font-size: 15px;
    }
    .content strong {
      color: #ffffff;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      font-size: 11px;
      font-weight: 700;
      border-radius: 9999px;
      background: rgba(82, 183, 136, 0.15);
      color: #95d5b2;
      border: 1px solid rgba(82, 183, 136, 0.35);
      margin-bottom: 16px;
      font-family: monospace;
    }
    .highlight-card {
      background: #13281f;
      border-left: 3px solid #52b788;
      border-radius: 8px;
      padding: 16px;
      margin: 20px 0;
      color: #d8e8dc;
      font-size: 14px;
    }
    .button {
      display: inline-block;
      background: #2d6a4f;
      color: #ffffff !important;
      text-decoration: none;
      font-weight: 700;
      font-size: 14px;
      padding: 12px 24px;
      border-radius: 9999px;
      margin: 12px 0 20px 0;
    }
    .footer {
      padding: 24px 32px;
      background-color: #09130e;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      font-size: 12px;
      color: #728c7d;
      text-align: center;
    }
    .footer a {
      color: #95d5b2;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="brand-title">Mainuddin Talukdar</h1>
      <p class="brand-sub">AI Engineer &bull; Full-Stack Architect &bull; Christchurch, NZ</p>
    </div>
    <div class="content">
      <span class="badge">Inquiry Verified: ${intentCategory}</span>
      <p>Hello,</p>
      <p>${introText}</p>
      <p>As requested, my latest official resume is attached directly to this email in PDF format.</p>
      <div class="highlight-card">
        <strong>Key Engineering Highlights:</strong>
        <ul style="margin: 8px 0 0 0; padding-left: 20px;">
          <li>9 years production engineering: Java, Spring Boot, microservices, AWS & Redis</li>
          <li>Applied AI engineering: Deterministic agent architectures, tool execution & LLMs with Python</li>
          <li>Full-stack delivery: TypeScript, Next.js, React Native, Astro SSR & Supabase</li>
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

export function generateAdminNotificationHtml(params: {
  email: string;
  phone?: string;
  intent: string;
  category: string;
  score: number;
  summary: string;
}): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>New Resume Lead Captured</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: #09130e; color: #f0f7f3; padding: 20px; }
    .card { max-width: 600px; margin: 0 auto; background: #0e1d16; border: 1px solid rgba(82,183,136,0.3); border-radius: 12px; padding: 24px; }
    h2 { color: #52b788; margin-top: 0; }
    .field { margin-bottom: 12px; }
    .label { font-weight: bold; color: #95d5b2; font-size: 12px; text-transform: uppercase; }
    .val { background: #13281f; padding: 8px 12px; border-radius: 6px; font-size: 14px; margin-top: 4px; word-break: break-word; }
  </style>
</head>
<body>
  <div class="card">
    <h2>🎯 New Lead Captured on Portfolio</h2>
    <div class="field"><div class="label">Requester Email:</div><div class="val">${params.email}</div></div>
    ${params.phone ? `<div class="field"><div class="label">Phone:</div><div class="val">${params.phone}</div></div>` : ''}
    <div class="field"><div class="label">AI Classified Category:</div><div class="val"><strong>${params.category}</strong> (Confidence: ${(params.score * 100).toFixed(0)}%)</div></div>
    <div class="field"><div class="label">AI Summary:</div><div class="val">${params.summary}</div></div>
    <div class="field"><div class="label">Raw Intent Message:</div><div class="val">${params.intent}</div></div>
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

    const replyTo = process.env.RESEND_NOTIFY_EMAIL || process.env.RESEND_REPLY_TO;

    const data = await resend.emails.send({
      from: fromEmail,
      to: [params.toEmail],
      replyTo: replyTo ? [replyTo] : undefined,
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

/**
 * Sends an instant lead alert to your personal notification inbox.
 */
export async function sendLeadNotificationEmail(params: {
  email: string;
  phone?: string;
  intent: string;
  category: string;
  score: number;
  summary: string;
}): Promise<{ success: boolean; messageId?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.RESEND_NOTIFY_EMAIL;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'Mainuddin Talukdar <onboarding@resend.dev>';

  if (!apiKey || !notifyEmail || apiKey.startsWith('re_dummy')) {
    console.info(`[Email Mock Mode] Lead notification simulated for admin (${params.email})`);
    return { success: true, messageId: `mock-notify-${Date.now()}` };
  }

  try {
    const resend = new Resend(apiKey);
    const html = generateAdminNotificationHtml(params);

    const data = await resend.emails.send({
      from: fromEmail,
      to: [notifyEmail],
      subject: `🎯 New Lead Alert: ${params.category} (${params.email})`,
      html,
    });

    return { success: !data.error, messageId: data.data?.id };
  } catch (err) {
    console.error('[Resend Admin Notify Exception]', err);
    return { success: false };
  }
}

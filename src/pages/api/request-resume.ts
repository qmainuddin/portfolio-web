import type { APIRoute } from 'astro';
import { z } from 'zod';
import crypto from 'node:crypto';
import { analyzeIntent } from '@/lib/ai-intent';
import { saveResumeRequest, getResumePdfBuffer } from '@/lib/supabase';
import { sendResumeEmail } from '@/lib/email';

export const prerender = false;

export const resumeRequestSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address'),
  phone: z
    .string()
    .trim()
    .optional()
    .refine(
      val => !val || /^(\+?\d{1,4}[-.\s]?)?(\(?\d{1,4}\)?[-.\s]?)?[\d\s.-]{5,15}$/.test(val),
      'Please enter a valid phone number or leave blank'
    ),
  intent: z
    .string()
    .trim()
    .min(5, 'Please provide at least a brief explanation (minimum 5 characters) of why you are requesting the resume')
    .max(1000, 'Intent explanation must be under 1000 characters'),
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const contentType = request.headers.get('content-type') || '';
    let body: any;

    if (contentType.includes('application/json')) {
      body = await request.json();
    } else {
      const formData = await request.formData();
      body = {
        email: formData.get('email'),
        phone: formData.get('phone') || undefined,
        intent: formData.get('intent'),
      };
    }

    // 1. Validate payload
    const validationResult = resumeRequestSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return new Response(
        JSON.stringify({
          success: false,
          error: 'Validation failed. Please verify the submitted fields.',
          details: errors,
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const { email, phone, intent } = validationResult.data;

    // 2. Client Metadata & IP Hashing (for privacy-compliant rate tracking)
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const forwardedFor = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    const ipHash = crypto.createHash('sha256').update(forwardedFor).digest('hex').substring(0, 16);

    // 3. AI Intent Classification
    const intentAnalysis = await analyzeIntent(intent);

    // 4. Persist to Supabase / Storage
    const dbResult = await saveResumeRequest({
      email,
      phone: phone || null,
      intent_raw: intent,
      intent_category: intentAnalysis.category,
      intent_score: intentAnalysis.score,
      intent_summary: intentAnalysis.summary,
      user_agent: userAgent,
      ip_hash: ipHash,
      status: intentAnalysis.category === 'Spam' ? 'flagged' : 'sent',
    });

    // 5. Fetch Resume Asset Buffer
    const resumeAsset = await getResumePdfBuffer();

    // 6. Send transactional email (skip sending email if flagged as blatant spam)
    let emailSent = false;
    if (intentAnalysis.category !== 'Spam') {
      const emailResult = await sendResumeEmail({
        toEmail: email,
        intentCategory: intentAnalysis.category,
        pdfBuffer: resumeAsset.buffer,
        pdfFilename: resumeAsset.filename,
      });
      emailSent = emailResult.success;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Your resume request has been received! We have sent a copy to your email.',
        data: {
          requestId: dbResult.id,
          category: intentAnalysis.category,
          downloadUrl: '/assets/resume-sample.pdf',
          emailDelivered: emailSent,
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err: any) {
    console.error('[API Exception /api/request-resume]', err);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'An unexpected error occurred while processing your request. Please try again.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

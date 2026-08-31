import { describe, it, expect } from 'vitest';
import { resumeRequestSchema } from '@/pages/api/request-resume';

describe('Resume Request Schema Validation', () => {
  it('validates a valid full payload with name, email, phone, and intent', () => {
    const validData = {
      name: 'Alex Thompson',
      email: 'recruiter@techcorp.io',
      phone: '+64 21 123 4567',
      intent: 'We have an open Principal AI Architect role and would love to review your background.',
    };

    const result = resumeRequestSchema.safeParse(validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe('Alex Thompson');
      expect(result.data.email).toBe('recruiter@techcorp.io');
      expect(result.data.phone).toBe('+64 21 123 4567');
      expect(result.data.intent).toContain('Principal AI Architect');
    }
  });

  it('validates a valid payload without optional phone number', () => {
    const dataWithoutPhone = {
      name: 'Sarah Connor',
      email: 'client@startup.co',
      intent: 'Looking to hire an architect for building our MVP platform.',
    };

    const result = resumeRequestSchema.safeParse(dataWithoutPhone);
    expect(result.success).toBe(true);
  });

  it('rejects an empty name', () => {
    const emptyNameData = {
      name: '',
      email: 'alex@example.com',
      intent: 'Checking out your resume.',
    };

    const result = resumeRequestSchema.safeParse(emptyNameData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('name');
    }
  });

  it('rejects an invalid email format', () => {
    const invalidEmailData = {
      name: 'Alex Thompson',
      email: 'not-an-email',
      intent: 'Checking out your resume.',
    };

    const result = resumeRequestSchema.safeParse(invalidEmailData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('valid email');
    }
  });

  it('rejects an empty or too short intent explanation', () => {
    const shortIntentData = {
      name: 'Alex Thompson',
      email: 'alex@example.com',
      intent: 'hi',
    };

    const result = resumeRequestSchema.safeParse(shortIntentData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('minimum 5 characters');
    }
  });

  it('rejects an invalid telephone format when supplied', () => {
    const invalidPhoneData = {
      name: 'Alex Thompson',
      email: 'alex@example.com',
      phone: 'invalid-alpha-phone-number',
      intent: 'Interested in your full-stack engineering background.',
    };

    const result = resumeRequestSchema.safeParse(invalidPhoneData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('valid phone number');
    }
  });
});

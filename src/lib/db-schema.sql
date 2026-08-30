-- ==============================================================================
-- Portfolio & Lead Capture Platform - Supabase PostgreSQL Schema & Security
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create resume_requests table
CREATE TABLE IF NOT EXISTS public.resume_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  phone TEXT,
  intent_raw TEXT NOT NULL,
  intent_category TEXT NOT NULL CHECK (intent_category IN ('Recruiter', 'Client', 'Engineering Peer', 'Spam')),
  intent_score NUMERIC(3,2) NOT NULL DEFAULT 1.00,
  intent_summary TEXT,
  user_agent TEXT,
  ip_hash TEXT,
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('pending', 'sent', 'failed', 'flagged')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create Indexes for fast querying & lead segmentation
CREATE INDEX IF NOT EXISTS idx_resume_requests_email ON public.resume_requests (email);
CREATE INDEX IF NOT EXISTS idx_resume_requests_intent_category ON public.resume_requests (intent_category);
CREATE INDEX IF NOT EXISTS idx_resume_requests_created_at ON public.resume_requests (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resume_requests_ip_hash ON public.resume_requests (ip_hash);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.resume_requests ENABLE ROW LEVEL SECURITY;

-- 5. Policies:
-- Service role key has full access
CREATE POLICY "Service role full access on resume_requests"
  ON public.resume_requests
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Anonymous role can only INSERT new requests (cannot read or update others)
CREATE POLICY "Anon can insert resume_requests"
  ON public.resume_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 6. Storage Bucket Configuration (Run in Supabase SQL editor or Storage Dashboard)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false)
-- ON CONFLICT (id) DO NOTHING;

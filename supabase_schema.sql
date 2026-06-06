-- Supabase Schema for ReviewAI Owner Analytics
-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard → SQL Editor)

-- 1. Companies table
CREATE TABLE IF NOT EXISTS companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  plan TEXT DEFAULT 'starter',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  plan TEXT DEFAULT 'starter',
  status TEXT DEFAULT 'success',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast lookups by company
CREATE INDEX IF NOT EXISTS idx_payments_company_id ON payments(company_id);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at);

-- 3. Enable Row Level Security (RLS) — allow public read via anon key
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Allow anonymous reads (for the public analytics dashboard)
CREATE POLICY "Allow public read on companies"
  ON companies FOR SELECT
  USING (true);

CREATE POLICY "Allow public read on payments"
  ON payments FOR SELECT
  USING (true);

-- 4. Sample seed data (optional — remove after testing)
INSERT INTO companies (name, email, plan) VALUES
  ('Dev Caterers', 'dev@caterers.com', 'pro'),
  ('Smile Dental Clinic', 'info@smiledental.com', 'pro'),
  ('Delhi Crown Hotel', 'front@delhicrown.com', 'starter');

INSERT INTO payments (company_id, amount, plan, status, created_at) VALUES
  ((SELECT id FROM companies WHERE name = 'Dev Caterers'), 5999, 'pro', 'success', now() - interval '25 days'),
  ((SELECT id FROM companies WHERE name = 'Dev Caterers'), 5999, 'pro', 'success', now() - interval '5 days'),
  ((SELECT id FROM companies WHERE name = 'Smile Dental Clinic'), 5999, 'pro', 'success', now() - interval '10 days'),
  ((SELECT id FROM companies WHERE name = 'Delhi Crown Hotel'), 2999, 'starter', 'success', now() - interval '3 days');

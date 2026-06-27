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

DROP POLICY IF EXISTS "Allow public read on companies" ON companies;
CREATE POLICY "Allow public read on companies"
  ON companies FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow public read on payments" ON payments;
CREATE POLICY "Allow public read on payments"
  ON payments FOR SELECT
  USING (true);

-- 4. Sample seed data (optional — insert only if not present)
INSERT INTO companies (name, email, plan)
SELECT 'Dev Caterers', 'dev@caterers.com', 'pro'
WHERE NOT EXISTS (SELECT 1 FROM companies WHERE name = 'Dev Caterers');

INSERT INTO companies (name, email, plan)
SELECT 'Smile Dental Clinic', 'info@smiledental.com', 'pro'
WHERE NOT EXISTS (SELECT 1 FROM companies WHERE name = 'Smile Dental Clinic');

INSERT INTO companies (name, email, plan)
SELECT 'Delhi Crown Hotel', 'front@delhicrown.com', 'starter'
WHERE NOT EXISTS (SELECT 1 FROM companies WHERE name = 'Delhi Crown Hotel');

INSERT INTO payments (company_id, amount, plan, status, created_at)
SELECT (SELECT id FROM companies WHERE name = 'Dev Caterers' LIMIT 1), 5999, 'pro', 'success', now() - interval '25 days'
WHERE NOT EXISTS (SELECT 1 FROM payments WHERE company_id = (SELECT id FROM companies WHERE name = 'Dev Caterers' LIMIT 1) AND created_at <= now() - interval '24 days');

INSERT INTO payments (company_id, amount, plan, status, created_at)
SELECT (SELECT id FROM companies WHERE name = 'Dev Caterers' LIMIT 1), 5999, 'pro', 'success', now() - interval '5 days'
WHERE NOT EXISTS (SELECT 1 FROM payments WHERE company_id = (SELECT id FROM companies WHERE name = 'Dev Caterers' LIMIT 1) AND created_at > now() - interval '6 days' AND created_at < now() - interval '4 days');

INSERT INTO payments (company_id, amount, plan, status, created_at)
SELECT (SELECT id FROM companies WHERE name = 'Smile Dental Clinic' LIMIT 1), 5999, 'pro', 'success', now() - interval '10 days'
WHERE NOT EXISTS (SELECT 1 FROM payments WHERE company_id = (SELECT id FROM companies WHERE name = 'Smile Dental Clinic' LIMIT 1));

INSERT INTO payments (company_id, amount, plan, status, created_at)
SELECT (SELECT id FROM companies WHERE name = 'Delhi Crown Hotel' LIMIT 1), 2999, 'starter', 'success', now() - interval '3 days'
WHERE NOT EXISTS (SELECT 1 FROM payments WHERE company_id = (SELECT id FROM companies WHERE name = 'Delhi Crown Hotel' LIMIT 1));

-- 5. Scans table
CREATE TABLE IF NOT EXISTS scans (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL,
  time BIGINT NOT NULL,
  converted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL,
  text TEXT NOT NULL,
  rating INTEGER NOT NULL,
  time BIGINT NOT NULL,
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for reviews and scans lookups
CREATE INDEX IF NOT EXISTS idx_scans_business_id ON scans(business_id);
CREATE INDEX IF NOT EXISTS idx_reviews_business_id ON reviews(business_id);

-- Enable RLS
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read on scans" ON scans;
CREATE POLICY "Allow public read on scans"
  ON scans FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow public insert on scans" ON scans;
CREATE POLICY "Allow public insert on scans"
  ON scans FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on scans" ON scans;
CREATE POLICY "Allow public update on scans"
  ON scans FOR UPDATE
  USING (true);

DROP POLICY IF EXISTS "Allow public read on reviews" ON reviews;
CREATE POLICY "Allow public read on reviews"
  ON reviews FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow public insert on reviews" ON reviews;
CREATE POLICY "Allow public insert on reviews"
  ON reviews FOR INSERT
  WITH CHECK (true);

-- 7. Enable Realtime Replication
alter publication supabase_realtime add table scans;
alter publication supabase_realtime add table reviews;

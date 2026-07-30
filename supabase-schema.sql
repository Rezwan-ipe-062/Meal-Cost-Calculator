-- Run this entire file in the Supabase SQL Editor (https://supabase.com/dashboard/project/wkkyrgpbklfognuzmqsx/sql/new)

-- 1. Create members table
CREATE TABLE IF NOT EXISTS members (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

-- 2. Insert the three members
INSERT INTO members (id, name) VALUES (1, 'Rezwan'), (2, 'Tanvir'), (3, 'Kaykobad')
ON CONFLICT (id) DO NOTHING;

-- 3. Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id SERIAL PRIMARY KEY,
  amount DECIMAL(10,2) NOT NULL,
  item_name TEXT,
  paid_by INTEGER REFERENCES members(id) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create expense_splits table
CREATE TABLE IF NOT EXISTS expense_splits (
  id SERIAL PRIMARY KEY,
  expense_id INTEGER REFERENCES expenses(id) ON DELETE CASCADE,
  member_id INTEGER REFERENCES members(id) NOT NULL,
  share DECIMAL(10,2) NOT NULL,
  UNIQUE(expense_id, member_id)
);

-- 5. Create settlements table
CREATE TABLE IF NOT EXISTS settlements (
  id SERIAL PRIMARY KEY,
  from_member INTEGER REFERENCES members(id) NOT NULL,
  to_member INTEGER REFERENCES members(id) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create egg_stock table
CREATE TABLE IF NOT EXISTS egg_stock (
  id SERIAL PRIMARY KEY,
  quantity INTEGER NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Create egg_consumption table
CREATE TABLE IF NOT EXISTS egg_consumption (
  id SERIAL PRIMARY KEY,
  member_id INTEGER REFERENCES members(id) NOT NULL,
  quantity INTEGER NOT NULL,
  meal_type TEXT CHECK(meal_type IN ('breakfast', 'lunch', 'dinner')),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Enable Row Level Security (optional for this app — public anon key is used)
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_splits ENABLE ROW LEVEL SECURITY;
ALTER TABLE settlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE egg_stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE egg_consumption ENABLE ROW LEVEL SECURITY;

-- 9. Allow public access (since we use the anon key with shared password auth)
DROP POLICY IF EXISTS "Allow public read members" ON members;
CREATE POLICY "Allow public read members" ON members FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public read expenses" ON expenses;
CREATE POLICY "Allow public read expenses" ON expenses FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public insert expenses" ON expenses;
CREATE POLICY "Allow public insert expenses" ON expenses FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public delete expenses" ON expenses;
CREATE POLICY "Allow public delete expenses" ON expenses FOR DELETE USING (true);
DROP POLICY IF EXISTS "Allow public read splits" ON expense_splits;
CREATE POLICY "Allow public read splits" ON expense_splits FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public insert splits" ON expense_splits;
CREATE POLICY "Allow public insert splits" ON expense_splits FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public delete splits" ON expense_splits;
CREATE POLICY "Allow public delete splits" ON expense_splits FOR DELETE USING (true);
DROP POLICY IF EXISTS "Allow public read settlements" ON settlements;
CREATE POLICY "Allow public read settlements" ON settlements FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public insert settlements" ON settlements;
CREATE POLICY "Allow public insert settlements" ON settlements FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public delete settlements" ON settlements;
CREATE POLICY "Allow public delete settlements" ON settlements FOR DELETE USING (true);
DROP POLICY IF EXISTS "Allow public read egg_stock" ON egg_stock;
CREATE POLICY "Allow public read egg_stock" ON egg_stock FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public insert egg_stock" ON egg_stock;
CREATE POLICY "Allow public insert egg_stock" ON egg_stock FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public delete egg_stock" ON egg_stock;
CREATE POLICY "Allow public delete egg_stock" ON egg_stock FOR DELETE USING (true);
DROP POLICY IF EXISTS "Allow public read egg_consumption" ON egg_consumption;
CREATE POLICY "Allow public read egg_consumption" ON egg_consumption FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public insert egg_consumption" ON egg_consumption;
CREATE POLICY "Allow public insert egg_consumption" ON egg_consumption FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public delete egg_consumption" ON egg_consumption;
CREATE POLICY "Allow public delete egg_consumption" ON egg_consumption FOR DELETE USING (true);

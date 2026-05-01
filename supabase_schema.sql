-- SQL to create the inventory table in Supabase
-- Run this in the Supabase SQL Editor

CREATE TABLE inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  sector TEXT NOT NULL,
  task TEXT NOT NULL,
  risk TEXT NOT NULL,
  methodology TEXT NOT NULL,
  score NUMERIC NOT NULL,
  priority TEXT CHECK (priority IN ('Baixa', 'Média', 'Alta', 'Crítica')) NOT NULL,
  date DATE DEFAULT CURRENT_DATE NOT NULL,
  status TEXT CHECK (status IN ('Pendente', 'Em Ação', 'Resolvido')) NOT NULL
);

-- Table for formal reports (AET/LIP/PGR Documents)
CREATE TABLE reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  cnpj TEXT,
  address TEXT,
  employee_name TEXT,
  sector TEXT,
  job_function TEXT,
  report_type TEXT CHECK (report_type IN ('AET', 'LIP', 'PGR')) NOT NULL,
  assessment_ids UUID[] DEFAULT '{}', -- References inventory item IDs
  status TEXT DEFAULT 'Draft' CHECK (status IN ('Draft', 'Review', 'Completed')) NOT NULL,
  content JSONB DEFAULT '{}'::jsonb, -- Stores the structured sections based on the AET model
  conclusion TEXT,
  recommendations TEXT
);

-- Enable Row Level Security
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Inventory Policies
CREATE POLICY "Users can view their own inventory" ON inventory FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own inventory" ON inventory FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own inventory" ON inventory FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own inventory" ON inventory FOR DELETE USING (auth.uid() = user_id);

-- Report Policies
CREATE POLICY "Users can view their own reports" ON reports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own reports" ON reports FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reports" ON reports FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reports" ON reports FOR DELETE USING (auth.uid() = user_id);

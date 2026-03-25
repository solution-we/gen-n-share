-- Create students table
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  class TEXT NOT NULL,
  division TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(name, class, division)
);

-- Create receipts table
CREATE TABLE public.receipts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  receipt_number INTEGER NOT NULL UNIQUE,
  student_name TEXT NOT NULL,
  class TEXT NOT NULL,
  division TEXT NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;

-- Public access policies (no auth for tuition center internal use)
CREATE POLICY "Anyone can read students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Anyone can insert students" ON public.students FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read receipts" ON public.receipts FOR SELECT USING (true);
CREATE POLICY "Anyone can insert receipts" ON public.receipts FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete receipts" ON public.receipts FOR DELETE USING (true);

-- Indexes
CREATE INDEX idx_receipts_number ON public.receipts(receipt_number DESC);
CREATE INDEX idx_receipts_date ON public.receipts(date DESC);
CREATE INDEX idx_students_name ON public.students(name);
-- Create table for vehicle inquiries
CREATE TABLE public.vehicle_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  registration_number TEXT NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  mileage INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.vehicle_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert inquiries (public submission form)
CREATE POLICY "Anyone can submit vehicle inquiries"
ON public.vehicle_inquiries
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only allow reading inquiries in authenticated/admin contexts (future-proofing)
CREATE POLICY "Only authenticated users can view inquiries"
ON public.vehicle_inquiries
FOR SELECT
TO authenticated
USING (true);

-- Add index for better query performance
CREATE INDEX idx_vehicle_inquiries_created_at ON public.vehicle_inquiries(created_at DESC);
CREATE INDEX idx_vehicle_inquiries_email ON public.vehicle_inquiries(email);
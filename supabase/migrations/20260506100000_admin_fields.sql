-- Admin workflow fields for vehicle_inquiries
ALTER TABLE public.vehicle_inquiries
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'contacted', 'completed', 'cancelled')),
  ADD COLUMN IF NOT EXISTS offered_price numeric,
  ADD COLUMN IF NOT EXISTS internal_notes text;

CREATE INDEX IF NOT EXISTS idx_vehicle_inquiries_status
  ON public.vehicle_inquiries(status);

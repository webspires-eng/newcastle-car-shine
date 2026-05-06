-- Persist DVLA-derived vehicle details so the admin sees what the email shows
ALTER TABLE public.vehicle_inquiries
  ADD COLUMN IF NOT EXISTS year integer,
  ADD COLUMN IF NOT EXISTS colour text,
  ADD COLUMN IF NOT EXISTS fuel_type text,
  ADD COLUMN IF NOT EXISTS engine_capacity integer,
  ADD COLUMN IF NOT EXISTS body_type text;

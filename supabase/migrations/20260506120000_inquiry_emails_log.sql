-- Persist a log of emails sent for each inquiry so the admin Emails tab can show them
ALTER TABLE public.vehicle_inquiries
  ADD COLUMN IF NOT EXISTS emails jsonb NOT NULL DEFAULT '[]'::jsonb;

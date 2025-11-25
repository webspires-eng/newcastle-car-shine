-- Add HPI clear and condition fields to vehicle_inquiries table
ALTER TABLE public.vehicle_inquiries 
ADD COLUMN hpi_clear boolean DEFAULT NULL,
ADD COLUMN condition text DEFAULT NULL 
CHECK (condition IN ('excellent', 'good', 'bad'));
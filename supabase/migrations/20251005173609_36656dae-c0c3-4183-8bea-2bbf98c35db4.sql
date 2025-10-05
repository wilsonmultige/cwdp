-- Add new fields to contact_requests table
ALTER TABLE public.contact_requests
ADD COLUMN budget_range text,
ADD COLUMN desired_timeline text,
ADD COLUMN project_location text,
ADD COLUMN how_found_us text;
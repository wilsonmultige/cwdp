-- Create settings table for company information
CREATE TABLE public.settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Create policies for settings
CREATE POLICY "Settings are viewable by everyone" 
ON public.settings 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can manage settings" 
ON public.settings 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'admin'
));

-- Create contact_requests table
CREATE TABLE public.contact_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for contact_requests
CREATE POLICY "Only admins can view contact requests" 
ON public.contact_requests 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'admin'
));

CREATE POLICY "Anyone can create contact requests" 
ON public.contact_requests 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Only admins can update contact requests" 
ON public.contact_requests 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'admin'
));

-- Add update triggers
CREATE TRIGGER update_settings_updated_at
BEFORE UPDATE ON public.settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contact_requests_updated_at
BEFORE UPDATE ON public.contact_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default settings
INSERT INTO public.settings (key, value, description) VALUES
('company_name', 'CWDP', 'Nome da empresa'),
('company_subtitle', 'Construção Civil', 'Subtítulo da empresa'),
('company_logo', '/logo.png', 'URL do logo da empresa'),
('contact_phone1', '+351 910 375 217', 'Telefone principal'),
('contact_phone2', '+34 614 607 639', 'Telefone secundário'),
('contact_email1', 'contato@cwdp.pt', 'Email principal'),
('contact_email2', 'info@cwdp.pt', 'Email secundário'),
('company_address', 'Rua Dom Dinis, Qta Dálias, 1685-229 Famões', 'Endereço da empresa'),
('business_hours_weekdays', 'Seg - Sex: 08:00 - 18:00', 'Horário dias úteis'),
('business_hours_saturday', 'Sáb: 08:00 - 13:00', 'Horário sábado');
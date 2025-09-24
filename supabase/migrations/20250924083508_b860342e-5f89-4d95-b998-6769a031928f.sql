-- Create table for managing stats section
CREATE TABLE public.stats (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  icon_name text NOT NULL,
  number integer NOT NULL DEFAULT 0,
  label text NOT NULL,
  suffix text DEFAULT '',
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.stats ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Stats are viewable by everyone" 
ON public.stats 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can manage stats" 
ON public.stats 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'admin'
));

-- Create trigger for timestamps
CREATE TRIGGER update_stats_updated_at
  BEFORE UPDATE ON public.stats
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default stats data
INSERT INTO public.stats (icon_name, number, label, suffix, display_order) VALUES
('Building2', 150, 'Projetos Realizados', '+', 1),
('Award', 50000, 'Metros Construídos', '+', 2), 
('Users', 40, 'Especialistas', '+', 3),
('Wrench', 200, 'Projetos Entregues', '+', 4);

-- Create table for stats section settings
INSERT INTO public.settings (key, value, description) VALUES
('stats_title', 'Números que Falam por Si', 'Título da seção de estatísticas'),
('stats_description', 'Anos de dedicação e excelência resultam em números impressionantes e clientes satisfeitos em toda a Europa.', 'Descrição da seção de estatísticas')
ON CONFLICT (key) DO NOTHING;
-- Create gallery table for managing all images
CREATE TABLE public.gallery (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  is_logo BOOLEAN DEFAULT false,
  is_footer_logo BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Gallery is viewable by everyone" 
ON public.gallery 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Only admins can manage gallery" 
ON public.gallery 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'admin'
));

-- Add gallery_urls column to projects table to store multiple images
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS gallery_images JSONB DEFAULT '[]'::jsonb;

-- Create trigger for gallery updated_at
CREATE TRIGGER update_gallery_updated_at
BEFORE UPDATE ON public.gallery
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add settings for logos
INSERT INTO public.settings (key, value, description) VALUES 
('site_logo_url', '', 'URL da logo principal do site'),
('footer_logo_url', '', 'URL da logo do rodapé')
ON CONFLICT (key) DO NOTHING;
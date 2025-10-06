-- Add setting to control projects section visibility
INSERT INTO public.settings (key, value, description)
VALUES ('show_projects_section', 'false', 'Exibir ou ocultar a seção de projetos na página inicial')
ON CONFLICT (key) DO NOTHING;
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Home, Building, Factory, Calendar, MapPin } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  location?: string;
  project_type?: string;
  status: 'ongoing' | 'completed' | 'planned';
  start_date?: string;
  end_date?: string;
  is_featured: boolean;
  display_order: number;
}

const ProjectsSection = () => {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('is_featured', true)
        .order('display_order')
        .limit(6);
      
      if (error) throw error;
      return data as Project[];
    },
  });

  const getIcon = (projectType?: string) => {
    switch (projectType?.toLowerCase()) {
      case 'residencial':
        return Home;
      case 'comercial':
        return Building;
      case 'industrial':
        return Factory;
      default:
        return Building;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      ongoing: { label: 'Em Andamento', color: 'bg-yellow-100 text-yellow-800' },
      completed: { label: 'Concluído', color: 'bg-green-100 text-green-800' },
      planned: { label: 'Planejado', color: 'bg-blue-100 text-blue-800' }
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.completed;
  };

  if (isLoading) {
    return (
      <section id="projetos" className="py-20 bg-construction-light-gray">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent font-medium mb-6">
              Projetos Realizados
            </div>
            <h2 className="section-title mb-6">
              Qualidade Comprovada em{" "}
              <span className="bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent">
                Cada Projeto
              </span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="construction-card animate-pulse">
                <div className="h-64 bg-muted rounded-t-lg"></div>
                <CardContent className="p-6">
                  <div className="h-6 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded mb-4"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projetos" className="py-20 bg-construction-light-gray">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-up">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent font-medium mb-6">
            Projetos Realizados
          </div>
          
          <h2 className="section-title mb-6">
            Qualidade Comprovada em{" "}
            <span className="bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent">
              Cada Projeto
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Conheça alguns dos nossos projetos mais marcantes. Cada obra reflete 
            nossa dedicação à excelência e compromisso com resultados extraordinários.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {projects?.map((project, index) => {
            const IconComponent = getIcon(project.project_type);
            const statusInfo = getStatusBadge(project.status);

            return (
              <Card 
                key={project.id} 
                className="group construction-card overflow-hidden h-full animate-fade-up hover:shadow-construction"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Project Image */}
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={project.image_url || '/api/placeholder/800/600'}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = '/api/placeholder/800/600?text=Projeto+CWDP';
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-accent/90 text-accent-foreground font-medium">
                      <IconComponent className="w-3 h-3 mr-1" />
                      {project.project_type || 'Projeto'}
                    </Badge>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-lg font-bold text-white mb-1">
                      {project.title}
                    </h3>
                    {project.location && (
                      <p className="text-white/90 text-sm flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {project.location}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* View More Section */}
        <div className="text-center animate-fade-up">
          <p className="text-lg text-muted-foreground mb-6">
            Quer ver mais projetos e conhecer nosso portfólio completo?
          </p>
          <Button variant="outline" className="group" size="lg">
            Ver Todos os Projetos
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
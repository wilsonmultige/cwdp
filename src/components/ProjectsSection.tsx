import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Home, Building, Factory } from "lucide-react";

const ProjectsSection = () => {
  const projects = [
    {
      category: "Residencial",
      icon: Home,
      title: "Moradia Moderna em Lisboa",
      description: "Construção completa de moradia de luxo com 4 quartos, jardim paisagístico e sistema de automação residencial.",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      tags: ["Construção Civil", "Instalações Elétricas", "Design Moderno"],
      area: "320m²",
      duration: "8 meses"
    },
    {
      category: "Comercial", 
      icon: Building,
      title: "Centro Empresarial Porto",
      description: "Reabilitação completa de edifício comercial com escritórios modernos e sistemas de eficiência energética.",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      tags: ["Reabilitação", "Eficiência Energética", "Comercial"],
      area: "1.200m²", 
      duration: "12 meses"
    },
    {
      category: "Industrial",
      icon: Factory,
      title: "Armazém Logístico Aveiro",
      description: "Construção de complexo industrial com sistemas automatizados e infraestrutura para logística avançada.",
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      tags: ["Industrial", "Automação", "Logística"],
      area: "2.500m²",
      duration: "10 meses"
    }
  ];

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

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {projects.map((project, index) => (
            <Card 
              key={index} 
              className="group construction-card overflow-hidden h-full animate-fade-up hover:shadow-construction"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Project Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-accent/90 text-accent-foreground font-medium">
                    <project.icon className="w-3 h-3 mr-1" />
                    {project.category}
                  </Badge>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>

              <CardContent className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-primary group-hover:text-accent transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {project.description}
                </p>

                {/* Project Stats */}
                <div className="flex justify-between text-sm text-muted-foreground bg-construction-light-blue/30 rounded-lg p-3">
                  <div>
                    <span className="font-medium text-primary">Área:</span> {project.area}
                  </div>
                  <div>
                    <span className="font-medium text-primary">Duração:</span> {project.duration}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
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
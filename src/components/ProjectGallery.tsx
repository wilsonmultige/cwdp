import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Eye, MapPin, Calendar } from "lucide-react";
import GalleryModal from "./GalleryModal";

interface GalleryImage {
  id: string;
  title: string;
  description?: string;
  image_url: string;
}

interface Project {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  location?: string;
  project_type?: string;
  status: string;
  start_date?: string;
  end_date?: string;
  is_featured: boolean;
  display_order: number;
  gallery_images?: any;
}

const ProjectGallery = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);

  // Fetch projects
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects-featured'],
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

  const handleViewGallery = (project: Project) => {
    setSelectedProject(project);
    
    // Convert gallery_images to proper format
    const images: GalleryImage[] = [];
    
    // Add main project image if exists
    if (project.image_url) {
      images.push({
        id: `${project.id}-main`,
        title: `${project.title} - Imagem Principal`,
        description: project.description,
        image_url: project.image_url
      });
    }
    
    // Add gallery images if they exist
    if (project.gallery_images && Array.isArray(project.gallery_images)) {
      project.gallery_images.forEach((img: any, index: number) => {
        if (img.url) {
          images.push({
            id: `${project.id}-${index}`,
            title: img.title || `${project.title} - Imagem ${index + 1}`,
            description: img.description || `${project.title}, ${project.location || 'Portugal'}`,
            image_url: img.url
          });
        }
      });
    }
    
    setGalleryImages(images);
    setIsGalleryOpen(true);
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
              Galeria de Projetos
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
                <div className="h-80 bg-muted rounded-t-lg"></div>
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
    <>
      <section id="projetos" className="py-20 bg-construction-light-gray">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-up">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent font-medium mb-6">
              Galeria de Projetos
            </div>
            
            <h2 className="section-title mb-6">
              Qualidade Comprovada em{" "}
              <span className="bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent">
                Cada Projeto
              </span>
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Explore nossa galeria de projetos realizados. Cada obra conta uma história 
              de dedicação, qualidade e excelência na construção civil.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {projects?.map((project, index) => {
              const statusInfo = getStatusBadge(project.status);
              const hasGallery = project.gallery_images && Array.isArray(project.gallery_images) && project.gallery_images.length > 0;
              const totalImages = (project.image_url ? 1 : 0) + (hasGallery ? project.gallery_images.length : 0);

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
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <Badge className={`font-medium ${statusInfo.color}`}>
                        {statusInfo.label}
                      </Badge>
                      {totalImages > 1 && (
                        <Badge className="bg-primary/90 text-primary-foreground font-medium">
                          <Eye className="w-3 h-3 mr-1" />
                          {totalImages} fotos
                        </Badge>
                      )}
                    </div>
                    
                    {/* Gallery Button */}
                    {totalImages > 0 && (
                      <div className="absolute top-4 right-4">
                        <Button
                          size="sm"
                          className="bg-black/20 hover:bg-black/40 text-white border-0 backdrop-blur-sm"
                          onClick={() => handleViewGallery(project)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Galeria
                        </Button>
                      </div>
                    )}
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    
                    {/* Project Info */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white mb-2">
                        {project.title}
                      </h3>
                      
                      {project.location && (
                        <p className="text-white/90 text-sm flex items-center gap-1 mb-2">
                          <MapPin className="h-3 w-3" />
                          {project.location}
                        </p>
                      )}
                      
                      {(project.start_date || project.end_date) && (
                        <p className="text-white/80 text-xs flex items-center gap-1 mb-2">
                          <Calendar className="h-3 w-3" />
                          {project.start_date && new Date(project.start_date).getFullYear()}
                          {project.end_date && ` - ${new Date(project.end_date).getFullYear()}`}
                        </p>
                      )}
                      
                      {project.description && (
                        <p className="text-white/80 text-sm line-clamp-2">
                          {project.description}
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

      {/* Gallery Modal */}
      {isGalleryOpen && galleryImages.length > 0 && (
        <GalleryModal
          images={galleryImages}
          currentIndex={0}
          isOpen={isGalleryOpen}
          onClose={() => setIsGalleryOpen(false)}
        />
      )}
    </>
  );
};

export default ProjectGallery;
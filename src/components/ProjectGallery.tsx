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

  // Fetch projects (limit to 4 for 4x1 grid)
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects-featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('is_featured', true)
        .order('display_order')
        .limit(4);
      
      if (error) throw error;
      return data as Project[];
    },
  });

  const handleViewGallery = (project: Project, startIndex: number = 0) => {
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="relative overflow-hidden rounded-xl animate-pulse">
                <div className="h-96 bg-muted"></div>
              </div>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {projects?.map((project, index) => {
              const statusInfo = getStatusBadge(project.status);
              const hasGallery = project.gallery_images && Array.isArray(project.gallery_images) && project.gallery_images.length > 0;
              const totalImages = (project.image_url ? 1 : 0) + (hasGallery ? project.gallery_images.length : 0);

              return (
                <div 
                  key={project.id} 
                  className="group relative overflow-hidden rounded-xl animate-fade-up hover:shadow-2xl transition-all duration-500"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Project Image - Clickable */}
                  <div 
                    className="relative h-96 overflow-hidden cursor-pointer"
                    onClick={() => handleViewGallery(project, 0)}
                  >
                    <img
                      src={project.image_url || '/api/placeholder/800/600'}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        e.currentTarget.src = '/api/placeholder/800/600?text=Projeto+CWDP';
                      }}
                    />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-4">
                          <Eye className="w-8 h-8 text-primary" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex gap-2 z-10">
                      <Badge className={`font-medium shadow-lg ${statusInfo.color}`}>
                        {statusInfo.label}
                      </Badge>
                      {totalImages > 1 && (
                        <Badge className="bg-primary/90 text-primary-foreground font-medium shadow-lg backdrop-blur-sm">
                          <Eye className="w-3 h-3 mr-1" />
                          {totalImages} fotos
                        </Badge>
                      )}
                    </div>
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
                    
                    {/* Project Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-0 group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
                        {project.title}
                      </h3>
                      
                      {project.location && (
                        <p className="text-white/95 text-sm flex items-center gap-1 mb-2 drop-shadow">
                          <MapPin className="h-4 w-4" />
                          {project.location}
                        </p>
                      )}
                      
                      {(project.start_date || project.end_date) && (
                        <p className="text-white/90 text-xs flex items-center gap-1 mb-3 drop-shadow">
                          <Calendar className="h-3 w-3" />
                          {project.start_date && new Date(project.start_date).getFullYear()}
                          {project.end_date && ` - ${new Date(project.end_date).getFullYear()}`}
                        </p>
                      )}
                      
                      {project.description && (
                        <p className="text-white/85 text-sm line-clamp-2 drop-shadow opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          {project.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Contact CTA Section */}
          <div className="text-center animate-fade-up">
            <p className="text-lg text-muted-foreground mb-6">
              Gostou do nosso trabalho? Entre em contato conosco!
            </p>
            <Button 
              variant="outline" 
              className="group" 
              size="lg"
              onClick={() => {
                const contactSection = document.getElementById('contato');
                contactSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Solicite Orçamento do seu Projeto
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
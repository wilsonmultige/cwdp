import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Image, Check, Loader2 } from "lucide-react";
import GalleryModal from "../GalleryModal";

interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  is_logo: boolean;
  is_footer_logo: boolean;
  is_active: boolean;
}

interface Settings {
  site_logo_url?: string;
  footer_logo_url?: string;
}

const AdminLogos = () => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [logoType, setLogoType] = useState<'site' | 'footer'>('site');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch gallery items that can be logos
  const { data: galleryItems, isLoading: galleryLoading } = useQuery({
    queryKey: ['gallery-logos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      
      if (error) throw error;
      return data as GalleryItem[];
    },
  });

  // Fetch current logo settings
  const { data: currentLogos } = useQuery({
    queryKey: ['settings', 'logos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .in('key', ['site_logo_url', 'footer_logo_url']);
      
      if (error) throw error;
      
      const settings = data.reduce((acc: Settings, setting) => {
        acc[setting.key as keyof Settings] = setting.value || '';
        return acc;
      }, {});
      
      return settings;
    },
  });

  // Update logo setting mutation
  const updateLogoMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const { data, error } = await supabase
        .from('settings')
        .upsert({ 
          key, 
          value,
          description: key === 'site_logo_url' ? 'URL do logo principal do site' : 'URL do logo do rodapé'
        }, { 
          onConflict: 'key' 
        });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast({
        title: "Logo atualizado",
        description: "O logo foi definido com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao definir logo: " + error.message,
        variant: "destructive",
      });
    },
  });

  const handleSelectLogo = (image: GalleryItem) => {
    const key = logoType === 'site' ? 'site_logo_url' : 'footer_logo_url';
    updateLogoMutation.mutate({ key, value: image.image_url });
    setIsGalleryOpen(false);
  };

  const openGalleryForLogo = (type: 'site' | 'footer') => {
    setLogoType(type);
    setIsGalleryOpen(true);
  };

  if (galleryLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Carregando logos...</span>
        </div>
      </div>
    );
  }

  const galleryImages = galleryItems?.map(item => ({
    id: item.id,
    title: item.title,
    description: item.description,
    image_url: item.image_url
  })) || [];

  return (
    <div className="space-y-8">
      {/* Current Logos */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Site Logo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Logo Principal do Site
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center gap-4">
              {currentLogos?.site_logo_url ? (
                <div className="w-32 h-32 border-2 border-border rounded-lg p-4 flex items-center justify-center bg-muted/50">
                  <img
                    src={currentLogos.site_logo_url}
                    alt="Logo Principal"
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = '/api/placeholder/128/128?text=Logo';
                    }}
                  />
                </div>
              ) : (
                <div className="w-32 h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Image className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Nenhum logo selecionado</p>
                  </div>
                </div>
              )}
              
              <Button 
                onClick={() => openGalleryForLogo('site')}
                className="w-full"
                disabled={updateLogoMutation.isPending}
              >
                {updateLogoMutation.isPending && logoType === 'site' ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Definindo...
                  </>
                ) : (
                  <>
                    <Image className="h-4 w-4 mr-2" />
                    Escolher da Galeria
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer Logo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Logo do Rodapé
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center gap-4">
              {currentLogos?.footer_logo_url ? (
                <div className="w-32 h-32 border-2 border-border rounded-lg p-4 flex items-center justify-center bg-primary text-primary-foreground">
                  <img
                    src={currentLogos.footer_logo_url}
                    alt="Logo Rodapé"
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = '/api/placeholder/128/128?text=Logo+Rodapé';
                    }}
                  />
                </div>
              ) : (
                <div className="w-32 h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center text-muted-foreground bg-primary">
                  <div className="text-center text-primary-foreground">
                    <Image className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Nenhum logo selecionado</p>
                  </div>
                </div>
              )}
              
              <Button 
                onClick={() => openGalleryForLogo('footer')}
                variant="secondary"
                className="w-full"
                disabled={updateLogoMutation.isPending}
              >
                {updateLogoMutation.isPending && logoType === 'footer' ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Definindo...
                  </>
                ) : (
                  <>
                    <Image className="h-4 w-4 mr-2" />
                    Escolher da Galeria
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0"></div>
            <div>
              <h4 className="font-medium mb-2">Como funcionam os logos:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Logo Principal:</strong> Aparece no cabeçalho do site (fundo claro)</li>
                <li>• <strong>Logo do Rodapé:</strong> Aparece no rodapé do site (fundo escuro)</li>
                <li>• Escolha imagens com boa resolução e contraste adequado</li>
                <li>• Os logos são selecionados diretamente da galeria de imagens</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gallery Modal for Logo Selection */}
      {isGalleryOpen && (
        <GalleryModal
          images={galleryImages}
          currentIndex={0}
          isOpen={isGalleryOpen}
          onClose={() => setIsGalleryOpen(false)}
          onSelect={handleSelectLogo}
          selectMode={true}
        />
      )}
    </div>
  );
};

export default AdminLogos;
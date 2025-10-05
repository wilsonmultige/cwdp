import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Search, Image as ImageIcon } from "lucide-react";

interface GalleryImage {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  category?: string;
}

interface ImageGallerySelectorProps {
  images: GalleryImage[];
  isOpen: boolean;
  onClose: () => void;
  onSelect: (imageUrl: string) => void;
  selectedUrl?: string;
}

const ImageGallerySelector = ({ 
  images, 
  isOpen, 
  onClose, 
  onSelect,
  selectedUrl 
}: ImageGallerySelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Get unique categories
  const categories = ["all", ...Array.from(new Set(images.map(img => img.category).filter(Boolean)))];

  // Filter images
  const filteredImages = images.filter(image => {
    const matchesSearch = image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         image.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || image.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelect = (imageUrl: string) => {
    onSelect(imageUrl);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Selecionar Imagem da Galeria
          </DialogTitle>
        </DialogHeader>
        
        {/* Search and Filter */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por título ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          
          {/* Category Filter */}
          {categories.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === "all" ? "Todas" : category}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Image Grid */}
        <ScrollArea className="flex-1 pr-4">
          {filteredImages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <ImageIcon className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">Nenhuma imagem encontrada</p>
              <p className="text-sm">Tente ajustar sua busca ou filtros</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
              {filteredImages.map((image) => (
                <button
                  key={image.id}
                  onClick={() => handleSelect(image.image_url)}
                  className={`group relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:shadow-lg ${
                    selectedUrl === image.image_url
                      ? 'border-primary shadow-lg'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <img
                    src={image.image_url}
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = '/api/placeholder/400/400?text=Erro';
                    }}
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white text-sm font-medium line-clamp-2">
                        {image.title}
                      </p>
                    </div>
                  </div>
                  
                  {/* Selected Indicator */}
                  {selectedUrl === image.image_url && (
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            {filteredImages.length} {filteredImages.length === 1 ? 'imagem' : 'imagens'}
          </p>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageGallerySelector;

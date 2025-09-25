import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface GalleryImage {
  id: string;
  title: string;
  description?: string;
  image_url: string;
}

interface GalleryModalProps {
  images: GalleryImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (image: GalleryImage) => void;
  selectMode?: boolean;
}

const GalleryModal = ({ 
  images, 
  currentIndex, 
  isOpen, 
  onClose, 
  onSelect,
  selectMode = false 
}: GalleryModalProps) => {
  const [activeIndex, setActiveIndex] = useState(currentIndex);

  const goToPrevious = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const currentImage = images[activeIndex];

  if (!currentImage) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-bold">
            {currentImage.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="relative">
          {/* Main Image */}
          <div className="relative h-[60vh] bg-black/5 rounded-lg mx-6">
            <img
              src={currentImage.image_url}
              alt={currentImage.title}
              className="w-full h-full object-contain rounded-lg"
              onError={(e) => {
                e.currentTarget.src = '/api/placeholder/800/600?text=Erro+ao+carregar';
              }}
            />
            
            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white border-0"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white border-0"
                  onClick={goToNext}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
          
          {/* Image Info */}
          <div className="p-6">
            {currentImage.description && (
              <p className="text-muted-foreground mb-4">
                {currentImage.description}
              </p>
            )}
            
            {/* Thumbnail Navigation */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto py-2 max-w-full">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setActiveIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      index === activeIndex 
                        ? 'border-primary' 
                        : 'border-transparent hover:border-primary/50'
                    }`}
                  >
                    <img
                      src={image.image_url}
                      alt={image.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/api/placeholder/64/64';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-muted-foreground">
                {activeIndex + 1} de {images.length}
              </div>
              
              <div className="flex gap-2">
                {selectMode && onSelect && (
                  <Button 
                    onClick={() => onSelect(currentImage)}
                    variant="default"
                  >
                    Selecionar Esta Imagem
                  </Button>
                )}
                
                <Button 
                  onClick={onClose}
                  variant="outline"
                >
                  <X className="w-4 h-4 mr-2" />
                  Fechar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GalleryModal;
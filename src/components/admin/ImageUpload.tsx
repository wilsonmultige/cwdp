import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Image as ImageIcon, CheckCircle } from "lucide-react";

interface ImageUploadProps {
  bucket: 'projects' | 'gallery' | 'logos';
  onUploadComplete: (url: string, path: string) => void;
  maxSize?: number; // in MB
  accept?: Record<string, string[]>;
}

const ImageUpload = ({ 
  bucket, 
  onUploadComplete,
  maxSize = 5,
  accept = {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/webp': ['.webp'],
    'image/gif': ['.gif']
  }
}: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);
      setProgress(0);

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      // Simulate progress (Supabase doesn't provide real progress)
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      clearInterval(progressInterval);
      setProgress(100);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      toast({
        title: "Upload Concluído!",
        description: "Imagem enviada com sucesso.",
      });

      onUploadComplete(publicUrl, filePath);
      setPreview(null);
      setProgress(0);
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Erro no Upload",
        description: error.message || "Não foi possível fazer upload da imagem.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: "Arquivo Muito Grande",
        description: `O arquivo deve ter no máximo ${maxSize}MB.`,
        variant: "destructive",
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload immediately
    uploadImage(file);
  }, [maxSize, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
    multiple: false,
    disabled: uploading
  });

  const clearPreview = () => {
    setPreview(null);
    setProgress(0);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-200 
          ${isDragActive ? 'border-primary bg-primary/5 scale-105' : 'border-border hover:border-primary/50'}
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {!preview ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-primary/10">
                <Upload className="w-8 h-8 text-primary" />
              </div>
            </div>
            
            <div>
              <p className="text-lg font-medium mb-1">
                {isDragActive ? 'Solte a imagem aqui...' : 'Arraste e solte uma imagem'}
              </p>
              <p className="text-sm text-muted-foreground">
                ou clique para selecionar (máx. {maxSize}MB)
              </p>
            </div>
            
            <div className="flex justify-center gap-2 text-xs text-muted-foreground">
              <span>JPG</span>
              <span>•</span>
              <span>PNG</span>
              <span>•</span>
              <span>WEBP</span>
              <span>•</span>
              <span>GIF</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative inline-block">
              <img 
                src={preview} 
                alt="Preview" 
                className="max-h-48 rounded-lg mx-auto"
              />
              {!uploading && progress === 0 && (
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute -top-2 -right-2 rounded-full p-2 h-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearPreview();
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            
            {uploading && (
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  Enviando... {progress}%
                </p>
              </div>
            )}
            
            {progress === 100 && !uploading && (
              <div className="flex items-center justify-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Upload Concluído!</span>
              </div>
            )}
          </div>
        )}
      </div>
      
      <p className="text-xs text-muted-foreground text-center">
        As imagens são armazenadas de forma segura e otimizadas automaticamente
      </p>
    </div>
  );
};

export default ImageUpload;
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Image, Crown, Footprints } from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  category: string;
  is_logo: boolean;
  is_footer_logo: boolean;
  display_order: number;
  is_active: boolean;
}

const AdminGallery = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    image_url: '',
    category: 'general',
    is_logo: false,
    is_footer_logo: false,
    display_order: 0,
    is_active: true
  });

  // Fetch gallery items
  const { data: galleryItems, isLoading } = useQuery({
    queryKey: ['gallery'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as GalleryItem[];
    },
  });

  // Create gallery item
  const createItemMutation = useMutation({
    mutationFn: async (item: typeof newItem) => {
      const { data, error } = await supabase
        .from('gallery')
        .insert([item])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      setIsDialogOpen(false);
      setNewItem({
        title: '',
        description: '',
        image_url: '',
        category: 'general',
        is_logo: false,
        is_footer_logo: false,
        display_order: 0,
        is_active: true
      });
      toast({
        title: "Sucesso",
        description: "Item adicionado à galeria com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao adicionar item à galeria.",
        variant: "destructive",
      });
    },
  });

  // Delete gallery item
  const deleteItemMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      toast({
        title: "Sucesso",
        description: "Item removido da galeria.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao remover item da galeria.",
        variant: "destructive",
      });
    },
  });

  // Update gallery item
  const updateItemMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<GalleryItem> }) => {
      const { error } = await supabase
        .from('gallery')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      toast({
        title: "Sucesso",
        description: "Item atualizado com sucesso!",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar item.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createItemMutation.mutate(newItem);
  };

  const handleItemChange = (id: string, field: keyof GalleryItem, value: any) => {
    updateItemMutation.mutate({ id, updates: { [field]: value } });
  };

  if (isLoading) {
    return <div className="p-6">Carregando galeria...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciar Galeria</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Imagem
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Nova Imagem</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="image_url">URL da Imagem</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={newItem.image_url}
                  onChange={(e) => setNewItem({ ...newItem, image_url: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="category">Categoria</Label>
                <Select value={newItem.category} onValueChange={(value) => setNewItem({ ...newItem, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">Geral</SelectItem>
                    <SelectItem value="projects">Projetos</SelectItem>
                    <SelectItem value="logos">Logos</SelectItem>
                    <SelectItem value="gallery">Galeria</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_logo"
                  checked={newItem.is_logo}
                  onCheckedChange={(checked) => setNewItem({ ...newItem, is_logo: checked })}
                />
                <Label htmlFor="is_logo">Logo Principal</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_footer_logo"
                  checked={newItem.is_footer_logo}
                  onCheckedChange={(checked) => setNewItem({ ...newItem, is_footer_logo: checked })}
                />
                <Label htmlFor="is_footer_logo">Logo do Rodapé</Label>
              </div>
              
              <Button type="submit" className="w-full" disabled={createItemMutation.isPending}>
                {createItemMutation.isPending ? "Adicionando..." : "Adicionar"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleryItems?.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="relative h-48">
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/api/placeholder/400/300?text=Erro+ao+carregar';
                }}
              />
              <div className="absolute top-2 right-2 flex gap-1">
                {item.is_logo && (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    <Crown className="w-3 h-3 mr-1" />
                    Logo
                  </Badge>
                )}
                {item.is_footer_logo && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    <Footprints className="w-3 h-3 mr-1" />
                    Rodapé
                  </Badge>
                )}
              </div>
            </div>
            <CardContent className="p-4">
              <div className="space-y-3">
                <Input
                  value={item.title}
                  onChange={(e) => handleItemChange(item.id, 'title', e.target.value)}
                  className="font-medium"
                />
                
                <Textarea
                  value={item.description || ''}
                  onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                  placeholder="Descrição..."
                  className="text-sm"
                />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={item.is_active}
                      onCheckedChange={(checked) => handleItemChange(item.id, 'is_active', checked)}
                    />
                    <Label className="text-sm">Ativo</Label>
                  </div>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteItemMutation.mutate(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {galleryItems?.length === 0 && (
        <div className="text-center py-12">
          <Image className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            Nenhuma imagem na galeria
          </h3>
          <p className="text-muted-foreground mb-4">
            Adicione imagens para começar a construir sua galeria.
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminGallery;
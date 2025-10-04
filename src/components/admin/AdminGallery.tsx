import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Plus, Image as ImageIcon, Crown, Footprints, Edit, Eye, Upload as UploadIcon } from "lucide-react";
import ImageUpload from "./ImageUpload";
import { deleteImage } from "@/lib/storage";

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
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [uploadedImagePath, setUploadedImagePath] = useState('');
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
      setUploadedImageUrl('');
      setUploadedImagePath('');
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
      setIsEditDialogOpen(false);
      setEditingItem(null);
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

  // Delete gallery item
  const deleteItemMutation = useMutation({
    mutationFn: async (item: GalleryItem) => {
      // Try to extract storage path from URL
      const urlParts = item.image_url.split('/storage/v1/object/public/gallery/');
      if (urlParts.length > 1) {
        const storagePath = urlParts[1];
        await deleteImage('gallery', storagePath);
      }
      
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', item.id);
      
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

  const handleUploadComplete = (url: string, path: string) => {
    setUploadedImageUrl(url);
    setUploadedImagePath(path);
    setNewItem({ ...newItem, image_url: url });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createItemMutation.mutate(newItem);
  };

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setIsEditDialogOpen(true);
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateItemMutation.mutate({
        id: editingItem.id,
        updates: {
          title: editingItem.title,
          description: editingItem.description,
          category: editingItem.category,
          is_logo: editingItem.is_logo,
          is_footer_logo: editingItem.is_footer_logo,
          is_active: editingItem.is_active,
          display_order: editingItem.display_order
        }
      });
    }
  };

  const handleDelete = (item: GalleryItem) => {
    if (confirm(`Tem certeza que deseja excluir "${item.title}"?`)) {
      deleteItemMutation.mutate(item);
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    const colors: Record<string, string> = {
      general: 'bg-gray-100 text-gray-800',
      projects: 'bg-blue-100 text-blue-800',
      logos: 'bg-purple-100 text-purple-800',
      gallery: 'bg-green-100 text-green-800'
    };
    return colors[category] || colors.general;
  };

  if (isLoading) {
    return <div className="p-6">Carregando galeria...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gerenciar Galeria</h2>
          <p className="text-sm text-muted-foreground">
            {galleryItems?.length || 0} imagens • Upload, edição e organização completa
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Imagem
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Adicionar Nova Imagem</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upload">
                    <UploadIcon className="w-4 h-4 mr-2" />
                    Upload
                  </TabsTrigger>
                  <TabsTrigger value="url">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    URL Externa
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="upload" className="space-y-4">
                  <ImageUpload
                    bucket="gallery"
                    onUploadComplete={handleUploadComplete}
                    maxSize={5}
                  />
                  {uploadedImageUrl && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800 font-medium">
                        ✓ Imagem enviada com sucesso!
                      </p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="url" className="space-y-4">
                  <div>
                    <Label htmlFor="image_url">URL da Imagem</Label>
                    <Input
                      id="image_url"
                      type="url"
                      value={newItem.image_url}
                      onChange={(e) => setNewItem({ ...newItem, image_url: e.target.value })}
                      placeholder="https://exemplo.com/imagem.jpg"
                    />
                  </div>
                  {newItem.image_url && (
                    <div className="rounded-lg overflow-hidden border">
                      <img 
                        src={newItem.image_url} 
                        alt="Preview" 
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </TabsContent>
              </Tabs>
              
              <div className="space-y-4 pt-4 border-t">
                <div>
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    value={newItem.title}
                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                    placeholder="Nome da imagem"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    placeholder="Informações adicionais sobre a imagem..."
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
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
                  
                  <div>
                    <Label htmlFor="display_order">Ordem</Label>
                    <Input
                      id="display_order"
                      type="number"
                      value={newItem.display_order}
                      onChange={(e) => setNewItem({ ...newItem, display_order: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_logo"
                      checked={newItem.is_logo}
                      onCheckedChange={(checked) => setNewItem({ ...newItem, is_logo: checked })}
                    />
                    <Label htmlFor="is_logo">Usar como Logo Principal</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_footer_logo"
                      checked={newItem.is_footer_logo}
                      onCheckedChange={(checked) => setNewItem({ ...newItem, is_footer_logo: checked })}
                    />
                    <Label htmlFor="is_footer_logo">Usar como Logo do Rodapé</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={newItem.is_active}
                      onCheckedChange={(checked) => setNewItem({ ...newItem, is_active: checked })}
                    />
                    <Label htmlFor="is_active">Ativar imagem</Label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={createItemMutation.isPending || !newItem.image_url}>
                  {createItemMutation.isPending ? "Adicionando..." : "Adicionar à Galeria"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {galleryItems?.map((item) => (
          <Card key={item.id} className="group overflow-hidden hover:shadow-lg transition-all">
            <div className="relative h-48">
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.src = '/api/placeholder/400/300?text=Erro+ao+carregar';
                }}
              />
              
              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleEdit(item)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(item)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Status badges */}
              <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                <Badge className={getCategoryBadgeColor(item.category)}>
                  {item.category}
                </Badge>
                {item.is_logo && (
                  <Badge className="bg-yellow-100 text-yellow-800">
                    <Crown className="w-3 h-3 mr-1" />
                    Logo
                  </Badge>
                )}
                {item.is_footer_logo && (
                  <Badge className="bg-blue-100 text-blue-800">
                    <Footprints className="w-3 h-3 mr-1" />
                    Rodapé
                  </Badge>
                )}
                {!item.is_active && (
                  <Badge variant="destructive">Inativo</Badge>
                )}
              </div>
            </div>
            
            <CardContent className="p-3">
              <h3 className="font-medium truncate">{item.title}</h3>
              {item.description && (
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                  {item.description}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                Ordem: {item.display_order}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty state */}
      {galleryItems?.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <ImageIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            Nenhuma imagem na galeria
          </h3>
          <p className="text-muted-foreground mb-4">
            Faça upload de imagens ou adicione URLs para começar.
          </p>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Imagem</DialogTitle>
          </DialogHeader>
          
          {editingItem && (
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div className="rounded-lg overflow-hidden border">
                <img 
                  src={editingItem.image_url} 
                  alt={editingItem.title} 
                  className="w-full h-48 object-cover"
                />
              </div>
              
              <div>
                <Label htmlFor="edit_title">Título *</Label>
                <Input
                  id="edit_title"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="edit_description">Descrição</Label>
                <Textarea
                  id="edit_description"
                  value={editingItem.description || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit_category">Categoria</Label>
                  <Select 
                    value={editingItem.category} 
                    onValueChange={(value) => setEditingItem({ ...editingItem, category: value })}
                  >
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
                
                <div>
                  <Label htmlFor="edit_display_order">Ordem</Label>
                  <Input
                    id="edit_display_order"
                    type="number"
                    value={editingItem.display_order}
                    onChange={(e) => setEditingItem({ ...editingItem, display_order: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={editingItem.is_logo}
                    onCheckedChange={(checked) => setEditingItem({ ...editingItem, is_logo: checked })}
                  />
                  <Label>Usar como Logo Principal</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={editingItem.is_footer_logo}
                    onCheckedChange={(checked) => setEditingItem({ ...editingItem, is_footer_logo: checked })}
                  />
                  <Label>Usar como Logo do Rodapé</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={editingItem.is_active}
                    onCheckedChange={(checked) => setEditingItem({ ...editingItem, is_active: checked })}
                  />
                  <Label>Ativar imagem</Label>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={updateItemMutation.isPending}>
                  {updateItemMutation.isPending ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminGallery;
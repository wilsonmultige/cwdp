import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Save, Settings, Phone, Mail, MapPin, Clock, Image, Crown, Footprints } from "lucide-react";
import GalleryModal from "@/components/GalleryModal";

interface Setting {
  id: string;
  key: string;
  value: string | null;
  description: string | null;
}

const AdminSettings = () => {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentLogoType, setCurrentLogoType] = useState<'site' | 'footer'>('site');
  const { toast } = useToast();

  // Fetch gallery images
  const { data: gallery } = useQuery({
    queryKey: ['gallery'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      
      if (error) throw error;
      return data;
    },
  });

  const settingsGroups = [
    {
      title: "Informações da Empresa",
      icon: Settings,
      keys: ["company_name", "company_subtitle"]
    },
    {
      title: "Logos",
      icon: Image,
      keys: ["site_logo_url", "footer_logo_url"]
    },
    {
      title: "Contatos",
      icon: Phone,
      keys: ["contact_phone1", "contact_phone2", "contact_email1", "contact_email2"]
    },
    {
      title: "Localização",
      icon: MapPin,
      keys: ["company_address"]
    },
    {
      title: "Horário de Funcionamento",
      icon: Clock,
      keys: ["business_hours_weekdays", "business_hours_saturday"]
    }
  ];

  const openGallery = (logoType: 'site' | 'footer') => {
    setCurrentLogoType(logoType);
    setIsGalleryOpen(true);
  };

  const handleImageSelect = (image: any) => {
    const settingKey = currentLogoType === 'site' ? 'site_logo_url' : 'footer_logo_url';
    handleSettingChange(settingKey, image.image_url);
    setIsGalleryOpen(false);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .order('key');

      if (error) throw error;
      setSettings(data || []);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as configurações.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingChange = (key: string, value: string) => {
    setSettings(prev => prev.map(setting => 
      setting.key === key ? { ...setting, value } : setting
    ));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updates = settings.map(setting => ({
        id: setting.id,
        key: setting.key,
        value: setting.value,
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('settings')
        .upsert(updates, { onConflict: 'key' });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Configurações salvas com sucesso!",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getSettingsByGroup = (keys: string[]) => {
    return settings.filter(setting => keys.includes(setting.key));
  };

  const getSettingValue = (key: string) => {
    return settings.find(s => s.key === key)?.value || '';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-primary">Configurações da Empresa</h3>
          <p className="text-muted-foreground">
            Gerencie as informações básicas da empresa exibidas no site.
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="ml-4">
          {isSaving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Salvar Alterações
        </Button>
      </div>

      <div className="grid gap-6">
        {settingsGroups.map((group) => {
          const groupSettings = getSettingsByGroup(group.keys);
          
          return (
            <Card key={group.title}>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <group.icon className="w-5 h-5 mr-2 text-primary" />
                  {group.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {group.title === "Logos" ? (
                  // Special handling for logo settings
                  <>
                    <div className="space-y-2">
                      <Label>Logo Principal do Site</Label>
                      <div className="flex gap-2">
                        <Input
                          value={getSettingValue('site_logo_url')}
                          onChange={(e) => handleSettingChange('site_logo_url', e.target.value)}
                          placeholder="URL da logo principal..."
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => openGallery('site')}
                          className="flex items-center gap-2"
                        >
                          <Crown className="w-4 h-4" />
                          Galeria
                        </Button>
                      </div>
                      {getSettingValue('site_logo_url') && (
                        <div className="mt-2">
                          <img 
                            src={getSettingValue('site_logo_url')} 
                            alt="Logo Principal" 
                            className="h-16 object-contain border rounded-lg p-2 bg-white"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Logo do Rodapé</Label>
                      <div className="flex gap-2">
                        <Input
                          value={getSettingValue('footer_logo_url')}
                          onChange={(e) => handleSettingChange('footer_logo_url', e.target.value)}
                          placeholder="URL da logo do rodapé..."
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => openGallery('footer')}
                          className="flex items-center gap-2"
                        >
                          <Footprints className="w-4 h-4" />
                          Galeria
                        </Button>
                      </div>
                      {getSettingValue('footer_logo_url') && (
                        <div className="mt-2 bg-gray-900 p-2 rounded-lg">
                          <img 
                            src={getSettingValue('footer_logo_url')} 
                            alt="Logo Rodapé" 
                            className="h-16 object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  // Default handling for other settings
                  groupSettings.map((setting) => (
                    <div key={setting.key} className="space-y-2">
                      <Label htmlFor={setting.key}>
                        {setting.description || setting.key}
                      </Label>
                      <Input
                        id={setting.key}
                        value={getSettingValue(setting.key)}
                        onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                        placeholder="Digite o valor..."
                      />
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Gallery Modal */}
      <GalleryModal
        images={gallery || []}
        currentIndex={0}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        onSelect={handleImageSelect}
        selectMode={true}
      />
    </div>
  );
};

export default AdminSettings;
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Save, Settings, Phone, Mail, MapPin, Clock } from "lucide-react";

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
  const { toast } = useToast();

  const settingsGroups = [
    {
      title: "Informações da Empresa",
      icon: Settings,
      keys: ["company_name", "company_subtitle", "company_logo"]
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
                {groupSettings.map((setting) => (
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
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AdminSettings;
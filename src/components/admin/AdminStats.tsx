import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { BarChart3, Plus, Trash2 } from "lucide-react";

interface Stat {
  id: string;
  icon_name: string;
  number: number;
  label: string;
  suffix: string;
  display_order: number;
  is_active: boolean;
}

interface Settings {
  stats_title: string;
  stats_description: string;
}

const AdminStats = () => {
  const [settings, setSettings] = useState<Settings>({
    stats_title: '',
    stats_description: ''
  });
  const [newStat, setNewStat] = useState({
    icon_name: 'Building2',
    number: 0,
    label: '',
    suffix: '+',
    display_order: 0,
    is_active: true
  });

  const queryClient = useQueryClient();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stats')
        .select('*')
        .order('display_order');
      
      if (error) throw error;
      return data as Stat[];
    },
  });

  const { data: settingsData, isLoading: settingsLoading } = useQuery({
    queryKey: ['admin-settings', 'stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .in('key', ['stats_title', 'stats_description']);
      
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (settingsData) {
      const settingsMap = settingsData.reduce((acc: Record<string, string>, setting) => {
        acc[setting.key] = setting.value || '';
        return acc;
      }, {});
      
      setSettings({
        stats_title: settingsMap.stats_title || '',
        stats_description: settingsMap.stats_description || ''
      });
    }
  }, [settingsData]);

  const updateSettingsMutation = useMutation({
    mutationFn: async (updatedSettings: Settings) => {
      const promises = Object.entries(updatedSettings).map(([key, value]) =>
        supabase
          .from('settings')
          .upsert({ key, value }, { onConflict: 'key' })
      );
      
      await Promise.all(promises);
    },
    onSuccess: () => {
      toast.success("Configurações atualizadas com sucesso!");
      queryClient.invalidateQueries({ queryKey: ['admin-settings', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['settings', 'stats'] });
    },
    onError: () => {
      toast.error("Erro ao atualizar configurações");
    }
  });

  const createStatMutation = useMutation({
    mutationFn: async (stat: typeof newStat) => {
      const { error } = await supabase
        .from('stats')
        .insert([stat]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Estatística adicionada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      setNewStat({
        icon_name: 'Building2',
        number: 0,
        label: '',
        suffix: '+',
        display_order: 0,
        is_active: true
      });
    },
    onError: () => {
      toast.error("Erro ao adicionar estatística");
    }
  });

  const updateStatMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Stat> }) => {
      const { error } = await supabase
        .from('stats')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Estatística atualizada!");
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
    onError: () => {
      toast.error("Erro ao atualizar estatística");
    }
  });

  const deleteStatMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('stats')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Estatística removida!");
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
    onError: () => {
      toast.error("Erro ao remover estatística");
    }
  });

  const handleSettingsChange = (field: keyof Settings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveSettings = () => {
    updateSettingsMutation.mutate(settings);
  };

  const handleStatChange = (id: string, field: keyof Stat, value: any) => {
    updateStatMutation.mutate({ id, updates: { [field]: value } });
  };

  const iconOptions = [
    'Building2', 'Wrench', 'Users', 'Award', 'Star', 'Zap'
  ];

  if (statsLoading || settingsLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-5 w-5" />
        <h2 className="text-2xl font-bold">Gerenciar Estatísticas</h2>
      </div>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações da Seção</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="stats-title">Título da Seção</Label>
            <Input
              id="stats-title"
              value={settings.stats_title}
              onChange={(e) => handleSettingsChange('stats_title', e.target.value)}
              placeholder="Ex: Números que Falam por Si"
            />
          </div>

          <div>
            <Label htmlFor="stats-description">Descrição</Label>
            <Textarea
              id="stats-description"
              value={settings.stats_description}
              onChange={(e) => handleSettingsChange('stats_description', e.target.value)}
              placeholder="Descrição da seção de estatísticas"
              rows={3}
            />
          </div>

          <Button onClick={handleSaveSettings} disabled={updateSettingsMutation.isPending}>
            Salvar Configurações
          </Button>
        </CardContent>
      </Card>

      {/* Add New Stat */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Adicionar Nova Estatística
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Ícone</Label>
              <Select
                value={newStat.icon_name}
                onValueChange={(value) => setNewStat(prev => ({ ...prev, icon_name: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((icon) => (
                    <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Número</Label>
              <Input
                type="number"
                value={newStat.number}
                onChange={(e) => setNewStat(prev => ({ ...prev, number: parseInt(e.target.value) || 0 }))}
              />
            </div>

            <div>
              <Label>Texto</Label>
              <Input
                value={newStat.label}
                onChange={(e) => setNewStat(prev => ({ ...prev, label: e.target.value }))}
                placeholder="Ex: Projetos Realizados"
              />
            </div>

            <div>
              <Label>Sufixo</Label>
              <Input
                value={newStat.suffix}
                onChange={(e) => setNewStat(prev => ({ ...prev, suffix: e.target.value }))}
                placeholder="Ex: +"
              />
            </div>
          </div>

          <Button 
            onClick={() => createStatMutation.mutate(newStat)}
            disabled={createStatMutation.isPending || !newStat.label}
          >
            Adicionar Estatística
          </Button>
        </CardContent>
      </Card>

      {/* Existing Stats */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Estatísticas Existentes</h3>
        {stats?.map((stat) => (
          <Card key={stat.id}>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center">
                <div>
                  <Label>Ícone</Label>
                  <Select
                    value={stat.icon_name}
                    onValueChange={(value) => handleStatChange(stat.id, 'icon_name', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((icon) => (
                        <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Número</Label>
                  <Input
                    type="number"
                    value={stat.number}
                    onChange={(e) => handleStatChange(stat.id, 'number', parseInt(e.target.value) || 0)}
                  />
                </div>

                <div>
                  <Label>Texto</Label>
                  <Input
                    value={stat.label}
                    onChange={(e) => handleStatChange(stat.id, 'label', e.target.value)}
                  />
                </div>

                <div>
                  <Label>Sufixo</Label>
                  <Input
                    value={stat.suffix}
                    onChange={(e) => handleStatChange(stat.id, 'suffix', e.target.value)}
                  />
                </div>

                <div className="flex items-end gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteStatMutation.mutate(stat.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
        }
      </div>
    </div>
  );
};

export default AdminStats;

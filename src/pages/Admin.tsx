import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Plus, Settings, BarChart3 } from "lucide-react";
import AdminProjects from "@/components/admin/AdminProjects";
import AdminGallery from "@/components/admin/AdminGallery";
import AdminPartners from "@/components/admin/AdminPartners";
import AdminSettings from "@/components/admin/AdminSettings";
import AdminContactRequests from "@/components/admin/AdminContactRequests";
import AdminStats from "@/components/admin/AdminStats";
import { User, Session } from '@supabase/supabase-js';

interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  role: string;
}

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session) {
          navigate("/auth");
        } else if (session.user) {
          // Defer profile fetching with setTimeout
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session) {
        navigate("/auth");
      } else if (session.user) {
        fetchUserProfile(session.user.id);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        setProfile(data);
        if (data.role !== 'admin') {
          toast({
            title: "Acesso negado",
            description: "Você não tem permissão para acessar esta área.",
            variant: "destructive",
          });
          navigate("/");
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: "Erro ao sair",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Logout realizado com sucesso",
          description: "Até logo!",
        });
        navigate("/");
      }
    } catch (error) {
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao fazer logout.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !profile || profile.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Acesso Restrito</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Esta área é restrita para administradores.
            </p>
            <Button onClick={() => navigate("/")} className="w-full">
              Voltar ao Site
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold text-primary">Painel Administrativo</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Olá, {profile.display_name || user.email}
              </span>
              <Button variant="outline" size="sm" onClick={() => navigate("/")}>
                Ver Site
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-primary mb-2">
            Gestão de Conteúdo
          </h2>
          <p className="text-muted-foreground">
            Gerencie projetos, parceiros e outras informações do site.
          </p>
        </div>

        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="projects">Projetos</TabsTrigger>
            <TabsTrigger value="gallery">Galeria</TabsTrigger>
            <TabsTrigger value="partners">Parceiros</TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Estatísticas
            </TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
            <TabsTrigger value="contacts">Solicitações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="projects" className="mt-8">
            <AdminProjects />
          </TabsContent>

          <TabsContent value="gallery" className="mt-8">
            <AdminGallery />
          </TabsContent>
          
          <TabsContent value="partners" className="mt-8">
            <AdminPartners />
          </TabsContent>

          <TabsContent value="stats" className="mt-8">
            <AdminStats />
          </TabsContent>
          
          <TabsContent value="settings" className="mt-8">
            <AdminSettings />
          </TabsContent>
          
          <TabsContent value="contacts" className="mt-8">
            <AdminContactRequests />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
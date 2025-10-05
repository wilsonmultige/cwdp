import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Mail, Phone, Clock, Eye, CheckCircle, XCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ContactRequest {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  service: string | null;
  budget_range: string | null;
  desired_timeline: string | null;
  project_location: string | null;
  how_found_us: string | null;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const AdminContactRequests = () => {
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchContactRequests();
  }, []);

  const fetchContactRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching contact requests:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as solicitações.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateRequestStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('contact_requests')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setRequests(prev => prev.map(req => 
        req.id === id ? { ...req, status } : req
      ));

      toast({
        title: "Sucesso",
        description: `Solicitação marcada como ${status === 'completed' ? 'concluída' : 'em andamento'}.`,
      });
    } catch (error) {
      console.error('Error updating request status:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pendente", variant: "secondary" as const },
      in_progress: { label: "Em Andamento", variant: "default" as const },
      completed: { label: "Concluída", variant: "outline" as const }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const toggleExpanded = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
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
      <div>
        <h3 className="text-2xl font-bold text-primary">Solicitações de Orçamento</h3>
        <p className="text-muted-foreground">
          Gerencie todas as solicitações de orçamento recebidas pelo site.
        </p>
      </div>

      {requests.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma solicitação</h3>
            <p className="text-muted-foreground">
              Quando alguém enviar uma solicitação pelo site, ela aparecerá aqui.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id} className="transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <CardTitle className="text-lg">{request.name}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-1" />
                          {request.email}
                        </div>
                        {request.phone && (
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-1" />
                            {request.phone}
                          </div>
                        )}
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatDistanceToNow(new Date(request.created_at), { 
                            addSuffix: true, 
                            locale: ptBR 
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(request.status)}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpanded(request.id)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {expandedCard === request.id && (
                <CardContent className="border-t pt-4">
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      {request.service && (
                        <div>
                          <Label className="text-sm font-medium">Serviço de Interesse:</Label>
                          <p className="text-sm text-muted-foreground mt-1">{request.service}</p>
                        </div>
                      )}
                      
                      {request.budget_range && (
                        <div>
                          <Label className="text-sm font-medium">Orçamento Estimado:</Label>
                          <p className="text-sm text-muted-foreground mt-1">{request.budget_range}</p>
                        </div>
                      )}
                      
                      {request.desired_timeline && (
                        <div>
                          <Label className="text-sm font-medium">Prazo Desejado:</Label>
                          <p className="text-sm text-muted-foreground mt-1">{request.desired_timeline}</p>
                        </div>
                      )}
                      
                      {request.project_location && (
                        <div>
                          <Label className="text-sm font-medium">Localização do Projeto:</Label>
                          <p className="text-sm text-muted-foreground mt-1">{request.project_location}</p>
                        </div>
                      )}
                      
                      {request.how_found_us && (
                        <div>
                          <Label className="text-sm font-medium">Como Nos Conheceu:</Label>
                          <p className="text-sm text-muted-foreground mt-1">{request.how_found_us}</p>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Mensagem:</Label>
                      <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                        {request.message}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex space-x-2">
                        {request.status !== 'completed' && (
                          <Button
                            size="sm"
                            onClick={() => updateRequestStatus(request.id, 'completed')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Marcar como Concluída
                          </Button>
                        )}
                        {request.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateRequestStatus(request.id, 'in_progress')}
                          >
                            <Clock className="w-4 h-4 mr-2" />
                            Em Andamento
                          </Button>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          asChild
                        >
                          <a href={`mailto:${request.email}`}>
                            <Mail className="w-4 h-4 mr-2" />
                            Responder
                          </a>
                        </Button>
                        {request.phone && (
                          <Button
                            size="sm"
                            variant="outline"
                            asChild
                          >
                            <a href={`tel:${request.phone}`}>
                              <Phone className="w-4 h-4 mr-2" />
                              Ligar
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const Label = ({ className, children, ...props }: any) => (
  <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className || ''}`} {...props}>
    {children}
  </label>
);

export default AdminContactRequests;
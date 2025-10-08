import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const ContactSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    budget_range: "",
    desired_timeline: "",
    project_location: "",
    how_found_us: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch contact email from admin settings
  const { data: emailSetting } = useQuery({
    queryKey: ['setting-contact-email'],
    queryFn: async () => {
      const { data } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'contact_email')
        .single();
      return data?.value || "contato@cwdp.pt";
    },
  });

  const contactInfo = [
    {
      icon: Phone,
      title: "Telefone",
      details: ["+351 910 375 217", "+34 614 607 639"],
      action: "Ligar Agora"
    },
    {
      icon: Mail,
      title: "Email",
      details: [emailSetting || "contato@cwdp.pt"],
      action: "Enviar Email"
    },
    {
      icon: MapPin,
      title: "Localização",
      details: ["Rua Dom Dinis, Qta Dálias", "1685-229 Famões"],
      action: "Ver no Mapa"
    },
    {
      icon: Clock,
      title: "Horário",
      details: ["Seg - Sex: 08:00 - 18:00", "Sáb: 08:00 - 13:00"],
      action: "Agendar"
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('contact_requests')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          service: formData.service || null,
          budget_range: formData.budget_range || null,
          desired_timeline: formData.desired_timeline || null,
          project_location: formData.project_location || null,
          how_found_us: formData.how_found_us || null,
          message: formData.message
        }]);

      if (error) throw error;

      toast({
        title: "Mensagem Enviada!",
        description: "Entraremos em contato em breve para discutir seu projeto.",
      });
      
      setFormData({
        name: "",
        email: "",
        phone: "",
        service: "",
        budget_range: "",
        desired_timeline: "",
        project_location: "",
        how_found_us: "",
        message: ""
      });
    } catch (error) {
      console.error('Error submitting contact request:', error);
      toast({
        title: "Erro ao Enviar",
        description: "Ocorreu um erro ao enviar sua mensagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contato" className="py-12 bg-gradient-primary text-primary-foreground relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-40 h-40 border border-primary-foreground/20 rounded-full" />
        <div className="absolute bottom-20 right-20 w-32 h-32 border border-primary-foreground/20 rounded-full" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-up">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-primary-foreground">
            Vamos Construir Juntos
          </h2>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
            Pronto para começar seu projeto? Entre em contato conosco e receba 
            um orçamento gratuito e personalizado para suas necessidades.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 items-start max-w-7xl mx-auto">
          {/* Contact Form */}
          <Card className="bg-primary-foreground/10 backdrop-blur-sm border-primary-foreground/20 animate-fade-up shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-primary-foreground flex items-center">
                <Send className="w-6 h-6 mr-3 text-accent" />
                Solicitar Orçamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-primary-foreground">Nome Completo</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/60"
                      placeholder="Seu nome completo"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-primary-foreground">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/60"
                      placeholder="seu@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-primary-foreground">Telefone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/60"
                      placeholder="+351 XXX XXX XXX"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="service" className="text-primary-foreground">Serviço de Interesse</Label>
                    <Select value={formData.service} onValueChange={(value) => handleSelectChange('service', value)}>
                      <SelectTrigger className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground">
                        <SelectValue placeholder="Selecione um serviço" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="construcao-civil">Construção Civil</SelectItem>
                        <SelectItem value="remodelacao">Remodelação</SelectItem>
                        <SelectItem value="pintura">Pintura e Acabamentos</SelectItem>
                        <SelectItem value="capoto">Sistema Capoto</SelectItem>
                        <SelectItem value="telhados">Telhados</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budget_range" className="text-primary-foreground">Orçamento Estimado</Label>
                    <Select value={formData.budget_range} onValueChange={(value) => handleSelectChange('budget_range', value)}>
                      <SelectTrigger className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground">
                        <SelectValue placeholder="Selecione uma faixa" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="menos-10k">Menos de €10.000</SelectItem>
                        <SelectItem value="10k-25k">€10.000 - €25.000</SelectItem>
                        <SelectItem value="25k-50k">€25.000 - €50.000</SelectItem>
                        <SelectItem value="50k-100k">€50.000 - €100.000</SelectItem>
                        <SelectItem value="mais-100k">Mais de €100.000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="desired_timeline" className="text-primary-foreground">Prazo Desejado</Label>
                    <Select value={formData.desired_timeline} onValueChange={(value) => handleSelectChange('desired_timeline', value)}>
                      <SelectTrigger className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground">
                        <SelectValue placeholder="Selecione um prazo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="urgente">Urgente (1-2 meses)</SelectItem>
                        <SelectItem value="curto">Curto Prazo (3-6 meses)</SelectItem>
                        <SelectItem value="medio">Médio Prazo (6-12 meses)</SelectItem>
                        <SelectItem value="flexivel">Flexível</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="project_location" className="text-primary-foreground">Localização do Projeto</Label>
                    <Input
                      id="project_location"
                      name="project_location"
                      value={formData.project_location}
                      onChange={handleInputChange}
                      className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/60"
                      placeholder="Cidade ou região"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="how_found_us" className="text-primary-foreground">Como Nos Conheceu?</Label>
                    <Select value={formData.how_found_us} onValueChange={(value) => handleSelectChange('how_found_us', value)}>
                      <SelectTrigger className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground">
                        <SelectValue placeholder="Selecione uma opção" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="google">Google</SelectItem>
                        <SelectItem value="redes-sociais">Redes Sociais</SelectItem>
                        <SelectItem value="indicacao">Indicação</SelectItem>
                        <SelectItem value="outdoor">Outdoor/Publicidade</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-primary-foreground">Descrição do Projeto</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/60 resize-none"
                    placeholder="Descreva seu projeto e suas necessidades..."
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full btn-hero"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enviando..." : "Enviar Solicitação"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-2 animate-slide-left">
            {contactInfo.map((info, index) => (
              <Card 
                key={index} 
                className="bg-primary-foreground/10 backdrop-blur-sm border-primary-foreground/20 hover:bg-primary-foreground/15 transition-all duration-300 group"
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-xl bg-accent/20 group-hover:bg-accent/30 transition-colors">
                      <info.icon className="w-6 h-6 text-accent" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-primary-foreground mb-2">
                        {info.title}
                      </h3>
                      <div className="space-y-1 mb-2">
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-primary-foreground/80">
                            {detail}
                          </p>
                        ))}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-transparent border-accent/50 text-accent hover:bg-accent hover:text-accent-foreground"
                      >
                        {info.action}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Zap, Wrench, ArrowRight } from "lucide-react";

const ServicesSection = () => {
  const services = [
    {
      icon: Building2,
      title: "Construção Civil",
      description: "Realizamos obras completas, desde a fundação até o acabamento final. Atuamos com construção do zero, reformas, ampliações e melhorias em estruturas existentes.",
      features: [
        "Construção do zero",
        "Reformas e ampliações", 
        "Estruturas residenciais",
        "Projetos comerciais"
      ],
      color: "from-blue-500/20 to-blue-600/10"
    },
    {
      icon: Zap,
      title: "Instalações Elétricas", 
      description: "Executamos projetos elétricos completos, desde a montagem de quadros até a instalação de sistemas de iluminação e segurança com máxima eficiência.",
      features: [
        "Quadros elétricos",
        "Sistema de iluminação",
        "Instalações segurança",
        "Manutenções elétricas"
      ],
      color: "from-yellow-500/20 to-orange-500/10"
    },
    {
      icon: Wrench,
      title: "Manutenção",
      description: "Oferecemos manutenção preventiva e corretiva para garantir o bom funcionamento de sistemas elétricos e estruturas com agilidade e segurança.",
      features: [
        "Manutenção preventiva",
        "Reparos emergenciais",
        "Diagnóstico técnico", 
        "Atendimento 24h"
      ],
      color: "from-green-500/20 to-emerald-500/10"
    }
  ];

  return (
    <section id="servicos" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-up">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent font-medium mb-6">
            Nossos Serviços
          </div>
          
          <h2 className="section-title mb-6">
            Soluções Completas para{" "}
            <span className="bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent">
              Seus Projetos
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Do planejamento à execução, oferecemos serviços especializados com 
            qualidade excepcional e compromisso total com resultados.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="service-item h-full animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="pb-4">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className="w-8 h-8 text-primary" />
                </div>
                
                <CardTitle className="text-2xl text-primary group-hover:text-accent transition-colors duration-300">
                  {service.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
                
                <ul className="space-y-3">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                      <span className="text-foreground font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  variant="outline" 
                  className="w-full group hover:bg-accent hover:text-accent-foreground hover:border-accent"
                  asChild
                >
                  <a href="#contato">
                    Solicitar Orçamento
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 animate-fade-up">
          <div className="bg-gradient-subtle rounded-3xl p-12 border border-border/50">
            <h3 className="text-3xl font-bold text-primary mb-4">
              Pronto para Começar Seu Projeto?
            </h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Nossa equipe especializada está pronta para transformar suas ideias em realidade 
              com qualidade, pontualidade e compromisso total.
            </p>
            <Button className="btn-hero" asChild>
              <a href="#contato">Solicitar Orçamento Gratuito</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
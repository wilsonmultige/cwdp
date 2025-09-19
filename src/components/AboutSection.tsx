import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Target, Eye, Heart } from "lucide-react";

const AboutSection = () => {
  const values = [
    {
      icon: Target,
      title: "Missão",
      description: "Atuar como referência no setor da construção civil, oferecendo soluções personalizadas e de excelência, com foco em resultados e total adequação às necessidades de cada cliente."
    },
    {
      icon: Eye,
      title: "Visão", 
      description: "Ser reconhecida em Portugal e na União Europeia como uma referência em construção civil, destacando-se pela excelência técnica e capacidade de adaptação a qualquer desafio."
    },
    {
      icon: Heart,
      title: "Valores",
      description: "Agimos com base em princípios éticos, reconhecendo que cada talento e conquista vêm de dedicação, buscando exercer nossa profissão com propósito e serviço ao próximo."
    }
  ];

  const achievements = [
    "15+ anos de experiência comprovada",
    "40+ profissionais qualificados",
    "Atuação em toda União Europeia", 
    "Escritório técnico especializado",
    "Compromisso com prazos e qualidade",
    "Soluções personalizadas"
  ];

  return (
    <section id="sobre" className="py-20 bg-construction-light-gray">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="animate-fade-up">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent font-medium mb-6">
              Sobre Nós
            </div>
            
            <h2 className="section-title mb-6">
              Transformando Sonhos em{" "}
              <span className="bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent">
                Realidade
              </span>
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              A CWDP Construção nasceu de uma visão empreendedora, com uma sólida experiência 
              no setor da construção civil, eletricidade e alvenaria. Iniciamos oficialmente 
              nossas atividades com o compromisso de entregar serviços de excelência, 
              adaptados às necessidades de cada cliente.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-foreground font-medium">{achievement}</span>
                </div>
              ))}
            </div>

            <Button className="btn-hero" asChild>
              <a href="#contato">Conhecer Mais</a>
            </Button>
          </div>

          {/* Right Content - Values Cards */}
          <div className="space-y-6 animate-slide-left">
            {values.map((value, index) => (
              <Card key={index} className="construction-card group">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 group-hover:from-accent/30 group-hover:to-accent/20 transition-all duration-300">
                      <value.icon className="w-6 h-6 text-accent" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-primary mb-3">
                        {value.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {value.description}
                      </p>
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

export default AboutSection;
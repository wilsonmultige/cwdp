import { Button } from "@/components/ui/button";
import { ArrowRight, Award, Users, Wrench } from "lucide-react";
import heroImage from "@/assets/hero-construction.jpg";

const HeroSection = () => {
  return (
    <section id="inicio" className="relative h-screen flex items-center bg-gradient-subtle overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Construção Civil Profissional"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
        <div className="max-w-4xl w-full">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/20 border border-accent/30 text-accent font-medium mb-6 animate-fade-up">
            <Award className="w-4 h-4 mr-2" />
            15+ Anos de Experiência
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight mb-6 animate-fade-up">
            Especialistas em{" "}
            <span className="bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent">
              Construção Civil
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-2xl leading-relaxed animate-fade-up">
            Transformamos seus projetos em realidade com qualidade excepcional, 
            tecnologia avançada e compromisso total com prazos e excelência.
          </p>

          {/* Services Tags */}
          <div className="flex flex-wrap gap-3 mb-10 animate-fade-up">
            {[
              { icon: Wrench, text: "Instalações Elétricas" },
              { icon: Users, text: "Construção Civil" },
              { icon: Award, text: "Manutenção" },
            ].map((service, index) => (
              <div
                key={index}
                className="flex items-center px-4 py-2 bg-primary-foreground/10 backdrop-blur-sm rounded-xl border border-primary-foreground/20"
              >
                <service.icon className="w-4 h-4 mr-2 text-accent" />
                <span className="text-primary-foreground font-medium">
                  {service.text}
                </span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up">
            <Button 
              size="lg" 
              className="btn-hero group"
              asChild
            >
              <a href="#contato" className="flex items-center">
                Começar Projeto
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="bg-transparent border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:border-primary-foreground/50"
              asChild
            >
              <a href="#projetos">Ver Projetos</a>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary-foreground/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary-foreground/50 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
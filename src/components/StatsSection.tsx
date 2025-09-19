import { useEffect, useState } from "react";
import { Building2, Wrench, Users, Award } from "lucide-react";

const StatsSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  const stats = [
    {
      icon: Building2,
      number: 150,
      label: "Projetos Realizados",
      suffix: "+"
    },
    {
      icon: Award,
      number: 50000,
      label: "Metros Construídos",
      suffix: "+"
    },
    {
      icon: Users,
      number: 40,
      label: "Especialistas",
      suffix: "+"
    },
    {
      icon: Wrench,
      number: 200,
      label: "Projetos Entregues",
      suffix: "+"
    }
  ];

  const Counter = ({ target, suffix = "" }: { target: number; suffix?: string }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!isVisible) return;

      const duration = 2000; // 2 seconds
      const steps = 60;
      const increment = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }, [target, isVisible]);

    return (
      <span className="stats-counter">
        {count.toLocaleString()}{suffix}
      </span>
    );
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    const section = document.getElementById("stats");
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      id="stats" 
      className="py-20 bg-gradient-primary text-primary-foreground relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border border-primary-foreground/20 rounded-full" />
        <div className="absolute top-40 right-20 w-24 h-24 border border-primary-foreground/20 rounded-full" />
        <div className="absolute bottom-20 left-1/4 w-40 h-40 border border-primary-foreground/20 rounded-full" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-primary-foreground">
            Números que Falam por Si
          </h2>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Anos de dedicação e excelência resultam em números impressionantes 
            e clientes satisfeitos em toda a Europa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-8 rounded-2xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 hover:bg-primary-foreground/15 transition-all duration-300 hover:scale-105 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-accent/20 border border-accent/30">
                <stat.icon className="w-8 h-8 text-accent" />
              </div>
              
              <div className="mb-2">
                <Counter target={stat.number} suffix={stat.suffix} />
              </div>
              
              <p className="text-primary-foreground/80 font-medium text-lg">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
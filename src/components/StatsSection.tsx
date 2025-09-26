import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Building2, Wrench, Users, Award, Star, Zap } from "lucide-react";

interface Stat {
  id: string;
  icon_name: string;
  number: number;
  label: string;
  suffix: string;
  display_order: number;
  is_active: boolean;
}

const StatsSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Fetch stats from database
  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stats')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      
      if (error) {
        console.error('Error fetching stats:', error);
        throw error;
      }
      
      console.log('StatsSection - Stats data:', data);
      return data as Stat[];
    },
  });

  // Fetch section content from settings
  const { data: settings } = useQuery({
    queryKey: ['settings', 'stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .in('key', ['stats_title', 'stats_description']);
      
      if (error) throw error;
      
      const settingsMap = data.reduce((acc: Record<string, string>, setting) => {
        acc[setting.key] = setting.value || '';
        return acc;
      }, {});
      
      console.log('StatsSection - Settings data:', settingsMap);
      return settingsMap;
    },
  });

  const getIcon = (iconName: string) => {
    const icons = {
      Building2,
      Wrench,
      Users,
      Award,
      Star,
      Zap,
    };
    return icons[iconName as keyof typeof icons] || Building2;
  };

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

  if (!stats?.length) {
    return null;
  }

  return (
    <section 
      id="stats" 
      className="py-20 bg-primary text-white relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 border border-primary-foreground/20 rounded-full animate-pulse" />
        <div className="absolute top-40 right-20 w-24 h-24 border border-primary-foreground/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/4 w-40 h-40 border border-primary-foreground/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
            {settings?.stats_title || "Números que Falam por Si"}
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            {settings?.stats_description || "Anos de dedicação e excelência resultam em números impressionantes e clientes satisfeitos."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = getIcon(stat.icon_name);
            
            return (
              <div
                key={stat.id}
                className="text-center p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-white/10 border border-white/20">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                
                <div className="mb-2">
                  <Counter target={stat.number} suffix={stat.suffix} />
                </div>
                
                <p className="text-white/70 font-medium text-lg">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
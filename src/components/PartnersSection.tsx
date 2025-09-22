import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";

interface Partner {
  id: string;
  name: string;
  logo_url: string;
  website_url?: string;
  description?: string;
  is_active: boolean;
  display_order: number;
}

const PartnersSection = () => {
  const { data: partners, isLoading } = useQuery({
    queryKey: ['partners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      
      if (error) throw error;
      return data as Partner[];
    },
  });

  if (isLoading) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="section-title mb-6">Nossos Parceiros</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Trabalhamos com as melhores empresas do setor
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="bg-muted h-16 rounded"></div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="section-title mb-6">Nossos Parceiros</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Trabalhamos com as melhores empresas do setor para entregar projetos de excelência
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {partners?.map((partner, index) => (
            <Card
              key={partner.id}
              className="construction-card group cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="p-6 flex items-center justify-center h-32">
                {partner.website_url ? (
                  <a
                    href={partner.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300"
                    title={partner.description || partner.name}
                  >
                    <img
                      src={partner.logo_url}
                      alt={`Logo ${partner.name}`}
                      className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                      onError={(e) => {
                        e.currentTarget.src = `/api/placeholder/120/60?text=${partner.name}`;
                      }}
                    />
                  </a>
                ) : (
                  <div className="w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <img
                      src={partner.logo_url}
                      alt={`Logo ${partner.name}`}
                      className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                      onError={(e) => {
                        e.currentTarget.src = `/api/placeholder/120/60?text=${partner.name}`;
                      }}
                    />
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
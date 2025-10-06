import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import StatsSection from "@/components/StatsSection";
import ServicesSection from "@/components/ServicesSection";
import ProjectGallery from "@/components/ProjectGallery";
import PartnersSection from "@/components/PartnersSection";
import ContactSection from "@/components/ContactSection";
import GDPRCompliance from "@/components/GDPRCompliance";
import Footer from "@/components/Footer";
import FloatingContactButtons from "@/components/FloatingContactButtons";

const Index = () => {
  // Fetch setting to show/hide projects section
  const { data: showProjectsSetting } = useQuery({
    queryKey: ['setting-show-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'show_projects_section')
        .single();
      
      if (error) return { value: 'false' };
      return data;
    },
  });

  const showProjects = showProjectsSetting?.value === 'true';

  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <StatsSection />
        <ServicesSection />
        {showProjects && <ProjectGallery />}
        <PartnersSection />
        <ContactSection />
      </main>
      <Footer />
      <GDPRCompliance />
      <FloatingContactButtons />
    </div>
  );
};

export default Index;

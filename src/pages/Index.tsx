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
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <StatsSection />
        <ServicesSection />
        <ProjectGallery />
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

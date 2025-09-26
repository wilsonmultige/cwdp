import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Phone, Mail, MapPin } from "lucide-react";
import logo from "@/assets/logo.png";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Fetch site logo from settings
  const { data: logoUrl } = useQuery({
    queryKey: ['settings', 'site_logo_url'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'site_logo_url')
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching logo:', error);
        return null;
      }
      
      return data?.value || null;
    },
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 100;
      setIsScrolled(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: "#inicio", label: "Início" },
    { href: "#sobre", label: "Sobre" },
    { href: "#servicos", label: "Serviços" },
    { href: "#projetos", label: "Projetos" },
    { href: "#contato", label: "Contato" },
  ];

  const NavLink = ({ href, label, onClick }: { href: string; label: string; onClick?: () => void }) => (
    <a
      href={href}
      className="text-foreground hover:text-accent transition-colors duration-200 font-medium"
      onClick={onClick}
    >
      {label}
    </a>
  );

  return (
    <>
      {/* Top Bar - Hidden when scrolled */}
      <div className={`bg-primary text-primary-foreground py-2 text-sm transition-all duration-300 ${isScrolled ? 'hidden' : 'block'}`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <div className="flex items-center space-x-2 lg:space-x-6">
              <div className="flex items-center space-x-2 text-xs sm:text-sm">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="hidden sm:inline">Rua Dom Dinis, Qta Dálias, 1685-229 Famões</span>
                <span className="sm:hidden">Famões</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-6">
              <div className="flex items-center space-x-2 text-xs sm:text-sm">
                <Phone className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span>+351 910 375 217</span>
              </div>
              <div className="flex items-center space-x-2 text-xs sm:text-sm">
                <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="hidden sm:inline">contato@cwdp.pt</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className={`bg-background/95 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-soft transition-all duration-300 ${isScrolled ? 'h-[60px]' : 'h-[80px]'}`}>
        <div className="container mx-auto px-4 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <img 
                src={logoUrl || logo} 
                alt="CWDP Logo" 
                className={`transition-all duration-300 ${isScrolled ? 'h-8 w-8 sm:h-10 sm:w-10' : 'h-10 w-10 sm:h-12 sm:w-12'}`}
              />
              <div className="flex flex-col">
                <span className={`font-bold text-primary transition-all duration-300 ${isScrolled ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'}`}>
                  CWDP
                </span>
                <span className={`text-muted-foreground transition-all duration-300 ${isScrolled ? 'text-xs hidden sm:block' : 'text-xs sm:text-sm'}`}>
                  Construção Civil
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-4 xl:space-x-8">
              {navItems.map((item) => (
                <NavLink key={item.href} {...item} />
              ))}
            </div>

            {/* CTA Button Desktop */}
            <div className="hidden lg:block">
              <Button 
                className={`btn-hero transition-all duration-300 ${isScrolled ? 'px-3 py-1 text-sm' : 'px-4 py-2'}`}
                asChild
              >
                <a href="#contato">
                  <span className={isScrolled ? 'hidden xl:inline' : ''}>Pedir Orçamento</span>
                  <span className={isScrolled ? 'xl:hidden' : 'hidden'}>Orçamento</span>
                </a>
              </Button>
            </div>

            {/* Mobile Menu */}
            <div className="lg:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className={`transition-all duration-300 ${isScrolled ? 'h-8 w-8' : 'h-10 w-10'}`}>
                    <Menu className={`transition-all duration-300 ${isScrolled ? 'h-4 w-4' : 'h-5 w-5'}`} />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px]">
                  <div className="flex flex-col space-y-6 mt-8">
                    {navItems.map((item) => (
                      <NavLink
                        key={item.href}
                        {...item}
                        onClick={() => setIsOpen(false)}
                      />
                    ))}
                    <Button 
                      className="btn-hero mt-6"
                      asChild
                    >
                      <a href="#contato" onClick={() => setIsOpen(false)}>
                        Pedir Orçamento
                      </a>
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
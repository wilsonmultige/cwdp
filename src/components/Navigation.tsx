import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Phone, Mail, MapPin } from "lucide-react";
import logo from "@/assets/logo.png";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "#inicio", label: "Início" },
    { href: "#sobre", label: "Sobre" },
    { href: "#servicos", label: "Serviços" },
    { href: "#projetos", label: "Projetos" },
    { href: "/admin", label: "Admin" },
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
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground py-2 text-sm">
        <div className="container mx-auto px-4 flex flex-wrap justify-between items-center">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>Rua Dom Dinis, Qta Dálias, 1685-229 Famões</span>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>+351 910 375 217</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>contato@cwdp.pt</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-background/95 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <img src={logo} alt="CWDP Logo" className="h-12 w-12" />
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-primary">CWDP</span>
                <span className="text-sm text-muted-foreground">Construção Civil</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <NavLink key={item.href} {...item} />
              ))}
            </div>

            {/* CTA Button Desktop */}
            <div className="hidden md:block">
              <Button 
                className="btn-hero"
                asChild
              >
                <a href="#contato">Pedir Orçamento</a>
              </Button>
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
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
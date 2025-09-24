import { Phone, Mail, MapPin, Instagram, Facebook, Linkedin } from "lucide-react";
import logo from "@/assets/logo.png";
import GDPRModal from "./GDPRModal";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Início", href: "#inicio" },
    { name: "Sobre", href: "#sobre" },
    { name: "Serviços", href: "#servicos" },
    { name: "Projetos", href: "#projetos" },
    { name: "Contato", href: "#contato" }
  ];

  const gdprLinks = [
    "Política de Privacidade",
    "Política de Cookies",
    "Termos de Serviço",
    "Gestão de Consentimentos",
    "Direitos do Titular",
    "Contactar DPO"
  ];

  const socialLinks = [
    { icon: Instagram, href: "https://instagram.com/cwdp.pt", label: "Instagram" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Linkedin, href: "#", label: "LinkedIn" }
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <img src={logo} alt="CWDP Logo" className="h-12 w-12" />
              <div className="flex flex-col">
                <span className="text-2xl font-bold">CWDP</span>
                <span className="text-sm text-primary-foreground/80">Construção Civil</span>
              </div>
            </div>
            
            <p className="text-primary-foreground/90 leading-relaxed">
              Especialistas em construção civil, instalações elétricas e manutenção. 
              Transformando projetos em realidade há mais de 15 anos.
            </p>
            
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all duration-300 group"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-accent">Links Rápidos</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/80 hover:text-accent transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-2 h-2 rounded-full bg-accent/50 mr-3 group-hover:bg-accent transition-colors" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* GDPR Compliance */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-accent">Conformidade RGPD</h3>
            <ul className="space-y-3">
              {gdprLinks.map((link, index) => (
                <li key={index}>
                  <GDPRModal type={
                    link === "Política de Privacidade" ? "privacy" :
                    link === "Política de Cookies" ? "cookies" :
                    link === "Termos de Serviço" ? "terms" :
                    link === "Gestão de Consentimentos" ? "consent" :
                    link === "Direitos do Titular" ? "rights" :
                    "dpo"
                  }>
                    <button className="text-primary-foreground/80 hover:text-accent transition-colors duration-200 flex items-center group text-left">
                      <span className="w-2 h-2 rounded-full bg-accent/50 mr-3 group-hover:bg-accent transition-colors" />
                      {link}
                    </button>
                  </GDPRModal>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-accent">Contato</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                <div className="text-primary-foreground/80 text-sm">
                  <p>Rua Dom Dinis</p>
                  <p>Qta Dálias r/c Direito 89</p>
                  <p>1685-229 Famões</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-accent flex-shrink-0" />
                <div className="text-primary-foreground/80 text-sm">
                  <p>+351 910 375 217</p>
                  <p>+34 614 607 639</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-accent flex-shrink-0" />
                <div className="text-primary-foreground/80 text-sm">
                  <p>contato@cwdp.pt</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-primary-foreground/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-primary-foreground/80 text-sm">
              © {currentYear} CWDP Construção. Todos os direitos reservados.
            </p>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 text-sm">
            <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors">
              Política de Privacidade
            </a>
            <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors">
              Termos de Serviço
            </a>
            <span className="text-primary-foreground/60">
              Site criado por{" "}
              <a 
                href="https://www.casacriativami.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-accent hover:text-accent/80 transition-colors font-medium"
              >
                Casa Criativa M&I
              </a>
            </span>
          </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
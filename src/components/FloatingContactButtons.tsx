import { Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const FloatingContactButtons = () => {
  const isMobile = useIsMobile();
  
  const handleWhatsApp = () => {
    const message = encodeURIComponent("Olá! Gostaria de solicitar um orçamento.");
    window.open(`https://wa.me/351910375217?text=${message}`, "_blank");
  };

  const handleCall = () => {
    window.open("tel:+351910375217", "_self");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* WhatsApp Button */}
      <Button
        onClick={handleWhatsApp}
        className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        size="icon"
        aria-label="Contactar via WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>

      {/* Call Button - Only on mobile */}
      {isMobile && (
        <Button
          onClick={handleCall}
          className="w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          size="icon"
          aria-label="Ligar agora"
        >
          <Phone className="w-6 h-6" />
        </Button>
      )}
    </div>
  );
};

export default FloatingContactButtons;
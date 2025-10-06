import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Cookie, Shield, X } from "lucide-react";

const GDPRCompliance = () => {
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false
  });

  useEffect(() => {
    const consent = localStorage.getItem('gdpr-consent');
    if (!consent) {
      setShowCookieBanner(true);
    } else {
      setCookiePreferences(JSON.parse(consent));
    }
  }, []);

  const handleAcceptAll = () => {
    const preferences = { necessary: true, analytics: true, marketing: true };
    setCookiePreferences(preferences);
    localStorage.setItem('gdpr-consent', JSON.stringify(preferences));
    setShowCookieBanner(false);
  };

  const handleAcceptNecessary = () => {
    const preferences = { necessary: true, analytics: false, marketing: false };
    setCookiePreferences(preferences);
    localStorage.setItem('gdpr-consent', JSON.stringify(preferences));
    setShowCookieBanner(false);
  };

  const handleCustomPreferences = () => {
    localStorage.setItem('gdpr-consent', JSON.stringify(cookiePreferences));
    localStorage.setItem('gdpr-consent-date', new Date().toISOString());
    setShowCookieBanner(false);
  };

  const handleCloseBanner = () => {
    // Save only necessary cookies if user closes without selecting
    handleAcceptNecessary();
  };

  if (!showCookieBanner) return null;

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
        <Card className="bg-background/95 backdrop-blur-md border shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <Cookie className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Consentimento de Cookies</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Utilizamos cookies para melhorar sua experiência, analisar o tráfego do site e 
                    personalizar conteúdo. Você pode escolher quais tipos de cookies aceitar.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button size="sm" onClick={handleAcceptAll}>
                      Aceitar Todos
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleAcceptNecessary}>
                      Apenas Necessários
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="ghost">
                          <Shield className="w-4 h-4 mr-2" />
                          Personalizar
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Preferências de Cookies</DialogTitle>
                        </DialogHeader>
                        <ScrollArea className="max-h-[60vh]">
                          <div className="space-y-6 p-1">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium">Cookies Necessários</h4>
                                  <p className="text-sm text-muted-foreground">
                                    Essenciais para o funcionamento básico do site.
                                  </p>
                                 </div>
                                 <Switch 
                                   checked={cookiePreferences.necessary} 
                                   disabled 
                                 />
                               </div>
                               
                               <Separator />
                               
                               <div className="flex items-center justify-between">
                                 <div>
                                   <h4 className="font-medium">Cookies Analíticos</h4>
                                   <p className="text-sm text-muted-foreground">
                                     Nos ajudam a entender como você usa nosso site.
                                   </p>
                                 </div>
                                 <Switch 
                                   checked={cookiePreferences.analytics}
                                   onCheckedChange={(checked) => setCookiePreferences(prev => ({ 
                                     ...prev, 
                                     analytics: checked 
                                   }))}
                                 />
                               </div>
                               
                               <Separator />
                               
                               <div className="flex items-center justify-between">
                                 <div>
                                   <h4 className="font-medium">Cookies de Marketing</h4>
                                   <p className="text-sm text-muted-foreground">
                                     Usados para mostrar anúncios relevantes.
                                   </p>
                                 </div>
                                 <Switch 
                                   checked={cookiePreferences.marketing}
                                   onCheckedChange={(checked) => setCookiePreferences(prev => ({ 
                                     ...prev, 
                                     marketing: checked 
                                   }))}
                                 />
                              </div>
                            </div>
                          </div>
                        </ScrollArea>
                        <div className="flex justify-end gap-2 pt-4">
                          <Button variant="outline" onClick={() => setShowCookieBanner(false)}>
                            Cancelar
                          </Button>
                          <Button onClick={handleCustomPreferences}>
                            Salvar Preferências
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleCloseBanner}
                className="flex-shrink-0"
                aria-label="Fechar banner"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default GDPRCompliance;
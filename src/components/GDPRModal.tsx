import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Eye, UserCheck, Phone, Mail, FileText } from "lucide-react";

interface GDPRModalProps {
  children: React.ReactNode;
  type: "privacy" | "cookies" | "terms" | "consent" | "rights" | "dpo";
}

const GDPRModal = ({ children, type }: GDPRModalProps) => {
  const [open, setOpen] = useState(false);

  const getTitle = () => {
    const titles = {
      privacy: "Política de Privacidade",
      cookies: "Política de Cookies",
      terms: "Termos de Serviço",
      consent: "Gestão de Consentimentos",
      rights: "Direitos do Titular dos Dados",
      dpo: "Contactar Encarregado de Proteção de Dados"
    };
    return titles[type];
  };

  const getIcon = () => {
    const icons = {
      privacy: Shield,
      cookies: Eye,
      terms: FileText,
      consent: UserCheck,
      rights: UserCheck,
      dpo: Mail
    };
    const IconComponent = icons[type];
    return <IconComponent className="h-5 w-5" />;
  };

  const getContent = () => {
    switch (type) {
      case "privacy":
        return (
          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Responsável pelo Tratamento
              </h3>
              <p className="text-sm text-muted-foreground">
                <strong>CWDP Construção Civil</strong><br />
                Rua Dom Dinis, Qta Dálias r/c Direito 89<br />
                1685-229 Famões, Portugal<br />
                Email: contato@cwdp.pt<br />
                Telefone: +351 910 375 217
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Dados Coletados</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• <strong>Dados de Identificação:</strong> Nome, email, telefone</li>
                <li>• <strong>Dados de Navegação:</strong> Cookies técnicos e analíticos</li>
                <li>• <strong>Dados de Comunicação:</strong> Mensagens enviadas através de formulários</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Finalidades do Tratamento</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Prestação de serviços solicitados</li>
                <li>• Comunicação comercial (com consentimento)</li>
                <li>• Análise de desempenho do website</li>
                <li>• Cumprimento de obrigações legais</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Base Legal</h3>
              <p className="text-sm text-muted-foreground">
                O tratamento dos seus dados pessoais baseia-se no consentimento explícito, 
                no interesse legítimo para prestação de serviços e no cumprimento de obrigações legais.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Partilha de Dados</h3>
              <p className="text-sm text-muted-foreground">
                Os seus dados não são vendidos ou partilhados com terceiros, exceto quando 
                necessário para a prestação do serviço ou por obrigação legal.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Prazo de Conservação</h3>
              <p className="text-sm text-muted-foreground">
                Os dados são conservados pelo período necessário aos fins para que foram 
                coletados ou conforme exigido por lei.
              </p>
            </section>
          </div>
        );

      case "cookies":
        return (
          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-semibold mb-3">O que são Cookies?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Cookies são pequenos ficheiros de texto que são armazenados no seu dispositivo 
                quando visita o nosso website. Utilizamos cookies para melhorar a sua experiência 
                de navegação.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Tipos de Cookies Utilizados</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm">Cookies Necessários</h4>
                  <p className="text-xs text-muted-foreground">
                    Essenciais para o funcionamento do website. Não podem ser desativados.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Cookies de Análise</h4>
                  <p className="text-xs text-muted-foreground">
                    Ajudam-nos a compreender como interage com o website através de informações 
                    coletadas de forma anónima.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Cookies de Marketing</h4>
                  <p className="text-xs text-muted-foreground">
                    Utilizados para personalizar anúncios e medir a eficácia de campanhas 
                    publicitárias.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Gerir Cookies</h3>
              <p className="text-sm text-muted-foreground">
                Pode gerir as suas preferências de cookies através das configurações do seu 
                navegador ou utilizando o nosso centro de preferências.
              </p>
            </section>
          </div>
        );

      case "terms":
        return (
          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-semibold mb-3">Aceitação dos Termos</h3>
              <p className="text-sm text-muted-foreground">
                Ao utilizar este website, aceita automaticamente estes termos de serviço. 
                Se não concorda, por favor não utilize o website.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Serviços Oferecidos</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Construção civil e obras</li>
                <li>• Instalações elétricas</li>
                <li>• Manutenção e reparações</li>
                <li>• Consultoria técnica</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Responsabilidades do Cliente</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Fornecer informações precisas e atualizadas</li>
                <li>• Cumprir com os acordos estabelecidos</li>
                <li>• Respeitar os prazos de pagamento</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Limitação de Responsabilidade</h3>
              <p className="text-sm text-muted-foreground">
                A CWDP não se responsabiliza por danos indiretos, lucros cessantes ou 
                outras perdas decorrentes da utilização dos nossos serviços, exceto 
                nos casos previstos por lei.
              </p>
            </section>
          </div>
        );

      case "rights":
        return (
          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-semibold mb-3">Os Seus Direitos</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Enquanto titular dos dados, tem os seguintes direitos ao abrigo do RGPD:
              </p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm">Direito de Acesso</h4>
                  <p className="text-xs text-muted-foreground">
                    Pode solicitar uma cópia dos dados pessoais que tratamos sobre si.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Direito de Retificação</h4>
                  <p className="text-xs text-muted-foreground">
                    Pode solicitar a correção de dados inexatos ou incompletos.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Direito ao Apagamento</h4>
                  <p className="text-xs text-muted-foreground">
                    Pode solicitar a eliminação dos seus dados pessoais ("direito a ser esquecido").
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Direito de Portabilidade</h4>
                  <p className="text-xs text-muted-foreground">
                    Pode solicitar a transferência dos seus dados para outro responsável.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Direito de Oposição</h4>
                  <p className="text-xs text-muted-foreground">
                    Pode opor-se ao tratamento dos seus dados para fins de marketing direto.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Como Exercer os Direitos</h3>
              <p className="text-sm text-muted-foreground">
                Para exercer qualquer destes direitos, contacte-nos através do email 
                contato@cwdp.pt ou utilize o formulário de contacto disponível no website.
              </p>
            </section>
          </div>
        );

      case "dpo":
        return (
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <Mail className="h-12 w-12 text-primary" />
            </div>
            
            <section>
              <h3 className="text-lg font-semibold mb-3">Encarregado de Proteção de Dados</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Para questões relacionadas com a proteção de dados pessoais, 
                pode contactar o nosso Encarregado de Proteção de Dados:
              </p>
              
              <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span className="font-medium">contato@cwdp.pt</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span className="font-medium">+351 910 375 217</span>
                </div>
              </div>
            </section>

            <section>
              <p className="text-xs text-muted-foreground">
                Responderemos ao seu pedido no prazo máximo de 30 dias.
              </p>
            </section>
          </div>
        );

      default:
        return <p>Conteúdo não encontrado.</p>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getIcon()}
            {getTitle()}
          </DialogTitle>
          <DialogDescription>
            Informações sobre proteção de dados e privacidade
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          {getContent()}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default GDPRModal;
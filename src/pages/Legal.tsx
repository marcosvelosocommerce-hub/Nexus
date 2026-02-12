import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Shield, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Legal = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 fade-in">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header de Navegação */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Legal e Privacidade</h1>
        </div>

        <div className="grid gap-6">
          
          {/* Política de Privacidade */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Política de Privacidade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px] rounded-md border p-4 text-sm text-muted-foreground bg-muted/30">
                <h4 className="font-bold text-foreground mb-2">1. Coleta de Dados</h4>
                <p className="mb-4">
                  O Nexus coleta apenas os dados estritamente necessários para o funcionamento do aplicativo:
                  email (para autenticação), dados de transações financeiras inseridos manualmente e hábitos monitorados.
                </p>
                
                <h4 className="font-bold text-foreground mb-2">2. Uso das Informações</h4>
                <p className="mb-4">
                  Seus dados são utilizados exclusivamente para gerar estatísticas pessoais e gamificação dentro do aplicativo.
                  Não compartilhamos seus dados financeiros com terceiros.
                </p>

                <h4 className="font-bold text-foreground mb-2">3. Exclusão de Dados</h4>
                <p className="mb-4">
                  Conforme exigido pela LGPD e diretrizes das lojas de aplicativos, você pode excluir sua conta e todos os seus dados
                  permanentemente acessando a aba "Perfil" e selecionando "Excluir Conta".
                </p>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Termos de Uso */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Termos de Uso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px] rounded-md border p-4 text-sm text-muted-foreground bg-muted/30">
                <h4 className="font-bold text-foreground mb-2">1. Aceitação</h4>
                <p className="mb-4">
                  Ao usar o Nexus, você concorda com estes termos. O serviço é fornecido "como está", sem garantias implícitas.
                </p>
                
                <h4 className="font-bold text-foreground mb-2">2. Responsabilidade</h4>
                <p className="mb-4">
                  O usuário é o único responsável pela segurança de sua senha e pela precisão dos dados financeiros inseridos.
                  O Nexus não realiza movimentações bancárias reais.
                </p>

                <h4 className="font-bold text-foreground mb-2">3. Planos e Pagamentos</h4>
                <p className="mb-4">
                  Funcionalidades Premium podem ser adquiridas via assinatura. O cancelamento pode ser feito a qualquer momento
                  através das configurações da loja de aplicativos ou gerenciador de pagamentos.
                </p>
              </ScrollArea>
            </CardContent>
          </Card>

        </div>
        
        <p className="text-center text-xs text-muted-foreground mt-8">
            Última atualização: Fevereiro de 2026
        </p>

      </div>
    </div>
  );
};

export default Legal;
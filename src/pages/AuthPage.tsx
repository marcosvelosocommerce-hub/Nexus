import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { LogIn, UserPlus, Lock, Share, Eye, EyeOff, FileText, ShieldAlert } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const AuthPage = () => {
  const { session, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados dos inputs e checkbox
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Estados dos Modais (Pop-ups)
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  // Estados para o iPhone
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    const checkStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true;
    setIsStandalone(checkStandalone);

    const checkIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(checkIOS);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleAuth = async (e: React.FormEvent, isLogin: boolean) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Bem-vindo de volta ao Nexus!");
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast.success("Conta criada! Verifique a sua caixa de e-mail para confirmar.");
      }
    } catch (error: any) {
      toast.error(error.message || "Ocorreu um erro na autenticação.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      toast.error("Por favor, digite o seu e-mail no campo acima para recuperar a senha.");
      return;
    }
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) throw error;
      toast.success("E-mail de recuperação enviado! Verifique a sua caixa de entrada.");
    } catch (error: any) {
      toast.error(error.message || "Erro ao enviar e-mail de recuperação.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4 relative overflow-hidden">
      
      {/* NOVO FUNDO PROFISSIONAL */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute inset-0 bg-black/60 [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/15 blur-[120px] opacity-60 animate-pulse" />
      </div>

      <Card className="z-10 w-full max-w-md border-zinc-800 bg-zinc-950/60 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <CardHeader className="space-y-1 text-center pb-6">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 border border-primary/20">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-white">Acesso ao Sistema</CardTitle>
          <CardDescription className="text-zinc-400">
            Entre na sua conta ou crie uma nova para começar.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-zinc-900 border border-zinc-800">
              <TabsTrigger value="login" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
                <LogIn className="mr-2 h-4 w-4" /> Entrar
              </TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
                <UserPlus className="mr-2 h-4 w-4" /> Criar Conta
              </TabsTrigger>
            </TabsList>

            {/* ABA LOGIN */}
            <TabsContent value="login">
              <form onSubmit={(e) => handleAuth(e, true)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-login" className="text-zinc-300">E-mail</Label>
                  <Input id="email-login" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-zinc-900 border-zinc-800 text-white focus-visible:ring-primary" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password-login" className="text-zinc-300">Senha</Label>
                  <div className="relative">
                    <Input id="password-login" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-zinc-900 border-zinc-800 text-white focus-visible:ring-primary pr-10 [&::-ms-reveal]:hidden" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="flex justify-end pt-1">
                    <button type="button" onClick={handleResetPassword} className="text-xs text-primary hover:underline hover:text-primary/80 transition-colors">
                      Esqueceu a senha?
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full font-bold shadow-lg shadow-primary/20" disabled={isLoading}>
                  {isLoading ? "Entrando..." : "Entrar no Nexus"}
                </Button>
              </form>
            </TabsContent>

            {/* ABA REGISTRO */}
            <TabsContent value="register">
              <form onSubmit={(e) => handleAuth(e, false)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-register" className="text-zinc-300">E-mail</Label>
                  <Input id="email-register" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-zinc-900 border-zinc-800 text-white focus-visible:ring-primary pr-10 [&::-ms-reveal]:hidden" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password-register" className="text-zinc-300">Senha</Label>
                  <div className="relative">
                    <Input id="password-register" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-zinc-900 border-zinc-800 text-white focus-visible:ring-primary pr-10" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Checkbox de Termos */}
                <div className="flex items-start space-x-2 pt-2 pb-2">
                  <Checkbox 
                    id="terms" 
                    checked={termsAccepted} 
                    onCheckedChange={(checked) => setTermsAccepted(checked as boolean)} 
                    className="border-zinc-700 data-[state=checked]:bg-primary data-[state=checked]:text-black mt-0.5" 
                  />
                  <Label htmlFor="terms" className="text-xs text-zinc-400 leading-snug">
                    Li e concordo com os{" "}
                    <button type="button" onClick={() => setShowTerms(true)} className="text-primary hover:underline font-medium">Termos e Condições</button>
                    {" "}e a{" "}
                    <button type="button" onClick={() => setShowPrivacyPolicy(true)} className="text-primary hover:underline font-medium">Política de Privacidade</button>.
                  </Label>
                </div>

                <Button type="submit" className="w-full font-bold shadow-lg shadow-primary/20" disabled={isLoading || !termsAccepted}>
                  {isLoading ? "Criando..." : "Criar Conta"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* MODAL: POLÍTICA DE PRIVACIDADE */}
      <Dialog open={showPrivacyPolicy} onOpenChange={setShowPrivacyPolicy}>
        <DialogContent className="bg-zinc-950 border-zinc-800 text-white sm:max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2 text-primary">
              <ShieldAlert className="h-5 w-5" />
              Política de Privacidade
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-4 text-zinc-300 text-sm scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
            <p>A sua privacidade é importante para nós. É política do NEXUS respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site NEXUS, e outros sites que possuímos e operamos.</p>
            <p>Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento. Também informamos por que estamos coletando e como será usado.</p>
            <p>Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado. Quando armazenamos dados, protegemos dentro de meios comercialmente aceitáveis ​​para evitar perdas e roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados.</p>
            <p>Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei. O nosso site pode ter links para sites externos que não são operados por nós. Esteja ciente de que não temos controle sobre o conteúdo e práticas desses sites e não podemos aceitar responsabilidade por suas respectivas políticas de privacidade.</p>
            <p>O serviço Google AdSense que usamos para veicular publicidade usa um cookie DoubleClick para veicular anúncios mais relevantes em toda a Web e limitar o número de vezes que um determinado anúncio é exibido para você.</p>
            
            <h4 className="font-bold text-white mt-4">Compromisso do Usuário</h4>
            <p>O usuário se compromete a fazer uso adequado dos conteúdos e da informação que o NEXUS oferece no site e com caráter enunciativo, mas não limitativo:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>A) Não se envolver em atividades que sejam ilegais ou contrárias à boa fé a à ordem pública;</li>
              <li>B) Não difundir propaganda ou conteúdo de natureza racista, xenofóbica, jogos de sorte ou azar, qualquer tipo de pornografia ilegal, de apologia ao terrorismo ou contra os direitos humanos;</li>
              <li>C) Não causar danos aos sistemas físicos (hardwares) e lógicos (softwares) do NEXUS, de seus fornecedores ou terceiros.</li>
            </ul>
            
            <p className="mt-4 text-xs text-zinc-500">Esta política é efetiva a partir de 14 February 2026.</p>
          </div>
          <div className="pt-4 flex justify-end">
            <Button onClick={() => setShowPrivacyPolicy(false)} className="bg-primary hover:bg-primary/90 text-black font-bold">
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL: TERMOS E CONDIÇÕES */}
      <Dialog open={showTerms} onOpenChange={setShowTerms}>
        <DialogContent className="bg-zinc-950 border-zinc-800 text-white sm:max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2 text-primary">
              <FileText className="h-5 w-5" />
              Termos e Condições
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-4 text-zinc-300 text-sm scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
            <h4 className="font-bold text-white">1. Termos</h4>
            <p>Ao acessar ao site NEXUS, concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis ​​e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis. Se você não concordar com algum desses termos, está proibido de usar ou acessar este site.</p>
            
            <h4 className="font-bold text-white mt-4">2. Uso de Licença</h4>
            <p>É concedida permissão para baixar temporariamente uma cópia dos materiais no site NEXUS, apenas para visualização transitória pessoal e não comercial. Esta é a concessão de uma licença, não uma transferência de título e, sob esta licença, você não pode:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Modificar ou copiar os materiais;</li>
              <li>Usar os materiais para qualquer finalidade comercial ou para exibição pública;</li>
              <li>Tentar descompilar ou fazer engenharia reversa de qualquer software contido no site NEXUS;</li>
              <li>Remover quaisquer direitos autorais ou outras notações de propriedade dos materiais.</li>
            </ul>

            <h4 className="font-bold text-white mt-4">3. Isenção de responsabilidade</h4>
            <p>Os materiais no site da NEXUS são fornecidos 'como estão'. NEXUS não oferece garantias, expressas ou implícitas, e, por este meio, isenta e nega todas as outras garantias.</p>

            <h4 className="font-bold text-white mt-4">4. Limitações</h4>
            <p>Em nenhum caso o NEXUS ou seus fornecedores serão responsáveis ​​por quaisquer danos (incluindo, sem limitação, danos por perda de dados ou lucro ou devido a interrupção dos negócios) decorrentes do uso ou da incapacidade de usar os materiais.</p>

            <h4 className="font-bold text-white mt-4">5. Precisão dos materiais</h4>
            <p>Os materiais exibidos no site da NEXUS podem incluir erros técnicos, tipográficos ou fotográficos. NEXUS não garante que qualquer material em seu site seja preciso, completo ou atual.</p>

            <h4 className="font-bold text-white mt-4">6. Links e Modificações</h4>
            <p>O NEXUS não analisou todos os sites vinculados ao seu site e não é responsável pelo conteúdo de nenhum site vinculado. O NEXUS pode revisar estes termos de serviço do site a qualquer momento, sem aviso prévio.</p>
          </div>
          <div className="pt-4 flex justify-end">
            <Button onClick={() => setShowTerms(false)} className="bg-primary hover:bg-primary/90 text-black font-bold">
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* INSTRUÇÕES IOS - MANTIDAS */}
      {isIOS && !isStandalone && (
        <div className="z-10 mt-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <Button variant="outline" onClick={() => setShowIOSInstructions(true)} className="border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:text-white hover:bg-zinc-800 flex items-center gap-2 rounded-full px-6">
            <Share className="h-4 w-4" />
            Como instalar no iPhone
          </Button>
        </div>
      )}

      <div className="absolute bottom-8 z-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
        <a href="https://nexusbrasil.vercel.app" className="group flex items-center gap-2 text-[10px] font-medium tracking-widest uppercase text-zinc-500 hover:text-primary transition-colors">
          <span className="h-px w-6 bg-zinc-800 group-hover:bg-primary/50 transition-colors" />
          Voltar para o site principal
        </a>
      </div>

      <Dialog open={showIOSInstructions} onOpenChange={setShowIOSInstructions}>
        <DialogContent className="bg-zinc-950 border-zinc-800 text-white sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Share className="h-5 w-5 text-blue-400" />
              Instalar no iPhone
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 pt-4 text-zinc-300">
            <p className="text-sm">Para uma melhor experiência, instale o Nexus diretamente na sua tela inicial:</p>
            <ol className="list-decimal space-y-4 pl-5 text-sm">
              <li>Toque no botão <strong className="text-blue-400">Compartilhar</strong> na barra inferior do Safari.</li>
              <li>Role o menu para baixo e selecione <strong className="text-white">"Adicionar à Tela de Início"</strong>.</li>
              <li>Toque em <strong className="text-blue-400">"Adicionar"</strong> no canto superior direito.</li>
            </ol>
            <div className="pt-4 flex justify-center">
              <Button onClick={() => setShowIOSInstructions(false)} className="w-full bg-zinc-800 hover:bg-zinc-700 text-white">
                Entendi
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AuthPage;
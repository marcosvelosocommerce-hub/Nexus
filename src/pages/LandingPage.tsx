import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { Zap, Shield, Trophy, ArrowRight, Download, LayoutDashboard, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const LandingPage = () => {
  const { session, loading } = useAuth();
  const { canInstall, isInstalled, isIOS, promptInstall } = usePWAInstall();
  const [iosDialog, setIosDialog] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  // Efeito para detectar scroll e mudar a navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  // --- LÓGICA CORRIGIDA AQUI ---
  const handleInstall = () => {
    // 1. PRIORIDADE MÁXIMA: Verifica se o usuário já está usando o App (PWA)
    // Isso resolve o problema no iPhone: se ele já instalou e abriu o app, 
    // o botão serve como "Entrar", e não abre o tutorial de novo.
    if (isInstalled) {
      navigate("/auth");
      return;
    }

    // 2. Se não está instalado e é iPhone/iPad (iOS)
    // Abre o manual de instruções, pois a Apple bloqueia instalação automática.
    if (isIOS) {
      setIosDialog(true);
      return;
    }
    
    // 3. Android ou Chrome no PC/Mac
    // Tenta disparar o prompt nativo de instalação.
    if (canInstall) {
      promptInstall();
      return;
    }

    // 4. Fallback (ex: Firefox ou Safari no Mac antigo)
    toast.info("Para instalar, procure a opção 'Adicionar à tela de início' ou 'Instalar' no menu do navegador.");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black selection:bg-primary/20 text-white">
      
      {/* --- FUNDO (Background Aurora) --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-purple-500/20 blur-[100px] opacity-50 animate-pulse" />
        <div className="absolute top-[20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-primary/10 blur-[120px] opacity-40 animate-pulse delay-1000" />
      </div>

      {/* --- NAVBAR --- */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${scrolled ? "border-white/10 bg-black/80 backdrop-blur-xl py-3" : "border-transparent bg-transparent py-6"}`}>
        <div className="container mx-auto flex items-center justify-between px-6 max-w-6xl">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/20">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight">NEXUS</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/auth" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors hidden sm:block">
              Entrar
            </Link>
            <Link to="/auth">
              <Button className="h-9 rounded-full px-6 font-semibold bg-white text-black hover:bg-zinc-200 shadow-lg hover:scale-105 transition-all">
                Criar Conta
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="relative z-10 pt-32 pb-20 container mx-auto px-6 text-center max-w-6xl">
        
        <div className="mx-auto mb-8 flex w-fit items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-1.5 backdrop-blur-md transition-all hover:border-zinc-700 cursor-default">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-xs font-medium text-zinc-300">v1.2: Modo Dark & Gamificação</span>
        </div>

        <h1 className="mx-auto max-w-4xl text-5xl font-black tracking-tighter sm:text-7xl mb-6">
          Domine seus hábitos, <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
             controle sua vida.
          </span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg text-zinc-400 leading-relaxed">
          O Nexus combina rastreamento de hábitos, controle financeiro e gamificação em uma única plataforma minimalista feita para alta performance.
        </p>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <Link to="/auth">
            <Button size="lg" className="h-12 rounded-full px-8 text-base font-bold bg-primary text-black hover:bg-primary/90 shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:scale-105 transition-all">
              Começar Agora <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            size="lg" 
            onClick={handleInstall}
            className="h-12 rounded-full px-8 text-base border-zinc-700 bg-zinc-950/50 text-zinc-300 hover:bg-zinc-900 hover:text-white"
          >
            <Download className="mr-2 h-4 w-4" /> 
            {/* Mudei o texto aqui para ficar mais claro */}
            {isInstalled ? "Acessar Conta" : "Instalar App"}
          </Button>
        </div>

        {/* --- SHOWCASE --- */}
        <div className="relative mx-auto max-w-5xl rounded-xl border border-zinc-800 bg-zinc-900/30 p-2 shadow-2xl backdrop-blur-sm group">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-20 h-full w-full pointer-events-none"></div>
          
          <div className="overflow-hidden rounded-lg border border-zinc-800 bg-black aspect-video flex items-center justify-center relative">
            {/* Se tiver o print, descomente a linha abaixo */}
            {/* <img src="/dashboard-print.png" alt="Dashboard Preview" className="w-full h-full object-cover object-top" /> */}
            
            <div className="flex flex-col items-center gap-4 text-zinc-600">
               <div className="h-20 w-20 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 group-hover:border-primary/50 group-hover:text-primary transition-all duration-500">
                 <LayoutDashboard className="h-10 w-10" />
               </div>
               <p className="font-mono text-sm">Dashboard Preview</p>
            </div>
          </div>
        </div>

        {/* --- FEATURES --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-5xl mx-auto">
          <FeatureCard 
            icon={<Zap className="h-6 w-6 text-yellow-500" />}
            title="Rápido e Fluido"
            description="Interface otimizada para você não perder tempo. Carregamento instantâneo e sem distrações."
          />
          <FeatureCard 
            icon={<Shield className="h-6 w-6 text-blue-500" />}
            title="Seguro e Privado"
            description="Seus dados são criptografados de ponta a ponta. Sua privacidade é nossa prioridade absoluta."
          />
          <FeatureCard 
            icon={<Trophy className="h-6 w-6 text-green-500" />}
            title="Gamificado"
            description="Ganhe XP, suba de nível e desbloqueie conquistas mantendo a constância nos seus hábitos."
          />
        </div>

        <footer className="mt-32 border-t border-zinc-800 pt-8 pb-12">
          <p className="text-zinc-600 text-sm">© 2024 Nexus App. Todos os direitos reservados.</p>
        </footer>
      </main>

      {/* --- DIALOG DE INSTALAÇÃO IOS --- */}
      <Dialog open={iosDialog} onOpenChange={setIosDialog}>
        <DialogContent className="border-zinc-800 bg-zinc-950 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Instalar NEXUS no iOS</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm text-zinc-400">
            <p>Para instalar o app no seu iPhone ou iPad:</p>
            <ol className="list-decimal space-y-3 pl-5">
              <li>
                Toque no botão <strong className="text-blue-400">Compartilhar</strong> 
                <span className="mx-1 inline-block align-bottom text-xl">⏏</span> 
                na barra do Safari.
              </li>
              <li>
                Role para baixo e selecione <strong className="text-white">"Adicionar à Tela de Início"</strong>.
              </li>
              <li>
                Toque em <strong className="text-blue-400">"Adicionar"</strong> no canto superior direito.
              </li>
            </ol>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Componente Auxiliar para os Cards
const FeatureCard = ({ icon, title, description }: { icon: any, title: string, description: string }) => (
  <div className="group rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 text-left transition-all hover:border-zinc-700 hover:bg-zinc-900/60 hover:translate-y-[-2px]">
    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-800/50 border border-zinc-700/50 group-hover:border-zinc-600 transition-colors">
      {icon}
    </div>
    <h3 className="mb-2 text-xl font-bold text-white group-hover:text-primary transition-colors">{title}</h3>
    <p className="text-zinc-400 leading-relaxed text-sm">
      {description}
    </p>
  </div>
);

export default LandingPage;
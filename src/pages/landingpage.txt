import { useState, useEffect } from "react";
import { Zap, Shield, Trophy, ArrowRight, LayoutDashboard, Check, Target, LineChart, Wallet, ChevronDown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

// O link do seu APP!
const APP_URL = "https://nexusapp-jet.vercel.app";

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black selection:bg-primary/20 text-white">
      {/* FUNDO ANIMADO */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-[120px] opacity-50 animate-pulse" />
        <div className="absolute top-[40%] right-[-10%] h-[600px] w-[600px] rounded-full bg-primary/10 blur-[150px] opacity-40 animate-pulse delay-1000" />
      </div>

      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${scrolled ? "border-white/10 bg-black/80 backdrop-blur-xl py-4" : "border-transparent bg-transparent py-6"}`}>
        <div className="container mx-auto flex items-center justify-between px-6 max-w-6xl">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/20">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight">NEXUS</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <button onClick={() => scrollToSection('recursos')} className="hover:text-white transition-colors">Recursos</button>
            <button onClick={() => scrollToSection('planos')} className="hover:text-white transition-colors">Planos</button>
            <button onClick={() => scrollToSection('faq')} className="hover:text-white transition-colors">FAQ</button>
          </div>

          <div className="flex items-center gap-4">
            <a href={APP_URL} className="text-sm font-medium text-zinc-400 hover:text-white transition-colors hidden sm:block">
              Entrar
            </a>
            <a href={APP_URL}>
              <Button className="h-9 rounded-full px-6 font-semibold bg-white text-black hover:bg-zinc-200 shadow-lg hover:scale-105 transition-all">
                Acessar App
              </Button>
            </a>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-20">
        
        {/* HERO SECTION */}
        <section className="container mx-auto px-6 text-center max-w-6xl pt-10 md:pt-20">
          <div className="mx-auto mb-8 flex w-fit items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-1.5 backdrop-blur-md cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-medium text-zinc-300">A revolução da produtividade chegou</span>
          </div>

          <h1 className="mx-auto max-w-5xl text-5xl font-black tracking-tighter md:text-7xl lg:text-8xl mb-6">
            Sua vida inteira, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
               em um só lugar.
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg md:text-xl text-zinc-400 leading-relaxed">
            Abandone os múltiplos aplicativos. O Nexus une rastreamento de hábitos, controle financeiro e agenda com uma pitada de gamificação para manter você viciado no seu próprio progresso.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <a href={APP_URL}>
              <Button size="lg" className="h-14 rounded-full px-8 text-lg font-bold bg-primary text-black hover:bg-primary/90 shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:scale-105 transition-all">
                Começar Gratuitamente <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>
            <Button size="lg" variant="outline" onClick={() => scrollToSection('recursos')} className="h-14 rounded-full px-8 text-lg font-medium border-zinc-700 bg-zinc-900/50 text-white hover:bg-zinc-800 transition-all">
              Conhecer Recursos
            </Button>
          </div>
        </section>

        {/* DASHBOARD PREVIEW */}
        <section className="container mx-auto px-6 max-w-6xl mb-32">
          <div className="relative rounded-2xl border border-zinc-800 bg-zinc-900/30 p-2 shadow-2xl backdrop-blur-sm group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-20 pointer-events-none"></div>
            <div className="rounded-xl border border-zinc-800 bg-black aspect-video flex flex-col items-center justify-center relative overflow-hidden">
              {/* Aqui no futuro você pode colocar um print real do seu sistema */}
              <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070')] bg-cover bg-center mix-blend-luminosity"></div>
              <LayoutDashboard className="h-16 w-16 text-zinc-700 mb-4 z-10" />
              <p className="font-mono text-zinc-500 z-10">Interface do Sistema (Print Aqui)</p>
            </div>
          </div>
        </section>

        {/* RECURSOS */}
        <section id="recursos" className="container mx-auto px-6 max-w-6xl mb-32 pt-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Tudo que você precisa para <span className="text-primary">vencer</span>.</h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">Construímos ferramentas que se conectam entre si para te dar uma visão panorâmica da sua vida.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<Target className="h-6 w-6 text-emerald-500" />}
              title="Rastreador de Hábitos"
              description="Crie, monitore e mantenha a consistência. Visualize suas sequências de vitórias e não quebre a corrente."
            />
            <FeatureCard 
              icon={<Wallet className="h-6 w-6 text-blue-500" />}
              title="Controle Financeiro"
              description="Saiba exatamente para onde vai seu dinheiro. Registre ganhos, gastos e alcance a liberdade financeira."
            />
            <FeatureCard 
              icon={<Trophy className="h-6 w-6 text-yellow-500" />}
              title="Gamificação Real"
              description="A vida é um jogo. Ganhe XP, suba de nível e desbloqueie conquistas exclusivas cumprindo suas metas."
            />
            <FeatureCard 
              icon={<LineChart className="h-6 w-6 text-purple-500" />}
              title="Estatísticas Avançadas"
              description="Gráficos detalhados sobre sua performance. Entenda seus padrões e otimize sua rotina baseada em dados."
            />
            <FeatureCard 
              icon={<Zap className="h-6 w-6 text-orange-500" />}
              title="Rápido como um Raio"
              description="Navegação fluida e instantânea. Sem telas de carregamento demoradas para não quebrar seu fluxo."
            />
            <FeatureCard 
              icon={<Shield className="h-6 w-6 text-cyan-500" />}
              title="Privacidade Máxima"
              description="Seus dados são criptografados de ponta a ponta. Você é o único dono das suas informações."
            />
          </div>
        </section>

        {/* PLANOS & PREÇOS */}
        <section id="planos" className="container mx-auto px-6 max-w-5xl mb-32 pt-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Invista na sua <span className="text-primary">Evolução</span>.</h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">Comece de graça e faça o upgrade quando estiver pronto para levar sua vida para o próximo nível.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Plano Free */}
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/30 p-8 flex flex-col">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Básico</h3>
                <p className="text-zinc-400 text-sm">Perfeito para começar a organizar sua vida.</p>
              </div>
              <div className="mb-6 flex items-baseline gap-2">
                <span className="text-5xl font-black">R$ 0</span>
                <span className="text-zinc-500 font-medium">/para sempre</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <PricingFeature text="Até 5 Hábitos simultâneos" />
                <PricingFeature text="Controle financeiro básico" />
                <PricingFeature text="Visualização de agenda mensal" />
                <PricingFeature text="Sistema de níveis e XP" />
              </ul>
              <a href={APP_URL}>
                <Button className="w-full h-12 rounded-xl bg-zinc-800 text-white hover:bg-zinc-700 font-bold text-base">
                  Começar Grátis
                </Button>
              </a>
            </div>

            {/* Plano Premium */}
            <div className="relative rounded-3xl border-2 border-primary bg-zinc-900/50 p-8 flex flex-col transform md:-translate-y-4 shadow-[0_0_40px_rgba(34,197,94,0.15)] overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary text-black text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                Recomendado
              </div>
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-2xl font-bold text-primary">Nexus PRO</h3>
                  <Star className="h-5 w-5 text-primary fill-primary" />
                </div>
                <p className="text-zinc-400 text-sm">Para quem leva o sucesso a sério.</p>
              </div>
              <div className="mb-6 flex items-baseline gap-2">
                <span className="text-5xl font-black">R$ 19</span>
                <span className="text-zinc-500 font-medium">/mês</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <PricingFeature text="Hábitos ilimitados" highlight />
                <PricingFeature text="Finanças avançadas e relatórios" highlight />
                <PricingFeature text="Estatísticas detalhadas de performance" highlight />
                <PricingFeature text="Conquistas e emblemas exclusivos" highlight />
                <PricingFeature text="Suporte prioritário" highlight />
              </ul>
              {/* ATENÇÃO: Botão de Assinar - Futuramente ligaremos ao MercadoPago/Stripe */}
              <Button className="w-full h-12 rounded-xl bg-primary text-black hover:bg-primary/90 font-bold text-base shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:scale-[1.02] transition-transform">
                Assinar o PRO
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="container mx-auto px-6 max-w-3xl mb-32 pt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Perguntas Frequentes</h2>
          </div>
          <div className="space-y-4">
            <FaqItem 
              question="Preciso baixar o aplicativo nas lojas?" 
              answer="Não! O Nexus é um PWA (Progressive Web App). Você pode instalar diretamente pelo seu navegador no celular (Android ou iOS) sem ocupar quase nada de espaço e de forma totalmente segura." 
            />
            <FaqItem 
              question="Meus dados financeiros estão seguros?" 
              answer="Com certeza. Utilizamos as mais modernas tecnologias de criptografia. Não temos acesso às suas senhas de banco e seus dados são armazenados de forma privada na nuvem da AWS/Supabase." 
            />
            <FaqItem 
              question="Posso cancelar o plano PRO a qualquer momento?" 
              answer="Sim. O plano PRO é uma assinatura mensal sem contrato de fidelidade. Você pode cancelar a qualquer momento diretamente no seu perfil dentro do aplicativo." 
            />
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-zinc-900 bg-black pt-16 pb-8">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 text-sm">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-6 w-6 rounded flex items-center justify-center bg-primary/20 text-primary">
                    <Zap className="h-4 w-4" />
                  </div>
                  <span className="text-lg font-bold">NEXUS</span>
                </div>
                <p className="text-zinc-500 max-w-xs">A plataforma definitiva para transformar sua rotina em resultados reais através da gamificação.</p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-4">Produto</h4>
                <ul className="space-y-2 text-zinc-500">
                  <li><a href="#" className="hover:text-primary transition-colors">Recursos</a></li>
                  <li><a href="#planos" className="hover:text-primary transition-colors">Preços</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Changelog</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-white mb-4">Legal</h4>
                <ul className="space-y-2 text-zinc-500">
                  <li><a href="#" className="hover:text-primary transition-colors">Termos de Uso</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Privacidade</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Contato</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row items-center justify-between text-zinc-600 text-xs">
              <p>© {new Date().getFullYear()} Nexus App. Todos os direitos reservados.</p>
              <p>Construído para alta performance.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

// Componentes Auxiliares
const FeatureCard = ({ icon, title, description }: { icon: any, title: string, description: string }) => (
  <div className="group rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 text-left transition-all hover:border-zinc-700 hover:bg-zinc-900/60 hover:translate-y-[-4px]">
    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-800/50 border border-zinc-700/50 group-hover:border-primary/50 group-hover:text-primary transition-colors">
      {icon}
    </div>
    <h3 className="mb-3 text-xl font-bold text-white group-hover:text-primary transition-colors">{title}</h3>
    <p className="text-zinc-400 leading-relaxed text-sm">{description}</p>
  </div>
);

const PricingFeature = ({ text, highlight = false }: { text: string, highlight?: boolean }) => (
  <li className="flex items-start gap-3">
    <div className={`mt-0.5 rounded-full p-0.5 ${highlight ? "bg-primary/20 text-primary" : "bg-zinc-800 text-zinc-400"}`}>
      <Check className="h-3 w-3" strokeWidth={3} />
    </div>
    <span className={highlight ? "text-zinc-200" : "text-zinc-400"}>{text}</span>
  </li>
);

const FaqItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-zinc-800 rounded-xl bg-zinc-900/30 overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full text-left px-6 py-4 font-semibold text-white flex items-center justify-between hover:bg-zinc-800/50 transition-colors"
      >
        {question}
        <ChevronDown className={`h-5 w-5 text-zinc-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="px-6 pb-4 text-zinc-400 text-sm leading-relaxed border-t border-zinc-800/50 pt-4 bg-zinc-900/50">
          {answer}
        </div>
      )}
    </div>
  );
};

export default LandingPage;
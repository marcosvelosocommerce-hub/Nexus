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
import { LogIn, UserPlus, Mail, Lock, ExternalLink, Share, Apple } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const AuthPage = () => {
  const { session, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados para o iPhone
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // 1. Verifica se já está instalado (PWA)
    const checkStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true;
    setIsStandalone(checkStandalone);

    // 2. Verifica se é um dispositivo iOS (iPhone/iPad)
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

  // Se já estiver logado, manda direto pro Dashboard
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
        toast.success("Conta criada! Verifique seu e-mail.");
      }
    } catch (error: any) {
      toast.error(error.message || "Ocorreu um erro na autenticação.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4 relative overflow-hidden">
      {/* Elementos de Fundo */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px] opacity-50 animate-pulse" />
      </div>

      {/* Card Principal */}
      <Card className="z-10 w-full max-w-md border-zinc-800 bg-zinc-950/50 backdrop-blur-xl shadow-2xl">
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

            {/* ABA: LOGIN */}
            <TabsContent value="login">
              <form onSubmit={(e) => handleAuth(e, true)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-login" className="text-zinc-300">E-mail</Label>
                  <Input id="email-login" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-zinc-900 border-zinc-800 text-white focus-visible:ring-primary" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-login" className="text-zinc-300">Senha</Label>
                  <Input id="password-login" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-zinc-900 border-zinc-800 text-white focus-visible:ring-primary" />
                </div>
                <Button type="submit" className="w-full font-bold shadow-lg shadow-primary/20" disabled={isLoading}>
                  {isLoading ? "Entrando..." : "Entrar no Nexus"}
                </Button>
              </form>
            </TabsContent>

            {/* ABA: REGISTRO */}
            <TabsContent value="register">
              <form onSubmit={(e) => handleAuth(e, false)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-register" className="text-zinc-300">E-mail</Label>
                  <Input id="email-register" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-zinc-900 border-zinc-800 text-white focus-visible:ring-primary" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-register" className="text-zinc-300">Senha</Label>
                  <Input id="password-register" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-zinc-900 border-zinc-800 text-white focus-visible:ring-primary" />
                </div>
                <Button type="submit" className="w-full font-bold shadow-lg shadow-primary/20" disabled={isLoading}>
                  {isLoading ? "Criando..." : "Criar Conta"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* BOTÃO PARA IPHONE: Só aparece se for iOS e NÃO estiver instalado */}
      {isIOS && !isStandalone && (
        <div className="z-10 mt-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <Button 
            variant="outline" 
            onClick={() => setShowIOSInstructions(true)}
            className="border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:text-white hover:bg-zinc-800 flex items-center gap-2 rounded-full px-6"
          >
            <Share className="h-4 w-4" />
            Como instalar no iPhone
          </Button>
        </div>
      )}

      {/* Botão Fixo de Retorno ao Website */}
      <div className="absolute bottom-8 z-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
        <a 
          href="https://nexusbrasil.vercel.app" 
          className="group flex items-center gap-2 text-[10px] font-medium tracking-widest uppercase text-zinc-500 hover:text-primary transition-colors"
        >
          <span className="h-px w-6 bg-zinc-800 group-hover:bg-primary/50 transition-colors" />
          Voltar para o site principal
        </a>
      </div>

      {/* MODAL DE INSTRUÇÕES DO IOS */}
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
              <li>
                Toque no botão <strong className="text-blue-400">Compartilhar</strong> (o quadrado com uma seta para cima) na barra inferior do Safari.
              </li>
              <li>
                Role o menu para baixo e selecione <strong className="text-white">"Adicionar à Tela de Início"</strong>.
              </li>
              <li>
                Toque em <strong className="text-blue-400">"Adicionar"</strong> no canto superior direito.
              </li>
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
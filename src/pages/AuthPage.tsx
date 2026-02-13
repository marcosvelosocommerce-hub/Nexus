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
import { LogIn, UserPlus, Mail, Lock, ExternalLink } from "lucide-react";

const AuthPage = () => {
  const { session, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Estado para detectar se está rodando como App instalado (PWA)
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const checkStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone || 
      document.referrer.includes('android-app://');
    
    setIsStandalone(checkStandalone);
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast.error(error.message);
    } catch (err: any) {
      toast.error(err?.message || "Erro ao tentar entrar.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      toast.error("Você precisa aceitar os termos de uso.");
      return;
    }
    setIsLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) toast.error(error.message);
    else toast.success("Verifique seu e-mail para confirmar o cadastro!");
    setIsLoading(false);
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black p-4">
      {/* Efeitos de Aurora Boreal no Fundo */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-[30%] -left-[10%] h-[70%] w-[70%] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
        <div className="absolute -bottom-[30%] -right-[10%] h-[70%] w-[70%] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <Card className="relative z-10 w-full max-w-md border-zinc-800 bg-zinc-950/50 backdrop-blur-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 shadow-inner">
            <div className="h-6 w-6 rounded-full border-2 border-primary shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-white">NEXUS</CardTitle>
          <CardDescription className="text-zinc-400">
            Sua central de produtividade avançada
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="mb-8 grid w-full grid-cols-2 bg-zinc-900/50 p-1">
              <TabsTrigger value="login" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-primary transition-all duration-300">
                <LogIn className="mr-2 h-4 w-4" /> Entrar
              </TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-primary transition-all duration-300">
                <UserPlus className="mr-2 h-4 w-4" /> Criar conta
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-zinc-400">E-mail</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-600 group-focus-within:text-primary transition-colors" />
                    <Input 
                      id="login-email" 
                      type="email" 
                      placeholder="nome@exemplo.com" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-zinc-900/50 border-zinc-800 focus:border-primary/50 pl-10 text-white placeholder:text-zinc-600 transition-all" 
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-zinc-400">Senha</Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-600 group-focus-within:text-primary transition-colors" />
                    <Input 
                      id="login-password" 
                      type="password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-zinc-900/50 border-zinc-800 focus:border-primary/50 pl-10 text-white transition-all" 
                      required 
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all" disabled={isLoading}>
                  {isLoading ? "Entrando..." : "Acessar sistema"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-email" className="text-zinc-400">E-mail</Label>
                  <Input 
                    id="register-email" 
                    type="email" 
                    placeholder="nome@exemplo.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-zinc-900/50 border-zinc-800 focus:border-primary/50 text-white placeholder:text-zinc-600" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password" className="text-zinc-400">Senha</Label>
                  <Input 
                    id="register-password" 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-zinc-900/50 border-zinc-800 focus:border-primary/50 text-white placeholder:text-zinc-600" 
                    required 
                    minLength={6} 
                  />
                </div>

                <div className="flex items-start space-x-2 pt-2">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-1 h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-primary focus:ring-primary cursor-pointer accent-primary"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                  />
                  <Label htmlFor="terms" className="text-xs text-zinc-500 font-normal leading-relaxed cursor-pointer select-none">
                    Li e concordo com os <span className="underline hover:text-primary transition-colors">Termos de Uso</span> e <span className="underline hover:text-primary transition-colors">Política de Privacidade</span>.
                  </Label>
                </div>

                <Button type="submit" className="w-full font-bold shadow-lg shadow-primary/20" disabled={isLoading}>
                  {isLoading ? "Criando conta..." : "Criar conta"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Botão Discreto de Retorno ao Website (Aparece apenas no App instalado) */}
      {isStandalone && (
        <div className="absolute bottom-8 z-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
          <a 
            href="https://nexusbrasil.vercel.app" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex items-center gap-2 text-[10px] font-medium tracking-widest uppercase text-zinc-600 hover:text-primary transition-colors"
          >
            <span className="h-px w-6 bg-zinc-800 group-hover:bg-primary/50 transition-colors" />
            Acessar website NEXUS
            <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all translate-x-[-4px] group-hover:translate-x-0" />
          </a>
        </div>
      )}
    </div>
  );
};

export default AuthPage;
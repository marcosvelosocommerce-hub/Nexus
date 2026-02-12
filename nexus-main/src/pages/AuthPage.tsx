import { useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LogIn, UserPlus, Mail, Lock } from "lucide-react";

const AuthPage = () => {
  const { session, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Estado para controlar o checkbox dos termos
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setIsLoading(false);
    if (error) {
      toast.error(error.message === "Invalid login credentials"
        ? "Email ou senha incorretos."
        : error.message);
    } else {
      toast.success("Login realizado com sucesso!");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação de Senha
    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    // Validação de Termos (Compliance)
    if (!acceptedTerms) {
      toast.error("Você deve ler e aceitar os Termos de Uso para criar uma conta.");
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    setIsLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Conta criada com sucesso! Você já pode fazer login.");
    }
  };

  return (
    // Container Principal com Fundo Preto e Efeitos
    <div className="relative flex min-h-screen items-center justify-center bg-black px-4 overflow-hidden selection:bg-primary/20">
      
      {/* --- EFEITOS DE FUNDO (Aurora Boreal) --- */}
      {/* 1. Grade Sutil */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* 2. Brilho Roxo (Topo Esquerda) */}
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-purple-500/20 blur-[100px] animate-pulse" />
      
      {/* 3. Brilho Verde (Baixo Direita) */}
      <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-primary/20 blur-[100px] animate-pulse delay-1000" />
      
      {/* ---------------------------------------- */}

      {/* Card Principal (Vidro) */}
      <Card className="relative z-10 w-full max-w-md border-zinc-800 bg-zinc-950/70 backdrop-blur-xl shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
            NEXUS
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Entre na sua conta ou crie uma nova
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-zinc-900/50">
              <TabsTrigger value="login" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <LogIn className="h-4 w-4" /> Login
              </TabsTrigger>
              <TabsTrigger value="signup" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <UserPlus className="h-4 w-4" /> Cadastrar
              </TabsTrigger>
            </TabsList>

            {/* ABA DE LOGIN */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-zinc-300">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                    <Input 
                      id="login-email" 
                      type="email" 
                      placeholder="seu@email.com" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      className="pl-10 bg-zinc-900/50 border-zinc-800 focus:border-primary/50 text-white placeholder:text-zinc-600" 
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-zinc-300">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                    <Input 
                      id="login-password" 
                      type="password" 
                      placeholder="••••••••" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      className="pl-10 bg-zinc-900/50 border-zinc-800 focus:border-primary/50 text-white placeholder:text-zinc-600" 
                      required 
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full font-bold shadow-lg shadow-primary/20" disabled={isLoading}>
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            </TabsContent>

            {/* ABA DE CADASTRO */}
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-zinc-300">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                    <Input 
                      id="signup-email" 
                      type="email" 
                      placeholder="seu@email.com" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      className="pl-10 bg-zinc-900/50 border-zinc-800 focus:border-primary/50 text-white placeholder:text-zinc-600" 
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-zinc-300">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                    <Input 
                      id="signup-password" 
                      type="password" 
                      placeholder="Mínimo 6 caracteres" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      className="pl-10 bg-zinc-900/50 border-zinc-800 focus:border-primary/50 text-white placeholder:text-zinc-600" 
                      required 
                      minLength={6} 
                    />
                  </div>
                </div>

                {/* CHECKBOX DE TERMOS (Design Atualizado) */}
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
    </div>
  );
};

export default AuthPage;
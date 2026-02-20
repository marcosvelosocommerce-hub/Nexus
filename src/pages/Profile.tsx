import { useState, useEffect, useMemo } from "react";
import { User, CreditCard, LogOut, Trophy, Star, Shield, Zap, Pencil, Check, X, Crown, Trash2, Bell } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTransactions } from "@/hooks/useTransactions";
import { useHabits } from "@/hooks/useHabits";
import DashboardLayout from "@/components/DashboardLayout";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useIsPremium } from "@/hooks/useProfile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function urlB64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: transactions = [] } = useTransactions();
  const { data: habits = [] } = useHabits();
  const { isPremium } = useIsPremium();

  // --- Lógica de Edição de Nome ---
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    if (user) {
      const savedName = user.user_metadata?.full_name;
      const emailName = user.email?.split("@")[0];
      setDisplayName(savedName || emailName || "Usuário");
    }
  }, [user]);

  const handleSaveName = async () => {
    if (!displayName.trim()) return;
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: displayName }
      });
      if (error) throw error;
      toast.success("Nome atualizado!");
      setIsEditing(false);
    } catch (e) {
      toast.error("Erro ao atualizar nome.");
    }
  };

  // --- Lógica de Logout ---
  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  // --- Lógica de Excluir Conta ---
  const handleDeleteAccount = async () => {
    const confirm = window.confirm(
      "Tem certeza absoluta? Isso apagará todas as suas transações, hábitos e dados permanentemente."
    );

    if (!confirm) return;

    try {
      if (!user) return;
      await supabase.from("transactions").delete().eq("user_id", user.id);
      await supabase.from("habits").delete().eq("user_id", user.id);
      await supabase.from("profiles").delete().eq("id", user.id);
      
      toast.success("Dados excluídos.");
      await signOut();
      navigate("/auth");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir dados.");
    }
  };

  // --- Lógica de Notificações ---
  const handleSubscribeToNotifications = async () => {
    try {
      if (!('Notification' in window)) {
        toast.error('Seu navegador não suporta notificações.');
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        toast.error('Você precisa permitir as notificações no seu navegador/celular!');
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const applicationServerKey = urlB64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY);
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });

      console.log('Inscrição feita:', JSON.stringify(subscription));
      toast.success('Lembretes ativados com sucesso! 🔔');
      
      // O próximo passo será salvar isso no Supabase!

    } catch (error: any) {
      console.error('Erro ao ativar notificações:', error);
      // Isso vai mostrar o erro REAL na tela para nós!
      toast.error(`Falha: ${error.message || error}`);
    }
  };

  // --- Simulação de Upgrade ---
  const handleSimulateUpgrade = () => {
    toast.info("Redirecionando para o Stripe...");
  };

  // --- LÓGICA DE GAMIFICAÇÃO (RPG) ---
  const rpg = useMemo(() => {
    const habitsCount = habits.length;
    const txCount = transactions.length;
    
    // Cálculo de XP
    const totalXP = (habitsCount * 150) + (txCount * 50); 
    
    // Nível
    const level = Math.floor(Math.sqrt(totalXP / 100)) + 1;
    
    // XP necessário para o próximo nível
    const nextLevelXP = Math.pow(level, 2) * 100;
    const currentLevelBaseXP = Math.pow(level - 1, 2) * 100;
    
    // Progresso da barra (0 a 100%)
    const progress = Math.min(
        ((totalXP - currentLevelBaseXP) / (nextLevelXP - currentLevelBaseXP)) * 100, 
        100
    );

    return { level, totalXP, progress, habitsCount, txCount, nextLevelXP };
  }, [habits, transactions]);

  // Cards de Estatísticas
  const stats = [
    { label: "Transações", value: rpg.txCount, icon: CreditCard, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Hábitos Criados", value: rpg.habitsCount, icon: Star, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "XP Total", value: rpg.totalXP, icon: Trophy, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <DashboardLayout>
      <div className="fade-in max-w-3xl mx-auto space-y-8 pb-10">
        
        {/* Header do Perfil */}
        <div className="relative overflow-hidden rounded-3xl bg-card border border-border p-8 shadow-sm">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Shield className="h-32 w-32 rotate-12" />
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                {/* Avatar com Badge Flutuante Restuardo */}
                <div className="relative">
                    <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-primary to-purple-600 p-[3px]">
                        <div className="h-full w-full rounded-full bg-card p-1">
                            <div className="h-full w-full rounded-full bg-muted flex items-center justify-center text-2xl font-bold">
                                {displayName.substring(0, 2).toUpperCase()}
                            </div>
                        </div>
                    </div>
                    {/* Badge de Nível (Mantido) */}
                    <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-lg border-2 border-card shadow-sm">
                        LVL {rpg.level}
                    </div>
                </div>
                
                <div className="text-center md:text-left flex-1 w-full md:w-auto">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                        {isEditing ? (
                            <div className="flex items-center gap-2">
                                <Input 
                                    value={displayName} 
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    className="h-8 w-48"
                                />
                                <button onClick={handleSaveName} className="p-1 hover:bg-green-500/20 rounded-full text-green-500">
                                    <Check className="h-4 w-4"/>
                                </button>
                                <button onClick={() => setIsEditing(false)} className="p-1 hover:bg-red-500/20 rounded-full text-red-500">
                                    <X className="h-4 w-4"/>
                                </button>
                            </div>
                        ) : (
                            <>
                                <h1 className="text-2xl font-bold">{displayName}</h1>
                                <button onClick={() => setIsEditing(true)} className="text-muted-foreground hover:text-primary">
                                    <Pencil className="h-4 w-4"/>
                                </button>
                            </>
                        )}
                    </div>
                    
                    <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2 mb-3">
                        {user?.email} 
                        {isPremium && <span className="text-xs bg-gradient-to-r from-amber-400 to-orange-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1"><Crown className="h-3 w-3"/> PRO</span>}
                    </p>

                    {/* BARRA DE XP */}
                    <div className="w-full max-w-md bg-muted/50 h-2 rounded-full overflow-hidden relative">
                        <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000" 
                            style={{ width: `${rpg.progress}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-[10px] text-muted-foreground mt-1 max-w-md">
                        <span>XP Atual: {rpg.totalXP}</span>
                        <span>Próx. Nível: {rpg.nextLevelXP}</span>
                    </div>
                </div>

                {/* Badge Grande Lateral removido conforme solicitado */}
            </div>
        </div>

        {/* Estatísticas Rápidas (Cards) */}
        <div className="grid grid-cols-3 gap-4">
            {stats.map((stat, i) => (
                <div key={i} className="rounded-2xl bg-card border border-border p-4 flex flex-col items-center justify-center gap-2 transition-transform hover:scale-105">
                    <div className={`p-3 rounded-full ${stat.bg} ${stat.color}`}>
                        <stat.icon className="h-6 w-6" />
                    </div>
                    <span className="text-2xl font-bold">{stat.value}</span>
                    <span className="text-xs text-muted-foreground">{stat.label}</span>
                </div>
            ))}
        </div>

        {/* Configurações da Conta */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold ml-1">Configurações</h3>
          <div className="rounded-2xl border border-border bg-card overflow-hidden divide-y divide-border/50">
            
            {/* Opção Premium */}
            <div className="flex items-center justify-between p-6 hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${isPremium ? 'bg-amber-500/10 text-amber-500' : 'bg-gray-500/10 text-gray-500'}`}>
                  {isPremium ? <Crown className="h-5 w-5" /> : <Zap className="h-5 w-5" />}
                </div>
                <div>
                  <p className="font-bold">Plano {isPremium ? "Premium" : "Gratuito"}</p>
                  <p className="text-xs text-muted-foreground">{isPremium ? "Sua assinatura está ativa" : "Faça upgrade para desbloquear recursos"}</p>
                </div>
              </div>
              {!isPremium && (
                <Button 
                  className="w-full md:w-auto bg-primary hover:bg-primary/90 text-black font-bold"
                  onClick={() => {
                    const userId = user?.id;
                    const userEmail = user?.email;
                    const stripeUrl = `https://buy.stripe.com/test_00w3cp3s62Fkd6DetbfrW00?client_reference_id=${userId}&prefilled_email=${encodeURIComponent(userEmail || '')}`;
                    window.open(stripeUrl, '_blank');
                  }}
                >
                  Fazer Upgrade
                </Button>
              )}
            </div>

            {/* Opção Notificações */}
            <button 
              onClick={handleSubscribeToNotifications}
              className="w-full flex items-center justify-between p-6 transition-colors hover:bg-white/5 text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform">
                  <Bell className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-white">Ativar Lembretes</p>
                  <p className="text-xs text-muted-foreground">Receba avisos para não esquecer os hábitos</p>
                </div>
              </div>
            </button>

            {/* Opção Sair */}
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-between p-6 transition-colors hover:bg-red-500/5 text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 text-red-500 group-hover:scale-110 transition-transform">
                  <LogOut className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-red-500">Sair da conta</p>
                  <p className="text-xs text-muted-foreground">Encerrar sessão neste dispositivo</p>
                </div>
              </div>
            </button>

             {/* Opção Excluir Conta */}
             <button 
              onClick={handleDeleteAccount}
              className="w-full flex items-center justify-between p-6 transition-colors hover:bg-red-500/5 text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 text-red-500 group-hover:scale-110 transition-transform">
                  <Trash2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-red-500">Excluir conta</p>
                  <p className="text-xs text-muted-foreground">Apagar todos os dados permanentemente</p>
                </div>
              </div>
            </button>

          </div>
        </div>

        <p className="mt-8 text-center text-[10px] text-muted-foreground uppercase tracking-widest opacity-50">
          Nexus v1.0.0 • {user?.id.slice(0, 8)}
        </p>

      </div>
    </DashboardLayout>
  );
};

export default Profile;
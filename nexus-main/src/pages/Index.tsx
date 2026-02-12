import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wallet, Activity, User, ArrowRight, Zap, CheckCircle2, TrendingUp, TrendingDown, Target, Clock } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// AQUI ESTÁ O SEGREDO: Importamos as duas ferramentas do mesmo arquivo
import { useHabits, useCheckInHabit } from "@/hooks/useHabits";
import { useTransactions } from "@/hooks/useTransactions";
import { format, isSameDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  
  // 1. Ferramenta de LEITURA (Pega os dados)
  const { data: habits = [] } = useHabits();
  const { data: transactions = [] } = useTransactions();
  
  // 2. Ferramenta de ESCRITA (Salva o check-in)
  const checkInMutation = useCheckInHabit();

  // Estado visual local (para sumir instantaneamente ao clicar)
  const [completedNow, setCompletedNow] = useState<string[]>([]);

  // Verifica se a data do banco é HOJE
  const isCompletedToday = (lastCompletedAt: string | null) => {
    if (!lastCompletedAt) return false;
    return isSameDay(parseISO(lastCompletedAt), new Date());
  };

  // Filtra: Ativos + Não feitos hoje + Não clicados agora
  const pendingHabits = habits.filter(h => 
    h.active && 
    !isCompletedToday(h.last_completed_at) && 
    !completedNow.includes(h.id)
  );

  const recentTransactions = transactions.slice(0, 2);

  const handleCheckHabit = (id: string, title: string, currentStreak: number) => {
    // 1. Efeito visual (some da tela)
    setCompletedNow(prev => [...prev, id]); 
    toast.success(`${title} concluído!`);

    // 2. Salva no banco de dados usando a ferramenta importada
    checkInMutation.mutate({ id, currentStreak });
  };

  return (
    <DashboardLayout>
      <div className="fade-in space-y-8">
        {/* Cabeçalho */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-white">Nexus</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao seu centro de comando. O que vamos focar hoje?
          </p>
        </div>

        {/* --- CARDS PRINCIPAIS --- */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Finanças */}
          <Card 
            className="group relative cursor-pointer overflow-hidden border-border bg-card transition-all hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/10"
            onClick={() => navigate("/finance")}
          >
            <div className="absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full bg-green-500/10 transition-transform group-hover:scale-150" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Finanças</CardTitle>
              <Wallet className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">Carteira</div>
              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                Gerenciar receitas e despesas
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </p>
            </CardContent>
          </Card>

          {/* Hábitos */}
          <Card 
            className="group relative cursor-pointer overflow-hidden border-border bg-card transition-all hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10"
            onClick={() => navigate("/habits")}
          >
            <div className="absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full bg-blue-500/10 transition-transform group-hover:scale-150" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Hábitos</CardTitle>
              <Activity className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">Rotina</div>
              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                Acompanhar progresso diário
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </p>
            </CardContent>
          </Card>

          {/* Perfil */}
          <Card 
            className="group relative cursor-pointer overflow-hidden border-border bg-card transition-all hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/10"
            onClick={() => navigate("/profile")}
          >
            <div className="absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full bg-orange-500/10 transition-transform group-hover:scale-150" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Perfil</CardTitle>
              <User className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">Conta</div>
              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                Configurações e Assinatura
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </p>
            </CardContent>
          </Card>
        </div>

        {/* --- ÁREA DO MEIO --- */}
        <div className="flex flex-col gap-8">
            
            {/* 1. SEÇÃO DE HÁBITOS (Foco de Hoje) */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary"/> Foco de Hoje
                    </h2>
                    <span className="text-xs text-muted-foreground cursor-pointer hover:text-primary" onClick={() => navigate('/habits')}>
                      Ver todos
                    </span>
                </div>
                
                <div className="space-y-3">
                    {pendingHabits.length > 0 ? (
                        pendingHabits.map((habit) => (
                            <div 
                              key={habit.id} 
                              className="group flex items-center gap-4 rounded-xl border border-border/40 bg-card/60 p-4 transition-all hover:bg-card hover:border-primary/20"
                            >
                                {/* Botão de Check */}
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCheckHabit(habit.id, habit.title, habit.current_streak);
                                  }}
                                  disabled={checkInMutation.isPending}
                                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background/50 border border-muted-foreground/30 text-muted-foreground transition-all hover:bg-green-500/20 hover:border-green-500 hover:text-green-500 hover:scale-110 cursor-pointer disabled:opacity-50"
                                >
                                    <CheckCircle2 className="h-6 w-6" />
                                </button>

                                <div className="flex-1 cursor-default">
                                    <p className="text-base font-medium text-foreground group-hover:text-primary transition-colors">
                                      {habit.title}
                                    </p>
                                    <p className="text-sm text-muted-foreground">+{habit.xp} XP</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/50 bg-card/30 p-8 text-center animate-in fade-in zoom-in duration-300">
                            <CheckCircle2 className="h-8 w-8 text-green-500 mb-2" />
                            <p className="text-sm font-medium text-foreground">Tudo feito por hoje!</p>
                            <p className="text-xs text-muted-foreground">Bom descanso.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* 2. SEÇÃO FINANCEIRA */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary"/> Histórico de Transações
                    </h2>
                    <span className="text-xs text-muted-foreground cursor-pointer hover:text-primary" onClick={() => navigate('/finance')}>
                      Ver extrato
                    </span>
                </div>

                <div className="space-y-3">
                    {recentTransactions.length > 0 ? (
                        recentTransactions.map((t) => (
                            <div key={t.id} className="flex items-center justify-between rounded-xl border border-border/40 bg-card/60 p-4 transition-all hover:bg-card">
                                <div className="flex items-center gap-4">
                                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${t.type === 'income' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                                        {t.type === 'income' ? (
                                            <TrendingUp className="h-5 w-5 text-green-500" />
                                        ) : (
                                            <TrendingDown className="h-5 w-5 text-red-500" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-foreground">{t.description || "Sem descrição"}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {t.date ? format(new Date(t.date), "d MMM", { locale: ptBR }) : "Hoje"}
                                        </p>
                                    </div>
                                </div>
                                <span className={`text-sm font-bold ${t.type === 'income' ? 'text-green-500' : 'text-foreground'}`}>
                                    {t.type === 'expense' ? '- ' : '+ '}
                                    R$ {Number(t.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="rounded-xl border border-dashed border-border/50 p-6 text-center text-sm text-muted-foreground">
                            Nenhuma transação recente.
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* --- BANNER --- */}
        <div className="rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-primary/20 p-2">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Continue focado!</h3>
              <p className="text-sm text-muted-foreground">
                "A consistência é a chave para o sucesso. Revise seus hábitos hoje."
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
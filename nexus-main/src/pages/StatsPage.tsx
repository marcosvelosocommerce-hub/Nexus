import { useMemo } from "react";
import { Flame, Trophy, Zap, TrendingUp } from "lucide-react";
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import DashboardLayout from "@/components/DashboardLayout";
import { useAppointments } from "@/hooks/useAppointments";
import { useFinanceStats, useHabitStats } from "@/hooks/useStats";

// Configurações de cores (UI)
const variantText: Record<string, string> = {
  success: "text-emerald-500",
  warning: "text-orange-500",
  premium: "text-purple-500",
  info: "text-blue-500",
};
const variantBg: Record<string, string> = {
  success: "bg-emerald-500/10",
  warning: "bg-orange-500/10",
  premium: "bg-purple-500/10",
  info: "bg-blue-500/10",
};

export default function StatsPage() {
  const { data: appointments = [] } = useAppointments();
  
  // Hooks de dados
  const { data: financeData = [], isLoading: isLoadingFinance } = useFinanceStats();
  const { data: habitData, isLoading: isLoadingHabits } = useHabitStats();

  const weeklyHabits = habitData?.weeklyHistory || [];
  const consistencyList = habitData?.consistency || [];

  // Cálculo dos KPIs
  const kpiData = useMemo(() => {
    const futureApts = appointments ? appointments.filter(a => new Date(a.date) >= new Date()).length : 0;
    const bestHabit = consistencyList.length > 0 ? consistencyList[0] : null;
    
    // Pega o último mês financeiro disponível
    const currentMonthFinance = financeData.length > 0 ? financeData[financeData.length - 1] : { income: 0, expenses: 0 };
    // @ts-ignore 
    const balance = (currentMonthFinance?.income || 0) - (currentMonthFinance?.expenses || 0);

    return [
      { 
        icon: TrendingUp, label: "Compromissos", value: futureApts.toString(), variant: "success" as const 
      },
      { 
        icon: Flame, label: "Melhor Sequência", value: bestHabit ? `${bestHabit.streak} dias` : "0 dias", variant: "warning" as const 
      },
      { 
        icon: Zap, label: "Saldo (Mês)", value: `R$ ${balance}`, variant: "info" as const 
      },
      { 
        icon: Trophy, label: "Nível Atual", value: "Prata", variant: "premium" as const 
      },
    ];
  }, [appointments, consistencyList, financeData]);

  if (isLoadingFinance || isLoadingHabits) {
    return (
        <DashboardLayout>
            <div className="flex items-center justify-center h-screen text-zinc-500">
                Carregando estatísticas...
            </div>
        </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      {/* Container principal com espaçamento vertical (space-y-6) */}
      <div className="fade-in space-y-8 pb-10 max-w-5xl mx-auto">
        
        {/* Cabeçalho */}
        <div>
            <h1 className="text-2xl font-bold text-white">Estatísticas</h1>
            <p className="text-zinc-400">Visão geral do seu progresso.</p>
        </div>

        {/* 1. KPIs (Cards do topo) */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {kpiData.map((kpi) => (
            <div key={kpi.label} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 transition-all hover:-translate-y-1 hover:shadow-md">
              <div className="mb-2 flex items-center justify-between">
                <div className={`rounded-lg p-2 ${variantBg[kpi.variant]}`}>
                  <kpi.icon className={`h-5 w-5 ${variantText[kpi.variant]}`} />
                </div>
              </div>
              <p className="text-xs font-medium text-zinc-400">{kpi.label}</p>
              <p className="mt-1 text-2xl font-bold text-white">{kpi.value}</p>
            </div>
          ))}
        </div>

        {/* 2. Gráfico de HÁBITOS (Largura Total) */}
        <div className="h-[350px] w-full rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h3 className="mb-6 text-sm font-semibold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500"/> Desempenho de Hábitos (Últimos 7 dias)
          </h3>
          <ResponsiveContainer width="100%" height="100%" minHeight={240}>
            <AreaChart data={weeklyHabits} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorHabits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#71717a" }} axisLine={false} tickLine={false} dy={10} />
              <YAxis tick={{ fontSize: 12, fill: "#71717a" }} axisLine={false} tickLine={false} tickFormatter={(val) => `${val}%`} />
              <Tooltip contentStyle={{ backgroundColor: "#09090b", border: "1px solid #27272a", borderRadius: "0.75rem", color: "#f4f4f5", fontSize: 12 }} />
              <Area type="monotone" dataKey="value" name="% Concluído" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorHabits)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 3. Gráfico FINANCEIRO (Agora embaixo e com Largura Total) */}
        <div className="h-[350px] w-full rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h3 className="mb-6 text-sm font-semibold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-500"/> Fluxo Financeiro (Últimos 6 Meses)
          </h3>
          <ResponsiveContainer width="100%" height="100%" minHeight={240}>
            <LineChart data={financeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#71717a" }} axisLine={false} tickLine={false} dy={10} />
              <YAxis tick={{ fontSize: 12, fill: "#71717a" }} axisLine={false} tickLine={false} tickFormatter={(val) => `R$ ${(Number(val)).toFixed(0)}`} />
              <Tooltip 
                  contentStyle={{ backgroundColor: "#09090b", border: "1px solid #27272a", borderRadius: "0.75rem", color: "#f4f4f5", fontSize: 12 }}
                  formatter={(value: any) => [`R$ ${value}`, ""]}
              />
              <Line type="monotone" dataKey="income" name="Receitas" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="expenses" name="Despesas" stroke="#ef4444" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 4. Leaderboard (Lista no final) */}
        <div className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h3 className="mb-6 text-sm font-semibold text-white flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500"/> Seus Melhores Hábitos (30 Dias)
          </h3>
          
          {consistencyList.length === 0 ? (
              <div className="text-center text-zinc-500 py-6">Nenhum hábito registrado ainda.</div>
          ) : (
              <div className="space-y-6">
              {consistencyList.map((h: any, i: number) => (
                  <div key={h.name}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium text-zinc-200 capitalize">{h.name}</span>
                        <div className="flex gap-4 text-xs">
                           <span className="text-zinc-500">{h.streak} dias seguidos</span>
                           <span className="font-bold text-white">{h.completed}%</span>
                        </div>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                        <div className="h-full rounded-full transition-all duration-500 ease-in-out"
                        style={{ width: `${h.completed}%`, backgroundColor: i === 0 ? "#10b981" : i === 1 ? "#3b82f6" : "#f59e0b" }} />
                    </div>
                  </div>
              ))}
              </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}
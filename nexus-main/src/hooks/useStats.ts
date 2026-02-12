import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format, subMonths, subDays, parseISO, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";

// --- HOOK DE FINANÇAS ---
export const useFinanceStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["stats-finance", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const sixMonthsAgo = format(subMonths(new Date(), 5), "yyyy-MM-01");
      
      // Tenta buscar. Se der erro (tabela não existe), retorna array vazio e não trava.
      try {
        const { data, error } = await supabase
          .from("transactions" as any)
          .select("*")
          .eq("user_id", user.id)
          .gte("date", sixMonthsAgo)
          .order("date", { ascending: true });

        if (error) {
          console.error("Erro ao buscar transações:", error);
          return [];
        }

        const transactions = data || [];

        // Agrupa por mês
        const monthlyMap = new Map();
        
        // Cria estrutura dos últimos 6 meses zerada
        for (let i = 5; i >= 0; i--) {
          const d = subMonths(new Date(), i);
          const key = format(d, "MMM", { locale: ptBR });
          monthlyMap.set(key, { month: key.charAt(0).toUpperCase() + key.slice(1), income: 0, expenses: 0 });
        }

        // Preenche com dados reais
        transactions.forEach((t: any) => {
          // Garante que a data é válida
          if (!t.date) return;
          const dateObj = typeof t.date === 'string' ? parseISO(t.date) : new Date(t.date);
          const monthKey = format(dateObj, "MMM", { locale: ptBR });
          
          if (monthlyMap.has(monthKey)) {
            const entry = monthlyMap.get(monthKey);
            const val = Number(t.amount) || 0;
            if (t.type === 'income') entry.income += val;
            else entry.expenses += val;
          }
        });

        return Array.from(monthlyMap.values());
      } catch (err) {
        console.error("Erro fatal em finanças:", err);
        return [];
      }
    },
    enabled: !!user,
  });
};

// --- HOOK DE HÁBITOS ---
export const useHabitStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["stats-habits", user?.id],
    queryFn: async () => {
      if (!user) return { consistency: [], weeklyHistory: [] };

      try {
        // 1. Busca Hábitos
        const { data: habitsData, error: habitsError } = await supabase
          .from("habits" as any)
          .select("id, title")
          .eq("user_id", user.id);

        if (habitsError || !habitsData) return { consistency: [], weeklyHistory: [] };

        const habits = habitsData as any[];

        // 2. Busca Logs (Últimos 30 dias)
        const thirtyDaysAgo = format(subDays(new Date(), 30), "yyyy-MM-dd");
        
        const { data: logsData, error: logsError } = await supabase
          .from("habit_logs" as any)
          .select("habit_id, date")
          .eq("user_id", user.id)
          .gte("date", thirtyDaysAgo);

        if (logsError) return { consistency: [], weeklyHistory: [] };

        const logs = (logsData || []) as any[];

        // A. Gráfico Semanal
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
          const d = subDays(new Date(), i);
          // Compara datas ignorando horário
          const logsToday = logs.filter(l => isSameDay(parseISO(l.date), d));
          const completedCount = logsToday.length;
          const totalPossible = habits.length;
          const percentage = totalPossible > 0 ? Math.round((completedCount / totalPossible) * 100) : 0;

          last7Days.push({
            day: format(d, "EEE", { locale: ptBR }),
            value: percentage
          });
        }

        // B. Ranking Consistência
        const consistency = habits.map(habit => {
          const habitLogs = logs.filter(l => l.habit_id === habit.id);
          const completed30Days = habitLogs.length;
          const percentage = Math.round((completed30Days / 30) * 100);
          
          return {
            name: habit.title,
            completed: percentage,
            streak: calculateStreak(habitLogs)
          };
        }).sort((a, b) => b.completed - a.completed).slice(0, 5);

        return { consistency, weeklyHistory: last7Days };

      } catch (err) {
        console.error("Erro fatal em hábitos:", err);
        return { consistency: [], weeklyHistory: [] };
      }
    },
    enabled: !!user,
  });
};

// Função auxiliar de streak
function calculateStreak(logs: any[]) {
  if (!logs || logs.length === 0) return 0;
  
  // Extrai datas únicas e ordena
  const uniqueDates = [...new Set(logs.map(l => l.date))].sort().reverse();
  
  const today = format(new Date(), "yyyy-MM-dd");
  const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd");

  // Se não fez hoje nem ontem, streak zerou
  let currentDate = uniqueDates[0];
  if (currentDate !== today && currentDate !== yesterday) return 0;

  let streak = 0;
  // Começa a contar de hoje (ou ontem) para trás
  let checkDate = currentDate === today ? today : yesterday;

  for (const date of uniqueDates) {
    if (date === checkDate) {
      streak++;
      checkDate = format(subDays(parseISO(date), 1), "yyyy-MM-dd");
    } else {
      break; // Sequência quebrou
    }
  }
  return streak;
}
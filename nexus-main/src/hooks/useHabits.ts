import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useIsPremium } from "./useProfile";

// Interface alinhada com o banco de dados
export interface Habit {
  id: string;
  user_id: string;
  title: string;
  category: string;    
  xp: number;
  active: boolean;
  priority: boolean;
  current_streak: number;
  last_completed_at: string | null;
  created_at: string;
}

// 1. Buscar Hábitos
export const useHabits = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["habits", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("habits")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });
        
      if (error) throw error;
      return data as Habit[];
    },
    enabled: !!user,
  });
};

// 2. Adicionar Hábito
export const useAddHabit = () => {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { isPremium } = useIsPremium();

  return useMutation({
    mutationFn: async (habit: { title: string; category: string; xp: number; priority: boolean }) => {
      if (!user) throw new Error("Usuário não logado");

      // Verificação de Limite Grátis
      if (!isPremium) {
        const { count } = await supabase
          .from("habits")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("active", true);
          
        if ((count ?? 0) >= 3) {
          throw new Error("LIMIT_REACHED");
        }
      }

      const { data, error } = await supabase
        .from("habits")
        .insert({ 
          title: habit.title, 
          category: habit.category, 
          xp: habit.xp, 
          priority: habit.priority,
          user_id: user.id, 
          active: true,
          current_streak: 0,
          last_completed_at: null 
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["habits"] });
      toast.success("Hábito criado!");
    },
    onError: (e) => {
      if (e.message === "LIMIT_REACHED") {
        toast.error("Limite atingido!", { description: "Versão Free: máx 3 hábitos." });
      } else {
        toast.error("Erro ao criar hábito.");
      }
    },
  });
};

// 3. Deletar Hábito
export const useDeleteHabit = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("habits").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["habits"] });
      toast.success("Hábito removido.");
    },
  });
};

// 4. Check-in (Marcar como Feito)
export const useCheckInHabit = () => {
  const qc = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, currentStreak }: { id: string; currentStreak: number }) => {
      const { error } = await supabase
        .from("habits")
        .update({ 
          current_streak: currentStreak + 1,
          last_completed_at: new Date().toISOString() // Salva data atual
        })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["habits"] });
      toast.success("Hábito concluído! +XP");
    },
    onError: () => toast.error("Erro ao completar hábito"),
  });
};

// 5. Desfazer Check-in (Desmarcar)
export const useUndoCheckInHabit = () => {
  const qc = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, currentStreak }: { id: string; currentStreak: number }) => {
      const { error } = await supabase
        .from("habits")
        .update({ 
          current_streak: Math.max(0, currentStreak - 1), // Garante que não fica negativo
          last_completed_at: null // Remove a data de conclusão
        })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["habits"] });
      // toast.info("Hábito desmarcado."); 
    },
    onError: () => toast.error("Erro ao desmarcar hábito"),
  });
};
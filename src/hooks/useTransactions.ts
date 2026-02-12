import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useIsPremium } from "./useProfile";
import { format, startOfMonth, endOfMonth } from "date-fns";

export interface TransactionRow {
  id: string;
  user_id: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
  created_at: string;
}

export const useTransactions = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["transactions", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user!.id)
        .order("date", { ascending: false });
      if (error) throw error;
      return data as TransactionRow[];
    },
    enabled: !!user,
  });
};

export const useAddTransaction = () => {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { isPremium } = useIsPremium();

  return useMutation({
    mutationFn: async (tx: { description: string; amount: number; type: "income" | "expense"; category: string; date: string }) => {
      if (!isPremium) {
        const now = new Date();
        const monthStart = format(startOfMonth(now), "yyyy-MM-dd");
        const monthEnd = format(endOfMonth(now), "yyyy-MM-dd");
        const { count } = await supabase
          .from("transactions")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user!.id)
          .eq("type", tx.type)
          .gte("date", monthStart)
          .lte("date", monthEnd);
        const limit = tx.type === "income" ? 5 : 7;
        if ((count ?? 0) >= limit) {
          throw new Error("LIMIT_REACHED");
        }
      }
      const { data, error } = await supabase
        .from("transactions")
        .insert({ ...tx, user_id: user!.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Transação registrada!");
    },
    onError: (e) => {
      if (e.message === "LIMIT_REACHED") {
        toast.error("Limite mensal atingido! Faça upgrade para continuar.");
      } else {
        toast.error("Erro ao registrar transação.");
      }
    },
  });
};

export const useDeleteTransaction = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("transactions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["transactions"] }),
  });
};

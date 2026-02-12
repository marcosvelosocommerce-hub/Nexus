import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useIsPremium } from "./useProfile";
import { format, startOfMonth, endOfMonth } from "date-fns";

export interface AppointmentRow {
  id: string;
  user_id: string;
  title: string;
  date: string;
  time: string | null;
  description: string | null;
  color: string;
  created_at: string;
}

export const useAppointments = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["appointments", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: true })
        .order("time", { ascending: true });
      if (error) throw error;
      return data as AppointmentRow[];
    },
    enabled: !!user,
  });
};

export const useAddAppointment = () => {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { isPremium } = useIsPremium();

  return useMutation({
    mutationFn: async (apt: { title: string; date: string; time?: string; description?: string; color: string }) => {
      if (!isPremium) {
        const now = new Date();
        const monthStart = format(startOfMonth(now), "yyyy-MM-dd");
        const monthEnd = format(endOfMonth(now), "yyyy-MM-dd");
        const { count } = await supabase
          .from("appointments")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user!.id)
          .gte("date", monthStart)
          .lte("date", monthEnd);
        if ((count ?? 0) >= 1) throw new Error("LIMIT_REACHED");
      }
      const { data, error } = await supabase
        .from("appointments")
        .insert({ ...apt, user_id: user!.id, time: apt.time || null })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Compromisso agendado!");
    },
    onError: (e) => {
      if (e.message === "LIMIT_REACHED") {
        toast.error("Limite atingido (Free: 1/mês).");
      } else {
        toast.error("Erro ao agendar.");
      }
    },
  });
};

// --- NOVO: HOOK PARA EDITAR ---
export const useUpdateAppointment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (apt: { id: string; title: string; date: string; time?: string; description?: string; color: string }) => {
      const { error } = await supabase
        .from("appointments")
        .update({ 
            title: apt.title,
            date: apt.date,
            time: apt.time || null,
            description: apt.description,
            color: apt.color
        })
        .eq("id", apt.id);

      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Compromisso atualizado!");
    },
    onError: () => {
      toast.error("Erro ao editar compromisso.");
    }
  });
};

export const useDeleteAppointment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("appointments").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Compromisso removido.");
    },
  });
};
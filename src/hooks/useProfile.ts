import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Profile {
  id: string;
  email: string;
  subscription_status: string | null;
  is_premium: boolean;
  created_at: string;
}

export const useProfile = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("Usuário não logado");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Erro ao buscar perfil:", error);
        return null; 
      }

      // CORREÇÃO: Forçar o 'data' a ser tratado como 'any' 
      // para o TypeScript ler a coluna nova sem reclamar
      const rawData = data as any;

      const profileData: Profile = {
        id: rawData.id,
        created_at: rawData.created_at,
        subscription_status: rawData.subscription_status,
        email: user.email || "",
        
        // Agora acessamos rawData (que o TS não bloqueia)
        is_premium: rawData.is_premium === true || rawData.subscription_status === "active" || rawData.subscription_status === "premium", 
      };

      return profileData;
    },
    enabled: !!user,
  });
};

export const useIsPremium = () => {
  const { data: profile, isLoading } = useProfile();
  
  return { 
    // Se o perfil ainda estiver carregando, assume false
    // Se carregou, usa o valor calculado acima
    isPremium: profile?.is_premium ?? false,
    isLoading 
  };
};
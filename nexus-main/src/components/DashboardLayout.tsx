import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useIsPremium } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogOut, Crown, User, Pencil, Check, X } from "lucide-react"; 
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import BottomNav from "./BottomNav";
import { toast } from "sonner";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, signOut } = useAuth();
  const { isPremium, trialDaysLeft, loading, subscriptionStatus } = useIsPremium();
  const navigate = useNavigate();

  // --- LÓGICA DE NOME ---
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    if (user) {
      // Pega o nome salvo ou a parte do email antes do @
      const savedName = user.user_metadata?.full_name;
      const emailName = user.email?.split("@")[0];
      setDisplayName(savedName || emailName || "Usuário");
    }
  }, [user]);

  const handleSaveName = async () => {
    if (!displayName.trim()) return;
    try {
      await supabase.auth.updateUser({ data: { full_name: displayName } });
      setIsEditing(false);
      toast.success("Nome atualizado!");
    } catch (error) {
      toast.error("Erro ao salvar.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSaveName();
    if (e.key === "Escape") setIsEditing(false);
  };
  // -----------------------------

  return (
    <div className="min-h-screen bg-background pb-28">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
          
          {/* LADO ESQUERDO: Nome + Badge em cima, Email embaixo */}
          <div className="flex flex-col justify-center items-start">
            
            {/* LINHA 1: Nome (Editável) + Badge */}
            <div className="flex items-center gap-2">
              
              {/* Área do Nome */}
              {isEditing ? (
                <div className="flex items-center gap-1">
                  <Input 
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="h-6 w-32 px-1 text-sm font-bold bg-background border-zinc-600"
                    autoFocus
                  />
                  <button onClick={handleSaveName} className="text-emerald-500 hover:bg-emerald-500/10 p-0.5 rounded">
                      <Check className="h-4 w-4" />
                  </button>
                  <button onClick={() => setIsEditing(false)} className="text-red-500 hover:bg-red-500/10 p-0.5 rounded">
                      <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div 
                  className="flex items-center gap-2 group cursor-pointer" 
                  onClick={() => setIsEditing(true)}
                  title="Clique para editar seu nome"
                >
                  <p className="text-sm font-bold text-foreground truncate max-w-[140px]">
                    {displayName}
                  </p>
                  <Pencil className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              )}

              {/* Badges (Agora ao lado do nome) */}
              {!loading && isPremium && subscriptionStatus === "trial" && (
                <span className="flex items-center gap-1 rounded bg-warning/10 px-1.5 py-0.5 text-[9px] font-bold text-warning uppercase tracking-wider">
                  <Crown className="h-2.5 w-2.5" />
                  Trial: {trialDaysLeft}d
                </span>
              )}
              {!loading && !isPremium && (
                <span className="flex items-center gap-1 rounded bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
                  Free
                </span>
              )}
               {!loading && isPremium && subscriptionStatus !== "trial" && (
                <span className="flex items-center gap-1 rounded bg-purple-500/10 px-1.5 py-0.5 text-[9px] font-bold text-purple-500 uppercase tracking-wider">
                  Premium
                </span>
              )}
            </div>

            {/* LINHA 2: Email (Fixo embaixo) */}
            <p className="text-[10px] text-muted-foreground truncate max-w-[180px]">
              {user?.email}
            </p>

          </div>


          {/* LADO DIREITO (Perfil e Sair - Mantido) */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => navigate("/profile")}>
              <User className="h-5 w-5 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="sm" onClick={signOut} className="gap-2 text-muted-foreground hover:text-destructive">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>

        </div>
      </header>
      
      <main className="mx-auto max-w-lg p-4 animate-fade-in">
        {children}
      </main>

      <BottomNav />
    </div>
  );
};

export default DashboardLayout;
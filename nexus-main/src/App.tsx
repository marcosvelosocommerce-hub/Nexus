import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react"; // Adicionei useState e useEffect

// --- IMPORTAÇÃO DAS PÁGINAS ---
import LandingPage from "./pages/LandingPage"; // Importe a LandingPage
import AuthPage from "./pages/AuthPage";
import Index from "./pages/Index";
import FinancePage from "./pages/FinancePage";
import HabitsPage from "./pages/HabitsPage";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import CalendarPage from "./pages/CalendarPage";
import StatsPage from "./pages/StatsPage";
import Legal from "./pages/Legal";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

// --- COMPONENTE INTELIGENTE DA ROTA INICIAL ---
const RootHandler = () => {
  const { session, loading } = useAuth();
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Detecta se está rodando como APP INSTALADO (PWA)
    const checkStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                            (navigator as any).standalone === true; // Fallback iOS
    setIsStandalone(checkStandalone);
  }, []);

  if (loading) return null; // Ou um spinner

  // 1. Se o usuário já estiver logado, manda pro Dashboard (seja App ou Web)
  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  // 2. Se NÃO estiver logado, mas estiver no MODO APP -> Manda pro Login (Pula Landing Page)
  if (isStandalone) {
    return <Navigate to="/auth" replace />;
  }

  // 3. Se estiver no Navegador e não logado -> Mostra a Landing Page
  return <LandingPage />;
};

// --- COMPONENTE DE PROTEÇÃO (Mantive igual) ---
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* AQUI ESTÁ A MÁGICA:
               A rota "/" agora usa o RootHandler para decidir para onde ir 
            */}
            <Route path="/" element={<RootHandler />} />
            
            <Route path="/auth" element={<AuthPage />} />
            
            <Route path="/dashboard" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            
            {/* Rotas de Finanças */}
            <Route path="/finance" element={<ProtectedRoute><FinancePage /></ProtectedRoute>} />
            <Route path="/financas" element={<Navigate to="/finance" replace />} />

            {/* Rotas de Hábitos */}
            <Route path="/habits" element={<ProtectedRoute><HabitsPage /></ProtectedRoute>} />
            <Route path="/habitos" element={<Navigate to="/habits" replace />} />

            {/* Rotas de Calendário */}
            <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
            <Route path="/calendario" element={<Navigate to="/calendar" replace />} />

            {/* Rotas de Estatísticas */}
            <Route path="/stats" element={<ProtectedRoute><StatsPage /></ProtectedRoute>} />
            <Route path="/estatisticas" element={<Navigate to="/stats" replace />} />

            {/* Perfil */}
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/perfil" element={<Navigate to="/profile" replace />} />

            {/* Legal */}
            <Route path="/legal" element={<Legal />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
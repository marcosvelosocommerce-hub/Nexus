import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import Index from "./pages/Index";
import FinancePage from "./pages/FinancePage";
import HabitsPage from "./pages/HabitsPage";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import CalendarPage from "./pages/CalendarPage";
import StatsPage from "./pages/StatsPage";
import Legal from "./pages/Legal";
import UpdatePassword from "./pages/UpdatePassword"; 

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, refetchOnWindowFocus: false },
  },
});

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!session) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const App = () => {
  // --- A MÁGICA: O CADEADO DOS MUNDOS ---
  // Lemos a URL e o Modo de Tela apenas UMA VEZ na hora em que a aplicação inicia.
  const [isAppMode] = useState(() => {
    const hostname = window.location.hostname;
    const isAppDomain = hostname.includes("nexusapp") || hostname === "localhost";
    
    // Detetive PWA Turbinado (apanha todos os formatos possíveis de PWA em Android/iOS)
    const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                  window.matchMedia('(display-mode: fullscreen)').matches ||
                  window.matchMedia('(display-mode: minimal-ui)').matches ||
                  (window.navigator as any).standalone === true;

    // Se o Manifest abriu na rota /auth, ou o utilizador tentou ir direto para /dashboard, é o App com certeza.
    const isAppRoute = window.location.pathname !== "/" && window.location.pathname !== "/legal";

    return isAppDomain || isPWA || isAppRoute;
  });

  // ==========================================
  // MUNDO 1: O SITE (Landing Page)
  // ==========================================
  if (!isAppMode) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    );
  }

  // ==========================================
  // MUNDO 2: O APP (PWA Instalado ou Domínio Direto)
  // ==========================================
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* No Modo App, a raiz (/) exibe o AuthPage. Se já houver conta logada, 
                  o próprio ficheiro AuthPage encarrega-se de mandar o utilizador para o /dashboard */}
              <Route path="/" element={<AuthPage />} />
              <Route path="/auth" element={<Navigate to="/" replace />} />
              <Route path="/dashboard" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/finance" element={<ProtectedRoute><FinancePage /></ProtectedRoute>} />
              <Route path="/financas" element={<Navigate to="/finance" replace />} />
              <Route path="/habits" element={<ProtectedRoute><HabitsPage /></ProtectedRoute>} />
              <Route path="/habitos" element={<Navigate to="/habits" replace />} />
              <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
              <Route path="/calendario" element={<Navigate to="/calendar" replace />} />
              <Route path="/stats" element={<ProtectedRoute><StatsPage /></ProtectedRoute>} />
              <Route path="/estatisticas" element={<Navigate to="/stats" replace />} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/perfil" element={<Navigate to="/profile" replace />} />
              <Route path="/auth/update-password" element={<UpdatePassword />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
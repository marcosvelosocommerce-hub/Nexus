import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// --- ADICIONE ISSO PARA O NAVEGADOR RECONHECER O APP ---
import { registerSW } from 'virtual:pwa-register';

// Isso registra o Service Worker imediatamente
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm("Nova versão disponível. Atualizar?")) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log("App pronto para funcionar offline");
  },
});
// -------------------------------------------------------

createRoot(document.getElementById("root")!).render(<App />);
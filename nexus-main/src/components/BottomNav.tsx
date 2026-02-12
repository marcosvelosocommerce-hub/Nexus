import { NavLink, useLocation } from "react-router-dom";
import { Home, Target, Calendar, Wallet, BarChart3 } from "lucide-react";

const navItems = [
  { to: "/", icon: Home, label: "Início" },
  { to: "/habits", icon: Target, label: "Hábitos" },
  { to: "/calendar", icon: Calendar, label: "Agenda" },
  { to: "/finance", icon: Wallet, label: "Finanças" },
  { to: "/stats", icon: BarChart3, label: "Estatísticas" },
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-safe">
      <div className="mx-4 mb-4 flex items-center gap-1 rounded-2xl border border-border bg-card/80 px-2 py-2 backdrop-blur-xl sm:gap-2 sm:px-4">
        {navItems.map(({ to, icon: Icon, label }) => {
          // Ajuste na lógica de isActive para funcionar com a Home sendo "/"
          const isActive = to === "/" 
            ? location.pathname === "/" 
            : location.pathname.startsWith(to);

          return (
            <NavLink
              key={to}
              to={to}
              className={`flex flex-col items-center gap-0.5 rounded-xl px-3 py-2 transition-all sm:px-5 ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium sm:text-xs">{label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
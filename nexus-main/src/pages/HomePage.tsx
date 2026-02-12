import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Flame, Target, Wallet, Zap, CheckCircle2 } from "lucide-react";
import { useHabits } from "@/hooks/useHabits";
import { useTransactions } from "@/hooks/useTransactions";
import DashboardLayout from "@/components/DashboardLayout";

const MetricCard = ({
  icon: Icon,
  label,
  value,
  sub,
  variant,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub: string;
  variant: "success" | "warning" | "premium" | "info";
}) => {
  const bgMap = {
    success: "bg-primary/10",
    warning: "bg-warning/10",
    premium: "bg-premium/10",
    info: "bg-info/10",
  };
  const textMap = {
    success: "text-primary",
    warning: "text-warning",
    premium: "text-premium",
    info: "text-info",
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-2">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${bgMap[variant]}`}>
          <Icon className={`h-4 w-4 ${textMap[variant]}`} />
        </div>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className={`mt-2 text-2xl font-bold ${textMap[variant]}`}>{value}</p>
      <p className="text-xs text-muted-foreground">{sub}</p>
    </div>
  );
};

const HomePage = () => {
  const { data: habits = [] } = useHabits();
  const { data: transactions = [] } = useTransactions();

  const activeHabits = habits.filter((h) => h.active);
  const totalXp = activeHabits.reduce((s, h) => s + h.xp, 0);

  const income = transactions.filter((t) => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
  const expenses = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);
  const balance = income - expenses;

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Bom dia! 👋</h1>
        <p className="text-sm text-muted-foreground">
          {format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3">
        <MetricCard icon={Zap} label="XP Total" value={`${totalXp}`} sub={`${activeHabits.length} hábitos ativos`} variant="success" />
        <MetricCard icon={Flame} label="Sequência" value="—" sub="Em breve" variant="warning" />
        <MetricCard icon={Target} label="Hábitos" value={`${activeHabits.length}`} sub="ativos" variant="premium" />
        <MetricCard icon={Wallet} label="Saldo" value={`R$${balance.toLocaleString()}`} sub={`${transactions.length} transações`} variant="success" />
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Hábitos Ativos</h2>
        <div className="space-y-2">
          {activeHabits.slice(0, 5).map((habit) => (
            <div
              key={habit.id}
              className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-muted-foreground/30">
                <CheckCircle2 className="h-5 w-5 text-muted-foreground/30" />
              </div>
              <span className="flex-1 font-medium">{habit.title}</span>
              <span className="rounded-lg bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                +{habit.xp}xp
              </span>
            </div>
          ))}
          {activeHabits.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Adicione seus primeiros hábitos na aba Hábitos!
            </p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HomePage;

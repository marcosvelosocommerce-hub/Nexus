import { format, subDays, addDays, startOfWeek } from "date-fns";

export interface Habit {
  id: string;
  name: string;
  icon: string;
  category: string;
  xp: number;
  completed: boolean;
  priority: boolean;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
}

export interface Commitment {
  id: string;
  title: string;
  time?: string;
  description?: string;
  color: string;
  date: string;
}

export const mockHabits: Habit[] = [
  { id: "1", name: "Treino Matinal", icon: "Dumbbell", category: "Essenciais", xp: 10, completed: true, priority: true },
  { id: "2", name: "Ler 30 min", icon: "BookOpen", category: "Essenciais", xp: 10, completed: true, priority: false },
  { id: "3", name: "Meditar", icon: "Brain", category: "Essenciais", xp: 10, completed: false, priority: true },
  { id: "4", name: "Beber 2L de Água", icon: "Droplets", category: "Saúde", xp: 5, completed: true, priority: false },
  { id: "5", name: "Escrever no Diário", icon: "PenLine", category: "Crescimento", xp: 10, completed: false, priority: false },
  { id: "6", name: "Sem Redes Sociais", icon: "ShieldOff", category: "Crescimento", xp: 15, completed: false, priority: true },
  { id: "7", name: "Dormir até 23h", icon: "Moon", category: "Saúde", xp: 10, completed: false, priority: false },
  { id: "8", name: "Banho Frio", icon: "Snowflake", category: "Saúde", xp: 10, completed: false, priority: false },
];

export const mockTransactions: Transaction[] = [
  { id: "1", description: "Pagamento Freelance", amount: 3200, type: "income", category: "Trabalho", date: "2026-02-01" },
  { id: "2", description: "Supermercado", amount: 87.50, type: "expense", category: "Alimentação", date: "2026-02-02" },
  { id: "3", description: "Assinatura Netflix", amount: 15.99, type: "expense", category: "Entretenimento", date: "2026-02-03" },
  { id: "4", description: "Academia", amount: 49.00, type: "expense", category: "Saúde", date: "2026-02-04" },
  { id: "5", description: "Renda Projeto Extra", amount: 850, type: "income", category: "Trabalho", date: "2026-02-05" },
  { id: "6", description: "Jantar Restaurante", amount: 62.30, type: "expense", category: "Alimentação", date: "2026-02-06" },
  { id: "7", description: "Corridas Uber", amount: 34.00, type: "expense", category: "Transporte", date: "2026-02-07" },
  { id: "8", description: "Curso Online", amount: 29.99, type: "expense", category: "Educação", date: "2026-02-07" },
  { id: "9", description: "Cafeteria", amount: 12.50, type: "expense", category: "Alimentação", date: "2026-02-08" },
  { id: "10", description: "Consultoria", amount: 500, type: "income", category: "Trabalho", date: "2026-02-08" },
];

export const mockCommitments: Commitment[] = [
  { id: "1", title: "Reunião Diária", time: "09:00", color: "#3b82f6", date: "2026-02-09" },
  { id: "2", title: "Consulta Dentista", time: "14:30", color: "#ef4444", date: "2026-02-11" },
  { id: "3", title: "Treino na Academia", time: "07:00", color: "#10b981", date: "2026-02-10" },
  { id: "4", title: "Festa de Aniversário", time: "19:00", color: "#f59e0b", date: "2026-02-14" },
  { id: "5", title: "Prazo do Projeto", color: "#8b5cf6", date: "2026-02-15" },
  { id: "6", title: "Café com Alex", time: "10:00", color: "#ec4899", date: "2026-02-12" },
];

export const habitChartData = [
  { day: "Seg", completion: 85 },
  { day: "Ter", completion: 70 },
  { day: "Qua", completion: 92 },
  { day: "Qui", completion: 60 },
  { day: "Sex", completion: 78 },
  { day: "Sáb", completion: 95 },
  { day: "Dom", completion: 88 },
];

export const weeklyChartData = Array.from({ length: 30 }, (_, i) => ({
  date: format(subDays(new Date(), 29 - i), "MMM dd"),
  completion: Math.floor(40 + Math.random() * 55),
}));

export const financeChartData = [
  { month: "Set", income: 3800, expenses: 2100 },
  { month: "Out", income: 4200, expenses: 2800 },
  { month: "Nov", income: 3600, expenses: 2400 },
  { month: "Dez", income: 5100, expenses: 3200 },
  { month: "Jan", income: 4500, expenses: 2900 },
  { month: "Fev", income: 4550, expenses: 340.28 },
];

export const consistencyData = [
  { name: "Treino Matinal", percentage: 92 },
  { name: "Ler 30 min", percentage: 85 },
  { name: "Beber 2L de Água", percentage: 78 },
  { name: "Meditar", percentage: 71 },
  { name: "Escrever no Diário", percentage: 64 },
];

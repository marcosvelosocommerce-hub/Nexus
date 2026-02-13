import { useState, useMemo } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
  Send,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Percent,
  PackageOpen,
  Trash2,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useTransactions, useAddTransaction, useDeleteTransaction } from "@/hooks/useTransactions";
import DashboardLayout from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#f97316"];

const FinancePage = () => {
  const [month, setMonth] = useState(new Date());
  const { data: transactions = [], isLoading } = useTransactions();
  const addMutation = useAddTransaction();
  const deleteMutation = useDeleteTransaction();
  const [input, setInput] = useState("");
  const [tab, setTab] = useState("all");
  const [pieView, setPieView] = useState<"expense" | "income">("expense");

  // Filtrar transações pelo mês selecionado
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const monthTransactions = transactions.filter((t) =>
    isWithinInterval(new Date(t.date), { start: monthStart, end: monthEnd })
  );

  const income = monthTransactions.filter((t) => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
  const expenses = monthTransactions.filter((t) => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);
  const balance = income - expenses;
  const savedPct = income > 0 ? Math.round(((income - expenses) / income) * 100) : 0;

  // Verificar se é o mês atual ou futuro
  const now = new Date();
  const currentMonth = startOfMonth(now);
  const selectedMonth = startOfMonth(month);
  const isCurrentOrFutureMonth = selectedMonth >= currentMonth;
  const canGoToNextMonth = addMonths(selectedMonth, 1) <= currentMonth;
  const isPastMonth = selectedMonth < currentMonth;

  const pieData = useMemo(() => {
    const grouped: Record<string, number> = {};
    monthTransactions
      .filter((t) => t.type === pieView)
      .forEach((t) => {
        grouped[t.category] = (grouped[t.category] || 0) + Number(t.amount);
      });
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [monthTransactions, pieView]);

  // --- CORREÇÃO 1: Lógica de Ordenação (Do mais novo para o mais antigo) ---
  const filteredTx = useMemo(() => {
    const data = tab === "all"
      ? monthTransactions
      : monthTransactions.filter((t) => (tab === "in" ? t.type === "income" : t.type === "expense"));

    return [...data].sort((a, b) => {
      // Tenta usar created_at (precisão de segundos), se não tiver usa date
      const dateA = new Date((a as any).created_at || a.date).getTime();
      const dateB = new Date((b as any).created_at || b.date).getTime();
      return dateB - dateA; // B - A garante a ordem decrescente (Novo -> Velho)
    });
  }, [monthTransactions, tab]);
  // -----------------------------------------------------------------------

  const handleSend = () => {
    // Bloqueia adição em meses passados
    if (isPastMonth) {
      toast.error("Ops — esse mês já foi arquivado. Não é possível adicionar transações. 😄");
      return;
    }

    if (!input.trim()) return;

    const text = input.toLowerCase();
    
    // Parser Inteligente
    const amountMatch = text.match(/(\d+(?:[.,]\d{1,2})?)/);
    const amount = amountMatch ? parseFloat(amountMatch[1].replace(',', '.')) : 0;
    
    if (amount <= 0) {
      toast.error("Não identifiquei um valor na sua mensagem.");
      return;
    }

    const incomeKeywords = ['ganhei', 'salário', 'salario', 'recebi', 'pix recebido', 'venda', 'vendi', 'renda', 'entrada', 'faturei', "ganha", "recebe", "entrou", "ganha", "entra"];
    const isIncome = incomeKeywords.some(key => text.includes(key));

    let category = "Geral";
    const categories: Record<string, string[]> = {
      "Alimentação": ['ifood', 'restaurante', 'almoço', 'jantar', 'padaria', 'mercado', 'burger', 'pizza', 'café'],
      "Transporte": ['uber', '99', 'gasolina', 'combustível', 'combustivel', 'estacionamento', 'pedágio', 'ônibus', 'onibus', 'metrô', 'metro'],
      "Lazer": ['cinema', 'show', 'rolê', 'cerveja', 'festa', 'viagem', 'game', 'netflix', 'spotify', 'bar', 'role'],
      "Saúde": ['farmácia', 'farmacia', 'médico', 'dentista', 'exame', 'hospital', 'remédio', 'remedio', 'consulta', 'psicólogo', 'psicologo', 'terapia', 'academia'],
      "Casa": ['aluguel', 'luz', 'água', 'agua', 'internet', 'condomínio', 'condominio', 'limpeza', 'manutenção', 'manutencao'],
      "Educação": ['curso', 'livro', 'escola', 'faculdade', 'universidade', 'aula', 'workshop', 'seminário', 'seminario'],
      "Roupas": ['roupa', 'calçado', 'calcado', 'sapato', 'vestuário', 'vestuario', 'moda', 'look', 'blusa', 'calça', 'calca', 'jaqueta', 'tênis', 'tenis', 'sapato', 'vestido', 'saia'],
      "Tecnologia": ['celular', 'notebook', 'tablet', 'aplicativo', 'software', 'hardware', 'gadget'],
    };

    for (const [cat, keywords] of Object.entries(categories)) {
      if (keywords.some(key => text.includes(key))) {
        category = cat;
        break;
      }
    }

    let description = input;
    if (amountMatch) description = description.replace(amountMatch[0], "");
    
    const wordsToRemove = [...incomeKeywords, 'gastei', 'com', 'no', 'na', 'de', 'o', 'a', 'pagar', 'paguei', 'reais', 'r$'];
    wordsToRemove.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      description = description.replace(regex, "");
    });

    description = description.trim().replace(/\s+/g, " ");
    description = description.charAt(0).toUpperCase() + description.slice(1);

    if (!description) description = isIncome ? "Renda identificada" : "Despesa identificada";

    addMutation.mutate({
      description,
      amount,
      type: isIncome ? "income" : "expense",
      category,
      date: format(new Date(), "yyyy-MM-dd"),
    }, {
      onSuccess: () => {
        setInput("");
        toast.success(`${isIncome ? 'Entrada' : 'Saída'} registrada!`);
      },
    });
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-border bg-card px-3 py-2 shadow-lg">
          <p className="text-xs font-semibold text-foreground">{payload[0].name}</p>
          <p className="text-xs text-muted-foreground">
            R${payload[0].value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <h1 className="mb-4 text-2xl font-bold">Finanças</h1>

      <div className="mb-4 flex items-center gap-2 rounded-2xl border border-border bg-card p-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={isPastMonth ? 'Mês finalizado — não é possível adicionar/alterar 😄' : 'Ex: Gastei 50 no jantar'}
          disabled={isPastMonth}
          className="flex-1 bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={addMutation.isPending || isPastMonth}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-4 flex items-center justify-center gap-4">
        <button onClick={() => setMonth(subMonths(month, 1))}>
          <ChevronLeft className="h-5 w-5 text-muted-foreground" />
        </button>
        <span className="text-sm font-semibold">
          {format(month, "MMMM yyyy", { locale: ptBR })}
          {isCurrentOrFutureMonth && <span className="ml-2 text-xs text-primary font-medium">(Atual)</span>}
        </span>
        <button 
          onClick={() => setMonth(addMonths(month, 1))}
          disabled={!canGoToNextMonth}
          className="disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ArrowDownRight className="h-3.5 w-3.5 text-primary" />
            Receitas
          </div>
          <p className="mt-1 text-xl font-bold text-primary">R${income.toLocaleString()}</p>
        </div>
        
        {/* Despesas com Vermelho Vibrante */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ArrowUpRight className="h-3.5 w-3.5 text-red-500" />
            Despesas
          </div>
          <p className="mt-1 text-xl font-bold text-red-500">R${expenses.toLocaleString()}</p>
        </div>
        
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <TrendingUp className={`h-3.5 w-3.5 ${balance >= 0 ? "text-primary" : "text-red-500"}`} />
            Saldo
          </div>
          <p className={`mt-1 text-xl font-bold ${balance >= 0 ? "text-primary" : "text-red-500"}`}>
            R${balance.toLocaleString()}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Percent className="h-3.5 w-3.5 text-warning" />
            Economizado
          </div>
          <p className="mt-1 text-xl font-bold text-warning">{savedPct}%</p>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Distribuição por Categoria</h2>
          <div className="flex gap-1 rounded-xl bg-secondary p-0.5">
            <button
              onClick={() => setPieView("expense")}
              className={`rounded-lg px-3 py-1 text-xs font-medium transition-all ${
                pieView === "expense" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              Saídas
            </button>
            <button
              onClick={() => setPieView("income")}
              className={`rounded-lg px-3 py-1 text-xs font-medium transition-all ${
                pieView === "income" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              Entradas
            </button>
          </div>
        </div>
        {pieData.length === 0 ? (
          <p className="py-8 text-center text-xs text-muted-foreground">Sem dados para exibir</p>
        ) : (
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={180}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value" stroke="none">
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-1 flex-col gap-2">
              {pieData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="flex-1 text-xs text-muted-foreground">{item.name}</span>
                  <span className="text-xs font-semibold text-foreground">R${item.value.toFixed(0)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-4 grid w-full grid-cols-3 bg-secondary">
          <TabsTrigger value="all">Tudo</TabsTrigger>
          <TabsTrigger value="out">Saídas</TabsTrigger>
          <TabsTrigger value="in">Entradas</TabsTrigger>
        </TabsList>
        <TabsContent value={tab}>
          {filteredTx.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
              <PackageOpen className="h-12 w-12" />
              <p className="text-sm">Nenhuma transação ainda</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTx.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between rounded-2xl border border-border bg-card p-4">
                  <div>
                    <p className="text-sm font-medium">{tx.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {tx.category} · {format(new Date(tx.date), "MMM d")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* --- CORREÇÃO 2: Vermelho Vibrante aqui também --- */}
                    <p className={`text-sm font-bold ${tx.type === "income" ? "text-primary" : "text-red-500"}`}>
                      {tx.type === "income" ? "+" : "-"}R${Number(tx.amount).toFixed(2)}
                    </p>
                    <button
                      onClick={() => {
                        if (isPastMonth) {
                          toast.error("Ei! Meses passados estão arquivados — não é possível excluir. 😄");
                          return;
                        }
                        deleteMutation.mutate(tx.id);
                      }}
                      disabled={isPastMonth}
                      className={`flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground transition-colors ${isPastMonth ? 'opacity-50 cursor-not-allowed' : 'hover:bg-destructive/10 hover:text-destructive'}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default FinancePage;
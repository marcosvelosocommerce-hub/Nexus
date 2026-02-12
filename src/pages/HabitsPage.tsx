import { useState } from "react";
import { Plus, Check, Trash2, Zap, Star, ArrowLeft } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format, isSameDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
// ADICIONEI O useUndoCheckInHabit AQUI NA IMPORTAÇÃO:
import { useHabits, useAddHabit, useDeleteHabit, useCheckInHabit, useUndoCheckInHabit } from "@/hooks/useHabits";

// Opções de XP
const XP_OPTIONS = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];

const HabitsPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newHabitTitle, setNewHabitTitle] = useState("");
  const [isPriority, setIsPriority] = useState(false);
  const [xp, setXp] = useState(10); 
  const [frequency, setFrequency] = useState("Diário");

  // Hooks
  const { data: habits = [], isLoading } = useHabits();
  const addHabit = useAddHabit();
  const deleteHabit = useDeleteHabit();
  const checkInHabit = useCheckInHabit();
  const undoCheckInHabit = useUndoCheckInHabit(); // Novo Hook

  // Lógica de Progresso
  const totalHabits = habits.length;
  const completedToday = habits.filter(h => 
    h.last_completed_at && isSameDay(parseISO(h.last_completed_at), new Date())
  ).length;
  
  const progressPercentage = totalHabits === 0 ? 0 : Math.round((completedToday / totalHabits) * 100);

  const resetForm = () => {
    setNewHabitTitle("");
    setIsPriority(false);
    setXp(10);
    setFrequency("Diário");
    setIsDialogOpen(false);
  };

  const handleCreateHabit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newHabitTitle.trim()) return;

    addHabit.mutate({
      title: newHabitTitle,
      category: frequency,
      xp: xp,
      priority: isPriority,
    }, {
      onSuccess: () => resetForm(),
      onError: (error) => console.error("Erro:", error)
    });
  };

  // Função inteligente que decide se Marca ou Desmarca
  const handleToggleHabit = (habit: any, isCompleted: boolean) => {
    if (isCompleted) {
      // Se já está feito, desfaz (remove data e diminui streak)
      undoCheckInHabit.mutate({ id: habit.id, currentStreak: habit.current_streak });
    } else {
      // Se não está feito, marca (adiciona data e aumenta streak)
      checkInHabit.mutate({ id: habit.id, currentStreak: habit.current_streak });
    }
  };

  const today = format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR });
  const capitalizedDate = today.charAt(0).toUpperCase() + today.slice(1);

  return (
    <DashboardLayout>
      <div className="space-y-8 fade-in pb-24">
        
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Hábitos</h1>
            <p className="text-muted-foreground capitalize">{capitalizedDate}</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-lg shadow-primary/20 transition-all hover:scale-105">
                <Plus className="h-4 w-4" /> Novo Hábito
              </Button>
            </DialogTrigger>
            
            <DialogContent className="bg-[#09090b] border-zinc-800 sm:max-w-[600px] p-0 overflow-hidden gap-0 [&>button]:hidden">
              <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-800">
                <Button variant="ghost" size="icon" onClick={() => setIsDialogOpen(false)} className="h-8 w-8 text-muted-foreground hover:text-white rounded-full hover:bg-zinc-800">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <DialogTitle className="text-base font-semibold text-white">Novo Hábito</DialogTitle>
                <Button onClick={() => handleCreateHabit()} disabled={addHabit.isPending || !newHabitTitle.trim()} size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4 h-8 rounded-md transition-colors">
                  {addHabit.isPending ? "..." : "Adicionar"}
                </Button>
              </div>

              <form onSubmit={handleCreateHabit} className="p-6 space-y-8">
                <div className="space-y-3">
                  <Label className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">Nome</Label>
                  <Input placeholder="Ex: Meditar 10 minutos" value={newHabitTitle} onChange={(e) => setNewHabitTitle(e.target.value)} className="bg-zinc-900/50 border-zinc-800 focus:border-emerald-600 h-14 text-lg rounded-xl placeholder:text-zinc-600 text-white" />
                </div>

                <div className="space-y-3">
                  <Label className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">Pontos</Label>
                  <div className="flex flex-wrap gap-2">
                    {XP_OPTIONS.map((value) => (
                      <button type="button" key={value} onClick={() => setXp(value)} className={`h-9 px-4 rounded-lg text-sm font-medium transition-all duration-200 border ${xp === value ? "bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-900/20" : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200"}`}>
                        +{value}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">Frequência</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {["Diário", "Dias úteis", "Fim de semana"].map((freq) => (
                      <button type="button" key={freq} onClick={() => setFrequency(freq)} className={`py-3 px-2 rounded-xl text-sm font-medium transition-all duration-200 border ${frequency === freq ? "bg-emerald-600 text-white border-emerald-600" : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200"}`}>
                        {freq}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-zinc-900/50 p-4 border border-zinc-800 cursor-pointer hover:border-zinc-700 transition-colors" onClick={() => setIsPriority(!isPriority)}>
                  <div className="flex items-center gap-3">
                    <Star className={`h-5 w-5 transition-colors ${isPriority ? "text-yellow-500 fill-yellow-500" : "text-zinc-600"}`} />
                    <span className="text-sm font-medium text-zinc-300">Marcar como essencial</span>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${isPriority ? "border-emerald-500 bg-emerald-500" : "border-zinc-700"}`}>
                    {isPriority && <Check className="h-3 w-3 text-black" strokeWidth={3} />}
                  </div>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Card de Progresso */}
        <Card className="bg-gradient-to-br from-zinc-900 to-black border-zinc-800 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-32 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-white mb-1">Seu Progresso Hoje</h3>
                <p className="text-sm text-muted-foreground">
                  {completedToday} de {totalHabits} hábitos concluídos
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <Zap className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
             {/* Barra de Progresso Visual */}
             <div className="h-2 w-full bg-zinc-800/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-xs text-right mt-2 text-zinc-500">{progressPercentage}% Completo</p>
          </CardContent>
        </Card>

        {/* Lista de Hábitos */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="flex flex-col gap-3">
               {[1,2,3].map(i => <div key={i} className="h-20 bg-zinc-900/50 rounded-xl animate-pulse" />)}
            </div>
          ) : habits.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20">
              <p className="text-zinc-500">Sua rotina está vazia.</p>
              <Button variant="link" className="text-emerald-500 mt-2" onClick={() => setIsDialogOpen(true)}>
                Criar primeiro hábito
              </Button>
            </div>
          ) : (
            habits.map((habit) => {
              // Verifica se foi feito hoje
              const isCompleted = habit.last_completed_at && isSameDay(parseISO(habit.last_completed_at), new Date());

              return (
                <div 
                  key={habit.id} 
                  className={`group flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
                    isCompleted 
                      ? "border-emerald-900/50 bg-emerald-950/10" 
                      : "border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center gap-5">
                    {/* Checkbox Customizado com Lógica de Desfazer */}
                    <button
                      onClick={() => handleToggleHabit(habit, !!isCompleted)}
                      disabled={checkInHabit.isPending || undoCheckInHabit.isPending}
                      className={`h-8 w-8 rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${
                        isCompleted 
                          ? "bg-emerald-500 border-emerald-500" // Se feito: Verde Cheio
                          : "border-zinc-700 hover:border-emerald-500/50 hover:bg-emerald-500/10" // Se não: Vazio
                      }`}
                    >
                      <Check className={`h-4 w-4 text-black transition-transform duration-300 ${
                        isCompleted ? "scale-100 opacity-100" : "scale-0 opacity-0"
                      }`} strokeWidth={3} />
                    </button>
                    
                    <div className={isCompleted ? "opacity-50 transition-opacity" : "opacity-100 transition-opacity"}>
                      <h3 className={`font-medium text-base flex items-center gap-2 ${
                        isCompleted ? "text-emerald-500/70 line-through decoration-emerald-500/50" : "text-zinc-100"
                      }`}>
                        {habit.title}
                        {habit.priority && <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1.5 font-medium">
                        <span className="bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-md">
                          {habit.category || "Diário"}
                        </span>
                        <span className={isCompleted ? "text-zinc-600" : "text-emerald-500"}>
                          +{habit.xp} XP
                        </span>
                        <span>
                          🔥 {habit.current_streak} dias
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-all text-zinc-500 hover:text-red-400 hover:bg-red-500/10"
                    onClick={() => deleteHabit.mutate(habit.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HabitsPage;
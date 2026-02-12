import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Clock, Calendar as CalendarIcon, Trash2, Pencil } from "lucide-react";
import { format, isSameMonth, isBefore, startOfDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
    useAppointments, 
    useAddAppointment, 
    useUpdateAppointment, 
    useDeleteAppointment, 
    AppointmentRow 
} from "@/hooks/useAppointments";

const COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#ef4444", "#f59e0b", "#ec4899"];

export default function AgendaPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Estado do Formulário
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  // Hooks
  const { data: appointments = [], isLoading } = useAppointments();
  const addAppointment = useAddAppointment();
  const updateAppointment = useUpdateAppointment();
  const deleteAppointment = useDeleteAppointment();

  const today = startOfDay(new Date());
  const parseApptDate = (dateString: string) => parseISO(dateString);

  // Filtros
  const futureAppointments = appointments.filter(apt => {
    const aptDate = parseApptDate(apt.date);
    return !isBefore(aptDate, today); 
  });

  const pastMonthAppointments = appointments.filter(apt => {
    const aptDate = parseApptDate(apt.date);
    return isBefore(aptDate, today) && isSameMonth(aptDate, date || new Date());
  });

  // Funções de Controle
  const resetForm = () => {
    setTitle(""); setTime(""); setDescription(""); setSelectedColor(COLORS[0]); setEditingId(null);
  };

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) resetForm();
  };

  const handleEditClick = (apt: AppointmentRow) => {
    setEditingId(apt.id);
    setTitle(apt.title);
    setTime(apt.time || "");
    setDescription(apt.description || "");
    setSelectedColor(apt.color);
    setDate(parseISO(apt.date)); 
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date) return;
    const dateString = format(date, "yyyy-MM-dd");

    if (editingId) {
        updateAppointment.mutate({ id: editingId, title, date: dateString, time: time || undefined, description, color: selectedColor }, { onSuccess: () => handleOpenChange(false) });
    } else {
        addAppointment.mutate({ title, date: dateString, time: time || undefined, description, color: selectedColor }, { onSuccess: () => handleOpenChange(false) });
    }
  };

  const isSaving = addAppointment.isPending || updateAppointment.isPending;

  return (
    <DashboardLayout>
      <div className="space-y-12 pb-24 fade-in max-w-5xl mx-auto">
        
        {/* ================= CABEÇALHO ================= */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
                <h1 className="text-3xl font-bold text-white">Agenda</h1>
                <p className="text-zinc-400">Organize seus compromissos.</p>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
                <DialogTrigger asChild>
                <Button onClick={resetForm} className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-900/20">
                    <Plus className="h-5 w-5 mr-2" /> Novo Compromisso
                </Button>
                </DialogTrigger>
                <DialogContent className="bg-zinc-950 border-zinc-800 text-white sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{editingId ? "Editar Compromisso" : "Novo Compromisso"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label>Título</Label>
                        <Input placeholder="Ex: Médico..." value={title} onChange={e => setTitle(e.target.value)} className="bg-zinc-900 border-zinc-800" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Data</Label>
                            <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-md text-sm text-zinc-300 flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-emerald-500" />
                            {date ? format(date, "dd/MM/yyyy") : "Selecione..."}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Horário</Label>
                            <Input type="time" value={time} onChange={e => setTime(e.target.value)} className="bg-zinc-900 border-zinc-800" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Descrição</Label>
                        <Textarea placeholder="Detalhes opcionais..." value={description} onChange={e => setDescription(e.target.value)} className="bg-zinc-900 border-zinc-800 resize-none h-20" />
                    </div>
                    <div className="space-y-2">
                        <Label>Cor</Label>
                        <div className="flex gap-2">
                            {COLORS.map(c => (
                            <button key={c} type="button" onClick={() => setSelectedColor(c)} className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === c ? "border-white scale-110" : "border-transparent opacity-70 hover:opacity-100"}`} style={{ backgroundColor: c }} />
                            ))}
                        </div>
                    </div>
                    <Button type="submit" disabled={isSaving} className="w-full bg-emerald-600 hover:bg-emerald-500 mt-2">
                        {isSaving ? "Salvando..." : (editingId ? "Atualizar" : "Agendar")}
                    </Button>
                </form>
                </DialogContent>
            </Dialog>
        </div>

        {/* ================= CALENDÁRIO CENTRALIZADO ================= */}
        <div className="flex justify-center w-full">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 shadow-2xl inline-block transform md:scale-110 origin-top">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    locale={ptBR}
                    className="pointer-events-auto"
                    classNames={{
                        // 1. AQUI ESTÁ A CORREÇÃO: Remove o fundo da célula da tabela
                        cell: "h-10 w-10 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-zinc-900/50 [&:has([aria-selected])]:bg-transparent focus-within:relative focus-within:z-20",
                        
                        // 2. O Botão Redondo
                        day: "h-10 w-10 p-0 font-medium aria-selected:bg-transparent hover:bg-zinc-800 rounded-2xl transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-0",
                        
                        // 3. A Cor de Seleção (Sobrepõe tudo)
                        day_selected: "!bg-emerald-500 !text-white !opacity-100 !rounded-2xl hover:!bg-emerald-600 shadow-md shadow-emerald-900/20",
                        
                        // 4. Dia de Hoje
                        day_today: "bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-2xl",
                        
                        // Estilos Gerais
                        caption: "flex justify-center pt-1 relative items-center mb-4",
                        caption_label: "text-lg font-bold capitalize text-zinc-100",
                        nav_button: "border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 hover:text-white h-8 w-8 rounded-xl p-0 opacity-70 hover:opacity-100 transition-opacity",
                        head_cell: "text-zinc-500 rounded-md w-10 font-normal text-[0.8rem] capitalize pb-4",
                        table: "w-full border-collapse space-y-1",
                    }}
                    modifiers={{
                        hasEvent: (day) => appointments.some(apt => apt.date === format(day, "yyyy-MM-dd"))
                    }}
                    modifiersStyles={{
                        hasEvent: { 
                            fontWeight: "900",
                            color: "#34d399", 
                        }
                    }}
                />
            </div>
        </div>

        <div className="border-t border-zinc-800/50 my-10"></div>

        {/* ================= PRÓXIMOS COMPROMISSOS ================= */}
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="w-2 h-8 bg-emerald-500 rounded-full"/> Próximos Compromissos
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {isLoading ? (
                  <p className="text-zinc-500 col-span-full text-center py-8">Carregando...</p>
                ) : futureAppointments.length === 0 ? (
                  <div className="col-span-full p-12 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/20 text-center">
                    <p className="text-zinc-400">Sua agenda futura está livre!</p>
                  </div>
                ) : (
                  futureAppointments.map((apt) => (
                    <EventCard 
                        key={apt.id} 
                        apt={apt} 
                        onEdit={() => handleEditClick(apt)}
                        onDelete={() => deleteAppointment.mutate(apt.id)} 
                    />
                  ))
                )}
            </div>

            {/* Histórico */}
            {pastMonthAppointments.length > 0 && (
                <div className="pt-12 opacity-60 hover:opacity-100 transition-opacity">
                    <h3 className="text-lg font-semibold text-zinc-500 mb-4 uppercase tracking-wider text-sm">Passados Recentemente</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {pastMonthAppointments.map((apt) => (
                        <EventCard 
                            key={apt.id} 
                            apt={apt} 
                            isPast={true}
                            onEdit={() => handleEditClick(apt)}
                            onDelete={() => deleteAppointment.mutate(apt.id)} 
                        />
                        ))}
                    </div>
                </div>
            )}
        </div>
      </div>
    </DashboardLayout>
  );
}

// --- Componente do Cartão ---
function EventCard({ apt, onEdit, onDelete, isPast = false }: { apt: AppointmentRow, onEdit: () => void, onDelete: () => void, isPast?: boolean }) {
    const dateObj = parseISO(apt.date);
    const day = format(dateObj, "dd");
    const month = format(dateObj, "MMM", { locale: ptBR }).toUpperCase();
    const weekDay = format(dateObj, "EEEE", { locale: ptBR });
    const formattedTime = apt.time ? apt.time.slice(0, 5) : null;

    return (
        <div className={`relative group flex flex-col p-5 rounded-xl border transition-all duration-300 overflow-hidden ${
            isPast 
            ? "bg-zinc-950 border-zinc-800 grayscale opacity-70" 
            : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900 shadow-sm hover:shadow-md hover:-translate-y-1"
        }`}>
            {/* Faixa Colorida Lateral */}
            <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: apt.color }} />

            {/* Topo do Card */}
            <div className="flex items-start gap-4 mb-3 pl-2">
                <div className="flex flex-col items-center justify-center w-12 h-12 bg-zinc-950 rounded-lg border border-zinc-800 shrink-0">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase leading-none">{month}</span>
                    <span className="text-xl font-bold text-white leading-none mt-0.5">{day}</span>
                </div>
                
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h3 className={`font-semibold text-base truncate pr-2 ${isPast ? "text-zinc-500 line-through" : "text-white"}`} title={apt.title}>
                        {apt.title}
                    </h3>
                    <span className="text-xs text-zinc-500 capitalize truncate">{weekDay}</span>
                </div>
            </div>

            {/* Detalhes */}
            <div className="flex-1 space-y-3 mb-2 pl-2">
                 {formattedTime && (
                    <div className="inline-flex items-center gap-1.5 text-xs font-medium bg-zinc-800/50 text-zinc-300 px-2.5 py-1 rounded-full border border-zinc-800/50">
                         <Clock className="h-3 w-3 shrink-0" /> {formattedTime}
                    </div>
                )}
                
                {apt.description && (
                  <p className="text-xs text-zinc-500 line-clamp-2 min-h-[2.5em] break-words">
                    {apt.description}
                  </p>
                )}
            </div>

            {/* Ações */}
            <div className="flex items-center justify-end gap-2 border-t border-zinc-800/50 pt-3 mt-auto pl-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); onEdit(); }}
                    className="h-8 w-8 p-0 text-zinc-400 hover:text-white hover:bg-zinc-800"
                >
                    <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    className="h-8 w-8 p-0 text-zinc-400 hover:text-red-400 hover:bg-red-500/10"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
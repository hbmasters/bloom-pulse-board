import { useState, useMemo } from "react";
import {
  ChevronLeft, ChevronRight, X, Calendar, RefreshCw, Clock,
  ArrowUp, ArrowRight, ArrowDown, Flower2, Truck, ClipboardCheck,
  Users, Snowflake, PackageCheck, Code2, BarChart3, User, Bot, Filter
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, startOfWeek, addDays, addWeeks, isToday } from "date-fns";
import { nl } from "date-fns/locale";
import type { KanbanCard, Priority, Category, TaskType, Status } from "./kanban-shared";
import { getKanbanCards } from "./kanban-data";

/* ── Config (identical to Kanban) ── */

const priorityConfig: Record<Priority, { icon: typeof ArrowUp; label: string; className: string }> = {
  high:   { icon: ArrowUp,    label: "Hoog",   className: "text-red-400" },
  medium: { icon: ArrowRight, label: "Medium", className: "text-bloom-warm" },
  low:    { icon: ArrowDown,  label: "Laag",   className: "text-muted-foreground" },
};

const categoryConfig: Record<Category, { icon: typeof Flower2; label: string; className: string }> = {
  productie: { icon: Flower2,        label: "Productie",  className: "bg-primary/10 text-primary" },
  planning:  { icon: ClipboardCheck, label: "Planning",   className: "bg-bloom-sky/10 text-bloom-sky" },
  logistiek: { icon: Truck,          label: "Logistiek",  className: "bg-bloom-warm/10 text-bloom-warm" },
  qc:        { icon: PackageCheck,   label: "QC",         className: "bg-accent/10 text-accent" },
  personeel: { icon: Users,          label: "Personeel",  className: "bg-purple-500/10 text-purple-400" },
  koelcel:   { icon: Snowflake,      label: "Koelcel",    className: "bg-cyan-500/10 text-cyan-400" },
};

const taskTypeConfig: Record<TaskType, { icon: typeof Code2; label: string; className: string }> = {
  development: { icon: Code2,     label: "DEV",      className: "bg-blue-500/15 text-blue-400 border-blue-500/20" },
  analysis:    { icon: BarChart3, label: "ANALYSIS", className: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
};

const statusLabels: Record<Status, { label: string; className: string }> = {
  todo:        { label: "Te Doen",       className: "text-bloom-warm" },
  in_progress: { label: "In Uitvoering", className: "text-primary" },
  review:      { label: "Review",        className: "text-purple-400" },
  done:        { label: "Klaar",         className: "text-accent" },
};

const recurrenceLabels: Record<string, string> = {
  daily: "Dagelijks",
  weekly: "Wekelijks",
  biweekly: "Tweewekelijks",
  monthly: "Maandelijks",
};

/* ── Detail Panel (right side — mirrors Kanban) ── */

const AgendaDetailPanel = ({ card, onClose }: { card: KanbanCard; onClose: () => void }) => {
  const PriorityIcon = priorityConfig[card.priority].icon;
  const CategoryIcon = categoryConfig[card.category].icon;
  const TypeIcon = taskTypeConfig[card.task_type].icon;
  const statusCfg = statusLabels[card.status];

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]" onClick={onClose} />
      <div className="fixed top-0 right-0 z-50 h-full w-full max-w-xl border-l border-border bg-card shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
        {/* Header */}
        <div className="shrink-0 p-5 border-b border-border">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className={cn("inline-flex items-center gap-1 text-[8px] font-mono font-black px-1.5 py-0.5 rounded border", taskTypeConfig[card.task_type].className)}>
                  <TypeIcon className="w-2.5 h-2.5" />
                  {taskTypeConfig[card.task_type].label}
                </span>
                <span className={cn("inline-flex items-center gap-1 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded", categoryConfig[card.category].className)}>
                  <CategoryIcon className="w-2.5 h-2.5" />
                  {categoryConfig[card.category].label}
                </span>
                <span className={cn("flex items-center gap-0.5", priorityConfig[card.priority].className)} title={priorityConfig[card.priority].label}>
                  <PriorityIcon className="w-3 h-3" />
                  <span className="text-[9px] font-mono">{priorityConfig[card.priority].label}</span>
                </span>
                {card.labels.map(l => (
                  <span key={l} className="text-[8px] font-mono px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">{l}</span>
                ))}
              </div>
              <h2 className="text-base font-bold text-foreground">{card.title}</h2>
              {card.description && (
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{card.description}</p>
              )}
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted/50 transition-colors shrink-0">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-5">
          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3">
            <InfoRow label="Type" value={card.task_type === "analysis" ? "Analyse" : "Taak"} />
            <InfoRow label="Status" value={statusCfg.label} valueClass={statusCfg.className} />
            <InfoRow label="Owner" value={card.assignee || "—"} />
            <InfoRow label="Prioriteit" value={priorityConfig[card.priority].label} valueClass={priorityConfig[card.priority].className} />
          </div>

          {/* Agent */}
          {card.agent && (
            <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Agent</span>
              </div>
              <p className="text-sm text-foreground mt-1 font-medium">{card.agent}</p>
            </div>
          )}

          {/* Recurring info */}
          {card.recurring && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Terugkerend</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <InfoRow label="Frequentie" value={card.recurrence_pattern ? recurrenceLabels[card.recurrence_pattern] || card.recurrence_pattern : "—"} />
                <InfoRow label="Laatste run" value={card.last_run_at || "—"} />
                <InfoRow label="Volgende run" value={card.next_run_at || "—"} />
                <InfoRow label="Aangemaakt" value={card.createdAt} />
              </div>
            </div>
          )}

          {/* Time info */}
          {(card.startTime || card.stopTime || card.dueDate) && (
            <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Planning</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {card.startTime && <InfoRow label="Start" value={card.startTime} />}
                {card.stopTime && <InfoRow label="Stop" value={card.stopTime} />}
                {card.dueDate && <InfoRow label="Deadline" value={card.dueDate} />}
              </div>
            </div>
          )}

          {/* Labels */}
          {card.labels.length > 0 && (
            <div>
              <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider">Labels</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {card.labels.map(l => (
                  <span key={l} className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">{l}</span>
                ))}
              </div>
            </div>
          )}

          {/* Analysis output */}
          {card.task_type === "analysis" && card.result_summary && (
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">Laatste output</span>
              <p className="text-xs text-foreground/80 mt-1 leading-relaxed">{card.result_summary}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const InfoRow = ({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) => (
  <div>
    <span className="text-[10px] font-mono font-bold text-muted-foreground/60 uppercase tracking-wider block">{label}</span>
    <span className={cn("text-xs font-medium text-foreground", valueClass)}>{value}</span>
  </div>
);

/* ── Day Card (compact agenda item with labels + agent) ── */

const AgendaDayCard = ({ card, onClick }: { card: KanbanCard; onClick: () => void }) => {
  const catCfg = categoryConfig[card.category];
  const CatIcon = catCfg.icon;
  const PriIcon = priorityConfig[card.priority].icon;
  const statusCfg = statusLabels[card.status];
  const visibleLabels = card.labels.slice(0, 2);
  const extraCount = card.labels.length - 2;

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-2.5 rounded-lg border border-border bg-card transition-all group hover:border-primary/20 hover:shadow-sm"
    >
      <div className="flex items-start gap-2">
        <CatIcon className={cn("w-3.5 h-3.5 mt-0.5 shrink-0", catCfg.className.split(" ")[1])} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h4 className="text-xs font-semibold text-foreground truncate flex-1">{card.title}</h4>
            <PriIcon className={cn("w-3 h-3 shrink-0", priorityConfig[card.priority].className)} />
          </div>

          {/* Row 2: status + recurring + time */}
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {card.recurring && (
              <span className="inline-flex items-center gap-0.5 text-[8px] font-mono font-bold text-primary">
                <RefreshCw className="w-2.5 h-2.5" />
              </span>
            )}
            <span className={cn("text-[8px] font-mono font-medium", statusCfg.className)}>{statusCfg.label}</span>
            {card.startTime && (
              <span className="text-[8px] font-mono text-muted-foreground">{card.startTime}{card.stopTime ? `–${card.stopTime}` : ""}</span>
            )}
          </div>

          {/* Row 3: labels + agent */}
          <div className="flex items-center gap-1 mt-1.5 flex-wrap">
            {visibleLabels.map(l => (
              <span key={l} className="text-[7px] font-mono px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground border border-border leading-none">{l}</span>
            ))}
            {extraCount > 0 && (
              <span className="text-[7px] font-mono text-muted-foreground/40">+{extraCount}</span>
            )}
            {card.agent && (
              <span className="ml-auto inline-flex items-center gap-0.5 text-[7px] font-mono text-blue-400/70">
                <Bot className="w-2.5 h-2.5" />
                {card.agent}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
};

/* ── Main Agenda ── */

const MCAgenda = () => {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedCard, setSelectedCard] = useState<KanbanCard | null>(null);
  const [filterRecurring, setFilterRecurring] = useState(false);
  const [filterAgent, setFilterAgent] = useState<string | null>(null);

  const weekStart = useMemo(() => {
    const base = startOfWeek(new Date(), { weekStartsOn: 1 });
    return weekOffset === 0 ? base : addWeeks(base, weekOffset);
  }, [weekOffset]);

  const allCards = useMemo(() => getKanbanCards(), []);

  // Derive unique agents from cards
  const agentOptions = useMemo(() => {
    const set = new Set<string>();
    allCards.forEach(c => { if (c.agent) set.add(c.agent); });
    return Array.from(set).sort();
  }, [allCards]);

  // Filter
  const agendaCards = useMemo(() => {
    return allCards.filter(c => {
      if (filterRecurring && !c.recurring) return false;
      if (filterAgent && c.agent !== filterAgent) return false;
      return c.recurring || c.dueDate || c.startTime;
    });
  }, [allCards, filterRecurring, filterAgent]);

  const days = useMemo(() =>
    Array.from({ length: 5 }, (_, i) => {
      const date = addDays(weekStart, i);
      return { date, key: format(date, "yyyy-MM-dd"), name: ["Ma", "Di", "Wo", "Do", "Vr"][i], label: format(date, "d MMM", { locale: nl }) };
    }), [weekStart]);

  const cardsByDay = useMemo(() => {
    const map: Record<string, KanbanCard[]> = {};
    days.forEach(d => { map[d.key] = []; });
    agendaCards.forEach(card => {
      if (card.recurring) {
        if (card.recurrence_pattern === "daily") {
          days.forEach(d => map[d.key].push(card));
        } else {
          if (days.length > 0) map[days[0].key].push(card);
        }
      } else {
        const dayIdx = parseInt(card.id, 36) % days.length;
        map[days[dayIdx].key].push(card);
      }
    });
    return map;
  }, [agendaCards, days]);

  const recurringCount = allCards.filter(c => c.recurring).length;
  const totalAgenda = agendaCards.length;

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-4 md:px-6 py-4 border-b border-border bg-card/40 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <button onClick={() => setWeekOffset(o => o - 1)} className="p-1.5 rounded-md hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
              Week {format(weekStart, "w")} — {format(weekStart, "d MMM", { locale: nl })} t/m {format(addDays(weekStart, 4), "d MMM yyyy", { locale: nl })}
            </h2>
            <button onClick={() => setWeekOffset(o => o + 1)} className="p-1.5 rounded-md hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
            {weekOffset !== 0 && (
              <button onClick={() => setWeekOffset(0)} className="text-[10px] font-mono text-primary hover:text-primary/80 px-2 py-0.5 rounded border border-primary/30 hover:border-primary/50 transition-colors">
                Vandaag
              </button>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="flex gap-4 md:gap-6 items-center flex-wrap">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{totalAgenda} items</span>
          </div>
          <div className="flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs text-primary font-medium">{recurringCount} terugkerend</span>
          </div>
          <button
            onClick={() => setFilterRecurring(!filterRecurring)}
            className={cn(
              "px-2.5 py-1 rounded-full text-[10px] font-medium border transition-colors",
              filterRecurring
                ? "bg-primary/15 text-primary border-primary/30"
                : "border-border text-muted-foreground/40 hover:border-muted-foreground/30"
            )}
          >
            <RefreshCw className="w-2.5 h-2.5 inline mr-1" />
            Alleen terugkerend
          </button>
        </div>

        {/* Agent filter */}
        <div className="flex items-center gap-1.5 mt-3 flex-wrap">
          <Filter className="w-3 h-3 text-muted-foreground/50" />
          <span className="text-[10px] font-mono text-muted-foreground/50 mr-1">Agent:</span>
          <button
            onClick={() => setFilterAgent(null)}
            className={cn(
              "px-2 py-0.5 rounded-full text-[10px] font-medium border transition-colors",
              !filterAgent ? "bg-blue-500/15 text-blue-400 border-blue-500/30" : "border-border text-muted-foreground/40 hover:border-muted-foreground/30"
            )}
          >
            Alle
          </button>
          {agentOptions.map(agent => (
            <button
              key={agent}
              onClick={() => setFilterAgent(filterAgent === agent ? null : agent)}
              className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-medium border transition-colors inline-flex items-center gap-1",
                filterAgent === agent ? "bg-blue-500/15 text-blue-400 border-blue-500/30" : "border-border text-muted-foreground/40 hover:border-muted-foreground/30"
              )}
            >
              <Bot className="w-2.5 h-2.5" />
              {agent}
            </button>
          ))}
        </div>
      </div>

      {/* Day columns */}
      <div className="flex-1 min-h-0 overflow-x-auto overflow-y-auto">
        <div className="flex min-w-[800px] h-full">
          {days.map(day => {
            const dayCards = cardsByDay[day.key] || [];
            const today = isToday(day.date);
            const hasRecurring = dayCards.some(c => c.recurring);

            return (
              <div
                key={day.key}
                className={cn(
                  "flex-1 min-w-[160px] flex flex-col border-r border-border last:border-r-0",
                  today && "bg-primary/[0.03]"
                )}
              >
                <div className={cn(
                  "flex-shrink-0 px-3 py-2.5 border-b border-border text-center",
                  today && "bg-primary/10"
                )}>
                  <div className={cn("text-xs font-bold uppercase tracking-wider", today ? "text-primary" : "text-muted-foreground")}>{day.name}</div>
                  <div className={cn("text-[11px]", today ? "text-primary/80 font-medium" : "text-muted-foreground/60")}>{day.label}</div>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <span className="text-[9px] font-mono text-muted-foreground/50">{dayCards.length} items</span>
                    {hasRecurring && <RefreshCw className="w-2.5 h-2.5 text-primary/50" />}
                  </div>
                </div>

                <div className="flex-1 p-2 space-y-1.5 overflow-y-auto">
                  {dayCards.map(card => (
                    <AgendaDayCard key={card.id} card={card} onClick={() => setSelectedCard(card)} />
                  ))}
                  {dayCards.length === 0 && (
                    <div className="flex items-center justify-center py-6 text-[10px] font-mono text-muted-foreground/30">
                      Geen items
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail panel */}
      {selectedCard && (
        <AgendaDetailPanel card={selectedCard} onClose={() => setSelectedCard(null)} />
      )}
    </div>
  );
};

export default MCAgenda;

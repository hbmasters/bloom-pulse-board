import { useState, useMemo } from "react";
import { Plus, X, GripVertical, ChevronLeft, ChevronRight, Clock, Target, Flame, Check, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, startOfWeek, addDays, addWeeks, subWeeks, isToday, isSameDay } from "date-fns";
import { nl } from "date-fns/locale";

interface PlanBlock {
  id: string;
  title: string;
  time?: string;
  duration: number; // in minutes
  category: BlockCategory;
  done: boolean;
}

type BlockCategory = "focus" | "meeting" | "admin" | "pauze" | "overig";

const categoryConfig: Record<BlockCategory, { label: string; color: string; bgClass: string; borderClass: string }> = {
  focus:   { label: "Focus",    color: "text-primary",            bgClass: "bg-primary/10",     borderClass: "border-primary/30" },
  meeting: { label: "Overleg",  color: "text-amber-400",          bgClass: "bg-amber-400/10",   borderClass: "border-amber-400/30" },
  admin:   { label: "Admin",    color: "text-blue-400",           bgClass: "bg-blue-400/10",    borderClass: "border-blue-400/30" },
  pauze:   { label: "Pauze",    color: "text-muted-foreground",   bgClass: "bg-muted/30",       borderClass: "border-border" },
  overig:  { label: "Overig",   color: "text-violet-400",         bgClass: "bg-violet-400/10",  borderClass: "border-violet-400/30" },
};

const dayNames = ["Ma", "Di", "Wo", "Do", "Vr"];

const generateId = () => Math.random().toString(36).slice(2, 9);

// Initial demo data
const createInitialBlocks = (weekStart: Date): Record<string, PlanBlock[]> => {
  const result: Record<string, PlanBlock[]> = {};
  for (let i = 0; i < 5; i++) {
    const key = format(addDays(weekStart, i), "yyyy-MM-dd");
    result[key] = [];
  }

  const mon = format(weekStart, "yyyy-MM-dd");
  const tue = format(addDays(weekStart, 1), "yyyy-MM-dd");
  const wed = format(addDays(weekStart, 2), "yyyy-MM-dd");

  result[mon] = [
    { id: generateId(), title: "Dagstart & planning", time: "07:00", duration: 30, category: "admin", done: false },
    { id: generateId(), title: "Productie monitoring", time: "07:30", duration: 120, category: "focus", done: false },
    { id: generateId(), title: "Pauze", time: "09:30", duration: 15, category: "pauze", done: false },
    { id: generateId(), title: "Lijnbezetting optimaliseren", time: "09:45", duration: 90, category: "focus", done: false },
  ];
  result[tue] = [
    { id: generateId(), title: "Team overleg", time: "08:00", duration: 60, category: "meeting", done: false },
    { id: generateId(), title: "KPI analyse", time: "09:00", duration: 120, category: "focus", done: false },
  ];
  result[wed] = [
    { id: generateId(), title: "Inkoop review", time: "07:30", duration: 60, category: "admin", done: false },
    { id: generateId(), title: "Kenya call", time: "10:00", duration: 45, category: "meeting", done: false },
  ];

  return result;
};

const MCWeekPlanner = () => {
  const [weekOffset, setWeekOffset] = useState(0);
  const weekStart = useMemo(() => {
    const base = startOfWeek(new Date(), { weekStartsOn: 1 });
    return weekOffset === 0 ? base : addWeeks(base, weekOffset);
  }, [weekOffset]);

  const [blocks, setBlocks] = useState<Record<string, PlanBlock[]>>(() => createInitialBlocks(startOfWeek(new Date(), { weekStartsOn: 1 })));

  // Add block form state
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newTime, setNewTime] = useState("08:00");
  const [newDuration, setNewDuration] = useState(60);
  const [newCategory, setNewCategory] = useState<BlockCategory>("focus");
  const [selectedCategories, setSelectedCategories] = useState<Set<BlockCategory>>(new Set());

  const toggleCategoryFilter = (cat: BlockCategory) => {
    setSelectedCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat); else next.add(cat);
      return next;
    });
  };

  const filterBlocks = (list: PlanBlock[]) =>
    selectedCategories.size === 0 ? list : list.filter(b => selectedCategories.has(b.category));

  const days = useMemo(() => 
    Array.from({ length: 5 }, (_, i) => {
      const date = addDays(weekStart, i);
      return { date, key: format(date, "yyyy-MM-dd"), name: dayNames[i], label: format(date, "d MMM", { locale: nl }) };
    }), [weekStart]);

  const addBlock = (dayKey: string) => {
    if (!newTitle.trim()) return;
    const block: PlanBlock = { id: generateId(), title: newTitle.trim(), time: newTime, duration: newDuration, category: newCategory, done: false };
    setBlocks(prev => ({ ...prev, [dayKey]: [...(prev[dayKey] || []), block] }));
    setNewTitle("");
    setNewTime("08:00");
    setNewDuration(60);
    setNewCategory("focus");
    setAddingTo(null);
  };

  const removeBlock = (dayKey: string, blockId: string) => {
    setBlocks(prev => ({ ...prev, [dayKey]: (prev[dayKey] || []).filter(b => b.id !== blockId) }));
  };

  const toggleDone = (dayKey: string, blockId: string) => {
    setBlocks(prev => ({
      ...prev,
      [dayKey]: (prev[dayKey] || []).map(b => b.id === blockId ? { ...b, done: !b.done } : b),
    }));
  };

  // Stats
  const weekStats = useMemo(() => {
    let totalMinutes = 0, focusMinutes = 0, doneCount = 0, totalCount = 0;
    days.forEach(d => {
      (blocks[d.key] || []).forEach(b => {
        totalMinutes += b.duration;
        if (b.category === "focus") focusMinutes += b.duration;
        totalCount++;
        if (b.done) doneCount++;
      });
    });
    return { totalMinutes, focusMinutes, doneCount, totalCount, focusPercent: totalMinutes ? Math.round((focusMinutes / totalMinutes) * 100) : 0 };
  }, [blocks, days]);

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

        {/* Week stats */}
        <div className="flex gap-4 md:gap-6">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{Math.round(weekStats.totalMinutes / 60)}u gepland</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs text-primary font-medium">{weekStats.focusPercent}% focus</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs text-muted-foreground">{weekStats.doneCount}/{weekStats.totalCount} afgerond</span>
          </div>
        </div>

        {/* Category filters */}
        <div className="flex items-center gap-1.5 mt-3">
          <Filter className="w-3 h-3 text-muted-foreground/50" />
          {(Object.entries(categoryConfig) as [BlockCategory, typeof categoryConfig["focus"]][]).map(([key, cfg]) => {
            const active = selectedCategories.has(key);
            return (
              <button
                key={key}
                onClick={() => toggleCategoryFilter(key)}
                className={cn(
                  "px-2.5 py-1 rounded-full text-[10px] font-medium border transition-colors",
                  active ? `${cfg.bgClass} ${cfg.borderClass} ${cfg.color}` : "border-border text-muted-foreground/40 hover:border-muted-foreground/30"
                )}
              >
                {cfg.label}
              </button>
            );
          })}
          {selectedCategories.size > 0 && (
            <button onClick={() => setSelectedCategories(new Set())} className="text-[9px] text-muted-foreground hover:text-foreground ml-1 transition-colors">
              Wis
            </button>
          )}
        </div>
      </div>

      {/* Day columns */}
      <div className="flex-1 min-h-0 overflow-x-auto overflow-y-auto">
        <div className="flex min-w-[800px] h-full">
          {days.map(day => {
            const dayBlocks = filterBlocks(blocks[day.key] || []);
            const allDayBlocks = blocks[day.key] || [];
            const today = isToday(day.date);
            const dayFocus = allDayBlocks.filter(b => b.category === "focus").reduce((s, b) => s + b.duration, 0);
            const dayTotal = allDayBlocks.reduce((s, b) => s + b.duration, 0);

            return (
              <div
                key={day.key}
                className={cn(
                  "flex-1 min-w-[160px] flex flex-col border-r border-border last:border-r-0",
                  today && "bg-primary/[0.03]"
                )}
              >
                {/* Day header */}
                <div className={cn(
                  "flex-shrink-0 px-3 py-2.5 border-b border-border text-center",
                  today && "bg-primary/10"
                )}>
                  <div className={cn("text-xs font-bold uppercase tracking-wider", today ? "text-primary" : "text-muted-foreground")}>{day.name}</div>
                  <div className={cn("text-[11px]", today ? "text-primary/80 font-medium" : "text-muted-foreground/60")}>{day.label}</div>
                  {dayTotal > 0 && (
                    <div className="mt-1 flex items-center justify-center gap-1">
                      <div className="h-1 rounded-full bg-muted w-12 overflow-hidden">
                        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${dayTotal ? (dayFocus / dayTotal) * 100 : 0}%` }} />
                      </div>
                      <span className="text-[9px] text-muted-foreground font-mono">{Math.round(dayTotal / 60)}u</span>
                    </div>
                  )}
                </div>

                {/* Blocks */}
                <div className="flex-1 p-2 space-y-1.5 overflow-y-auto">
                  {dayBlocks.map(block => {
                    const cfg = categoryConfig[block.category];
                    return (
                      <div
                        key={block.id}
                        className={cn(
                          "group relative rounded-lg border p-2.5 transition-all cursor-default",
                          cfg.bgClass, cfg.borderClass,
                          block.done && "opacity-50"
                        )}
                      >
                        <div className="flex items-start gap-1.5">
                          <button onClick={() => toggleDone(day.key, block.id)} className={cn(
                            "mt-0.5 w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors",
                            block.done ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/30 hover:border-primary/50"
                          )}>
                            {block.done && <Check className="w-2.5 h-2.5" />}
                          </button>
                          <div className="flex-1 min-w-0">
                            <p className={cn("text-xs font-medium leading-tight", block.done && "line-through", cfg.color)}>{block.title}</p>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className={cn("text-[9px] font-medium px-1.5 py-0.5 rounded-full border", cfg.bgClass, cfg.borderClass, cfg.color)}>{cfg.label}</span>
                              {block.time && <span className="text-[9px] font-mono text-muted-foreground">{block.time}</span>}
                              <span className="text-[9px] font-mono text-muted-foreground/50">{block.duration}m</span>
                            </div>
                          </div>
                          <button
                            onClick={() => removeBlock(day.key, block.id)}
                            className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-all"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {/* Add block */}
                  {addingTo === day.key ? (
                    <div className="rounded-lg border border-primary/30 bg-card p-2.5 space-y-2">
                      <input
                        autoFocus
                        value={newTitle}
                        onChange={e => setNewTitle(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && addBlock(day.key)}
                        placeholder="Wat ga je doen?"
                        className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground/50 outline-none"
                      />
                      <div className="flex items-center gap-1.5">
                        <input type="time" value={newTime} onChange={e => setNewTime(e.target.value)} className="bg-secondary/50 border border-border rounded px-1.5 py-0.5 text-[10px] text-foreground font-mono w-[72px]" />
                        <select value={newDuration} onChange={e => setNewDuration(Number(e.target.value))} className="bg-secondary/50 border border-border rounded px-1 py-0.5 text-[10px] text-foreground">
                          <option value={15}>15m</option>
                          <option value={30}>30m</option>
                          <option value={45}>45m</option>
                          <option value={60}>1u</option>
                          <option value={90}>1.5u</option>
                          <option value={120}>2u</option>
                          <option value={180}>3u</option>
                        </select>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {(Object.entries(categoryConfig) as [BlockCategory, typeof categoryConfig["focus"]][]).map(([key, cfg]) => (
                          <button
                            key={key}
                            onClick={() => setNewCategory(key)}
                            className={cn(
                              "px-2 py-0.5 rounded-full text-[9px] font-medium border transition-colors",
                              newCategory === key ? `${cfg.bgClass} ${cfg.borderClass} ${cfg.color}` : "border-border text-muted-foreground/50 hover:border-muted-foreground/30"
                            )}
                          >
                            {cfg.label}
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-1.5">
                        <button onClick={() => addBlock(day.key)} className="flex-1 text-[10px] font-bold text-primary-foreground bg-primary rounded py-1 hover:bg-primary/90 transition-colors">Toevoegen</button>
                        <button onClick={() => setAddingTo(null)} className="text-[10px] text-muted-foreground hover:text-foreground px-2 py-1 rounded border border-border hover:bg-secondary/50 transition-colors">Annuleer</button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAddingTo(day.key)}
                      className="w-full flex items-center justify-center gap-1 py-2 rounded-lg border border-dashed border-border text-muted-foreground/40 hover:border-primary/30 hover:text-primary/60 transition-colors text-[10px]"
                    >
                      <Plus className="w-3 h-3" />
                      Blok
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MCWeekPlanner;

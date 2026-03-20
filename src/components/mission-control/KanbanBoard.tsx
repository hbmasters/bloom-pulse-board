import { useState, useMemo, lazy, Suspense } from "react";
import {
  LayoutGrid, MoreHorizontal, ArrowUp, ArrowRight, ArrowDown,
  Flower2, Truck, ClipboardCheck, Users, Snowflake, PackageCheck,
  Filter, X, Search, Calendar, User, GripVertical,
  Code2, BarChart3, CheckCircle2, Clock, Loader2, AlertCircle, ChevronDown, ChevronUp, FileText,
  History, FlaskConical, ExternalLink, RefreshCw, Archive, Moon
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import PageAgentBadges from "./PageAgentBadges";
import AnalysisPresentation from "@/components/analysis-presentation/AnalysisPresentation";
import type { AnalysisPresentationData } from "@/components/analysis-presentation/types";

/* ── Types — re-export from shared ── */

import type {
  Priority, Category, Status, TaskType, AnalysisKind, AnalysisStatus,
  OvernightActivity, AnalysisRun, KanbanCard,
} from "./kanban-shared";
import { getKanbanCards } from "./kanban-data";

interface KanbanColumn {
  title: string;
  status: Status;
  accent: string;
  dotColor: string;
}

/* ── Config ── */

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

const analysisStatusConfig: Record<AnalysisStatus, { icon: typeof Clock; label: string; className: string }> = {
  pending:   { icon: Clock,        label: "Pending",   className: "text-muted-foreground" },
  running:   { icon: Loader2,      label: "Running",   className: "text-blue-400" },
  completed: { icon: CheckCircle2, label: "Completed", className: "text-accent" },
  blocked:   { icon: AlertCircle,  label: "Blocked",   className: "text-red-400" },
  stale:     { icon: Clock,        label: "Stale",     className: "text-yellow-500" },
};

const analysisKindLabels: Record<AnalysisKind, string> = {
  mapping: "Mapping",
  margin: "Marge",
  procurement: "Inkoop",
  production: "Productie",
  logistics: "Logistiek",
  quality: "Kwaliteit",
  general: "Algemeen",
};

const columns: KanbanColumn[] = [
  { title: "Te Doen",        status: "todo",        accent: "bg-bloom-warm/15 text-bloom-warm", dotColor: "bg-bloom-warm" },
  { title: "In Uitvoering",  status: "in_progress", accent: "bg-primary/15 text-primary",       dotColor: "bg-primary" },
  { title: "Review",         status: "review",      accent: "bg-purple-500/15 text-purple-400", dotColor: "bg-purple-400" },
  { title: "Klaar",          status: "done",        accent: "bg-accent/15 text-accent",         dotColor: "bg-accent" },
];

const initialCards: KanbanCard[] = getKanbanCards();

/* ── Sub-components ── */

const PriorityBadge = ({ priority }: { priority: Priority }) => {
  const cfg = priorityConfig[priority];
  const Icon = cfg.icon;
  return (
    <span className={`flex items-center gap-0.5 ${cfg.className}`} title={cfg.label}>
      <Icon className="w-3 h-3" />
    </span>
  );
};

const CategoryBadge = ({ category }: { category: Category }) => {
  const cfg = categoryConfig[category];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${cfg.className}`}>
      <Icon className="w-2.5 h-2.5" />
      {cfg.label}
    </span>
  );
};

const TaskTypeBadge = ({ taskType }: { taskType: TaskType }) => {
  const cfg = taskTypeConfig[taskType];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-[8px] font-mono font-black px-1.5 py-0.5 rounded border ${cfg.className}`}>
      <Icon className="w-2.5 h-2.5" />
      {cfg.label}
    </span>
  );
};

const AnalysisStatusIndicator = ({ status }: { status: AnalysisStatus }) => {
  const cfg = analysisStatusConfig[status];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-[8px] font-mono ${cfg.className}`}>
      <Icon className={`w-2.5 h-2.5 ${status === "running" ? "animate-spin" : ""}`} />
      {cfg.label}
    </span>
  );
};

const LabelBadge = ({ label }: { label: string }) => (
  <span className="text-[8px] font-mono px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
    {label}
  </span>
);

type FilterChipProps = {
  label: string;
  active: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  color?: string;
};

const FilterChip = ({ label, active, onClick, icon, color }: FilterChipProps) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center gap-1 text-[9px] font-mono font-bold px-2 py-1 rounded-full border transition-all ${
      active
        ? `${color || "bg-primary/15 text-primary border-primary/30"}`
        : "bg-card text-muted-foreground border-border hover:border-primary/20"
    }`}
  >
    {icon}
    {label}
    {active && <X className="w-2.5 h-2.5 ml-0.5" />}
  </button>
);

/* ── Detail Panel ── */

const buildPresentationData = (card: KanbanCard): AnalysisPresentationData => {
  const base: AnalysisPresentationData = {
    title: card.title,
    task_type: card.task_type,
    status: card.analysis_status,
    result_ready: card.result_ready_flag,
    updated_at: card.result_updated_at,
    summary: card.result_summary,
    methodiek: card.methodiek_name ? {
      methodiek_name: card.methodiek_name,
      methodiek_id: card.methodiek_id,
      methodiek_version: card.methodiek_version,
      analysis_kind: card.analysis_kind ? analysisKindLabels[card.analysis_kind] : undefined,
    } : undefined,
    detail_payload: card.result_payload,
    run_history: card.run_history?.map(r => ({
      run_id: r.run_id,
      methodiek_version: r.methodiek_version,
      analysis_status: r.analysis_status,
      result_summary: r.result_summary,
      data_scope: r.data_scope,
      created_at: r.created_at,
    })),
  };

  // Enrich completed analysis with structured data based on analysis_kind
  if (card.result_ready_flag && card.analysis_status === "completed") {
    if (card.analysis_kind === "quality") {
      base.kpis = [
        { label: "Goedgekeurd", value: "90%", trend: "up", delta: "+5%" },
        { label: "Afwijkingen", value: 2, trend: "down", delta: "-3" },
        { label: "Steekproef", value: 20, unit: "stuks" },
        { label: "Bloem kwaliteit", value: "100%", trend: "neutral" },
      ];
      base.table = {
        columns: [
          { key: "check", label: "Controle" },
          { key: "result", label: "Resultaat", align: "center" },
          { key: "score", label: "Score", align: "right" },
        ],
        rows: [
          { check: "Bloem kwaliteit", result: "✓ Goedgekeurd", score: "100%" },
          { check: "Verpakking integriteit", result: "✓ Goedgekeurd", score: "100%" },
          { check: "Etikettering", result: "✗ Afwijking", score: "90%" },
          { check: "Barcode positie", result: "✗ Afwijking", score: "90%" },
        ],
      };
    } else if (card.analysis_kind === "production") {
      base.kpis = [
        { label: "Target bereikt", value: "92.7%", trend: "down", delta: "-2.3%" },
        { label: "Lijn 1", value: "98%", trend: "up" },
        { label: "Lijn 2", value: "85%", trend: "down", delta: "-15%" },
        { label: "Lijn 3", value: "95%", trend: "neutral" },
      ];
      base.table = {
        columns: [
          { key: "lijn", label: "Lijn" },
          { key: "output", label: "Output", align: "right" },
          { key: "target", label: "Target", align: "right" },
          { key: "pct", label: "%", align: "right" },
        ],
        rows: [
          { lijn: "Lijn 1", output: "98", target: "100", pct: "98%" },
          { lijn: "Lijn 2", output: "85", target: "100", pct: "85%" },
          { lijn: "Lijn 3", output: "95", target: "100", pct: "95%" },
        ],
      };
      base.chart = {
        type: "bar",
        title: "Output vs Target per Lijn",
        data: [
          { label: "Lijn 1", value: 98, value2: 100 },
          { label: "Lijn 2", value: 85, value2: 100 },
          { label: "Lijn 3", value: 95, value2: 100 },
        ],
        valueLabel: "Output",
        value2Label: "Target",
        color: "hsl(var(--primary))",
        color2: "hsl(var(--border))",
      };
    } else if (card.analysis_kind === "mapping") {
      base.kpis = [
        { label: "Mapping chains", value: 1, trend: "neutral" },
        { label: "Orphan recipes", value: 3, trend: "down", delta: "+2" },
        { label: "Dekking", value: "94%", trend: "up" },
      ];
    }
  }

  return base;
};

const CardDetailPanel = ({ card, onClose }: { card: KanbanCard; onClose: () => void }) => {
  const isAnalysis = card.task_type === "analysis";

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]" onClick={onClose} />

      {/* Slide-in panel */}
      <div className="fixed top-0 right-0 z-50 h-full w-full max-w-2xl border-l border-border bg-card shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
        {/* Header */}
        <div className="shrink-0 p-5 border-b border-border">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <TaskTypeBadge taskType={card.task_type} />
                <CategoryBadge category={card.category} />
                <PriorityBadge priority={card.priority} />
                {card.labels.map(l => <LabelBadge key={l} label={l} />)}
              </div>
              {!isAnalysis && (
                <>
                  <h2 className="text-base font-bold text-foreground">{card.title}</h2>
                  {card.description && (
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{card.description}</p>
                  )}
                </>
              )}
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted/50 transition-colors shrink-0">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Meta row */}
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            {card.assignee && (
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-[9px] font-bold text-primary">{card.assignee[0]}</span>
                </div>
                <span className="text-[10px] text-muted-foreground font-mono">{card.assignee}</span>
              </div>
            )}
            {card.dueDate && (
              <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {card.dueDate}
              </span>
            )}
            <span className="text-[10px] font-mono text-muted-foreground/50">Aangemaakt: {card.createdAt}</span>
          </div>
        </div>

        {/* Content — scrollable */}
        <div className="flex-1 min-h-0 overflow-y-auto p-5">
          {/* Analysis result — full presentation standard */}
          {isAnalysis && (
            <AnalysisPresentation data={buildPresentationData(card)} />
          )}

          {/* Dev task */}
          {!isAnalysis && card.description && (
            <div className="space-y-4">
              <div>
                <h3 className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider mb-2">Beschrijving</h3>
                <p className="text-sm text-foreground leading-relaxed">{card.description}</p>
              </div>
            </div>
          )}

          {/* Empty state for analysis without results */}
          {isAnalysis && !card.result_summary && !card.result_payload && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BarChart3 className="w-8 h-8 text-muted-foreground/20 mb-3" />
              <p className="text-sm text-muted-foreground/50 font-mono">
                {card.analysis_status === "blocked"
                  ? "Analyse geblokkeerd"
                  : card.analysis_status === "running"
                  ? "Analyse wordt uitgevoerd..."
                  : card.analysis_status === "stale"
                  ? "Resultaat verouderd — heranalyse nodig"
                  : "Nog geen resultaten beschikbaar"}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

/* ── Overnight Activity Timeline Drawer ── */

const OvernightTimeline = ({ card, onClose }: { card: KanbanCard; onClose: () => void }) => (
  <>
    <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]" onClick={onClose} />
    <div className="fixed top-0 right-0 z-50 h-full w-full max-w-md border-l border-border bg-card shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
      <div className="shrink-0 p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-foreground">Overnight Activiteit</h3>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted/50 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-1 font-mono">{card.title}</p>
        {card.overnight_summary && (
          <p className="text-[11px] text-foreground/80 mt-2 leading-relaxed">{card.overnight_summary}</p>
        )}
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto p-4">
        {card.overnight_activity_log && card.overnight_activity_log.length > 0 ? (
          <div className="space-y-0">
            {card.overnight_activity_log.map((entry, i) => (
              <div key={i} className="flex gap-3 relative">
                {/* Timeline line */}
                {i < card.overnight_activity_log!.length - 1 && (
                  <div className="absolute left-[7px] top-5 bottom-0 w-px bg-border" />
                )}
                {/* Dot */}
                <div className="w-[15px] shrink-0 flex justify-center pt-1.5">
                  <div className="w-2 h-2 rounded-full bg-purple-400 ring-2 ring-purple-400/20" />
                </div>
                {/* Content */}
                <div className="pb-4 flex-1 min-w-0">
                  <span className="text-[10px] font-mono font-bold text-purple-400">{entry.timestamp}</span>
                  <p className="text-xs text-foreground/80 mt-0.5 leading-relaxed">{entry.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-12 text-xs font-mono text-muted-foreground/40">
            Geen overnight activiteit gelogd
          </div>
        )}
      </div>
    </div>
  </>
);

/* ── Draggable Card ── */

const DraggableKanbanCard = ({ card, onOpen, onShowTimeline }: { card: KanbanCard; onOpen: () => void; onShowTimeline: () => void }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isAnalysis = card.task_type === "analysis";

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onOpen}
      className={`p-3 rounded-xl bg-card border border-border hover:border-primary/20 transition-colors group shadow-sm cursor-pointer ${
        isDragging ? "shadow-lg ring-2 ring-primary/30 z-50" : ""
      } ${isAnalysis ? "border-l-2 border-l-amber-500/40" : "border-l-2 border-l-blue-500/40"}`}
    >
      {/* Row 1: drag handle + type badge + title + priority */}
      <div className="flex items-start justify-between gap-1">
        <div className="flex items-start gap-1.5 flex-1 min-w-0">
          <button
            {...attributes}
            {...listeners}
            onClick={e => e.stopPropagation()}
            className="touch-none text-muted-foreground/30 hover:text-muted-foreground shrink-0 mt-0.5 cursor-grab active:cursor-grabbing"
            aria-label="Drag handle"
          >
            <GripVertical className="w-3 h-3" />
          </button>
          <h4 className="text-xs font-semibold text-foreground leading-snug flex-1">{card.title}</h4>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <PriorityBadge priority={card.priority} />
          <MoreHorizontal className="w-3 h-3 text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {card.description && (
        <p className="text-[10px] text-muted-foreground/60 mt-1 line-clamp-2 leading-relaxed pl-4">
          {card.description}
        </p>
      )}

      {/* Overnight badge + summary */}
      {card.overnight_flag && (
        <div
          className="mt-1.5 ml-4 p-1.5 rounded-md bg-purple-500/8 border border-purple-500/15 cursor-pointer hover:bg-purple-500/12 transition-colors"
          onClick={e => { e.stopPropagation(); onShowTimeline(); }}
        >
          <div className="flex items-center gap-1.5">
            <Moon className="w-3 h-3 text-purple-400" />
            <span className="text-[8px] font-mono font-bold text-purple-400 uppercase tracking-wider">Overnight updates</span>
            {card.last_activity_at && (
              <span className="text-[7px] font-mono text-muted-foreground/50 ml-auto">{card.last_activity_at}</span>
            )}
          </div>
          {card.overnight_summary && (
            <p className="text-[9px] text-foreground/60 mt-0.5 line-clamp-1 leading-relaxed pl-[18px]">{card.overnight_summary}</p>
          )}
        </div>
      )}
      <div className="flex items-center gap-1.5 mt-2 flex-wrap pl-4">
        <TaskTypeBadge taskType={card.task_type} />
        <CategoryBadge category={card.category} />
        {card.labels.map(l => (
          <LabelBadge key={l} label={l} />
        ))}
      </div>

      {/* Row 3: Analysis — methodiek + status + result */}
      {isAnalysis && (
        <div className="mt-2 pl-4 space-y-1">
          {/* Methodiek label */}
          {card.methodiek_name && (
            <div className="text-[8px] font-mono font-bold text-amber-400/80 uppercase tracking-wider">
              Methodiek: {card.methodiek_name}
            </div>
          )}
          {/* Status row */}
          <div className="flex items-center gap-2 flex-wrap">
            {card.analysis_status && <AnalysisStatusIndicator status={card.analysis_status} />}
            {card.result_ready_flag && (
              <span className="inline-flex items-center gap-0.5 text-[8px] font-mono font-bold text-accent">
                <CheckCircle2 className="w-2.5 h-2.5" /> Result Ready
              </span>
            )}
            {card.analysis_status === "stale" && (
              <span className="text-[7px] font-mono text-yellow-500/60 flex items-center gap-0.5">
                <RefreshCw className="w-2 h-2" /> verouderd
              </span>
            )}
            {card.run_history && card.run_history.length > 0 && (
              <span className="inline-flex items-center gap-0.5 text-[7px] font-mono text-muted-foreground/40 ml-auto">
                <Archive className="w-2.5 h-2.5" /> {card.run_history.length}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Analysis result preview */}
      {isAnalysis && card.result_summary && (
        <div className="mt-1.5 ml-4 p-2 rounded-md bg-amber-500/5 border border-amber-500/10">
          <span className="text-[7px] font-mono font-bold text-muted-foreground/40 uppercase tracking-wider">Result:</span>
          <p className="text-[9px] text-foreground/70 line-clamp-2 leading-relaxed mt-0.5">{card.result_summary}</p>
          {card.result_updated_at && (
            <span className="text-[7px] font-mono text-muted-foreground/30 mt-1 block">{card.result_updated_at}</span>
          )}
        </div>
      )}

      {/* Row 4: assignee + due date + time */}
      <div className="flex items-center justify-between mt-2 pl-4">
        {card.assignee ? (
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-[8px] font-bold text-primary">{card.assignee[0]}</span>
            </div>
            <span className="text-[9px] text-muted-foreground font-mono">{card.assignee}</span>
          </div>
        ) : <div />}
        <div className="flex items-center gap-2">
          {(card.startTime || card.stopTime) && (
            <div className="flex items-center gap-1">
              <Clock className="w-2.5 h-2.5 text-accent/50" />
              <span className="text-[8px] font-mono text-accent/70">
                {card.startTime}{card.startTime && card.stopTime && "–"}{card.stopTime}
              </span>
            </div>
          )}
          {card.dueDate && (
            <div className="flex items-center gap-1">
              <Calendar className="w-2.5 h-2.5 text-muted-foreground/40" />
              <span className="text-[8px] font-mono text-muted-foreground/50">{card.dueDate}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── Main Board ── */

const KanbanBoard = () => {
  const [cards, setCards] = useState<KanbanCard[]>(initialCards);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Set<Category>>(new Set());
  const [selectedPriorities, setSelectedPriorities] = useState<Set<Priority>>(new Set());
  const [selectedAssignee, setSelectedAssignee] = useState<string | null>(null);
  const [selectedTaskType, setSelectedTaskType] = useState<TaskType | null>(null);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [timelineCardId, setTimelineCardId] = useState<string | null>(null);

  const allAssignees = useMemo(() => [...new Set(cards.filter(c => c.assignee).map(c => c.assignee!))].sort(), [cards]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  const toggleCategory = (c: Category) => {
    setSelectedCategories(prev => {
      const n = new Set(prev);
      n.has(c) ? n.delete(c) : n.add(c);
      return n;
    });
  };

  const togglePriority = (p: Priority) => {
    setSelectedPriorities(prev => {
      const n = new Set(prev);
      n.has(p) ? n.delete(p) : n.add(p);
      return n;
    });
  };

  const hasActiveFilters = selectedCategories.size > 0 || selectedPriorities.size > 0 || selectedAssignee || searchQuery || selectedTaskType;

  const clearFilters = () => {
    setSelectedCategories(new Set());
    setSelectedPriorities(new Set());
    setSelectedAssignee(null);
    setSearchQuery("");
    setSelectedTaskType(null);
  };

  const filteredCards = useMemo(() => {
    return cards.filter(card => {
      if (searchQuery && !card.title.toLowerCase().includes(searchQuery.toLowerCase()) && !card.description?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (selectedCategories.size > 0 && !selectedCategories.has(card.category)) return false;
      if (selectedPriorities.size > 0 && !selectedPriorities.has(card.priority)) return false;
      if (selectedAssignee && card.assignee !== selectedAssignee) return false;
      if (selectedTaskType && card.task_type !== selectedTaskType) return false;
      return true;
    });
  }, [cards, searchQuery, selectedCategories, selectedPriorities, selectedAssignee, selectedTaskType]);

  const activeFilterCount = selectedCategories.size + selectedPriorities.size + (selectedAssignee ? 1 : 0) + (searchQuery ? 1 : 0) + (selectedTaskType ? 1 : 0);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const targetColumn = columns.find(c => c.status === overId);
    const targetCard = cards.find(c => c.id === overId);

    let newStatus: Status | null = null;

    if (targetColumn) {
      newStatus = targetColumn.status;
    } else if (targetCard) {
      newStatus = targetCard.status;
    }

    if (newStatus && activeId !== overId) {
      setCards(prev =>
        prev.map(c => (c.id === activeId ? { ...c, status: newStatus! } : c))
      );
    }
  };

  const expandedCard = expandedCardId ? cards.find(c => c.id === expandedCardId) : null;

  // Counts for header
  const devCount = filteredCards.filter(c => c.task_type === "development").length;
  const analysisCount = filteredCards.filter(c => c.task_type === "analysis").length;

  return (
    <div className="flex flex-col h-full p-3 md:p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <LayoutGrid className="w-4 h-4 text-muted-foreground" />
        <h2 className="text-xs font-black text-foreground uppercase tracking-wider">Kanban Board</h2>
        <PageAgentBadges pageId="kanban" className="ml-2" />

        {/* Type counters */}
        <div className="hidden sm:flex items-center gap-1.5 ml-3">
          <span className="text-[9px] font-mono text-blue-400">{devCount} dev</span>
          <span className="text-[8px] text-muted-foreground/30">|</span>
          <span className="text-[9px] font-mono text-amber-400">{analysisCount} analysis</span>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <div className="hidden lg:flex items-center gap-3 mr-2">
            {Object.entries(priorityConfig).map(([key, cfg]) => {
              const Icon = cfg.icon;
              return (
                <span key={key} className={`flex items-center gap-1 text-[9px] font-mono ${cfg.className}`}>
                  <Icon className="w-2.5 h-2.5" />{cfg.label}
                </span>
              );
            })}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`relative flex items-center gap-1 text-[10px] font-mono font-bold px-2.5 py-1.5 rounded-lg border transition-all ${
              showFilters || hasActiveFilters
                ? "bg-primary/10 text-primary border-primary/30"
                : "bg-card text-muted-foreground border-border hover:border-primary/20"
            }`}
          >
            <Filter className="w-3 h-3" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="flex items-center justify-center w-4 h-4 rounded-full bg-primary text-primary-foreground text-[8px] font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="mb-3 p-3 rounded-xl bg-card/60 border border-border space-y-3 animate-fade-in">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Zoek op titel of beschrijving..."
              className="w-full pl-7 pr-3 py-1.5 text-[11px] font-mono bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/30"
            />
          </div>

          {/* Task type filter */}
          <div>
            <span className="text-[9px] font-mono text-muted-foreground/60 uppercase tracking-wider mb-1.5 block">Type</span>
            <div className="flex flex-wrap gap-1.5">
              {(Object.entries(taskTypeConfig) as [TaskType, typeof taskTypeConfig[TaskType]][]).map(([key, cfg]) => {
                const Icon = cfg.icon;
                return (
                  <FilterChip
                    key={key}
                    label={cfg.label}
                    active={selectedTaskType === key}
                    onClick={() => setSelectedTaskType(selectedTaskType === key ? null : key)}
                    icon={<Icon className="w-2.5 h-2.5" />}
                    color={selectedTaskType === key ? cfg.className : undefined}
                  />
                );
              })}
            </div>
          </div>

          <div>
            <span className="text-[9px] font-mono text-muted-foreground/60 uppercase tracking-wider mb-1.5 block">Categorie</span>
            <div className="flex flex-wrap gap-1.5">
              {(Object.entries(categoryConfig) as [Category, typeof categoryConfig[Category]][]).map(([key, cfg]) => {
                const Icon = cfg.icon;
                return (
                  <FilterChip
                    key={key}
                    label={cfg.label}
                    active={selectedCategories.has(key)}
                    onClick={() => toggleCategory(key)}
                    icon={<Icon className="w-2.5 h-2.5" />}
                    color={selectedCategories.has(key) ? cfg.className + " border-current/20" : undefined}
                  />
                );
              })}
            </div>
          </div>

          <div>
            <span className="text-[9px] font-mono text-muted-foreground/60 uppercase tracking-wider mb-1.5 block">Prioriteit</span>
            <div className="flex flex-wrap gap-1.5">
              {(Object.entries(priorityConfig) as [Priority, typeof priorityConfig[Priority]][]).map(([key, cfg]) => {
                const Icon = cfg.icon;
                return (
                  <FilterChip
                    key={key}
                    label={cfg.label}
                    active={selectedPriorities.has(key)}
                    onClick={() => togglePriority(key)}
                    icon={<Icon className="w-2.5 h-2.5" />}
                    color={selectedPriorities.has(key) ? cfg.className + " border-current/20 bg-current/10" : undefined}
                  />
                );
              })}
            </div>
          </div>

          <div>
            <span className="text-[9px] font-mono text-muted-foreground/60 uppercase tracking-wider mb-1.5 block">Toegewezen aan</span>
            <div className="flex flex-wrap gap-1.5">
              {allAssignees.map(name => (
                <FilterChip
                  key={name}
                  label={name}
                  active={selectedAssignee === name}
                  onClick={() => setSelectedAssignee(selectedAssignee === name ? null : name)}
                  icon={<User className="w-2.5 h-2.5" />}
                />
              ))}
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-[9px] font-mono text-primary hover:underline"
            >
              ✕ Alle filters wissen
            </button>
          )}
        </div>
      )}

      {/* Kanban columns with drag and drop */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div
          className="flex-1 min-h-0 flex md:grid gap-3 overflow-x-auto md:overflow-hidden snap-x snap-mandatory"
          style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
        >
          {columns.map(col => {
            const colCards = filteredCards.filter(c => c.status === col.status);
            const itemIds = colCards.map(c => c.id);
            return (
              <div key={col.status} id={col.status} className="flex flex-col min-h-0 min-w-[75vw] md:min-w-0 snap-center">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`w-2 h-2 rounded-full ${col.dotColor}`} />
                  <span className="text-xs font-bold text-muted-foreground">{col.title}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-auto ${col.accent}`}>
                    {colCards.length}
                  </span>
                </div>
                <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
                  <div className="flex-1 min-h-0 space-y-2 overflow-y-auto scrollbar-thin pr-1 min-h-[120px]">
                    {colCards.length === 0 && (
                      <div className="flex items-center justify-center py-8 text-[10px] font-mono text-muted-foreground/40">
                        Sleep taken hierheen
                      </div>
                    )}
                    {colCards.map(card => (
                      <DraggableKanbanCard key={card.id} card={card} onOpen={() => setExpandedCardId(card.id)} onShowTimeline={() => setTimelineCardId(card.id)} />
                    ))}
                  </div>
                </SortableContext>
              </div>
            );
          })}
        </div>
      </DndContext>

      {/* Detail panel overlay */}
      {expandedCard && (
        <CardDetailPanel card={expandedCard} onClose={() => setExpandedCardId(null)} />
      )}

      {/* Overnight timeline drawer */}
      {timelineCardId && (() => {
        const tlCard = cards.find(c => c.id === timelineCardId);
        return tlCard ? <OvernightTimeline card={tlCard} onClose={() => setTimelineCardId(null)} /> : null;
      })()}
    </div>
  );
};

export default KanbanBoard;

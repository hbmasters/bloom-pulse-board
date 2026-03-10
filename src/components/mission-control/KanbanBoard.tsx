import { useState, useMemo } from "react";
import {
  LayoutGrid, MoreHorizontal, ArrowUp, ArrowRight, ArrowDown,
  Flower2, Truck, ClipboardCheck, Users, Snowflake, PackageCheck,
  Filter, X, Search, Calendar, User, GripVertical
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

type Priority = "high" | "medium" | "low";
type Category = "productie" | "planning" | "logistiek" | "qc" | "personeel" | "koelcel";
type Status = "todo" | "in_progress" | "review" | "done";

interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  category: Category;
  priority: Priority;
  labels: string[];
  assignee?: string;
  status: Status;
  dueDate?: string;
  createdAt: string;
}

interface KanbanColumn {
  title: string;
  status: Status;
  accent: string;
  dotColor: string;
}

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

const columns: KanbanColumn[] = [
  { title: "Te Doen",        status: "todo",        accent: "bg-bloom-warm/15 text-bloom-warm", dotColor: "bg-bloom-warm" },
  { title: "In Uitvoering",  status: "in_progress", accent: "bg-primary/15 text-primary",       dotColor: "bg-primary" },
  { title: "Review",         status: "review",      accent: "bg-purple-500/15 text-purple-400", dotColor: "bg-purple-400" },
  { title: "Klaar",          status: "done",        accent: "bg-accent/15 text-accent",         dotColor: "bg-accent" },
];

const initialCards: KanbanCard[] = [
  { id: "1",  title: "BQ Trend voorbereiden",        description: "Alle materialen klaarzetten en receptuur controleren voor start productie.", category: "productie", priority: "high",   labels: ["urgent", "lijn-1"],     status: "todo",        assignee: undefined, dueDate: "28 feb", createdAt: "26 feb" },
  { id: "2",  title: "Bezetting middag plannen",      description: "Shift 2 bezetting afstemmen met beschikbare medewerkers.",                  category: "planning",  priority: "medium", labels: ["shift-2"],              status: "todo",        createdAt: "27 feb" },
  { id: "8",  title: "Nieuwe medewerker inwerken",    description: "Onboarding programma doorlopen met nieuwe medewerker op lijn 2.",           category: "personeel", priority: "low",    labels: ["onboarding"],           status: "todo",        assignee: "Maria",  createdAt: "25 feb" },
  { id: "11", title: "Verpakkingsmateriaal bestellen", description: "Voorraad dozen en sleeves aanvullen voor volgende week.",                  category: "logistiek", priority: "medium", labels: ["voorraad"],             status: "todo",        createdAt: "27 feb" },
  { id: "3",  title: "BQ Field L produceren",         description: "Lopende productie op lijn 2, target 180 stuks.",                            category: "productie", priority: "high",   labels: ["lijn-2", "actief"],     status: "in_progress", assignee: "Jan",    dueDate: "28 feb", createdAt: "28 feb" },
  { id: "4",  title: "BQ Elegance kwaliteitscheck",   description: "Steekproef van 20 boeketten controleren op kwaliteitsnormen.",              category: "qc",        priority: "medium", labels: ["steekproef"],           status: "in_progress", assignee: "Lisa",   createdAt: "28 feb" },
  { id: "5",  title: "Koelcel voorraad tellen",       description: "Inventarisatie koelcel 1 en 2 voor planning morgen.",                       category: "koelcel",   priority: "medium", labels: ["inventaris"],           status: "in_progress", createdAt: "28 feb" },
  { id: "12", title: "Temperatuur koelcel 3 checken", description: "Melding ontvangen van temperatuurafwijking, handmatige controle nodig.",    category: "koelcel",   priority: "high",   labels: ["urgent", "melding"],    status: "in_progress", assignee: "Pieter", createdAt: "28 feb" },
  { id: "9",  title: "BQ Lovely verpakkingcheck",     description: "Verpakking en etikettering controleren voor verzending.",                   category: "qc",        priority: "low",    labels: ["verpakking"],           status: "review",      createdAt: "27 feb" },
  { id: "10", title: "Transport schema bevestigen",   description: "Ochtendroute bevestigen met transporteur en laadtijden doorgeven.",         category: "logistiek", priority: "high",   labels: ["ochtend"],              status: "review",      assignee: "Pieter", dueDate: "28 feb", createdAt: "27 feb" },
  { id: "13", title: "Productie rapport ochtend",     description: "Samenvatting ochtendproductie verzenden naar management.",                  category: "planning",  priority: "medium", labels: ["rapport"],              status: "review",      assignee: "Lisa",   createdAt: "28 feb" },
  { id: "6",  title: "BQ de Luxe afgerond",           description: "Productie succesvol afgerond. 195/200 boeketten goedgekeurd.",              category: "productie", priority: "medium", labels: ["lijn-1", "✓"],          status: "done",        assignee: "Jan",    createdAt: "27 feb" },
  { id: "7",  title: "BQ Chique afgerond",            description: "Batch compleet, 100% goedgekeurd.",                                        category: "productie", priority: "low",    labels: ["lijn-3", "✓"],          status: "done",        createdAt: "26 feb" },
  { id: "14", title: "Weekplanning week 10",          description: "Planning voor volgende week afgerond en gecommuniceerd.",                   category: "planning",  priority: "medium", labels: ["planning", "✓"],        status: "done",        assignee: "Maria",  createdAt: "26 feb" },
];

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

/* ── Draggable Card ── */

const DraggableKanbanCard = ({ card }: { card: KanbanCard }) => {
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-3 rounded-xl bg-card border border-border hover:border-primary/20 transition-colors group shadow-sm ${
        isDragging ? "shadow-lg ring-2 ring-primary/30 z-50" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-1">
        <div className="flex items-start gap-1.5 flex-1 min-w-0">
          <button
            {...attributes}
            {...listeners}
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

      <div className="flex items-center gap-1.5 mt-2 flex-wrap pl-4">
        <CategoryBadge category={card.category} />
        {card.labels.map(l => (
          <LabelBadge key={l} label={l} />
        ))}
      </div>

      <div className="flex items-center justify-between mt-2 pl-4">
        {card.assignee ? (
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-[8px] font-bold text-primary">{card.assignee[0]}</span>
            </div>
            <span className="text-[9px] text-muted-foreground font-mono">{card.assignee}</span>
          </div>
        ) : <div />}
        {card.dueDate && (
          <div className="flex items-center gap-1">
            <Calendar className="w-2.5 h-2.5 text-muted-foreground/40" />
            <span className="text-[8px] font-mono text-muted-foreground/50">{card.dueDate}</span>
          </div>
        )}
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

  const hasActiveFilters = selectedCategories.size > 0 || selectedPriorities.size > 0 || selectedAssignee || searchQuery;

  const clearFilters = () => {
    setSelectedCategories(new Set());
    setSelectedPriorities(new Set());
    setSelectedAssignee(null);
    setSearchQuery("");
  };

  const filteredCards = useMemo(() => {
    return cards.filter(card => {
      if (searchQuery && !card.title.toLowerCase().includes(searchQuery.toLowerCase()) && !card.description?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (selectedCategories.size > 0 && !selectedCategories.has(card.category)) return false;
      if (selectedPriorities.size > 0 && !selectedPriorities.has(card.priority)) return false;
      if (selectedAssignee && card.assignee !== selectedAssignee) return false;
      return true;
    });
  }, [cards, searchQuery, selectedCategories, selectedPriorities, selectedAssignee]);

  const activeFilterCount = selectedCategories.size + selectedPriorities.size + (selectedAssignee ? 1 : 0) + (searchQuery ? 1 : 0);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Check if dropped on a column
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

  return (
    <div className="flex flex-col h-full p-3 md:p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <LayoutGrid className="w-4 h-4 text-muted-foreground" />
        <h2 className="text-xs font-black text-foreground uppercase tracking-wider">Kanban Board</h2>
        <PageAgentBadges pageId="kanban" className="ml-2" />
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
                      <DraggableKanbanCard key={card.id} card={card} />
                    ))}
                  </div>
                </SortableContext>
              </div>
            );
          })}
        </div>
      </DndContext>
    </div>
  );
};

export default KanbanBoard;

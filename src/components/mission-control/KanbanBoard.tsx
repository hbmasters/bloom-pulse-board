import { LayoutGrid, MoreHorizontal, Flag, ArrowUp, ArrowRight, ArrowDown, Flower2, Truck, ClipboardCheck, Users, Snowflake, PackageCheck } from "lucide-react";

type Priority = "high" | "medium" | "low";
type Category = "productie" | "planning" | "logistiek" | "qc" | "personeel" | "koelcel";
type Status = "todo" | "in_progress" | "review" | "done";

interface KanbanCard {
  id: string;
  title: string;
  category: Category;
  priority: Priority;
  labels: string[];
  assignee?: string;
  status: Status;
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

const cards: KanbanCard[] = [
  { id: "1", title: "BQ Trend voorbereiden",       category: "productie", priority: "high",   labels: ["urgent", "lijn-1"],     status: "todo" },
  { id: "2", title: "Bezetting middag plannen",     category: "planning",  priority: "medium", labels: ["shift-2"],              status: "todo" },
  { id: "8", title: "Nieuwe medewerker inwerken",   category: "personeel", priority: "low",    labels: ["onboarding"],           status: "todo" },
  { id: "3", title: "BQ Field L produceren",        category: "productie", priority: "high",   labels: ["lijn-2", "actief"],     status: "in_progress", assignee: "Jan" },
  { id: "4", title: "BQ Elegance kwaliteitscheck",  category: "qc",        priority: "medium", labels: ["steekproef"],           status: "in_progress", assignee: "Lisa" },
  { id: "5", title: "Koelcel voorraad tellen",      category: "koelcel",   priority: "medium", labels: ["inventaris"],           status: "in_progress" },
  { id: "9", title: "BQ Lovely verpakkingcheck",    category: "qc",        priority: "low",    labels: ["verpakking"],           status: "review" },
  { id: "10",title: "Transport schema bevestigen",  category: "logistiek", priority: "high",   labels: ["ochtend"],              status: "review", assignee: "Pieter" },
  { id: "6", title: "BQ de Luxe afgerond",          category: "productie", priority: "medium", labels: ["lijn-1", "✓"],          status: "done", assignee: "Jan" },
  { id: "7", title: "BQ Chique afgerond",           category: "productie", priority: "low",    labels: ["lijn-3", "✓"],          status: "done" },
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

const KanbanBoard = () => {
  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex items-center gap-2 mb-4">
        <LayoutGrid className="w-4 h-4 text-muted-foreground" />
        <h2 className="text-xs font-black text-foreground uppercase tracking-wider">Kanban Board</h2>
        <div className="flex items-center gap-3 ml-auto">
          {Object.entries(priorityConfig).map(([key, cfg]) => {
            const Icon = cfg.icon;
            return (
              <span key={key} className={`flex items-center gap-1 text-[9px] font-mono ${cfg.className}`}>
                <Icon className="w-2.5 h-2.5" />{cfg.label}
              </span>
            );
          })}
        </div>
      </div>

      <div className={`flex-1 min-h-0 grid gap-3 overflow-hidden`} style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}>
        {columns.map(col => {
          const colCards = cards.filter(c => c.status === col.status);
          return (
            <div key={col.status} className="flex flex-col min-h-0">
              <div className="flex items-center gap-2 mb-3">
                <span className={`w-2 h-2 rounded-full ${col.dotColor}`} />
                <span className="text-xs font-bold text-muted-foreground">{col.title}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-auto ${col.accent}`}>
                  {colCards.length}
                </span>
              </div>
              <div className="flex-1 min-h-0 space-y-2 overflow-y-auto scrollbar-thin pr-1">
                {colCards.map(card => (
                  <div key={card.id} className="p-3 rounded-xl bg-card border border-border hover:border-primary/20 transition-colors group shadow-sm">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs font-semibold text-foreground leading-snug flex-1">{card.title}</h4>
                      <div className="flex items-center gap-1 shrink-0">
                        <PriorityBadge priority={card.priority} />
                        <MoreHorizontal className="w-3 h-3 text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      <CategoryBadge category={card.category} />
                      {card.labels.map(l => (
                        <LabelBadge key={l} label={l} />
                      ))}
                    </div>
                    {card.assignee && (
                      <div className="mt-2 flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-[8px] font-bold text-primary">{card.assignee[0]}</span>
                        </div>
                        <span className="text-[9px] text-muted-foreground font-mono">{card.assignee}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KanbanBoard;

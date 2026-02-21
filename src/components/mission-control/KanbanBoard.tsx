import { LayoutGrid, MoreHorizontal } from "lucide-react";

interface KanbanCard {
  id: string;
  title: string;
  tag: string;
  tagColor: string;
}

interface KanbanColumn {
  title: string;
  cards: KanbanCard[];
  accent: string;
}

const columns: KanbanColumn[] = [
  {
    title: "Te Doen",
    accent: "bg-bloom-warm/15 text-bloom-warm",
    cards: [
      { id: "1", title: "BQ Trend voorbereiden", tag: "Productie", tagColor: "bg-primary/10 text-primary" },
      { id: "2", title: "Bezetting middag plannen", tag: "Planning", tagColor: "bg-bloom-sky/10 text-bloom-sky" },
    ],
  },
  {
    title: "In Uitvoering",
    accent: "bg-primary/15 text-primary",
    cards: [
      { id: "3", title: "BQ Field L produceren", tag: "Actief", tagColor: "bg-accent/10 text-accent" },
      { id: "4", title: "BQ Elegance kwaliteitscheck", tag: "QC", tagColor: "bg-bloom-warm/10 text-bloom-warm" },
      { id: "5", title: "Koelcel voorraad tellen", tag: "Logistiek", tagColor: "bg-bloom-sky/10 text-bloom-sky" },
    ],
  },
  {
    title: "Klaar",
    accent: "bg-accent/15 text-accent",
    cards: [
      { id: "6", title: "BQ de Luxe afgerond", tag: "✓ Done", tagColor: "bg-accent/10 text-accent" },
      { id: "7", title: "BQ Chique afgerond", tag: "✓ Done", tagColor: "bg-accent/10 text-accent" },
    ],
  },
];

const KanbanBoard = () => {
  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex items-center gap-2 mb-4">
        <LayoutGrid className="w-4 h-4 text-muted-foreground" />
        <h2 className="text-xs font-black text-foreground uppercase tracking-wider">Kanban Board</h2>
        <span className="text-[10px] font-mono text-muted-foreground ml-auto">read-only</span>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-3 gap-3 overflow-hidden">
        {columns.map(col => (
          <div key={col.title} className="flex flex-col min-h-0">
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${col.accent}`}>
                {col.cards.length}
              </span>
              <span className="text-xs font-bold text-muted-foreground">{col.title}</span>
            </div>
            <div className="flex-1 min-h-0 space-y-2 overflow-y-auto">
              {col.cards.map(card => (
                <div key={card.id} className="p-3 rounded-xl bg-card border border-border hover:border-primary/20 transition-colors group shadow-sm">
                  <div className="flex items-start justify-between">
                    <h4 className="text-xs font-semibold text-foreground leading-snug">{card.title}</h4>
                    <MoreHorizontal className="w-3 h-3 text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </div>
                  <span className={`inline-block text-[9px] font-mono font-bold px-1.5 py-0.5 rounded mt-2 ${card.tagColor}`}>
                    {card.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;

import { CheckCircle2 } from "lucide-react";

interface CompletedProduct {
  id: number;
  product: string;
  type: string;
  quantity: number;
  completedAt: string;
  line: string;
}

const completed: CompletedProduct[] = [
  { id: 1, product: "Lenteweelde Boeket", type: "Boeket", quantity: 350, completedAt: "08:45", line: "Lijn 2" },
  { id: 2, product: "Premium Roos Arrangement", type: "Arrangement", quantity: 200, completedAt: "09:30", line: "Lijn 1" },
  { id: 3, product: "Pastel Mono Plus", type: "Mono Plus", quantity: 500, completedAt: "10:15", line: "Lijn 3" },
  { id: 4, product: "Zonnebloem Mix", type: "Boeket", quantity: 275, completedAt: "11:00", line: "Lijn 4" },
  { id: 5, product: "Orchidee Deluxe", type: "Arrangement", quantity: 150, completedAt: "12:20", line: "Lijn 1" },
];

const CompletedProduction = () => {
  return (
    <section>
      <h2 className="text-lg font-semibold text-foreground mb-4">Vandaag afgerond</h2>
      <div className="bg-gradient-card rounded-xl border border-border overflow-hidden">
        <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-x-6 px-5 py-3 text-xs font-medium text-muted-foreground border-b border-border">
          <span></span>
          <span>Product</span>
          <span>Lijn</span>
          <span className="text-right">Aantal</span>
          <span className="text-right">Tijd</span>
        </div>
        {completed.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-x-6 items-center px-5 py-3.5 border-b border-border/50 last:border-b-0 hover:bg-secondary/30 transition-colors"
          >
            <CheckCircle2 className="w-4 h-4 text-accent" />
            <div>
              <span className="text-sm font-medium text-foreground">{item.product}</span>
              <span className="ml-2 text-xs text-muted-foreground">{item.type}</span>
            </div>
            <span className="text-xs text-muted-foreground">{item.line}</span>
            <span className="text-sm font-mono font-semibold text-foreground text-right">
              {item.quantity.toLocaleString("nl-NL")}
            </span>
            <span className="text-xs font-mono text-muted-foreground text-right">{item.completedAt}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CompletedProduction;

import { completedProducts } from "@/data/mockData";

const getBadge = (planned: number, actual: number) => {
  const ratio = actual / planned;
  if (ratio < 0.85) return { label: "🏆 Excellent", className: "bg-accent/10 text-accent border-accent/20" };
  if (ratio < 0.95) return { label: "⚡ Sneller", className: "bg-accent/10 text-accent border-accent/20" };
  return { label: "👍 Op target", className: "bg-primary/10 text-primary border-primary/20" };
};

const CompletedProduction = () => {
  return (
    <div className="flex flex-col h-full">
      <h3 className="text-[10px] font-bold text-foreground uppercase tracking-wider mb-1.5 shrink-0">
        Afgerond Vandaag
      </h3>
      <div className="flex-1 min-h-0 space-y-1 overflow-hidden">
        {completedProducts.map((item) => {
          const badge = getBadge(item.plannedMinutes, item.actualMinutes);
          return (
            <div
              key={item.id}
              className="flex items-center gap-2 px-2.5 py-2 rounded-lg border border-border bg-card"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-foreground truncate">{item.name}</span>
                  <span className={`text-[8px] font-semibold px-1.5 py-0.5 rounded-full border shrink-0 ${badge.className}`}>
                    {badge.label}
                  </span>
                </div>
                <div className="text-[9px] text-muted-foreground mt-0.5">
                  {item.completedAt} · {item.actualMinutes}min (plan: {item.plannedMinutes}min)
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-base font-mono font-black text-foreground leading-none">{item.quantity}</div>
                <div className="text-[8px] text-muted-foreground">stuks</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CompletedProduction;

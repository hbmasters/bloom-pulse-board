import { Truck, Package, Flower2, ArrowDownRight } from "lucide-react";

interface StatItem {
  label: string;
  value: string;
  sub?: string;
  icon: typeof Truck;
}

const stats: StatItem[] = [
  { label: "Aankomende Partijen", value: "12", sub: "3 uit Kenya, 9 NL", icon: Truck },
  { label: "Vertrek Vandaag", value: "94%", sub: "32 van 34 partijen", icon: Package },
  { label: "Stelen Inkoop", value: "148.200", sub: "+8% vs gisteren", icon: Flower2 },
  { label: "Stelen Verkoop", value: "142.800", sub: "96.4% benut", icon: ArrowDownRight },
];

const InkoopStatsToday = () => (
  <div className="rounded-xl border-2 border-bloom-warm/20 bg-gradient-to-br from-bloom-warm/5 to-transparent p-5">
    <h3 className="text-sm font-bold text-foreground mb-1 flex items-center gap-2">
      <span className="w-2 h-2 rounded-full bg-bloom-warm animate-pulse" />
      Stats Vandaag
    </h3>
    <p className="text-[10px] text-muted-foreground mb-4">Live overzicht inkomend & uitgaand</p>

    <div className="grid grid-cols-2 gap-3">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div key={s.label} className="rounded-lg border border-border bg-card p-3.5 hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-bloom-warm/10 flex items-center justify-center">
                <Icon className="w-3.5 h-3.5 text-bloom-warm" />
              </div>
              <span className="text-[10px] font-medium text-muted-foreground leading-tight">{s.label}</span>
            </div>
            <div className="text-xl font-bold text-foreground leading-none">{s.value}</div>
            {s.sub && <div className="text-[10px] text-muted-foreground mt-1">{s.sub}</div>}
          </div>
        );
      })}
    </div>
  </div>
);

export default InkoopStatsToday;

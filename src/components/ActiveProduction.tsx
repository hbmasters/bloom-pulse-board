import { Clock, Users, Zap, Rocket, ThumbsUp, Package } from "lucide-react";
import { activeProducts, type ActiveProduct } from "@/data/mockData";

const statusConfig = {
  "on-schedule": { label: "On schedule", icon: <ThumbsUp className="w-3.5 h-3.5" />, className: "bg-primary/15 text-primary border-primary/25" },
  "faster": { label: "Faster", icon: <Zap className="w-3.5 h-3.5" />, className: "bg-accent/15 text-accent border-accent/25" },
  "high-pace": { label: "High pace", icon: <Rocket className="w-3.5 h-3.5" />, className: "bg-bloom-warm/15 text-bloom-warm border-bloom-warm/25" },
};

const formatDuration = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h${m}m` : `${m}m`;
};

const ActiveProductCard = ({ product }: { product: ActiveProduct }) => {
  const pct = Math.round((product.produced / product.target) * 100);
  const status = statusConfig[product.status];
  const speedDiff = Math.round(((product.piecesPerHour - product.plannedPiecesPerHour) / product.plannedPiecesPerHour) * 100);

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden flex flex-col h-full shadow-sm">
      <div className="relative flex-1 min-h-0 overflow-hidden bg-secondary">
        {product.image ? (
          <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-secondary gap-1">
            <span className="text-lg font-black text-foreground/60">{product.customer || product.name}</span>
            <span className="text-[10px] text-muted-foreground">{product.customer ? product.name : ""}</span>
          </div>
        )}
        <div className="absolute top-2 left-2">
          <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md border ${status.className}`}>
            {status.icon}{status.label}
          </span>
        </div>
        <div className="absolute bottom-2 right-2 bg-card/95 backdrop-blur-sm rounded-lg px-2.5 py-1.5 border border-border shadow-md">
          <div className="text-[7px] text-muted-foreground uppercase tracking-wider font-bold">Klaar om</div>
          <div className="text-xl font-mono font-black text-foreground leading-none">{product.expectedEndTime}</div>
        </div>
      </div>
      <div className="p-2.5">
        <h3 className="text-sm font-bold text-foreground truncate mb-1">{product.name}</h3>
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground mb-1.5">
          <span className="flex items-center gap-1 font-semibold text-foreground/80"><Users className="w-3 h-3 text-primary" />{product.people} people</span>
          <span className="flex items-center gap-1 font-semibold text-accent"><Zap className="w-3 h-3" />{product.piecesPerHour} APU{speedDiff > 0 && <span className="text-[8px] font-bold ml-0.5">+{speedDiff}%</span>}</span>
        </div>
        <div className="flex justify-between text-[9px] mb-0.5">
          <span className="font-mono font-bold text-foreground">{product.produced} <span className="text-muted-foreground font-normal">/ {product.target}</span></span>
          <span className="font-mono font-bold text-foreground">{pct}%</span>
        </div>
        <div className="h-2 rounded-full bg-secondary overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${
              product.status === "faster" || product.status === "high-pace" ? "bg-gradient-success" : "bg-primary"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
};

const ActiveProduction = () => {
  return (
    <section className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-2 shrink-0">
        <div className="w-2 h-2 rounded-full bg-accent animate-pulse-slow" />
        <h2 className="text-xs font-bold text-foreground uppercase tracking-wider">In Production</h2>
      </div>
      <div className="grid grid-cols-4 gap-3 flex-1 min-h-0 auto-rows-fr">
        {activeProducts.map((product) => (
          <ActiveProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ActiveProduction;

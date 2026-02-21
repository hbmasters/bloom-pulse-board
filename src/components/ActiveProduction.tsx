import { Clock, Users, Zap, Rocket, ThumbsUp } from "lucide-react";
import { activeProducts, type ActiveProduct } from "@/data/mockData";

const statusConfig = {
  "op-schema": { label: "Op schema", icon: <ThumbsUp className="w-3.5 h-3.5" />, className: "bg-primary/15 text-primary border-primary/25" },
  "sneller": { label: "Sneller", icon: <Zap className="w-3.5 h-3.5" />, className: "bg-accent/15 text-accent border-accent/25" },
  "hoog-tempo": { label: "Hoog tempo", icon: <Rocket className="w-3.5 h-3.5" />, className: "bg-bloom-warm/15 text-bloom-warm border-bloom-warm/25" },
};

const formatDuration = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}u${m}m` : `${m}m`;
};

const ActiveProductCard = ({ product }: { product: ActiveProduct }) => {
  const pct = Math.round((product.produced / product.target) * 100);
  const status = statusConfig[product.status];
  const speedDiff = Math.round(((product.piecesPerHour - product.plannedPiecesPerHour) / product.plannedPiecesPerHour) * 100);

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden flex flex-col h-full shadow-sm">
      {/* Square 1:1 product image */}
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {/* Status badge */}
        <div className="absolute top-2 left-2">
          <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md border ${status.className}`}>
            {status.icon}
            {status.label}
          </span>
        </div>
        {/* PCS/H overlay */}
        <div className="absolute bottom-2 right-2 bg-card/95 backdrop-blur-sm rounded-lg px-2.5 py-1.5 border border-accent/30 shadow-md">
          <div className="text-[7px] text-accent uppercase tracking-wider font-bold">PCS/U</div>
          <div className="text-xl font-mono font-black text-accent text-glow-success leading-none">{product.piecesPerHour}</div>
          {speedDiff > 0 && (
            <div className="text-[8px] font-bold text-accent">+{speedDiff}%</div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 p-2.5 flex flex-col justify-between min-h-0">
        <div>
          <h3 className="text-sm font-bold text-foreground truncate mb-1">{product.name}</h3>
          <div className="flex items-center gap-2 text-[9px] text-muted-foreground mb-1.5 flex-wrap">
            <span className="flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />{product.startTime}–{product.expectedEndTime}</span>
            <span className="flex items-center gap-0.5"><Users className="w-2.5 h-2.5" />{product.people}</span>
            <span>{formatDuration(product.minutesActive)}</span>
          </div>
        </div>

        {/* Progress */}
        <div>
          <div className="flex justify-between text-[9px] mb-0.5">
            <span className="font-mono font-bold text-foreground">{product.produced} <span className="text-muted-foreground font-normal">/ {product.target}</span></span>
            <span className="font-mono font-bold text-foreground">{pct}%</span>
          </div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-out ${
                product.status === "sneller" || product.status === "hoog-tempo" ? "bg-gradient-success" : "bg-primary"
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="text-[8px] text-muted-foreground mt-0.5">
            Plan: {product.plannedPiecesPerHour} PCS/U
          </div>
        </div>
      </div>
    </div>
  );
};

const ActiveProduction = () => {
  const cols = activeProducts.length <= 2 ? "grid-cols-2" : activeProducts.length <= 4 ? "grid-cols-4" : "grid-cols-4";

  return (
    <section className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-2 shrink-0">
        <div className="w-2 h-2 rounded-full bg-accent animate-pulse-slow" />
        <h2 className="text-xs font-bold text-foreground uppercase tracking-wider">In Productie</h2>
      </div>
      <div className={`grid ${cols} gap-2.5 flex-1 min-h-0`}>
        {activeProducts.map((product) => (
          <ActiveProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ActiveProduction;

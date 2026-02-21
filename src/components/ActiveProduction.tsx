import { Clock, Users, Zap, Rocket, ThumbsUp } from "lucide-react";
import { activeProducts, type ActiveProduct } from "@/data/mockData";

const statusConfig = {
  "op-schema": { label: "Op schema", icon: <ThumbsUp className="w-3.5 h-3.5" />, className: "bg-primary/10 text-primary border-primary/20" },
  "sneller": { label: "Sneller dan gepland", icon: <Zap className="w-3.5 h-3.5" />, className: "bg-accent/10 text-accent border-accent/20" },
  "hoog-tempo": { label: "Hoog tempo", icon: <Rocket className="w-3.5 h-3.5" />, className: "bg-bloom-warm/10 text-bloom-warm border-bloom-warm/20" },
};

const formatDuration = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}u${m}m` : `${m}m`;
};

const ActiveProductCard = ({ product }: { product: ActiveProduct }) => {
  const pct = Math.round((product.produced / product.target) * 100);
  const status = statusConfig[product.status];

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
      {/* Large product image */}
      <div className="relative flex-[5] min-h-0 overflow-hidden bg-secondary">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {/* Status badge */}
        <div className="absolute top-2.5 left-2.5">
          <span className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md border ${status.className}`}>
            {status.icon}
            {status.label}
          </span>
        </div>
        {/* Speed overlay */}
        <div className="absolute bottom-2.5 right-2.5 bg-card/95 backdrop-blur-sm rounded-lg px-3 py-2 border border-accent/30 shadow-md">
          <div className="text-[8px] text-accent uppercase tracking-wider font-bold">stuks/u</div>
          <div className="text-2xl font-mono font-black text-accent text-glow-success leading-none">{product.piecesPerHour}</div>
        </div>
      </div>

      {/* Info */}
      <div className="flex-[3] p-3.5 flex flex-col justify-between min-h-0">
        <div>
          <h3 className="text-base font-bold text-foreground truncate mb-1.5">{product.name}</h3>
          {/* Meta row */}
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground mb-2">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{product.startTime}–{product.expectedEndTime}</span>
            <span className="flex items-center gap-1"><Users className="w-3 h-3" />{product.people} pers.</span>
            <span>{formatDuration(product.minutesActive)} bezig</span>
          </div>
        </div>

        {/* Progress */}
        <div>
          <div className="flex justify-between text-[10px] mb-1">
            <span className="font-mono font-bold text-foreground">{product.produced.toLocaleString("nl-NL")} <span className="text-muted-foreground font-normal">/ {product.target}</span></span>
            <span className="font-mono font-bold text-foreground">{pct}%</span>
          </div>
          <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-out ${
                product.status === "sneller" || product.status === "hoog-tempo" ? "bg-gradient-success" : "bg-primary"
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ActiveProduction = () => {
  return (
    <section className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-2.5 shrink-0">
        <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse-slow" />
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">In Productie</h2>
      </div>
      <div className="grid grid-cols-3 gap-3 flex-1 min-h-0">
        {activeProducts.map((product) => (
          <ActiveProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ActiveProduction;

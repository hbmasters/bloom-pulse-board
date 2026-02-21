import { Play, Clock, Users, AlertCircle } from "lucide-react";
import { activeProducts, type ActiveProduct } from "@/data/mockData";

const statusConfig = {
  "op-schema": { label: "Op schema", className: "bg-bloom-sky/15 text-bloom-sky" },
  "sneller": { label: "⚡ Sneller dan gepland", className: "bg-accent/15 text-accent" },
  "onder-check": { label: "Onder check", className: "bg-bloom-warm/15 text-bloom-warm" },
};

const formatDuration = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}u ${m}m` : `${m}m`;
};

const ActiveProductCard = ({ product }: { product: ActiveProduct }) => {
  const pct = Math.round((product.produced / product.target) * 100);
  const status = statusConfig[product.status];

  return (
    <div className="bg-gradient-card rounded-2xl border border-border overflow-hidden hover:glow-primary transition-all duration-500 group">
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-secondary">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-md ${status.className}`}>
            {status.label}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-md bg-card/80 text-foreground border border-border/50">
            {product.line}
          </span>
        </div>
        {product.status === "sneller" && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-success" />
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-foreground truncate">{product.name}</h3>
          <div className="flex items-center gap-1 text-accent text-xs font-medium shrink-0 ml-2">
            <Play className="w-3.5 h-3.5 fill-current" />
            Actief
          </div>
        </div>

        {/* Under check info */}
        {product.status === "onder-check" && product.checkStartTime && (
          <div className="mb-3 p-3 rounded-lg bg-bloom-warm/5 border border-bloom-warm/20">
            <div className="flex items-center gap-1.5 text-bloom-warm text-xs font-semibold mb-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              Check actief
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">Gestart</span>
                <div className="font-mono font-semibold text-foreground">{product.checkStartTime}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Personen</span>
                <div className="font-mono font-semibold text-foreground">{product.checkPeople}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Klaar om</span>
                <div className="font-mono font-semibold text-foreground">{product.checkEndTime}</div>
              </div>
            </div>
          </div>
        )}

        {/* Meta info */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
            <div>
              <div className="text-[10px] text-muted-foreground">Start</div>
              <div className="text-xs font-mono font-semibold text-foreground">{product.startTime}</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
            <div>
              <div className="text-[10px] text-muted-foreground">Einde</div>
              <div className="text-xs font-mono font-semibold text-foreground">{product.expectedEndTime}</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-muted-foreground" />
            <div>
              <div className="text-[10px] text-muted-foreground">Personen</div>
              <div className="text-xs font-mono font-semibold text-foreground">{product.people}</div>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-muted-foreground">Voortgang — {formatDuration(product.minutesActive)} bezig</span>
            <span className="font-mono font-bold text-foreground">{pct}%</span>
          </div>
          <div className="h-3 rounded-full bg-secondary overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-out ${
                product.status === "sneller" ? "bg-gradient-success" : "bg-primary"
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Counts */}
        <div className="flex justify-between items-end">
          <div>
            <div className="text-[10px] text-muted-foreground">Geproduceerd</div>
            <div className="text-2xl font-mono font-bold text-foreground animate-count-up">
              {product.produced.toLocaleString("nl-NL")}
              <span className="text-base font-normal text-muted-foreground"> / {product.target}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-muted-foreground">Snelheid</div>
            <div className="text-sm font-mono font-semibold text-accent">
              {Math.round(product.produced / (product.minutesActive / 60))}/u
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ActiveProduction = () => {
  return (
    <section>
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-3 h-3 rounded-full bg-accent animate-pulse-slow" />
        <h2 className="text-xl font-bold text-foreground">In productie</h2>
        <span className="text-sm text-muted-foreground ml-1">({activeProducts.length} actief)</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-5">
        {activeProducts.map((product) => (
          <ActiveProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ActiveProduction;

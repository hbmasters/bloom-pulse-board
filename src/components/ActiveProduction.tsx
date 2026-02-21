import { Play, Package } from "lucide-react";

interface ActiveLine {
  id: number;
  name: string;
  product: string;
  type: string;
  speed: number; // items per hour
  currentBatch: number;
  targetBatch: number;
  color: string;
}

const mockLines: ActiveLine[] = [
  {
    id: 1,
    name: "Lijn 1",
    product: "Luxe Voorjaarsboeket",
    type: "Boeket",
    speed: 142,
    currentBatch: 287,
    targetBatch: 400,
    color: "bloom-lavender",
  },
  {
    id: 2,
    name: "Lijn 2",
    product: "Moederdag Arrangement",
    type: "Arrangement",
    speed: 98,
    currentBatch: 156,
    targetBatch: 250,
    color: "bloom-pink",
  },
  {
    id: 3,
    name: "Lijn 3",
    product: "Mono Plus Tulpen",
    type: "Mono Plus",
    speed: 175,
    currentBatch: 412,
    targetBatch: 500,
    color: "bloom-sky",
  },
  {
    id: 4,
    name: "Lijn 4",
    product: "Seizoens Mix Pastel",
    type: "Boeket",
    speed: 130,
    currentBatch: 198,
    targetBatch: 350,
    color: "bloom-warm",
  },
];

const colorMap: Record<string, string> = {
  "bloom-lavender": "bg-bloom-lavender",
  "bloom-pink": "bg-bloom-pink",
  "bloom-sky": "bg-bloom-sky",
  "bloom-warm": "bg-bloom-warm",
};

const colorMapBg: Record<string, string> = {
  "bloom-lavender": "bg-bloom-lavender/15",
  "bloom-pink": "bg-bloom-pink/15",
  "bloom-sky": "bg-bloom-sky/15",
  "bloom-warm": "bg-bloom-warm/15",
};

const colorMapText: Record<string, string> = {
  "bloom-lavender": "text-bloom-lavender",
  "bloom-pink": "text-bloom-pink",
  "bloom-sky": "text-bloom-sky",
  "bloom-warm": "text-bloom-warm",
};

const ActiveProduction = () => {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse-slow" />
        <h2 className="text-lg font-semibold text-foreground">Nu in productie</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {mockLines.map((line) => {
          const pct = Math.round((line.currentBatch / line.targetBatch) * 100);
          return (
            <div
              key={line.id}
              className="bg-gradient-card rounded-xl border border-border p-5 hover:glow-primary transition-shadow duration-500"
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${colorMapBg[line.color]} ${colorMapText[line.color]}`}>
                  {line.name}
                </span>
                <div className="flex items-center gap-1.5 text-accent text-xs font-medium">
                  <Play className="w-3 h-3 fill-current" />
                  Actief
                </div>
              </div>

              <h3 className="text-base font-bold text-foreground mb-1 truncate">{line.product}</h3>
              <p className="text-xs text-muted-foreground mb-4">{line.type}</p>

              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">Voortgang</span>
                  <span className="font-mono font-semibold text-foreground">{pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div
                    className={`h-full rounded-full ${colorMap[line.color]} transition-all duration-1000`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <div className="text-xs text-muted-foreground">Geproduceerd</div>
                  <div className="text-xl font-mono font-bold text-foreground animate-count-up">
                    {line.currentBatch.toLocaleString("nl-NL")}
                    <span className="text-sm font-normal text-muted-foreground">/{line.targetBatch}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Snelheid</div>
                  <div className="text-sm font-mono font-semibold text-accent">{line.speed}/u</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ActiveProduction;

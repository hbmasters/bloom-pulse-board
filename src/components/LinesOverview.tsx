import { Trophy, TrendingUp, Award, Users, Zap } from "lucide-react";
import { productionLines, type ProductionLine } from "@/data/mockData";

const badgeIcons: Record<string, React.ReactNode> = {
  "Beste tempo": <Zap className="w-3 h-3" />,
  "Meeste output": <Trophy className="w-3 h-3" />,
  "Sterkste groei": <TrendingUp className="w-3 h-3" />,
};

const LinesOverview = () => {
  const handLines = productionLines.filter((l) => l.type === "hand");
  const bandLines = productionLines.filter((l) => l.type === "band");

  // Rank all lines by produced
  const ranked = [...productionLines].sort((a, b) => b.produced - a.produced);
  const top3Ids = new Set(ranked.slice(0, 3).map((l) => l.id));

  const renderLine = (line: ProductionLine, rank: number) => {
    const isTop3 = top3Ids.has(line.id);
    const globalRank = ranked.findIndex((l) => l.id === line.id) + 1;

    return (
      <div
        key={line.id}
        className={`flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all duration-300 ${
          isTop3
            ? "border-accent/25 bg-accent/5 hover:bg-accent/8"
            : "border-border bg-gradient-card hover:border-border/80"
        }`}
      >
        {/* Rank */}
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
          globalRank === 1 ? "bg-bloom-warm/20 text-bloom-warm" :
          globalRank === 2 ? "bg-bloom-sky/20 text-bloom-sky" :
          globalRank === 3 ? "bg-bloom-lavender/20 text-bloom-lavender" :
          "bg-secondary text-muted-foreground"
        }`}>
          {globalRank}
        </div>

        {/* Name + badge */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">{line.name}</span>
            {line.badge && (
              <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/20">
                {badgeIcons[line.badge]}
                {line.badge}
              </span>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-5 text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Users className="w-3.5 h-3.5" />
            <span className="font-mono font-semibold text-foreground">{line.people}</span>
          </div>
          <div className="text-right w-16">
            <div className="text-[10px] text-muted-foreground">Stuks</div>
            <div className="font-mono font-bold text-foreground">{line.produced.toLocaleString("nl-NL")}</div>
          </div>
          <div className="text-right w-14">
            <div className="text-[10px] text-muted-foreground">Uren</div>
            <div className="font-mono font-semibold text-foreground">{line.hoursActive}u</div>
          </div>
          <div className="text-right w-14">
            <div className="text-[10px] text-muted-foreground">Snelheid</div>
            <div className={`font-mono font-semibold ${isTop3 ? "text-accent" : "text-foreground"}`}>{line.avgSpeed}/u</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section>
      <div className="flex items-center gap-2.5 mb-5">
        <Award className="w-5 h-5 text-bloom-warm" />
        <h2 className="text-xl font-bold text-foreground">Lijnen overzicht</h2>
        <span className="text-sm text-muted-foreground">— Ranking op productie</span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Handlijnen */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
            Handlijnen ({handLines.length})
          </h3>
          <div className="space-y-2">
            {handLines
              .sort((a, b) => b.produced - a.produced)
              .map((line, i) => renderLine(line, i))}
          </div>
        </div>

        {/* Bandlijnen */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
            Bandlijnen ({bandLines.length})
          </h3>
          <div className="space-y-2">
            {bandLines
              .sort((a, b) => b.produced - a.produced)
              .map((line, i) => renderLine(line, i))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LinesOverview;

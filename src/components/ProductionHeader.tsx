import { useState, useEffect } from "react";
import { Users, TrendingUp } from "lucide-react";
import { lineStats } from "@/data/mockData";

const LiveClock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-end leading-none">
      <div className="text-3xl font-mono font-black text-primary tracking-tight tabular-nums">
        {time.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })}
      </div>
      <div className="text-[10px] text-muted-foreground capitalize mt-0.5">
        {time.toLocaleDateString("nl-NL", { weekday: "short", day: "numeric", month: "short" })}
      </div>
    </div>
  );
};

const ProductionHeader = () => {
  const perfDiff = lineStats.performanceVsPlanned - 100;

  return (
    <header className="shrink-0 px-5 py-2.5 border-b border-border bg-card shadow-sm">
      <div className="flex items-center gap-4">
        {/* Line Identity */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-11 h-11 rounded-xl bg-gradient-brand flex items-center justify-center shadow-md">
            <span className="text-lg font-black text-primary-foreground">H1</span>
          </div>
          <div className="leading-tight">
            <h1 className="text-xl font-black text-foreground tracking-tight">{lineStats.lineName}</h1>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Hoorn Bloommasters</p>
          </div>
        </div>

        {/* Dominant Speed KPI */}
        <div className="flex items-center gap-2 px-5 py-2 rounded-xl border border-accent/30 bg-accent/8 glow-success ml-2">
          <div className="leading-none text-center">
            <div className="text-[9px] text-accent uppercase tracking-wider font-bold">PCS / UUR</div>
            <div className="text-4xl font-mono font-black text-accent text-glow-success leading-none">{lineStats.currentPiecesPerHour}</div>
          </div>
        </div>

        {/* Vs Planned */}
        <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-accent/20 bg-accent/5">
          <TrendingUp className="w-4 h-4 text-accent" />
          <div className="leading-none">
            <div className="text-[8px] text-muted-foreground uppercase tracking-wider">vs Planning</div>
            <div className="text-xl font-mono font-bold text-accent">+{perfDiff}%</div>
          </div>
        </div>

        {/* People */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card">
          <Users className="w-4 h-4 text-primary" />
          <div className="leading-none">
            <div className="text-[8px] text-muted-foreground uppercase tracking-wider">Personen</div>
            <div className="text-lg font-mono font-black text-foreground">{lineStats.totalPeople}</div>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Total produced + Clock */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right leading-none">
            <div className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">Vandaag</div>
            <div className="text-2xl font-mono font-black text-foreground">{lineStats.totalProduced.toLocaleString("nl-NL")}</div>
            <div className="text-[9px] text-muted-foreground">stuks</div>
          </div>
          <div className="w-px h-10 bg-border" />
          <LiveClock />
        </div>
      </div>
    </header>
  );
};

export default ProductionHeader;

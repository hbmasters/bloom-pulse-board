import { useState, useEffect } from "react";
import { Users, Package, Zap, TrendingUp } from "lucide-react";
import { lineStats, hbMasterMessages } from "@/data/mockData";

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
      <div className="text-[11px] text-muted-foreground capitalize mt-0.5">
        {time.toLocaleDateString("nl-NL", { weekday: "short", day: "numeric", month: "short" })}
      </div>
    </div>
  );
};

const ProductionHeader = () => {
  const [aiIndex, setAiIndex] = useState(0);
  const [aiVisible, setAiVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setAiVisible(false);
      setTimeout(() => {
        setAiIndex((p) => (p + 1) % hbMasterMessages.length);
        setAiVisible(true);
      }, 400);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const perfDiff = lineStats.performanceVsPlanned - 100;

  return (
    <header className="flex items-center gap-5 px-6 py-3 border-b border-border bg-card shadow-sm shrink-0">
      {/* Line Identity */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-11 h-11 rounded-xl bg-gradient-brand flex items-center justify-center shadow-md">
          <span className="text-lg font-black text-primary-foreground">H1</span>
        </div>
        <div className="leading-tight">
          <h1 className="text-lg font-black text-foreground tracking-tight">
            {lineStats.lineName}
          </h1>
          <p className="text-[10px] text-muted-foreground font-medium">Hoorn Bloommasters</p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 ml-2">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card">
          <Users className="w-4 h-4 text-primary" />
          <div className="leading-none">
            <div className="text-[9px] text-muted-foreground uppercase tracking-wider">Personen</div>
            <div className="text-lg font-mono font-black text-foreground">{lineStats.totalPeople}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card">
          <Package className="w-4 h-4 text-primary" />
          <div className="leading-none">
            <div className="text-[9px] text-muted-foreground uppercase tracking-wider">Geproduceerd</div>
            <div className="text-lg font-mono font-black text-foreground">{lineStats.totalProduced.toLocaleString("nl-NL")}</div>
          </div>
        </div>
        {/* DOMINANT SPEED */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-accent/30 bg-accent/8 glow-success">
          <Zap className="w-5 h-5 text-accent" />
          <div className="leading-none">
            <div className="text-[9px] text-accent uppercase tracking-wider font-semibold">Stuks/uur</div>
            <div className="text-2xl font-mono font-black text-accent text-glow-success">{lineStats.currentPiecesPerHour}</div>
          </div>
        </div>
        {/* Vs planned */}
        <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-accent/20 bg-accent/5">
          <TrendingUp className="w-4 h-4 text-accent" />
          <div className="leading-none">
            <div className="text-[9px] text-muted-foreground uppercase tracking-wider">vs Planning</div>
            <div className="text-lg font-mono font-bold text-accent">+{perfDiff}%</div>
          </div>
        </div>
      </div>

      {/* HBMASTER AI */}
      <div className="flex-1 mx-4">
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-gradient-brand overflow-hidden shadow-md">
          <div className="w-8 h-8 rounded-lg bg-primary-foreground/15 flex items-center justify-center shrink-0">
            <span className="text-xs font-black text-primary-foreground">HB</span>
          </div>
          <div className="overflow-hidden flex-1">
            <div className="text-[9px] text-primary-foreground/70 uppercase tracking-wider font-semibold mb-0.5">HBMASTER</div>
            <p className={`text-sm font-semibold text-primary-foreground truncate transition-all duration-300 ${aiVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}>
              {hbMasterMessages[aiIndex]}
            </p>
          </div>
        </div>
      </div>

      <LiveClock />
    </header>
  );
};

export default ProductionHeader;

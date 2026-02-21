import { useState, useEffect } from "react";
import { Users, TrendingUp, UserCheck } from "lucide-react";
import { lineStats, hbMasterMessages } from "@/data/mockData";

const LiveClock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-end leading-none">
      <div className="text-4xl font-mono font-black text-primary tracking-tight tabular-nums">
        {time.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })}
      </div>
      <div className="text-xs text-muted-foreground capitalize mt-1">
        {time.toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long" })}
      </div>
    </div>
  );
};

const modeColors = {
  flow: "border-accent/40 bg-accent/8",
  stabilisatie: "border-primary/30 bg-primary/5",
  correctie: "border-bloom-warm/30 bg-bloom-warm/5",
};

const modeLabels = {
  flow: { label: "FLOW", color: "text-accent" },
  stabilisatie: { label: "STABIEL", color: "text-primary" },
  correctie: { label: "FOCUS", color: "text-bloom-warm" },
};

const ProductionHeader = () => {
  const [msgIndex, setMsgIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setMsgIndex((p) => (p + 1) % hbMasterMessages.length);
        setVisible(true);
      }, 400);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const currentMsg = hbMasterMessages[msgIndex];
  const perfDiff = lineStats.performanceVsPlanned - 100;
  const peopleRecent = lineStats.peopleLastUpdated < 15;

  return (
    <header className="shrink-0 px-5 py-3 border-b border-border bg-card shadow-sm">
      <div className="flex items-center gap-4">
        {/* Line Identity */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-12 h-12 rounded-xl bg-gradient-brand flex items-center justify-center shadow-md">
            <span className="text-xl font-black text-primary-foreground tracking-tight">H1</span>
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

        {/* Stats row */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card">
            <Users className="w-4 h-4 text-primary" />
            <div className="leading-none">
              <div className="text-[8px] text-muted-foreground uppercase tracking-wider">Personen</div>
              <div className="text-lg font-mono font-black text-foreground">{lineStats.totalPeople}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card">
            <div className="leading-none">
              <div className="text-[8px] text-muted-foreground uppercase tracking-wider">Per Persoon/U</div>
              <div className="text-lg font-mono font-black text-foreground">{lineStats.outputPerPerson}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card">
            <div className="leading-none">
              <div className="text-[8px] text-muted-foreground uppercase tracking-wider">Efficiency</div>
              <div className="text-lg font-mono font-black text-foreground">{lineStats.efficiencyScore}%</div>
            </div>
          </div>
          {/* People status */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[10px] font-medium ${
            peopleRecent 
              ? "border-accent/20 bg-accent/5 text-accent" 
              : "border-bloom-warm/20 bg-bloom-warm/5 text-bloom-warm"
          }`}>
            <UserCheck className="w-3.5 h-3.5" />
            {peopleRecent ? "✓ Team actueel" : `Bezetting ${lineStats.peopleLastUpdated}m geleden`}
          </div>
        </div>

        {/* HBMASTER — Central Coach */}
        <div className={`flex-1 mx-3 rounded-xl border overflow-hidden ${modeColors[currentMsg.mode]}`}>
          <div className="flex items-center gap-3 px-4 py-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-brand flex items-center justify-center shrink-0 shadow-sm">
              <span className="text-[10px] font-black text-primary-foreground">HB</span>
            </div>
            <div className="overflow-hidden flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[9px] font-black text-primary uppercase tracking-wider">HBMASTER</span>
                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${modeLabels[currentMsg.mode].color} bg-current/10`}>
                  {modeLabels[currentMsg.mode].label}
                </span>
              </div>
              <p className={`text-sm font-semibold text-foreground truncate transition-all duration-300 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
              }`}>
                {currentMsg.text}
              </p>
            </div>
          </div>
        </div>

        {/* Total produced + Clock */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right leading-none">
            <div className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">Vandaag</div>
            <div className="text-3xl font-mono font-black text-foreground">{lineStats.totalProduced.toLocaleString("nl-NL")}</div>
            <div className="text-[9px] text-muted-foreground">stuks totaal</div>
          </div>
          <div className="w-px h-10 bg-border" />
          <LiveClock />
        </div>
      </div>
    </header>
  );
};

export default ProductionHeader;

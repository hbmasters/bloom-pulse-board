import { Trophy, Zap } from "lucide-react";
import { crossLineAlerts } from "@/data/mockData";

const lineLeaders: Record<string, { name: string; initials: string }> = {
  "Hand Line 3": { name: "Marta", initials: "MA" },
  "Belt Line 2": { name: "Jolanta", initials: "JO" },
  "Hand Line 5": { name: "Renata", initials: "RE" },
};

const CrossLineHighlights = () => {
  const highlights = crossLineAlerts.slice(0, 2);

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 shrink-0">
        Other Lines
      </h3>
      <div className="flex-1 min-h-0 space-y-1 overflow-hidden">
        {highlights.map((alert, i) => {
          const leader = lineLeaders[alert.line];
          return (
            <div key={i} className="flex items-center gap-2 px-2.5 py-2 rounded-lg border border-border/60 bg-card/60">
              {leader ? (
                <div className="w-7 h-7 rounded-full bg-gradient-brand flex items-center justify-center shrink-0 shadow-sm">
                  <span className="text-[9px] font-black text-primary-foreground">{leader.initials}</span>
                </div>
              ) : (
                <div className="w-6 h-6 rounded-md bg-primary/8 flex items-center justify-center shrink-0">
                  {i === 0 ? <Trophy className="w-3 h-3 text-primary/60" /> : <Zap className="w-3 h-3 text-primary/60" />}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-bold text-foreground/80 truncate">
                  {alert.line}
                  {leader && <span className="text-muted-foreground font-normal ml-1">· {leader.name}</span>}
                </div>
                <div className="text-[9px] text-muted-foreground truncate">{alert.product} · {alert.message}</div>
              </div>
              <div className="text-[10px] font-mono font-bold text-primary/70 shrink-0">{alert.metric}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CrossLineHighlights;

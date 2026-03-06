import { TrendingUp, TrendingDown, Minus, ChevronRight, LucideIcon } from "lucide-react";

export type KPIStatus = "healthy" | "warning" | "critical";

export interface ExecutiveKPI {
  id: string;
  title: string;
  value: string;
  unit?: string;
  target: string;
  diffTarget: string;
  diffTargetDir: "positive" | "negative" | "neutral";
  trendPeriod: string;
  trendPeriodDir: "up" | "down" | "neutral";
  trendYear: string;
  trendYearDir: "up" | "down" | "neutral";
  status: KPIStatus;
  icon: LucideIcon;
}

const statusStyles: Record<KPIStatus, { border: string; dot: string; glow: string }> = {
  healthy:  { border: "border-accent/30", dot: "bg-accent", glow: "shadow-accent/5" },
  warning:  { border: "border-yellow-500/30", dot: "bg-yellow-500", glow: "shadow-yellow-500/5" },
  critical: { border: "border-red-500/30", dot: "bg-red-500 animate-pulse", glow: "shadow-red-500/5" },
};

const TrendBadge = ({ label, value, dir }: { label: string; value: string; dir: "up" | "down" | "neutral" }) => {
  const Icon = dir === "up" ? TrendingUp : dir === "down" ? TrendingDown : Minus;
  const color = dir === "up" ? "text-accent" : dir === "down" ? "text-red-400" : "text-muted-foreground";
  return (
    <div className="flex items-center gap-1">
      <span className="text-[8px] font-mono text-muted-foreground/60 uppercase">{label}</span>
      <Icon className={`w-3 h-3 ${color}`} />
      <span className={`text-[9px] font-mono font-bold ${color}`}>{value}</span>
    </div>
  );
};

const KPIExecutiveCard = ({ kpi, onClick }: { kpi: ExecutiveKPI; onClick: () => void }) => {
  const s = statusStyles[kpi.status];
  const Icon = kpi.icon;
  const diffColor = kpi.diffTargetDir === "positive" ? "text-accent" : kpi.diffTargetDir === "negative" ? "text-red-400" : "text-muted-foreground";

  return (
    <button
      onClick={onClick}
      className={`group text-left w-full p-4 rounded-xl border ${s.border} bg-card/80 backdrop-blur-sm hover:shadow-lg ${s.glow} transition-all`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${s.dot}`} />
          <Icon className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-mono font-bold text-foreground uppercase tracking-wider">{kpi.title}</span>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
      </div>

      {/* Value */}
      <div className="mb-3">
        <div className="text-2xl font-black text-foreground leading-none animate-count-up">
          {kpi.value}
          {kpi.unit && <span className="text-xs font-normal text-muted-foreground ml-1">{kpi.unit}</span>}
        </div>
      </div>

      {/* Target row */}
      <div className="flex items-center justify-between mb-2">
        <div className="text-[9px] font-mono text-muted-foreground">
          Target: <span className="font-bold text-foreground/70">{kpi.target}</span>
        </div>
        <div className={`text-[10px] font-mono font-bold ${diffColor}`}>
          {kpi.diffTarget}
        </div>
      </div>

      {/* Trend row */}
      <div className="flex items-center gap-4 pt-2 border-t border-border/50">
        <TrendBadge label="per" value={kpi.trendPeriod} dir={kpi.trendPeriodDir} />
        <TrendBadge label="jr" value={kpi.trendYear} dir={kpi.trendYearDir} />
      </div>
    </button>
  );
};

export default KPIExecutiveCard;

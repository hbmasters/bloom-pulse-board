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
  healthy:  { border: "border-accent/25", dot: "bg-accent", glow: "shadow-accent/5" },
  warning:  { border: "border-yellow-500/25", dot: "bg-yellow-500", glow: "shadow-yellow-500/5" },
  critical: { border: "border-red-500/25", dot: "bg-red-500 animate-pulse", glow: "shadow-red-500/5" },
};

const TrendBadge = ({ label, value, dir }: { label: string; value: string; dir: "up" | "down" | "neutral" }) => {
  const Icon = dir === "up" ? TrendingUp : dir === "down" ? TrendingDown : Minus;
  const color = dir === "up" ? "text-accent" : dir === "down" ? "text-red-400" : "text-muted-foreground";
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[11px] text-muted-foreground/50 tracking-wide">{label}</span>
      <Icon className={`w-3.5 h-3.5 ${color}`} />
      <span className={`text-xs font-semibold ${color}`}>{value}</span>
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
      className={`group text-left w-full p-5 rounded-2xl border ${s.border} bg-card/80 backdrop-blur-sm hover:shadow-lg ${s.glow} transition-all duration-200`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className={`w-2 h-2 rounded-full ${s.dot}`} />
          <Icon className="w-4 h-4 text-primary/70" />
          <span className="text-[13px] font-semibold text-foreground/80 tracking-tight">{kpi.title}</span>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground/20 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
      </div>

      {/* Value — dominant element */}
      <div className="mb-4">
        <div className="text-3xl font-extrabold text-foreground leading-none tracking-tight animate-count-up">
          {kpi.value}
          {kpi.unit && <span className="text-sm font-normal text-muted-foreground/60 ml-1.5">{kpi.unit}</span>}
        </div>
      </div>

      {/* Target row */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[12px] text-muted-foreground/50">
          Target: <span className="font-medium text-foreground/60">{kpi.target}</span>
        </span>
        <span className={`text-[12px] font-semibold ${diffColor}`}>
          {kpi.diffTarget}
        </span>
      </div>

      {/* Trend row */}
      <div className="flex items-center gap-5 pt-3 border-t border-border/30">
        <TrendBadge label="periode" value={kpi.trendPeriod} dir={kpi.trendPeriodDir} />
        <TrendBadge label="jaar" value={kpi.trendYear} dir={kpi.trendYearDir} />
      </div>
    </button>
  );
};

export default KPIExecutiveCard;

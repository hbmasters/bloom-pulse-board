import { TrendingUp, TrendingDown, Minus, ChevronRight, CheckCircle2, ArrowDown, LucideIcon } from "lucide-react";

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

const statusStyles: Record<KPIStatus, { border: string; glow: string; iconBg: string }> = {
  healthy:  { border: "border-accent/25", glow: "shadow-accent/5", iconBg: "bg-accent/10" },
  warning:  { border: "border-yellow-500/25", glow: "shadow-yellow-500/5", iconBg: "bg-yellow-500/10" },
  critical: { border: "border-red-500/25", glow: "shadow-red-500/5", iconBg: "bg-red-500/10" },
};

const StatusIcon = ({ dir }: { dir: "positive" | "negative" | "neutral" }) => {
  if (dir === "positive") return <CheckCircle2 className="w-5 h-5 text-accent" />;
  if (dir === "negative") return <ArrowDown className="w-5 h-5 text-red-400" />;
  return <Minus className="w-4 h-4 text-muted-foreground/50" />;
};

const TrendIcon = ({ value, dir }: { value: string; dir: "up" | "down" | "neutral" }) => {
  const Icon = dir === "up" ? TrendingUp : dir === "down" ? TrendingDown : Minus;
  const color = dir === "up" ? "text-accent" : dir === "down" ? "text-red-400" : "text-muted-foreground/50";
  return (
    <div className="flex items-center gap-1">
      <Icon className={`w-3.5 h-3.5 ${color}`} />
      <span className={`text-xs font-semibold ${color}`}>{value}</span>
    </div>
  );
};

const KPIExecutiveCard = ({ kpi, onClick }: { kpi: ExecutiveKPI; onClick: () => void }) => {
  const s = statusStyles[kpi.status];
  const Icon = kpi.icon;

  return (
    <button
      onClick={onClick}
      className={`group text-left w-full p-5 rounded-2xl border ${s.border} bg-card/80 backdrop-blur-sm hover:shadow-lg ${s.glow} transition-all duration-200`}
    >
      {/* Header row: icon + title + status icon */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-lg ${s.iconBg} flex items-center justify-center`}>
            <Icon className="w-3.5 h-3.5 text-foreground/60" />
          </div>
          <span className="text-[13px] font-semibold text-foreground/80 tracking-tight">{kpi.title}</span>
        </div>
        <StatusIcon dir={kpi.diffTargetDir} />
      </div>

      {/* Value + target on same row */}
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-3xl font-extrabold text-foreground leading-none tracking-tight">
          {kpi.value}
        </span>
        <span className="text-[12px] text-muted-foreground/40">/ {kpi.target}</span>
      </div>

      {/* Trend row — icons only, minimal text */}
      <div className="flex items-center justify-between pt-3 border-t border-border/30">
        <TrendIcon value={kpi.trendPeriod} dir={kpi.trendPeriodDir} />
        <TrendIcon value={kpi.trendYear} dir={kpi.trendYearDir} />
        <ChevronRight className="w-4 h-4 text-muted-foreground/15 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
      </div>
    </button>
  );
};

export default KPIExecutiveCard;

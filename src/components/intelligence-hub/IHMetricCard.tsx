import { TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react";

export type IHMetricStatus = "healthy" | "warning" | "critical" | "neutral";

export interface IHMetric {
  label: string;
  value: string;
  unit?: string;
  target?: string;
  change?: string;
  changeDir?: "up" | "down" | "neutral";
  status: IHMetricStatus;
  sparkline?: number[];
}

const statusMap: Record<IHMetricStatus, { bg: string; border: string; dot: string; text: string }> = {
  healthy:  { bg: "bg-accent/5",       border: "border-accent/20",       dot: "bg-accent",        text: "text-accent" },
  warning:  { bg: "bg-yellow-500/5",   border: "border-yellow-500/20",   dot: "bg-yellow-500",    text: "text-yellow-500" },
  critical: { bg: "bg-red-500/5",      border: "border-red-500/20",      dot: "bg-red-500",       text: "text-red-500" },
  neutral:  { bg: "bg-muted/30",       border: "border-border",          dot: "bg-muted-foreground", text: "text-muted-foreground" },
};

const MiniSparkline = ({ data, status }: { data: number[]; status: IHMetricStatus }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 72, h = 24;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 4) - 2}`).join(" ");
  const col = status === "healthy" ? "hsl(155,55%,50%)" : status === "warning" ? "hsl(45,90%,55%)" : status === "critical" ? "hsl(0,60%,55%)" : "hsl(215,12%,50%)";
  return (
    <svg width={w} height={h} className="shrink-0 opacity-60">
      <polyline points={pts} fill="none" stroke={col} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const IHMetricCard = ({ metric }: { metric: IHMetric }) => {
  const s = statusMap[metric.status];
  const Icon = metric.changeDir === "up" ? TrendingUp : metric.changeDir === "down" ? TrendingDown : Minus;

  return (
    <div className={`p-3.5 rounded-xl ${s.bg} border ${s.border} transition-all hover:shadow-md`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
          <span className="text-[11px] font-medium text-foreground/60 tracking-tight">{metric.label}</span>
        </div>
        {metric.status === "critical" && <AlertTriangle className="w-3 h-3 text-red-500" />}
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-lg font-extrabold text-foreground leading-none">
            {metric.value}
            {metric.unit && <span className="text-[10px] font-normal text-muted-foreground/50 ml-0.5">{metric.unit}</span>}
          </div>
          {metric.target && <div className="text-[10px] text-muted-foreground/40 mt-0.5">Target: {metric.target}</div>}
          {metric.change && (
            <div className={`flex items-center gap-0.5 mt-1 ${s.text}`}>
              <Icon className="w-3 h-3" />
              <span className="text-[10px] font-semibold">{metric.change}</span>
            </div>
          )}
        </div>
        {metric.sparkline && <MiniSparkline data={metric.sparkline} status={metric.status} />}
      </div>
    </div>
  );
};

export default IHMetricCard;

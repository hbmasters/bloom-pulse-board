import { TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react";

export type MetricStatus = "healthy" | "warning" | "critical";

export interface MetricData {
  id: string;
  title: string;
  value: string;
  unit?: string;
  target?: string;
  change?: string;
  changeDir?: "up" | "down" | "neutral";
  status: MetricStatus;
  sparkline?: number[];
}

const statusStyles: Record<MetricStatus, { bg: string; border: string; dot: string; text: string }> = {
  healthy:  { bg: "bg-accent/5",  border: "border-accent/20",  dot: "bg-accent",        text: "text-accent" },
  warning:  { bg: "bg-yellow-500/5", border: "border-yellow-500/20", dot: "bg-yellow-500", text: "text-yellow-500" },
  critical: { bg: "bg-red-500/5", border: "border-red-500/20", dot: "bg-red-500",       text: "text-red-500" },
};

const Sparkline = ({ data, status }: { data: number[]; status: MetricStatus }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 80, h = 28;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 4) - 2}`).join(" ");
  const color = status === "healthy" ? "hsl(155,55%,50%)" : status === "warning" ? "hsl(45,90%,55%)" : "hsl(0,60%,55%)";
  return (
    <svg width={w} height={h} className="shrink-0">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
    </svg>
  );
};

const KPIMetricCard = ({ metric }: { metric: MetricData }) => {
  const s = statusStyles[metric.status];
  const ChangeIcon = metric.changeDir === "up" ? TrendingUp : metric.changeDir === "down" ? TrendingDown : Minus;

  return (
    <div className={`p-4 rounded-2xl ${s.bg} border ${s.border} transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${s.dot}`} />
          <span className="text-[12px] font-medium text-foreground/70 tracking-tight">{metric.title}</span>
        </div>
        {metric.status === "critical" && <AlertTriangle className="w-3.5 h-3.5 text-red-500" />}
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-xl font-extrabold text-foreground leading-none tracking-tight">
            {metric.value}
            {metric.unit && <span className="text-[11px] font-normal text-muted-foreground/50 ml-1">{metric.unit}</span>}
          </div>
          {metric.target && (
            <div className="text-[11px] text-muted-foreground/40 mt-1">Target: {metric.target}</div>
          )}
          {metric.change && (
            <div className={`flex items-center gap-1 mt-1.5 ${s.text}`}>
              <ChangeIcon className="w-3.5 h-3.5" />
              <span className="text-[11px] font-semibold">{metric.change}</span>
            </div>
          )}
        </div>
        {metric.sparkline && <Sparkline data={metric.sparkline} status={metric.status} />}
      </div>
    </div>
  );
};

export default KPIMetricCard;

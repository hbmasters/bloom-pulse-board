import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { BlockShell, KPIStrip, SeverityBadge } from "../BlockShell";
import { DOMAIN_COLORS } from "../block-domain-colors";
import type { AlertExceptionData } from "../block-types";

export const AlertExceptionBlock = ({ data }: { data: AlertExceptionData }) => {
  const colors = DOMAIN_COLORS.alert;
  const severityCounts = { critical: 0, high: 0, medium: 0, low: 0 };
  data.alerts.forEach(a => severityCounts[a.severity]++);

  return (
    <BlockShell
      domain="alert"
      title={data.title}
      icon={<AlertTriangle className="w-3.5 h-3.5" />}
      badge={data.alerts.length}
      period={data.period}
    >
      <p className="text-[11px] text-muted-foreground leading-relaxed">{data.summary}</p>

      {/* Severity distribution */}
      <div className="flex gap-2">
        {(["critical", "high", "medium", "low"] as const).filter(s => severityCounts[s] > 0).map(s => (
          <div key={s} className="flex items-center gap-1">
            <SeverityBadge level={s} />
            <span className="text-[10px] font-mono text-muted-foreground">×{severityCounts[s]}</span>
          </div>
        ))}
      </div>

      {data.kpis && data.kpis.length > 0 && <KPIStrip kpis={data.kpis} domain="alert" />}

      {/* Alert cards */}
      <div className="space-y-1.5">
        {data.alerts.map((alert, i) => (
          <div key={i} className={cn(
            "rounded-md border p-2 space-y-1 bg-card/50",
            alert.severity === "critical" ? "border-red-500/40" : colors.border
          )}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-muted-foreground font-mono uppercase">{alert.domain}</span>
                <span className="text-[11px] font-semibold text-foreground">{alert.issue}</span>
              </div>
              <SeverityBadge level={alert.severity} />
            </div>
            <div className="text-[10px] text-muted-foreground">Impact: {alert.impact}</div>
            <div className="text-[10px] text-foreground font-medium">→ {alert.action}</div>
          </div>
        ))}
      </div>
    </BlockShell>
  );
};

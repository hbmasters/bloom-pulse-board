/**
 * HBM Analytical Block — Reusable Shell / Wrapper
 * 
 * Provides consistent header, domain color, expand/collapse, and layout
 * for all analytical block variants.
 */

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { DOMAIN_COLORS, type AnalyticalDomain } from "./block-domain-colors";
import type { BlockKPI } from "./block-types";

interface BlockShellProps {
  domain: AnalyticalDomain;
  title: string;
  icon: React.ReactNode;
  badge?: string | number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export const BlockShell = ({ domain, title, icon, badge, defaultOpen = false, children }: BlockShellProps) => {
  const [open, setOpen] = useState(defaultOpen);
  const colors = DOMAIN_COLORS[domain];

  return (
    <div className={cn("mt-2 rounded-lg overflow-hidden border", colors.border)}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-mono text-muted-foreground hover:text-foreground transition-colors"
      >
        <span className="flex items-center gap-1.5">
          <span className={colors.iconClass}>{icon}</span>
          <span className="font-medium">{title}</span>
          {badge !== undefined && (
            <span className={cn("text-[9px] px-1.5 py-0.5 rounded font-semibold border", colors.bgMuted, colors.text, colors.border)}>
              {badge}
            </span>
          )}
        </span>
        {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>
      {open && (
        <div className="px-3 pb-3 animate-fade-in space-y-3">
          {children}
        </div>
      )}
    </div>
  );
};

// ── Reusable KPI Strip ──

export const KPIStrip = ({ kpis, domain }: { kpis: BlockKPI[]; domain: AnalyticalDomain }) => {
  const colors = DOMAIN_COLORS[domain];
  return (
    <div className="flex flex-wrap gap-2">
      {kpis.map((kpi, i) => (
        <div key={i} className={cn("rounded-md px-2.5 py-1.5 border", colors.bgMuted, colors.border)}>
          <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{kpi.label}</div>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-bold text-foreground">{kpi.value}</span>
            {kpi.unit && <span className="text-[10px] text-muted-foreground">{kpi.unit}</span>}
            {kpi.delta && (
              <span className={cn("text-[10px] font-mono font-semibold",
                kpi.trend === "up" ? "text-emerald-400" : kpi.trend === "down" ? "text-red-400" : "text-muted-foreground"
              )}>
                {kpi.delta}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// ── Reusable Severity / Priority Badge ──

const SEVERITY_CONFIG = {
  critical: { bg: "bg-red-500/15", text: "text-red-400", border: "border-red-500/30", label: "Kritiek" },
  high: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20", label: "Hoog" },
  medium: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20", label: "Medium" },
  low: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", label: "Laag" },
};

export const SeverityBadge = ({ level }: { level: "critical" | "high" | "medium" | "low" }) => {
  const cfg = SEVERITY_CONFIG[level];
  return (
    <span className={cn("text-[9px] font-semibold px-1.5 py-0.5 rounded border", cfg.bg, cfg.text, cfg.border)}>
      {cfg.label}
    </span>
  );
};

// ── Reusable Mini Bar ──

export const MiniBar = ({ 
  value, max, color, height = "h-2" 
}: { 
  value: number; max: number; color?: string; height?: string 
}) => {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className={cn("w-full rounded-full bg-border/50 overflow-hidden", height)}>
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, backgroundColor: color || "hsl(var(--primary))" }}
      />
    </div>
  );
};

// ── Comparison Bar (two values side by side) ──

export const ComparisonBar = ({
  value1, value2, label1, label2, color1, color2, max
}: {
  value1: number; value2: number; label1?: string; label2?: string;
  color1: string; color2: string; max?: number;
}) => {
  const m = max || Math.max(value1, value2) * 1.1;
  const pct1 = (value1 / m) * 100;
  const pct2 = (value2 / m) * 100;
  return (
    <div className="space-y-1">
      {label1 && (
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>{label1}: {value1}</span>
          <span>{label2}: {value2}</span>
        </div>
      )}
      <div className="flex gap-0.5 h-2">
        <div className="flex-1 rounded-l-full bg-border/30 overflow-hidden">
          <div className="h-full rounded-l-full" style={{ width: `${pct1}%`, backgroundColor: color1 }} />
        </div>
        <div className="flex-1 rounded-r-full bg-border/30 overflow-hidden flex justify-end">
          <div className="h-full rounded-r-full" style={{ width: `${pct2}%`, backgroundColor: color2 }} />
        </div>
      </div>
    </div>
  );
};

// ── Deviation Indicator ──

export const DeviationIndicator = ({ value, unit = "%" }: { value: number; unit?: string }) => {
  const isPositive = value >= 0;
  return (
    <span className={cn(
      "text-[11px] font-mono font-semibold",
      isPositive ? "text-emerald-400" : "text-red-400"
    )}>
      {isPositive ? "+" : ""}{value}{unit}
    </span>
  );
};

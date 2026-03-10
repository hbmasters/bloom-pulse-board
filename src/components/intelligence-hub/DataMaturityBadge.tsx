import { Circle, CheckCircle, AlertTriangle, HelpCircle, Link2Off, Clock } from "lucide-react";

/* ══════════════════════════════════════════
   DATA MATURITY BADGE
   Visual language for data source maturity:
   - live: verified, real-time data
   - partial: some sources incomplete
   - placeholder: derived from fallback/placeholder source
   - unresolved: dependency cannot be resolved (e.g. missing recipe)
   - missing: source/dependency not available yet
   ══════════════════════════════════════════ */

export type DataMaturity = "live" | "partial" | "placeholder" | "unresolved" | "missing";

const maturityConfig: Record<DataMaturity, {
  label: string;
  icon: typeof Circle;
  dotClass: string;
  badgeClass: string;
  description: string;
}> = {
  live: {
    label: "Live",
    icon: CheckCircle,
    dotClass: "bg-accent",
    badgeClass: "text-accent bg-accent/8 border-accent/20",
    description: "Geverifieerde real-time data",
  },
  partial: {
    label: "Gedeeltelijk",
    icon: Clock,
    dotClass: "bg-yellow-500",
    badgeClass: "text-yellow-500 bg-yellow-500/8 border-yellow-500/20",
    description: "Sommige bronnen nog niet beschikbaar",
  },
  placeholder: {
    label: "Placeholder",
    icon: Circle,
    dotClass: "bg-primary/40",
    badgeClass: "text-primary/70 bg-primary/5 border-primary/15",
    description: "Gebaseerd op placeholderbron",
  },
  unresolved: {
    label: "Onopgelost",
    icon: AlertTriangle,
    dotClass: "bg-orange-500",
    badgeClass: "text-orange-500 bg-orange-500/8 border-orange-500/20",
    description: "Afhankelijkheid kan niet worden opgelost",
  },
  missing: {
    label: "Ontbreekt",
    icon: Link2Off,
    dotClass: "bg-muted-foreground/40",
    badgeClass: "text-muted-foreground/60 bg-muted/20 border-border",
    description: "Bron niet beschikbaar",
  },
};

/* ── Compact Badge ── */
export const DataMaturityBadge = ({
  maturity,
  showLabel = true,
  size = "default",
}: {
  maturity: DataMaturity;
  showLabel?: boolean;
  size?: "sm" | "default";
}) => {
  const config = maturityConfig[maturity];
  const Icon = config.icon;
  const sizeClasses = size === "sm" ? "text-[8px] px-1.5 py-0 h-4 gap-1" : "text-[9px] px-2 py-0.5 gap-1.5";

  return (
    <span className={`inline-flex items-center font-mono font-semibold rounded-full border ${config.badgeClass} ${sizeClasses}`}>
      <Icon className={size === "sm" ? "w-2.5 h-2.5" : "w-3 h-3"} />
      {showLabel && <span>{config.label}</span>}
    </span>
  );
};

/* ── Dot indicator (minimal, inline) ── */
export const DataMaturityDot = ({ maturity }: { maturity: DataMaturity }) => {
  const config = maturityConfig[maturity];
  return (
    <span className="relative inline-flex items-center" title={config.description}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
      {maturity === "live" && (
        <span className={`absolute w-1.5 h-1.5 rounded-full ${config.dotClass} animate-ping opacity-40`} />
      )}
    </span>
  );
};

/* ── Source label with maturity ── */
export const SourceLabel = ({
  source,
  maturity,
}: {
  source: string;
  maturity: DataMaturity;
}) => {
  const config = maturityConfig[maturity];
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground/60">
      <DataMaturityDot maturity={maturity} />
      <span>{source}</span>
      {maturity !== "live" && (
        <span className={`text-[8px] ${maturity === "missing" ? "text-muted-foreground/40" : maturity === "unresolved" ? "text-orange-500/70" : "text-yellow-500/70"}`}>
          ({config.label.toLowerCase()})
        </span>
      )}
    </span>
  );
};

/* ── Dependency status row ── */
export const DependencyStatus = ({
  label,
  maturity,
  detail,
}: {
  label: string;
  maturity: DataMaturity;
  detail?: string;
}) => {
  const config = maturityConfig[maturity];
  const Icon = config.icon;
  return (
    <div className="flex items-center gap-2 text-[11px]">
      <Icon className={`w-3 h-3 shrink-0 ${
        maturity === "live" ? "text-accent" :
        maturity === "partial" ? "text-yellow-500" :
        maturity === "unresolved" ? "text-orange-500" :
        maturity === "missing" ? "text-muted-foreground/40" :
        "text-primary/50"
      }`} />
      <span className="text-foreground/70">{label}</span>
      <DataMaturityBadge maturity={maturity} size="sm" />
      {detail && <span className="text-muted-foreground/50 text-[10px]">— {detail}</span>}
    </div>
  );
};

/* ── Forecast empty state message ── */
export const ForecastEmptyState = ({
  title,
  message,
  maturity = "missing",
}: {
  title?: string;
  message: string;
  maturity?: DataMaturity;
}) => {
  const config = maturityConfig[maturity];
  const Icon = config.icon;
  return (
    <div className={`rounded-xl border p-6 flex flex-col items-center justify-center text-center ${
      maturity === "unresolved" ? "border-orange-500/20 bg-orange-500/5" :
      maturity === "partial" ? "border-yellow-500/20 bg-yellow-500/5" :
      "border-border bg-muted/10"
    }`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${
        maturity === "unresolved" ? "bg-orange-500/10" :
        maturity === "partial" ? "bg-yellow-500/10" :
        "bg-muted/20"
      }`}>
        <Icon className={`w-5 h-5 ${
          maturity === "unresolved" ? "text-orange-500" :
          maturity === "partial" ? "text-yellow-500" :
          "text-muted-foreground/50"
        }`} />
      </div>
      {title && <p className="text-[11px] font-bold text-foreground/60 uppercase tracking-wider mb-1">{title}</p>}
      <p className="text-[11px] font-mono text-muted-foreground/70 max-w-md">{message}</p>
    </div>
  );
};

export default DataMaturityBadge;

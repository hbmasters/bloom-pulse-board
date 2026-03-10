import { Package, ShoppingCart, TrendingUp, AlertTriangle, HelpCircle } from "lucide-react";
import { DataMaturityBadge, DataMaturityDot, ForecastEmptyState, type DataMaturity } from "./DataMaturityBadge";

/* ══════════════════════════════════════════
   PROCUREMENT FORECAST CARDS
   Ready-to-fill card patterns for:
   - future demand
   - required stems/components
   - covered stems/components
   - remaining to buy
   - expected purchase price
   - expected procurement value
   ══════════════════════════════════════════ */

interface ForecastKPI {
  label: string;
  value?: string;
  unit?: string;
  maturity: DataMaturity;
  sublabel?: string;
}

/* ── Compact KPI Row ── */
export const ForecastKPIRow = ({ items }: { items: ForecastKPI[] }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
    {items.map((item) => (
      <div
        key={item.label}
        className={`p-3 rounded-xl border transition-all ${
          item.maturity === "live" ? "border-accent/20 bg-accent/5" :
          item.maturity === "partial" ? "border-yellow-500/15 bg-yellow-500/5" :
          item.maturity === "unresolved" ? "border-orange-500/15 bg-orange-500/5" :
          "border-border bg-muted/10"
        }`}
      >
        <div className="flex items-center gap-1.5 mb-1.5">
          <DataMaturityDot maturity={item.maturity} />
          <span className="text-[10px] font-medium text-foreground/50 truncate">{item.label}</span>
        </div>
        {item.value ? (
          <div className="text-base font-extrabold text-foreground leading-none font-mono">
            {item.value}
            {item.unit && <span className="text-[9px] font-normal text-muted-foreground/50 ml-0.5">{item.unit}</span>}
          </div>
        ) : (
          <div className="text-sm font-mono text-muted-foreground/30">—</div>
        )}
        {item.sublabel && (
          <div className="text-[9px] font-mono text-muted-foreground/40 mt-1">{item.sublabel}</div>
        )}
      </div>
    ))}
  </div>
);

/* ── Signal Metadata Section ── */
export const SignalMetadata = ({
  sources,
  lastUpdated,
  confidence,
}: {
  sources: { name: string; maturity: DataMaturity }[];
  lastUpdated?: string;
  confidence?: string;
}) => (
  <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-muted-foreground/50 mt-3 pt-3 border-t border-border/50">
    <span className="text-foreground/40 uppercase tracking-wider">Bronnen:</span>
    {sources.map((s) => (
      <span key={s.name} className="inline-flex items-center gap-1">
        <DataMaturityDot maturity={s.maturity} />
        {s.name}
      </span>
    ))}
    {lastUpdated && (
      <span className="text-muted-foreground/30">Laatst: {lastUpdated}</span>
    )}
    {confidence && (
      <span className="inline-flex items-center gap-1">
        <span className="text-muted-foreground/30">Betrouwbaarheid:</span>
        <span className="text-foreground/50 font-semibold">{confidence}</span>
      </span>
    )}
  </div>
);

/* ── Procurement Forecast Summary Card ── */
export const ProcurementForecastSummary = () => {
  const kpis: ForecastKPI[] = [
    { label: "Toekomstige vraag", maturity: "partial", sublabel: "Forecastbron gedeeltelijk" },
    { label: "Benodigde stelen", maturity: "partial", sublabel: "Afhankelijk van recepten" },
    { label: "Gedekte stelen", maturity: "missing", sublabel: "Supply data niet beschikbaar" },
    { label: "Nog in te kopen", maturity: "missing", sublabel: "Wacht op dekking + vraag" },
    { label: "Verw. inkoopprijs", maturity: "placeholder", sublabel: "Op basis van laatste offerte" },
    { label: "Verw. inkoopwaarde", maturity: "missing", sublabel: "Berekening incompleet" },
  ];

  return (
    <div className="space-y-3">
      <ForecastKPIRow items={kpis} />
      <SignalMetadata
        sources={[
          { name: "HBM Production", maturity: "live" },
          { name: "Picklist", maturity: "partial" },
          { name: "Recepten", maturity: "unresolved" },
          { name: "Supply Coverage", maturity: "missing" },
        ]}
      />
    </div>
  );
};

/* ── Demand Concentration Card (ready for per-customer data) ── */
export const DemandConcentrationCard = () => (
  <ForecastEmptyState
    title="Vraagconcentratie per klant/datum"
    message="Toekomstige vraag per klant en leverdatum wordt zichtbaar zodra de forecastbron volledig is aangesloten. Huidige data toont alleen geaggregeerde volumes."
    maturity="partial"
  />
);

/* ── Forecast Value Exposure Card ── */
export const ForecastValueExposure = () => {
  const kpis: ForecastKPI[] = [
    { label: "Verwachte inkoopwaarde", maturity: "partial", sublabel: "Gedeeltelijk berekend" },
    { label: "Ontbrekende prijsimpact", maturity: "unresolved", sublabel: "149 orders zonder prijs" },
    { label: "Forecast waarde exposure", maturity: "missing", sublabel: "Niet beschikbaar" },
  ];

  return (
    <div className="space-y-3">
      <ForecastKPIRow items={kpis} />
      <ForecastEmptyState
        message="Inkoopwaarde gedeeltelijk berekend — receptkoppelingen en actuele prijsdata zijn nodig voor een volledig beeld"
        maturity="partial"
      />
    </div>
  );
};

export default ProcurementForecastSummary;

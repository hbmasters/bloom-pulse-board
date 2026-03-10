import { Activity, Clock, Package, Ruler } from "lucide-react";
import IHSectionShell from "./IHSectionShell";
import { DependencyStatus, ForecastEmptyState } from "./DataMaturityBadge";
import { ProcurementForecastSummary } from "./ProcurementForecastCards";
import { UnresolvedRecipePanel } from "./UnresolvedRecipePanel";
import { StemLengthBreakdown } from "./StemLengthBreakdown";

/* ══════════════════════════════════════════
   FORECAST INTELLIGENCE SECTION
   For Intelligence Hub — shows:
   - Forecast system status & dependency readiness
   - Procurement forecast overview
   - Unresolved recipe blockers
   - Stem-length awareness
   ══════════════════════════════════════════ */

const IHForecastIntelligence = () => (
  <div className="space-y-6">
    {/* ── Forecast System Status ── */}
    <IHSectionShell
      icon={Activity}
      title="Forecast System Status"
      subtitle="Forecastbronnen & afhankelijkheden"
      badge="PREPARATION"
      badgeVariant="warning"
    >
      <div className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Dependency readiness */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">
              Bronstatus
            </h4>
            <DependencyStatus label="Orderdata (HBM)" maturity="live" detail="Real-time" />
            <DependencyStatus label="Picklijsten" maturity="live" detail="Dagelijks" />
            <DependencyStatus label="Receptkoppelingen" maturity="unresolved" detail="149 orders onopgelost" />
            <DependencyStatus label="Supply coverage" maturity="missing" detail="Nog niet aangesloten" />
            <DependencyStatus label="Actuele inkoopprijzen" maturity="partial" detail="Alleen laatste offerte" />
            <DependencyStatus label="Forecast model" maturity="partial" detail="V1 actief, V2 in ontwikkeling" />
          </div>

          {/* Future demand readiness */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">
              Forecast gereedheid
            </h4>
            <DependencyStatus label="Toekomstige vraag" maturity="partial" detail="Volumes beschikbaar, steelvraag deels" />
            <DependencyStatus label="Forecast betrouwbaarheid" maturity="placeholder" detail="Score op basis van historische data" />
            <DependencyStatus label="Vraag per klant/datum" maturity="partial" detail="Geaggregeerd beschikbaar" />
            <DependencyStatus label="Afwijking forecast vs actuals" maturity="missing" detail="Wacht op volledige koppeling" />
            <DependencyStatus label="Procurement exposure" maturity="missing" detail="Berekening niet mogelijk" />
            <DependencyStatus label="Confidence score" maturity="missing" detail="Nog niet beschikbaar" />
          </div>
        </div>
      </div>
    </IHSectionShell>

    {/* ── Procurement Forecast Overview ── */}
    <IHSectionShell
      icon={Package}
      title="Procurement Forecast Intelligence"
      subtitle="Inkoopprognose op basis van toekomstige vraag"
      badge="GEDEELTELIJK"
      badgeVariant="warning"
    >
      <ProcurementForecastSummary />
    </IHSectionShell>

    {/* ── Unresolved Recipes ── */}
    <IHSectionShell
      icon={Clock}
      title="Onopgeloste Recepten"
      subtitle="Toekomstige orders zonder receptkoppeling — primaire forecast blocker"
      badge="BLOCKER"
      badgeVariant="critical"
    >
      <UnresolvedRecipePanel />
    </IHSectionShell>

    {/* ── Stem Length Readiness ── */}
    <IHSectionShell
      icon={Ruler}
      title="Artikel × Lengte Intelligence"
      subtitle="Voorbereid op variant-specifieke inkoop per steellengte"
      badge="VOORBEREIDING"
      badgeVariant="default"
    >
      <StemLengthBreakdown />
    </IHSectionShell>
  </div>
);

export default IHForecastIntelligence;

import { Sparkles, TrendingUp, ArrowRight, Star, Zap, Filter } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import IHSectionShell from "@/components/intelligence-hub/IHSectionShell";
import IHMetricCard, { IHMetric } from "@/components/intelligence-hub/IHMetricCard";
import { MCHologramBackground } from "@/components/mission-control/MCHologramBackground";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DataStateWrapper } from "@/components/intelligence-hub/DataStateWrapper";
import { DepartmentBadge, DepartmentFilter, DeptAccentBorder, mapLegacyDept, type Department } from "@/components/department/DepartmentBadge";
import type { IntelligenceData } from "@/types/intelligence";

/* ── Opportunity Card ── */
interface OpportunityItem {
  product: string;
  score: "HIGH" | "MEDIUM" | "LOW";
  description: string;
  metrics?: { label: string; value: string }[];
  actions: string[];
}

const scoreStyle = {
  HIGH: { border: "border-accent/30", bg: "bg-accent/5", badge: "text-accent bg-accent/10 border-accent/20" },
  MEDIUM: { border: "border-primary/30", bg: "bg-primary/5", badge: "text-primary bg-primary/10 border-primary/20" },
  LOW: { border: "border-muted-foreground/30", bg: "bg-muted/10", badge: "text-muted-foreground bg-muted/20 border-border" },
};

const OpportunityCard = ({ item }: { item: OpportunityItem }) => {
  const s = scoreStyle[item.score];
  return (
    <div className={`rounded-xl border ${s.border} ${s.bg} p-4`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Star className={`w-3.5 h-3.5 ${item.score === "HIGH" ? "text-accent" : "text-primary"}`} />
            <span className="text-sm font-bold text-foreground">{item.product}</span>
            <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${s.badge}`}>{item.score}</span>
          </div>
          <p className="text-[11px] text-muted-foreground">{item.description}</p>
        </div>
      </div>
      {item.metrics && (
        <div className="flex gap-4 mb-3">
          {item.metrics.map((m) => (
            <div key={m.label} className="text-[10px]">
              <span className="text-muted-foreground/60">{m.label}: </span>
              <span className="font-mono font-bold text-foreground">{m.value}</span>
            </div>
          ))}
        </div>
      )}
      <div>
        <h4 className="text-[10px] font-bold text-foreground/60 uppercase tracking-wider mb-1.5">Aanbevolen acties</h4>
        <div className="space-y-1">
          {item.actions.map((a, i) => (
            <div key={i} className="flex items-start gap-1.5 text-[11px]">
              <ArrowRight className="w-3 h-3 mt-0.5 text-accent shrink-0" />
              <span className="text-foreground/80">{a}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ── Section Data (static fallback) ── */

const flowerCostMetrics: IHMetric[] = [
  { label: "Partijen onder verwachting", value: "5", status: "healthy", change: "+2 vs vorige week", changeDir: "up" },
  { label: "Gem. kostvoordeel", value: "−6.2", unit: "%", status: "healthy", sparkline: [3, 4, 5, 5.5, 6.2] },
  { label: "Potentiële besparing", value: "€4.8K", unit: "/week", status: "healthy" },
];

const flowerCostOpps: OpportunityItem[] = [
  {
    product: "Chrysant Baltica – Partij NL-2024-1205", score: "HIGH",
    description: "Partijprijs €0.068 vs verwacht €0.075 – 9.3% onder kostprijs",
    metrics: [{ label: "Partijprijs", value: "€0.068" }, { label: "Verwacht", value: "€0.075" }, { label: "Voordeel", value: "−9.3%" }],
    actions: ["Verhoog inkoopvolume voor deze partij", "Bevries prijs via contractextensie"],
  },
  {
    product: "Roos Avalanche 60cm – Partij KE-2024-0834", score: "MEDIUM",
    description: "Partijprijs 4.1% onder verwachting, goede kwaliteit",
    metrics: [{ label: "Partijprijs", value: "€0.091" }, { label: "Verwacht", value: "€0.095" }],
    actions: ["Overweeg extra bestelling", "Monitor kwaliteit over komende leveringen"],
  },
];

const prodEffMetrics: IHMetric[] = [
  { label: "Lijnen boven norm", value: "4/12", status: "healthy", change: "+1", changeDir: "up" },
  { label: "Beste lijn", value: "B3", status: "healthy", change: "350 st/u", changeDir: "up" },
  { label: "Potentiële output", value: "+6.2K", unit: "stelen/dag", status: "healthy" },
];

const prodEffOpps: OpportunityItem[] = [
  {
    product: "Lijn B3 – Band Afdeling", score: "HIGH",
    description: "350 st/p/u – 6% boven norm. Capaciteit beschikbaar voor extra orders.",
    metrics: [{ label: "Actueel", value: "350 st/u" }, { label: "Norm", value: "330 st/u" }, { label: "Surplus", value: "+6%" }],
    actions: ["Verschuif high-margin producten naar B3", "Verhoog productiecapaciteit toewijzing"],
  },
  {
    product: "Lijn H4 – Hand Afdeling", score: "HIGH",
    description: "230 st/p/u – consistent 5% boven norm",
    metrics: [{ label: "Actueel", value: "230 st/u" }, { label: "Norm", value: "220 st/u" }],
    actions: ["Analyseer best practices voor overdracht naar andere lijnen", "Plan complexere boeketten op H4"],
  },
];

const demandOpps: OpportunityItem[] = [
  {
    product: "BQ Elegance", score: "HIGH",
    description: "Orders 14% boven forecast – directe kans op extra omzet",
    metrics: [{ label: "Huidige marge", value: "24%" }, { label: "Target marge", value: "21%" }],
    actions: ["Verhoog productievolume", "Beveilig extra stelen", "Promoot naar retailprogramma"],
  },
  {
    product: "Tulpenboeket Premium", score: "MEDIUM",
    description: "Orders 8% boven forecast, marge gezond",
    metrics: [{ label: "Huidige marge", value: "23%" }, { label: "Forecast afwijking", value: "+8%" }],
    actions: ["Verleng contractvolume tulpen", "Overweeg weekendproductie"],
  },
];

const designOpps: OpportunityItem[] = [
  {
    product: "Boeket Charme XL", score: "MEDIUM",
    description: "Recept produceert 12% sneller dan vergelijkbare boeketten met lagere arbeidskosten",
    metrics: [{ label: "Arbeid/bos", value: "€0.028" }, { label: "Gem. categorie", value: "€0.034" }],
    actions: ["Gebruik als template voor nieuwe recepten", "Test variaties met vergelijkbare bloemen"],
  },
  {
    product: "Veldboeket Field M", score: "LOW",
    description: "Eenvoudig recept met hoog rendement – potentie voor schaalvergroting",
    actions: ["Analyseer of recept geschikt is voor bandproductie", "Bereken margewinst bij hogere volumes"],
  },
];

/* ── Action Engine (static fallback) ── */
interface ActionItem {
  action_title: string;
  department: "Procurement" | "Production" | "Sales" | "Design" | "Planning";
  priority: "High" | "Medium" | "Low";
  driver: string;
  flower?: string;
  recommended_action: string;
  expected_impact: string;
  constraints?: string;
  data_sources_used: string[];
}

const actionItems: ActionItem[] = [
  { action_title: "Secure flower supply", department: "Procurement", priority: "High", driver: "forecast_gap", flower: "Germini Franky", recommended_action: "Secure 45,000 stems before week 38", expected_impact: "+1.2% margin improvement", constraints: "Maintain orange color palette", data_sources_used: ["HBM Production", "Picklist", "Axerrio DW"] },
  { action_title: "Shift high-margin products to B3", department: "Production", priority: "High", driver: "production_efficiency", recommended_action: "Verplaats BQ Elegance en Charme XL naar lijn B3 (350 st/u)", expected_impact: "+€2.1K/week extra output", constraints: "B3 capaciteit max 8 uur/dag", data_sources_used: ["HBM Production"] },
  { action_title: "Increase price BQ Fleur", department: "Sales", priority: "High", driver: "margin_gap", flower: "BQ Fleur", recommended_action: "Verhoog verkoopprijs met €0.05 richting Vomar", expected_impact: "+0.8% marge-verbetering", data_sources_used: ["Axerrio DW", "Picklist"] },
  { action_title: "Optimize bouquet recipe", department: "Design", priority: "Medium", driver: "design_efficiency", flower: "Boeket Charme XL", recommended_action: "Vervang Alstroemeria door Chrysant – 18% snellere productie", expected_impact: "−€0.006 arbeid/bos", constraints: "Kleurpalet behouden", data_sources_used: ["Picklist", "HBM Production"] },
  { action_title: "Plan extra weekend shift", department: "Planning", priority: "Medium", driver: "demand_surge", recommended_action: "Plan zaterdagshift voor week 39 – orders 14% boven forecast", expected_impact: "+4.200 extra boeketten", constraints: "Personeelsbeschikbaarheid", data_sources_used: ["HBM Production", "Axerrio DW"] },
  { action_title: "Extend tulip contract volume", department: "Procurement", priority: "Medium", driver: "supply_risk", flower: "Tulp Premium Mix", recommended_action: "Verleng contractvolume met 20.000 stelen voor Q4", expected_impact: "Leveringszekerheid +15%", data_sources_used: ["Picklist", "Axerrio DW"] },
  { action_title: "Monitor rose quality", department: "Procurement", priority: "Low", driver: "quality_signal", flower: "Roos Avalanche 60cm", recommended_action: "Track uitval% komende 3 leveringen partij KE-2024-0834", expected_impact: "Preventie afkeur −2%", data_sources_used: ["HBM Production"] },
];

const allDepts: (Department | "All")[] = ["All", "Verkoop", "Inkoop", "Productie", "Administratie", "Financieel"];

const priorityOrder = { High: 0, Medium: 1, Low: 2 };
const priorityStyle = {
  High: "text-red-500 bg-red-500/10 border-red-500/20",
  Medium: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
  Low: "text-muted-foreground bg-muted/20 border-border",
};

interface Props {
  intelligence?: IntelligenceData;
}

const ChanceRadar = ({ intelligence }: Props) => {
  const [deptFilter, setDeptFilter] = useState<string>("All");
  const objectsState = intelligence?.objects.state ?? "complete";

  const filteredActions = actionItems
    .filter((a) => deptFilter === "All" || mapLegacyDept(a.department) === deptFilter)
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return (
    <div className="relative flex-1 min-h-0 overflow-hidden">
      <MCHologramBackground />
      <div className="absolute inset-0 z-10 overflow-y-auto overscroll-contain">
        <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto pb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-8 rounded-full bg-accent" />
            <div>
              <h1 className="text-lg md:text-xl font-black tracking-tight text-foreground uppercase">Chance Radar</h1>
              <p className="text-[11px] font-mono text-muted-foreground">
                Opportunity detection • Kosten · Productie · Vraag · Receptuur · Acties
                {objectsState === "partial" && (
                  <span className="text-yellow-500 ml-2">⚠ partial</span>
                )}
              </p>
            </div>
          </div>

          <DataStateWrapper state={objectsState} skeletonCount={2}>
            {/* 1. Flower Cost Advantage */}
            <IHSectionShell icon={Sparkles} title="Flower Cost Advantage" subtitle="Partijprijs < verwachte kostprijs" badge="5 PARTIJEN" badgeVariant="success">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                {flowerCostMetrics.map((m) => <IHMetricCard key={m.label} metric={m} />)}
              </div>
              <div className="space-y-3">
                {flowerCostOpps.map((o) => <OpportunityCard key={o.product} item={o} />)}
              </div>
            </IHSectionShell>

            {/* 2. Production Efficiency Opportunity */}
            <IHSectionShell icon={TrendingUp} title="Production Efficiency Opportunity" subtitle="APU of stelen/pers/uur boven verwachting" badge="4 LIJNEN" badgeVariant="success">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                {prodEffMetrics.map((m) => <IHMetricCard key={m.label} metric={m} />)}
              </div>
              <div className="space-y-3">
                {prodEffOpps.map((o) => <OpportunityCard key={o.product} item={o} />)}
              </div>
            </IHSectionShell>

            {/* 3. Demand Opportunity */}
            <IHSectionShell icon={TrendingUp} title="Demand Opportunity" subtitle="Orders > forecast levels" badge="2 PRODUCTEN" badgeVariant="success">
              <div className="space-y-3">
                {demandOpps.map((o) => <OpportunityCard key={o.product} item={o} />)}
              </div>
            </IHSectionShell>

            {/* 4. Design Efficiency Opportunity */}
            <IHSectionShell icon={Sparkles} title="Design Efficiency Opportunity" subtitle="Recepten met snellere productie of lagere arbeid" badge="ANALYSE">
              <div className="space-y-3">
                {designOpps.map((o) => <OpportunityCard key={o.product} item={o} />)}
              </div>
            </IHSectionShell>

            {/* 5. Action Engine */}
            <IHSectionShell icon={Zap} title="Action Engine" subtitle="Intelligence → Concrete operationele acties per afdeling" badge={`${filteredActions.length} ACTIES`} badgeVariant="success">
              <DepartmentFilter departments={allDepts} active={deptFilter} onChange={setDeptFilter} className="mb-4" />
              <div className="space-y-3">
                {filteredActions.map((action) => (
                  <div key={action.action_title} className={`rounded-xl border p-4 ${
                    action.priority === "High" ? "border-red-500/30 bg-red-500/5" :
                    action.priority === "Medium" ? "border-yellow-500/30 bg-yellow-500/5" :
                    "border-border bg-muted/10"
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Zap className={`w-3.5 h-3.5 ${action.priority === "High" ? "text-red-500" : "text-primary"}`} />
                        <span className="text-sm font-bold text-foreground">{action.action_title}</span>
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${priorityStyle[action.priority]}`}>
                          {action.priority.toUpperCase()}
                        </span>
                        <DepartmentBadge department={mapLegacyDept(action.department)} />
                      </div>
                    </div>
                    {action.flower && (
                      <div className="text-[10px] font-mono text-muted-foreground mb-2">
                        Bloem: <span className="text-foreground font-semibold">{action.flower}</span>
                        <span className="mx-2 text-border">|</span>
                        Driver: <span className="text-foreground font-semibold">{action.driver.replace(/_/g, " ")}</span>
                      </div>
                    )}
                    {!action.flower && (
                      <div className="text-[10px] font-mono text-muted-foreground mb-2">
                        Driver: <span className="text-foreground font-semibold">{action.driver.replace(/_/g, " ")}</span>
                      </div>
                    )}
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <h4 className="text-[10px] font-bold text-foreground/60 uppercase tracking-wider mb-1">Aanbevolen actie</h4>
                        <div className="flex items-start gap-1.5 text-[11px]">
                          <ArrowRight className="w-3 h-3 mt-0.5 text-accent shrink-0" />
                          <span className="text-foreground/80">{action.recommended_action}</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-[10px] font-bold text-foreground/60 uppercase tracking-wider mb-1">Verwacht effect</h4>
                        <span className="text-[11px] font-mono font-bold text-accent">{action.expected_impact}</span>
                        {action.constraints && (
                          <div className="mt-1 text-[10px] text-muted-foreground">
                            <span className="text-foreground/50">Constraint:</span> {action.constraints}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {action.data_sources_used.map((ds) => (
                        <Badge key={ds} variant="outline" className="text-[8px] font-mono px-1.5 py-0 h-4">{ds}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </IHSectionShell>
          </DataStateWrapper>
        </div>
      </div>
    </div>
  );
};

export default ChanceRadar;

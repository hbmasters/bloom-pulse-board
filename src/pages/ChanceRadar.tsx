import { Sparkles, TrendingUp, ArrowRight, Star } from "lucide-react";
import IHSectionShell from "@/components/intelligence-hub/IHSectionShell";
import IHMetricCard, { IHMetric } from "@/components/intelligence-hub/IHMetricCard";
import { MCHologramBackground } from "@/components/mission-control/MCHologramBackground";
import { ScrollArea } from "@/components/ui/scroll-area";

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

/* ── Section Data ── */

const flowerCostMetrics: IHMetric[] = [
  { label: "Partijen onder verwachting", value: "5", status: "healthy", change: "+2 vs vorige week", changeDir: "up" },
  { label: "Gem. kostvoordeel", value: "−6.2", unit: "%", status: "healthy", sparkline: [3, 4, 5, 5.5, 6.2] },
  { label: "Potentiële besparing", value: "€4.8K", unit: "/week", status: "healthy" },
];

const flowerCostOpps: OpportunityItem[] = [
  {
    product: "Chrysant Baltica – Partij NL-2024-1205",
    score: "HIGH",
    description: "Partijprijs €0.068 vs verwacht €0.075 – 9.3% onder kostprijs",
    metrics: [{ label: "Partijprijs", value: "€0.068" }, { label: "Verwacht", value: "€0.075" }, { label: "Voordeel", value: "−9.3%" }],
    actions: ["Verhoog inkoopvolume voor deze partij", "Bevries prijs via contractextensie"],
  },
  {
    product: "Roos Avalanche 60cm – Partij KE-2024-0834",
    score: "MEDIUM",
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
    product: "Lijn B3 – Band Afdeling",
    score: "HIGH",
    description: "350 st/p/u – 6% boven norm. Capaciteit beschikbaar voor extra orders.",
    metrics: [{ label: "Actueel", value: "350 st/u" }, { label: "Norm", value: "330 st/u" }, { label: "Surplus", value: "+6%" }],
    actions: ["Verschuif high-margin producten naar B3", "Verhoog productiecapaciteit toewijzing"],
  },
  {
    product: "Lijn H4 – Hand Afdeling",
    score: "HIGH",
    description: "230 st/p/u – consistent 5% boven norm",
    metrics: [{ label: "Actueel", value: "230 st/u" }, { label: "Norm", value: "220 st/u" }],
    actions: ["Analyseer best practices voor overdracht naar andere lijnen", "Plan complexere boeketten op H4"],
  },
];

const demandOpps: OpportunityItem[] = [
  {
    product: "BQ Elegance",
    score: "HIGH",
    description: "Orders 14% boven forecast – directe kans op extra omzet",
    metrics: [{ label: "Huidige marge", value: "24%" }, { label: "Target marge", value: "21%" }],
    actions: ["Verhoog productievolume", "Beveilig extra stelen", "Promoot naar retailprogramma"],
  },
  {
    product: "Tulpenboeket Premium",
    score: "MEDIUM",
    description: "Orders 8% boven forecast, marge gezond",
    metrics: [{ label: "Huidige marge", value: "23%" }, { label: "Forecast afwijking", value: "+8%" }],
    actions: ["Verleng contractvolume tulpen", "Overweeg weekendproductie"],
  },
];

const designOpps: OpportunityItem[] = [
  {
    product: "Boeket Charme XL",
    score: "MEDIUM",
    description: "Recept produceert 12% sneller dan vergelijkbare boeketten met lagere arbeidskosten",
    metrics: [{ label: "Arbeid/bos", value: "€0.028" }, { label: "Gem. categorie", value: "€0.034" }],
    actions: ["Gebruik als template voor nieuwe recepten", "Test variaties met vergelijkbare bloemen"],
  },
  {
    product: "Veldboeket Field M",
    score: "LOW",
    description: "Eenvoudig recept met hoog rendement – potentie voor schaalvergroting",
    actions: ["Analyseer of recept geschikt is voor bandproductie", "Bereken margewinst bij hogere volumes"],
  },
];

const ChanceRadar = () => (
  <div className="relative flex-1 min-h-0 overflow-hidden">
    <MCHologramBackground />
    <ScrollArea className="h-full relative z-10">
      <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-8 rounded-full bg-accent" />
          <div>
            <h1 className="text-lg md:text-xl font-black tracking-tight text-foreground uppercase">Chance Radar</h1>
            <p className="text-[11px] font-mono text-muted-foreground">Opportunity detection • Kosten · Productie · Vraag · Receptuur</p>
          </div>
        </div>

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
      </div>
    </ScrollArea>
  </div>
);

export default ChanceRadar;

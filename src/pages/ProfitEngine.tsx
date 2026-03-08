import { Banknote, TrendingUp, TrendingDown, ArrowRight, Star, AlertTriangle } from "lucide-react";
import IHSectionShell from "@/components/intelligence-hub/IHSectionShell";
import IHMetricCard, { IHMetric } from "@/components/intelligence-hub/IHMetricCard";
import { MCHologramBackground } from "@/components/mission-control/MCHologramBackground";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DataStateWrapper } from "@/components/intelligence-hub/DataStateWrapper";
import { DepartmentBadge, type Department } from "@/components/department/DepartmentBadge";
import type { IntelligenceData } from "@/types/intelligence";

/* ══════════════════════════════════════════
   1. PROFIT OVERVIEW
   ══════════════════════════════════════════ */

const overviewMetrics: IHMetric[] = [
  { label: "Totale omzet", value: "€2.4M", unit: "/P13", change: "+6.2%", changeDir: "up", status: "healthy", sparkline: [2.0, 2.1, 2.15, 2.25, 2.3, 2.4] },
  { label: "Gerealiseerde marge", value: "32.4", unit: "%", target: "35%", change: "−2.6pp", changeDir: "down", status: "warning", sparkline: [34, 33, 35, 32, 33, 31, 32] },
  { label: "Marge vs target", value: "−2.6", unit: "pp", status: "warning", change: "Gap stabiel", changeDir: "neutral" },
  { label: "Winstgevende producten", value: "28/36", status: "healthy", change: "78%", changeDir: "neutral" },
  { label: "Verliesgevende producten", value: "8", status: "critical", change: "+2 vs P12", changeDir: "up" },
  { label: "Winsttrend", value: "+4.1", unit: "%", status: "healthy", change: "vs vorige periode", changeDir: "up", sparkline: [1.2, 2.0, 2.8, 3.2, 3.8, 4.1] },
];

/* ══════════════════════════════════════════
   2. PROFIT BY PRODUCT
   ══════════════════════════════════════════ */

interface ProductProfit {
  product: string;
  desiredMargin: number;
  actualMargin: number;
  gap: number;
  revenue: string;
  cost: string;
  profit: string;
  status: "healthy" | "warning" | "critical";
  department?: Department;
}

const productProfits: ProductProfit[] = [
  { product: "BQ Elegance", desiredMargin: 21, actualMargin: 24.0, gap: 3.0, revenue: "€186K", cost: "€141K", profit: "€45K", status: "healthy", department: "Verkoop" },
  { product: "BQ Charme XL", desiredMargin: 22, actualMargin: 23.5, gap: 1.5, revenue: "€142K", cost: "€109K", profit: "€33K", status: "healthy", department: "Verkoop" },
  { product: "Tulpenboeket Premium", desiredMargin: 20, actualMargin: 21.2, gap: 1.2, revenue: "€98K", cost: "€77K", profit: "€21K", status: "healthy", department: "Verkoop" },
  { product: "AH Boeketje Zomer", desiredMargin: 22, actualMargin: 19.9, gap: -2.1, revenue: "€210K", cost: "€168K", profit: "€42K", status: "warning", department: "Verkoop" },
  { product: "Vomar Boeket Fleur", desiredMargin: 21, actualMargin: 16.6, gap: -4.4, revenue: "€165K", cost: "€138K", profit: "€27K", status: "critical", department: "Verkoop" },
  { product: "REWE Monat", desiredMargin: 23, actualMargin: 19.8, gap: -3.2, revenue: "€280K", cost: "€225K", profit: "€55K", status: "critical", department: "Verkoop" },
  { product: "Jumbo Veldboeket", desiredMargin: 20, actualMargin: 18.5, gap: -1.5, revenue: "€120K", cost: "€98K", profit: "€22K", status: "warning", department: "Verkoop" },
  { product: "Lidl Aktie Bos", desiredMargin: 18, actualMargin: 17.2, gap: -0.8, revenue: "€95K", cost: "€79K", profit: "€16K", status: "warning", department: "Verkoop" },
];

/* ══════════════════════════════════════════
   3. PROFIT DRIVERS
   ══════════════════════════════════════════ */

interface DriverItem {
  product: string;
  totalGap: string;
  procurement: string;
  production: string;
  sales: string;
}

const drivers: DriverItem[] = [
  { product: "Vomar Boeket Fleur", totalGap: "−4.4pp", procurement: "−1.6pp", production: "−1.8pp", sales: "−1.0pp" },
  { product: "REWE Monat", totalGap: "−3.2pp", procurement: "−1.4pp", production: "−0.9pp", sales: "−0.9pp" },
  { product: "AH Boeketje Zomer", totalGap: "−2.1pp", procurement: "−0.8pp", production: "−1.3pp", sales: "0.0pp" },
  { product: "Jumbo Veldboeket", totalGap: "−1.5pp", procurement: "−0.6pp", production: "−0.4pp", sales: "−0.5pp" },
  { product: "Lidl Aktie Bos", totalGap: "−0.8pp", procurement: "−0.3pp", production: "−0.5pp", sales: "0.0pp" },
];

/* ══════════════════════════════════════════
   4. SCALING OPPORTUNITIES
   ══════════════════════════════════════════ */

interface ScaleOpp {
  product: string;
  margin: number;
  target: number;
  opportunity: string;
  impact: string;
}

const scaleOpps: ScaleOpp[] = [
  { product: "BQ Elegance", margin: 24, target: 21, opportunity: "Verhoog productie + retail distributie", impact: "+€120K jaarwinst" },
  { product: "BQ Charme XL", margin: 23.5, target: 22, opportunity: "Uitbreiden naar Jumbo programma", impact: "+€85K jaarwinst" },
  { product: "Tulpenboeket Premium", margin: 21.2, target: 20, opportunity: "Seizoensverlenging + extra volume", impact: "+€45K jaarwinst" },
];

/* ══════════════════════════════════════════
   5. PROFIT LEAKAGE
   ══════════════════════════════════════════ */

interface LeakItem {
  product: string;
  gap: string;
  causes: string[];
  actions: string[];
  annualLoss: string;
}

const leaks: LeakItem[] = [
  {
    product: "REWE Monat", gap: "−3.2%",
    causes: ["Bloemprijs stijging +8% (Kenya rozen)", "Productie lijn H3 onder norm (195 st/u)"],
    actions: ["Heronderhandel leveranciersprijs", "Plan H3 onderhoud", "Evalueer receptaanpassing"],
    annualLoss: "€89K",
  },
  {
    product: "Vomar Boeket Fleur", gap: "−4.4%",
    causes: ["Chrysant partijprijs +12%", "Forecast mismatch −18%", "Verkoopprijs niet aangepast"],
    actions: ["Beveilig contractvolume chrysant", "Verhoog verkoopprijs €0.05", "Verschuif naar lijn B2"],
    annualLoss: "€73K",
  },
  {
    product: "Jumbo Veldboeket", gap: "−1.5%",
    causes: ["Inpak wachttijd boven norm", "Verpakkingskosten gestegen"],
    actions: ["Optimaliseer inpakflow", "Onderhandel verpakkingsprijs"],
    annualLoss: "€18K",
  },
];

/* ══════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════ */

const gapColor = (g: number) => g >= 0 ? "text-accent" : g >= -2 ? "text-yellow-500" : "text-red-500";
const statusDot = (s: string) => s === "healthy" ? "bg-accent" : s === "warning" ? "bg-yellow-500" : "bg-red-500";

/* ══════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════ */

interface Props {
  intelligence?: IntelligenceData;
}

const ProfitEngine = ({ intelligence }: Props) => {
  const objectsState = intelligence?.objects.state ?? "complete";

  return (
    <div className="relative flex-1 min-h-0 overflow-hidden">
      <MCHologramBackground />
      <ScrollArea className="h-full relative z-10">
        <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto">

          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-8 rounded-full bg-gradient-brand" />
            <div>
              <h1 className="text-lg md:text-xl font-black tracking-tight text-foreground uppercase">Profit Engine</h1>
              <p className="text-[11px] font-mono text-muted-foreground">
                Financial decision layer • Waar verdienen we, waar lekken we, waar schalen we
                {objectsState === "partial" && (
                  <span className="text-yellow-500 ml-2">⚠ partial</span>
                )}
              </p>
            </div>
          </div>

          <DataStateWrapper state={objectsState} skeletonCount={2}>
            {/* 1 ── Profit Overview */}
            <IHSectionShell icon={Banknote} title="Profit Overview" subtitle="Financieel overzicht • Periode 13" badge="LIVE" badgeVariant="success">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {overviewMetrics.map((m) => <IHMetricCard key={m.label} metric={m} />)}
              </div>
            </IHSectionShell>

            {/* 2 ── Profit by Product */}
            <IHSectionShell icon={Banknote} title="Profit by Product" subtitle="Product-niveau winstgevendheid" badge={`${productProfits.filter(p => p.gap < 0).length} ONDER TARGET`} badgeVariant="warning">
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="grid grid-cols-8 text-[10px] text-muted-foreground/50 font-mono px-3 py-2 bg-muted/20 border-b border-border">
                  <span className="col-span-2">Product</span><span>Afd.</span><span>Target</span><span>Actueel</span><span>Gap</span><span>Omzet</span><span>Winst</span>
                </div>
                {productProfits.map((p) => (
                  <div key={p.product} className="grid grid-cols-8 text-[11px] px-3 py-2.5 border-b border-border/50 last:border-0 hover:bg-muted/10 transition-colors items-center">
                    <span className="col-span-2 flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${statusDot(p.status)}`} />
                      <span className="font-medium text-foreground truncate">{p.product}</span>
                    </span>
                    <span>{p.department && <DepartmentBadge department={p.department} showIcon={false} />}</span>
                    <span className="text-muted-foreground font-mono">{p.desiredMargin}%</span>
                    <span className={`font-mono font-semibold ${gapColor(p.gap)}`}>{p.actualMargin}%</span>
                    <span className={`font-mono font-bold ${gapColor(p.gap)}`}>{p.gap >= 0 ? "+" : ""}{p.gap}pp</span>
                    <span className="text-foreground/70 font-mono">{p.revenue}</span>
                    <span className="text-foreground font-mono font-semibold">{p.profit}</span>
                  </div>
                ))}
              </div>
            </IHSectionShell>

            {/* 3 ── Profit Drivers */}
            <IHSectionShell icon={TrendingDown} title="Profit Drivers" subtitle="margin_gap = procurement_loss + production_loss + sales_loss" badge="DRIVER MODEL">
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="grid grid-cols-5 text-[10px] text-muted-foreground/50 font-mono px-3 py-2 bg-muted/20 border-b border-border">
                  <span>Product</span><span>Total Gap</span><span>Inkoop</span><span>Productie</span><span>Sales</span>
                </div>
                {drivers.map((d) => (
                  <div key={d.product} className="grid grid-cols-5 text-[11px] px-3 py-2.5 border-b border-border/50 last:border-0 hover:bg-muted/10 transition-colors">
                    <span className="font-medium text-foreground truncate">{d.product}</span>
                    <span className="font-mono font-bold text-red-500">{d.totalGap}</span>
                    <span className="font-mono text-red-400">{d.procurement}</span>
                    <span className="font-mono text-red-400">{d.production}</span>
                    <span className={`font-mono ${d.sales === "0.0pp" ? "text-muted-foreground/40" : "text-red-400"}`}>{d.sales}</span>
                  </div>
                ))}
              </div>
              {/* Stacked bar visual */}
              <div className="mt-4 space-y-2">
                <h4 className="text-[10px] font-bold text-foreground/60 uppercase tracking-wider">Gap verdeling per driver</h4>
                {drivers.slice(0, 3).map((d) => {
                  const total = Math.abs(parseFloat(d.totalGap));
                  const pInk = (Math.abs(parseFloat(d.procurement)) / total) * 100;
                  const pProd = (Math.abs(parseFloat(d.production)) / total) * 100;
                  const pSal = (Math.abs(parseFloat(d.sales)) / total) * 100;
                  return (
                    <div key={d.product}>
                      <div className="text-[10px] text-foreground/60 mb-1">{d.product} <span className="text-red-500 font-mono font-bold">{d.totalGap}</span></div>
                      <div className="flex h-3 rounded-full overflow-hidden">
                        <div className="transition-all" style={{ width: `${pInk}%`, backgroundColor: `hsl(var(--dept-inkoop))` }} />
                        <div className="transition-all" style={{ width: `${pProd}%`, backgroundColor: `hsl(var(--dept-productie))` }} />
                        <div className="transition-all" style={{ width: `${pSal}%`, backgroundColor: `hsl(var(--dept-verkoop))` }} />
                      </div>
                    </div>
                  );
                })}
                <div className="flex gap-4 mt-1">
                  <div className="flex items-center gap-1.5"><DepartmentBadge department="Inkoop" size="sm" /></div>
                  <div className="flex items-center gap-1.5"><DepartmentBadge department="Productie" size="sm" /></div>
                  <div className="flex items-center gap-1.5"><DepartmentBadge department="Verkoop" size="sm" /></div>
                </div>
              </div>
            </IHSectionShell>

            {/* 4 ── Scaling Opportunities */}
            <IHSectionShell icon={TrendingUp} title="Scaling Opportunities" subtitle="Producten met marge boven target – klaar om te schalen" badge={`${scaleOpps.length} KANSEN`} badgeVariant="success">
              <div className="space-y-3">
                {scaleOpps.map((o) => (
                  <div key={o.product} className="rounded-xl border border-accent/30 bg-accent/5 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-3.5 h-3.5 text-accent" />
                      <span className="text-sm font-bold text-foreground">{o.product}</span>
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border text-accent bg-accent/10 border-accent/20">HIGH</span>
                    </div>
                    <div className="flex gap-4 mb-3 text-[10px]">
                      <span><span className="text-muted-foreground/60">Marge: </span><span className="font-mono font-bold text-accent">{o.margin}%</span></span>
                      <span><span className="text-muted-foreground/60">Target: </span><span className="font-mono text-foreground">{o.target}%</span></span>
                      <span><span className="text-muted-foreground/60">Impact: </span><span className="font-mono font-bold text-accent">{o.impact}</span></span>
                    </div>
                    <div className="flex items-start gap-1.5 text-[11px]">
                      <ArrowRight className="w-3 h-3 mt-0.5 text-accent shrink-0" />
                      <span className="text-foreground/80">{o.opportunity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </IHSectionShell>

            {/* 5 ── Profit Leakage */}
            <IHSectionShell icon={AlertTriangle} title="Profit Leakage" subtitle="Waar gaat marge verloren – oorzaken & acties" badge={`€${leaks.reduce((a, l) => a + parseInt(l.annualLoss.replace(/[€K]/g, "")), 0)}K JAARLIJKS`} badgeVariant="critical">
              <div className="space-y-4">
                {leaks.map((l) => (
                  <div key={l.product} className="rounded-xl border border-red-500/30 bg-red-500/5 p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                          <span className="text-sm font-bold text-foreground">{l.product}</span>
                          <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border text-red-500 bg-red-500/10 border-red-500/20">LEAKAGE</span>
                        </div>
                        <div className="flex gap-3 text-[10px]">
                          <span>Marge gap: <span className="font-mono font-bold text-red-500">{l.gap}</span></span>
                          <span>Jaarlijks verlies: <span className="font-mono font-bold text-red-500">{l.annualLoss}</span></span>
                        </div>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <h4 className="text-[10px] font-bold text-foreground/60 uppercase tracking-wider mb-1.5">Oorzaken</h4>
                        <div className="space-y-1">
                          {l.causes.map((c, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-[11px]">
                              <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                              <span className="text-foreground/70">{c}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-[10px] font-bold text-foreground/60 uppercase tracking-wider mb-1.5">Aanbevolen acties</h4>
                        <div className="space-y-1">
                          {l.actions.map((a, i) => (
                            <div key={i} className="flex items-start gap-1.5 text-[11px]">
                              <ArrowRight className="w-3 h-3 mt-0.5 text-primary shrink-0" />
                              <span className="text-foreground/80">{a}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </IHSectionShell>
          </DataStateWrapper>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ProfitEngine;

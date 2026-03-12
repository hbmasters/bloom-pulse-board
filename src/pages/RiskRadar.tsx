import { Shield, AlertTriangle, TrendingDown, Package } from "lucide-react";
import IHSectionShell from "@/components/intelligence-hub/IHSectionShell";
import IHMetricCard, { IHMetric } from "@/components/intelligence-hub/IHMetricCard";
import { MCHologramBackground } from "@/components/mission-control/MCHologramBackground";

import { DataStateWrapper } from "@/components/intelligence-hub/DataStateWrapper";
import { DepartmentBadge, SubdepartmentChip, type Department, type ProductionSub } from "@/components/department/DepartmentBadge";
import { DependencyStatus } from "@/components/intelligence-hub/DataMaturityBadge";
import type { IntelligenceData } from "@/types/intelligence";

/* ── Structured Risk Row ── */
interface RiskRow {
  product: string;
  week: string;
  contract: string;
  forecast: string;
  gap: string;
  riskLevel: "HIGH" | "MEDIUM" | "LOW";
  department?: Department;
  subdepartment?: ProductionSub;
}

const riskLevelStyle = {
  HIGH: { border: "border-red-500/30", bg: "bg-red-500/5", badge: "text-red-500 bg-red-500/10 border-red-500/20" },
  MEDIUM: { border: "border-yellow-500/30", bg: "bg-yellow-500/5", badge: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20" },
  LOW: { border: "border-accent/30", bg: "bg-accent/5", badge: "text-accent bg-accent/10 border-accent/20" },
};

const RiskRow = ({ item }: { item: RiskRow }) => {
  const s = riskLevelStyle[item.riskLevel];
  return (
    <div className={`grid grid-cols-[1.2fr_0.5fr_0.6fr_0.6fr_0.6fr_0.4fr] items-center gap-2 px-3 py-2.5 rounded-lg border ${s.border} ${s.bg} text-[12px]`}>
      <div className="flex items-center gap-2">
        <AlertTriangle className={`w-3.5 h-3.5 shrink-0 ${item.riskLevel === "HIGH" ? "text-red-500" : item.riskLevel === "MEDIUM" ? "text-yellow-500" : "text-accent"}`} />
        <span className="font-bold text-foreground truncate">{item.product}</span>
        {item.department && <DepartmentBadge department={item.department} size="sm" />}
      </div>
      <span className="font-mono text-foreground/70">{item.week}</span>
      <span className="font-mono text-foreground/70">{item.contract}</span>
      <span className="font-mono text-foreground/70">{item.forecast}</span>
      <span className={`font-mono font-bold ${item.riskLevel === "HIGH" ? "text-red-500" : "text-yellow-500"}`}>{item.gap}</span>
      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${s.badge} text-center`}>{item.riskLevel}</span>
    </div>
  );
};

/* ── Section Data ── */

const supplyMetrics: IHMetric[] = [
  { label: "Supply gap totaal", value: "−42K", unit: "stelen", status: "critical", change: "Groeiend", changeDir: "down" },
  { label: "Kritieke bloemen", value: "3", status: "critical", change: "+1 vs vorige week", changeDir: "up" },
  { label: "Dekking %", value: "88", unit: "%", target: "95%", status: "warning", sparkline: [92, 91, 90, 89, 88] },
];

const supplyRisks: RiskRow[] = [
  { product: "Chrysant Ringa Yellow", week: "Wk 32", contract: "90K", forecast: "120K", gap: "−30K", riskLevel: "HIGH", department: "Inkoop" },
  { product: "Lisianthus Rosita White", week: "Wk 33", contract: "25K", forecast: "32K", gap: "−7K", riskLevel: "HIGH", department: "Inkoop" },
  { product: "Chrysant Baltica", week: "Wk 32", contract: "50K", forecast: "55K", gap: "−5K", riskLevel: "MEDIUM", department: "Inkoop" },
  { product: "Tulp Strong Gold", week: "Wk 34", contract: "58K", forecast: "60K", gap: "−2K", riskLevel: "LOW", department: "Inkoop" },
];

const marginMetrics: IHMetric[] = [
  { label: "Producten onder target", value: "4", status: "critical", change: "+1", changeDir: "up" },
  { label: "Gem. marge gap", value: "−2.8", unit: "pp", status: "warning", sparkline: [1.5, 2.0, 2.2, 2.5, 2.8] },
  { label: "Risico omzet", value: "€28K", unit: "/week", status: "warning" },
];

const marginRisks: RiskRow[] = [
  { product: "Vomar Boeket Fleur", week: "Wk 32", contract: "€18K", forecast: "€21K target", gap: "−4.4pp", riskLevel: "HIGH", department: "Financieel" },
  { product: "AH Boeketje Zomer", week: "Wk 33", contract: "€12K", forecast: "€14K target", gap: "−2.1pp", riskLevel: "MEDIUM", department: "Financieel" },
];

const productionRisks: RiskRow[] = [
  { product: "Lijn H3 – Hand", week: "Vandaag", contract: "220 st/u norm", forecast: "195 st/u actueel", gap: "−11%", riskLevel: "HIGH", department: "Productie" },
  { product: "Lijn B5 – Band", week: "Vandaag", contract: "330 st/u norm", forecast: "290 st/u actueel", gap: "−12%", riskLevel: "HIGH", department: "Productie" },
];

const forecastRisks: RiskRow[] = [
  { product: "Moederdag programma", week: "Wk 19-20", contract: "Plan 5K", forecast: "Orders 6K", gap: "+18%", riskLevel: "MEDIUM", department: "Verkoop" },
  { product: "Gerbera seizoen", week: "Wk 32", contract: "40K plan", forecast: "65K orders", gap: "+25K", riskLevel: "HIGH", department: "Inkoop" },
];

interface Props {
  intelligence?: IntelligenceData;
}

const RiskRadar = ({ intelligence }: Props) => {
  const objectsState = intelligence?.objects.state ?? "complete";

  return (
    <div className="relative min-h-0">
      <MCHologramBackground />
      <div className="relative z-10">
        <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto pb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-8 rounded-full bg-red-500" />
            <div>
              <h1 className="text-lg md:text-xl font-black tracking-tight text-foreground uppercase">Risk Radar</h1>
              <p className="text-[11px] font-mono text-muted-foreground">
                Product × Week × Contract × Forecast × Gap
                {objectsState === "partial" && (
                  <span className="text-yellow-500 ml-2">⚠ partial</span>
                )}
              </p>
            </div>
          </div>

          {/* Table header for all risk sections */}
          <div className="hidden md:grid grid-cols-[1.2fr_0.5fr_0.6fr_0.6fr_0.6fr_0.4fr] text-[10px] text-muted-foreground/40 font-mono px-3 py-1.5 gap-2">
            <span>Product</span><span>Week</span><span>Contract</span><span>Forecast</span><span>Gap</span><span>Level</span>
          </div>

          <DataStateWrapper state={objectsState} skeletonCount={2}>
            {/* 1. Supply Risk */}
            <IHSectionShell icon={Shield} title="Supply Risk" subtitle="Contract vs forecast gap" badge={`${supplyRisks.length} ALERTS`} badgeVariant="critical">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                {supplyMetrics.map((m) => <IHMetricCard key={m.label} metric={m} />)}
              </div>
              <div className="space-y-2">
                {supplyRisks.map((r) => <RiskRow key={r.product} item={r} />)}
              </div>
            </IHSectionShell>

            {/* 2. Margin Risk */}
            <IHSectionShell icon={TrendingDown} title="Margin Risk" subtitle="Marge onder target" badge={`${marginRisks.length} PRODUCTEN`} badgeVariant="warning">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                {marginMetrics.map((m) => <IHMetricCard key={m.label} metric={m} />)}
              </div>
              <div className="space-y-2">
                {marginRisks.map((r) => <RiskRow key={r.product} item={r} />)}
              </div>
            </IHSectionShell>

            {/* 3. Production Risk */}
            <IHSectionShell icon={Shield} title="Production Risk" subtitle="Lijnprestatie onder norm" badge={`${productionRisks.length} LIJNEN`} badgeVariant="critical">
              <div className="space-y-2">
                {productionRisks.map((r) => <RiskRow key={r.product} item={r} />)}
              </div>
            </IHSectionShell>

            {/* 4. Forecast Risk */}
            <IHSectionShell icon={Package} title="Forecast Risk" subtitle="Afwijkingen forecast vs orders" badge="MONITOR" badgeVariant="warning">
              <div className="space-y-2">
                {forecastRisks.map((r) => <RiskRow key={r.product} item={r} />)}
              </div>
            </IHSectionShell>

            {/* Dependency status */}
            <div className="rounded-lg border border-border bg-muted/10 p-3 space-y-2">
              <h4 className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider">Afhankelijkheden</h4>
              <DependencyStatus label="Receptkoppelingen" maturity="unresolved" detail="149 orders" />
              <DependencyStatus label="Supply coverage" maturity="missing" />
              <DependencyStatus label="Inkoopprijzen" maturity="partial" detail="Alleen offerte" />
            </div>
          </DataStateWrapper>
        </div>
      </div>
    </div>
  );
};

export default RiskRadar;

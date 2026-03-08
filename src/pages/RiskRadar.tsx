import { Shield, AlertTriangle, TrendingDown, ArrowRight } from "lucide-react";
import IHSectionShell from "@/components/intelligence-hub/IHSectionShell";
import IHMetricCard, { IHMetric } from "@/components/intelligence-hub/IHMetricCard";
import { MCHologramBackground } from "@/components/mission-control/MCHologramBackground";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DepartmentBadge, SubdepartmentChip, DeptAccentBorder, type Department, type ProductionSub } from "@/components/department/DepartmentBadge";

/* ── Risk Item Card ── */
interface RiskItem {
  product: string;
  riskLevel: "HIGH" | "MEDIUM" | "LOW";
  description: string;
  rootCauses: string[];
  actions: string[];
  metrics?: { label: string; value: string }[];
  department?: Department;
  subdepartment?: ProductionSub;
}

const riskLevelStyle = {
  HIGH: { border: "border-red-500/30", bg: "bg-red-500/5", badge: "text-red-500 bg-red-500/10 border-red-500/20" },
  MEDIUM: { border: "border-yellow-500/30", bg: "bg-yellow-500/5", badge: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20" },
  LOW: { border: "border-accent/30", bg: "bg-accent/5", badge: "text-accent bg-accent/10 border-accent/20" },
};

const RiskCard = ({ item }: { item: RiskItem }) => {
  const s = riskLevelStyle[item.riskLevel];
  return (
    <div className={`rounded-xl border ${s.border} ${s.bg} p-4`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className={`w-3.5 h-3.5 ${item.riskLevel === "HIGH" ? "text-red-500" : item.riskLevel === "MEDIUM" ? "text-yellow-500" : "text-accent"}`} />
            <span className="text-sm font-bold text-foreground">{item.product}</span>
            <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${s.badge}`}>{item.riskLevel}</span>
            {item.department && <DepartmentBadge department={item.department} />}
            {item.subdepartment && <SubdepartmentChip sub={item.subdepartment} />}
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
      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <h4 className="text-[10px] font-bold text-foreground/60 uppercase tracking-wider mb-1.5">Root Causes</h4>
          <div className="space-y-1">
            {item.rootCauses.map((rc, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[11px]">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                <span className="text-foreground/70">{rc}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-[10px] font-bold text-foreground/60 uppercase tracking-wider mb-1.5">Aanbevolen acties</h4>
          <div className="space-y-1">
            {item.actions.map((a, i) => (
              <div key={i} className="flex items-start gap-1.5 text-[11px]">
                <ArrowRight className="w-3 h-3 mt-0.5 text-primary shrink-0" />
                <span className="text-foreground/80">{a}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Section Data ── */

const supplyMetrics: IHMetric[] = [
  { label: "Supply gap totaal", value: "−42K", unit: "stelen", status: "critical", change: "Groeiend", changeDir: "down" },
  { label: "Kritieke bloemen", value: "3", status: "critical", change: "+1 vs vorige week", changeDir: "up" },
  { label: "Dekking %", value: "88", unit: "%", target: "95%", status: "warning", sparkline: [92, 91, 90, 89, 88] },
];

const supplyRisks: RiskItem[] = [
  {
    product: "Chrysant Ringa Yellow",
    riskLevel: "HIGH",
    description: "Contracted volume dekt slechts 75% van forecast",
    department: "Inkoop",
    metrics: [{ label: "Benodigd", value: "120K" }, { label: "Contract", value: "90K" }, { label: "Gap", value: "−30K" }],
    rootCauses: ["Leverancier Kenya Direct levert 15% minder", "Seizoenspiek niet afgedekt in contract"],
    actions: ["Reserveer 30K stelen bij Flora Holland Pool", "Onderhandel spoedlevering Kenya Direct"],
  },
  {
    product: "Lisianthus Rosita White",
    riskLevel: "HIGH",
    description: "Supply gap van 7K stelen bij stijgende vraag",
    department: "Inkoop",
    metrics: [{ label: "Benodigd", value: "32K" }, { label: "Contract", value: "25K" }, { label: "Gap", value: "−7K" }],
    rootCauses: ["Beperkt aanbod dit seizoen", "Slechts 1 leverancier"],
    actions: ["Zoek alternatieve leverancier", "Overweeg receptaanpassing"],
  },
];

const marginMetrics: IHMetric[] = [
  { label: "Producten onder target", value: "4", status: "critical", change: "+1", changeDir: "up" },
  { label: "Gem. marge gap", value: "−2.8", unit: "pp", status: "warning", sparkline: [1.5, 2.0, 2.2, 2.5, 2.8] },
  { label: "Risico omzet", value: "€28K", unit: "/week", status: "warning" },
];

const marginRisks: RiskItem[] = [
  {
    product: "Vomar Boeket Fleur",
    riskLevel: "HIGH",
    description: "Verwachte marge 4.4pp onder target",
    department: "Financieel",
    metrics: [{ label: "Verwacht", value: "18%" }, { label: "Target", value: "21%" }],
    rootCauses: ["Bloemprijs stijging +9.3%", "Forecast mismatch −12%"],
    actions: ["Beveilig leverancierscontracten", "Pas boeketsamenstelling aan"],
  },
  {
    product: "AH Boeketje Zomer",
    riskLevel: "MEDIUM",
    description: "Marge gap van 2.1pp door productiekosten",
    department: "Financieel",
    metrics: [{ label: "Verwacht", value: "19.9%" }, { label: "Target", value: "22%" }],
    rootCauses: ["Lijn H3 presteert 13% onder norm", "Hogere chrysantprijzen"],
    actions: ["Plan H3 onderhoud", "Wissel chrysant leverancier"],
  },
];

const procurementRisks: RiskItem[] = [
  {
    product: "Kenya Rozen partij K-2024-0892",
    riskLevel: "MEDIUM",
    description: "Partijprijs 12% boven offerte, leverancier instabiel",
    rootCauses: ["Transportkosten gestegen", "Wisselkoers KES/EUR ongunstig"],
    actions: ["Heronderhandel prijs", "Activeer backup leverancier"],
  },
];

const productionRisks: RiskItem[] = [
  {
    product: "Lijn H3 – Hand Afdeling",
    riskLevel: "HIGH",
    description: "195 st/p/u – 11% onder norm van 220",
    metrics: [{ label: "Actueel", value: "195 st/u" }, { label: "Norm", value: "220 st/u" }],
    rootCauses: ["Mechanisch probleem transportband", "2 nieuwe medewerkers in opleiding"],
    actions: ["Plan technisch onderhoud", "Herverdeel ervaren personeel"],
  },
  {
    product: "Lijn B5 – Band Afdeling",
    riskLevel: "HIGH",
    description: "290 st/p/u – 12% onder norm van 330",
    metrics: [{ label: "Actueel", value: "290 st/u" }, { label: "Norm", value: "330 st/u" }],
    rootCauses: ["Sensor kalibratie nodig", "Orderwissel te frequent"],
    actions: ["Kalibreer sensoren", "Optimaliseer orderplanning"],
  },
];

const forecastRisks: RiskItem[] = [
  {
    product: "Moederdag programma",
    riskLevel: "MEDIUM",
    description: "Forecast wijkt 18% af van binnenkomende orders",
    rootCauses: ["Retail forecast te optimistisch", "Markttrend lager dan verwacht"],
    actions: ["Herbereken forecast met actuele orderdata", "Verlaag productiecapaciteit reservering"],
  },
];

const RiskRadar = () => (
  <div className="relative flex-1 min-h-0 overflow-hidden">
    <MCHologramBackground />
    <ScrollArea className="h-full relative z-10">
      <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-8 rounded-full bg-red-500" />
          <div>
            <h1 className="text-lg md:text-xl font-black tracking-tight text-foreground uppercase">Risk Radar</h1>
            <p className="text-[11px] font-mono text-muted-foreground">Predictive risk detection • Supply · Margin · Procurement · Production · Forecast</p>
          </div>
        </div>

        {/* 1. Supply Risk */}
        <IHSectionShell icon={Shield} title="Supply Risk" subtitle="forecast × stems vs contracted volume" badge="3 ALERTS" badgeVariant="critical">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
            {supplyMetrics.map((m) => <IHMetricCard key={m.label} metric={m} />)}
          </div>
          <div className="space-y-3">
            {supplyRisks.map((r) => <RiskCard key={r.product} item={r} />)}
          </div>
        </IHSectionShell>

        {/* 2. Margin Risk */}
        <IHSectionShell icon={TrendingDown} title="Margin Risk" subtitle="expected_margin < desired_margin" badge="4 PRODUCTEN" badgeVariant="warning">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
            {marginMetrics.map((m) => <IHMetricCard key={m.label} metric={m} />)}
          </div>
          <div className="space-y-3">
            {marginRisks.map((r) => <RiskCard key={r.product} item={r} />)}
          </div>
        </IHSectionShell>

        {/* 3. Procurement Risk */}
        <IHSectionShell icon={Shield} title="Procurement Risk" subtitle="Prijsstijgingen & leveranciers instabiliteit" badge="1 ALERT" badgeVariant="warning">
          <div className="space-y-3">
            {procurementRisks.map((r) => <RiskCard key={r.product} item={r} />)}
          </div>
        </IHSectionShell>

        {/* 4. Production Risk */}
        <IHSectionShell icon={Shield} title="Production Risk" subtitle="Inefficiënte lijnen & capaciteitstekorten" badge="2 LIJNEN" badgeVariant="critical">
          <div className="space-y-3">
            {productionRisks.map((r) => <RiskCard key={r.product} item={r} />)}
          </div>
        </IHSectionShell>

        {/* 5. Forecast Risk */}
        <IHSectionShell icon={Shield} title="Forecast Risk" subtitle="Afwijkingen forecast vs inkomende orders" badge="MONITOR" badgeVariant="warning">
          <div className="space-y-3">
            {forecastRisks.map((r) => <RiskCard key={r.product} item={r} />)}
          </div>
        </IHSectionShell>
      </div>
    </ScrollArea>
  </div>
);

export default RiskRadar;

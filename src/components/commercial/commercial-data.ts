import {
  DollarSign, TrendingUp, Percent, ShieldAlert, AlertTriangle,
  Star, LineChart, Activity
} from "lucide-react";

/* ── Types ── */
export type MarginStatus = "above" | "on-target" | "below" | "critical";
export type RiskLevel = "none" | "low" | "medium" | "high";
export type AlertSeverity = "critical" | "warning" | "info";
export type SeasonPhase = "year-round" | "seasonal" | "promotional";

export interface CommercialRow {
  id: string;
  customer: string;
  program: string;
  family: string;
  turnover: number;
  marginEur: number;
  marginPct: number;
  targetMarginPct: number;
  varianceEur: number;
  variancePct: number;
  volume: number;
  status: MarginStatus;
  risk: RiskLevel;
  owner: string;
  invoicedTurnover: number;
  expectedTurnover: number;
  actions?: string[];
}

export interface CommercialAlert {
  id: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  customer?: string;
  time: string;
  type: "risk" | "opportunity" | "stability" | "recipe" | "season" | "margin-vol";
}

export interface ProductLineRow {
  id: string;
  productFamily: string;
  program: string;
  programType: "year-round" | "seasonal" | "promotional";
  weeksActive: number;
  totalOrders: number;
  revenue: number;
  avgMargin: number;
  recipeVariationIndex: number;
  lineStabilityIndex: number;
  seasonPhase: SeasonPhase;
}

export interface WeekHeatCell {
  week: number;
  volume: number; // 0-100 normalized
}

export interface SeasonRow {
  productFamily: string;
  weeks: WeekHeatCell[];
}

/* ── Helpers ── */
export const fmt = (n: number) => n.toLocaleString("nl-NL");
export const fmtEur = (n: number) => `€${Math.abs(n) >= 1000 ? (n / 1000).toFixed(0) + "K" : fmt(n)}`;

/* ── Summary Metrics ── */
export const summaryMetrics = [
  { label: "Totale omzet", value: "€2.4M", icon: DollarSign, status: "healthy" as const, change: "+6.2%", changeDir: "up" as const },
  { label: "Gem. marge %", value: "17.2", unit: "%", icon: Percent, status: "warning" as const, target: "19%", change: "−1.8pp", changeDir: "down" as const },
  { label: "Marge gap", value: "−1.8", unit: "pp", icon: TrendingUp, status: "warning" as const },
  { label: "Marge verschil", value: "−€43K", icon: LineChart, status: "warning" as const, change: "−2.8%", changeDir: "down" as const },
  { label: "Omzet Hand", value: "€1.1M", icon: DollarSign, status: "healthy" as const, sub: "46%" },
  { label: "Omzet Band", value: "€1.3M", icon: DollarSign, status: "healthy" as const, sub: "54%" },
  { label: "Marge Hand", value: "18.4%", icon: Percent, status: "healthy" as const },
  { label: "Marge Band", value: "16.1%", icon: Percent, status: "warning" as const, target: "18%" },
];

/* ── Commercial Rows ── */
export const commercialRows: CommercialRow[] = [
  { id: "c1", customer: "Albert Heijn", program: "Wk12 — AH Basis", family: "Premium", turnover: 482000, marginEur: 106400, marginPct: 22.1, targetMarginPct: 20, varianceEur: 10100, variancePct: 2.1, volume: 18400, status: "above", risk: "none", owner: "Mark", invoicedTurnover: 478000, expectedTurnover: 495000, actions: ["Upsell Seasonal"] },
  { id: "c2", customer: "Jumbo", program: "Wk12 — Jumbo Standaard", family: "Standard", turnover: 356000, marginEur: 60520, marginPct: 17.0, targetMarginPct: 18, varianceEur: -3560, variancePct: -1.0, volume: 14200, status: "below", risk: "low", owner: "Sandra", invoicedTurnover: 348000, expectedTurnover: 362000 },
  { id: "c3", customer: "Aldi", program: "Wk12 — Aldi Actie", family: "Budget", turnover: 284000, marginEur: 34080, marginPct: 12.0, targetMarginPct: 15, varianceEur: -8520, variancePct: -3.0, volume: 22800, status: "critical", risk: "high", owner: "Mark", invoicedTurnover: 276000, expectedTurnover: 290000, actions: ["Prijsherziening", "Volume review"] },
  { id: "c4", customer: "Lidl", program: "Wk12 — Lidl Promo", family: "Budget", turnover: 198000, marginEur: 25740, marginPct: 13.0, targetMarginPct: 14, varianceEur: -1980, variancePct: -1.0, volume: 16200, status: "below", risk: "medium", owner: "Sandra", invoicedTurnover: 192000, expectedTurnover: 204000 },
  { id: "c5", customer: "Dekamarkt", program: "Wk12 — Deka Seasonal", family: "Seasonal", turnover: 142000, marginEur: 29820, marginPct: 21.0, targetMarginPct: 19, varianceEur: 2840, variancePct: 2.0, volume: 6800, status: "above", risk: "none", owner: "Mark", invoicedTurnover: 140000, expectedTurnover: 145000 },
  { id: "c6", customer: "Plus", program: "Wk12 — Plus Premium", family: "Premium", turnover: 168000, marginEur: 33600, marginPct: 20.0, targetMarginPct: 20, varianceEur: 0, variancePct: 0, volume: 7200, status: "on-target", risk: "none", owner: "Sandra", invoicedTurnover: 165000, expectedTurnover: 170000 },
  { id: "c7", customer: "Coop", program: "Wk12 — Coop Basis", family: "Standard", turnover: 96000, marginEur: 11520, marginPct: 12.0, targetMarginPct: 16, varianceEur: -3840, variancePct: -4.0, volume: 4800, status: "critical", risk: "high", owner: "Mark", invoicedTurnover: 89000, expectedTurnover: 102000, actions: ["Evaluatie programma"] },
  { id: "c8", customer: "Dirk", program: "Wk12 — Dirk Value", family: "Budget", turnover: 124000, marginEur: 19840, marginPct: 16.0, targetMarginPct: 15, varianceEur: 1240, variancePct: 1.0, volume: 9600, status: "above", risk: "none", owner: "Sandra", invoicedTurnover: 122000, expectedTurnover: 126000 },
];

/* ── Alerts ── */
export const alerts: CommercialAlert[] = [
  { id: "r1", severity: "critical", title: "Aldi marge 3pp onder target", description: "Programma Wk12 Aldi Actie realiseert 12% marge vs 15% target.", customer: "Aldi", time: "08:45", type: "risk" },
  { id: "r2", severity: "critical", title: "Coop programma verliesgevend risico", description: "Marge 12% vs target 16%. Factuurdelta −€13K.", customer: "Coop", time: "09:10", type: "risk" },
  { id: "r3", severity: "warning", title: "Klantconcentratie AH 20%", description: "Albert Heijn vertegenwoordigt 20% van omzet.", customer: "Albert Heijn", time: "09:30", type: "risk" },
  { id: "r4", severity: "warning", title: "Factuur vs verwacht −€68K", description: "Gecumuleerde afwijking verwachte vs gefactureerde omzet.", time: "10:00", type: "risk" },
  { id: "o1", severity: "info", title: "Dekamarkt marge +2pp boven target", description: "Seasonal programma presteert sterk. Mogelijkheid tot volume-uitbreiding.", customer: "Dekamarkt", time: "08:30", type: "opportunity" },
  { id: "o2", severity: "info", title: "Dirk Value boven margetarget", description: "Budget-programma Dirk realiseert 16% vs 15% target.", customer: "Dirk", time: "09:00", type: "opportunity" },
  // Product Line Alerts
  { id: "pl1", severity: "critical", title: "Lijn 'Actie Mix' instabiel", description: "Line Stability Index 0.31 — frequente receptwissels en volume schommelingen.", time: "07:30", type: "stability" },
  { id: "pl2", severity: "warning", title: "Hoge marge volatiliteit 'Promo Tulp'", description: "Marge varieert tussen 8% en 19% over afgelopen 8 weken.", time: "08:00", type: "margin-vol" },
  { id: "pl3", severity: "warning", title: "Recept variatie 'Seizoensmix' boven drempel", description: "Recipe Variation Index 0.82 — meer dan 4 receptvarianten actief.", time: "08:15", type: "recipe" },
  { id: "pl4", severity: "info", title: "Piekvolume 'Valentijn Special' week 6-7", description: "Verwacht 340% volume-toename t.o.v. gemiddeld.", time: "08:30", type: "season" },
];

/* ── Product Line Data ── */
export const productLines: ProductLineRow[] = [
  { id: "pl1", productFamily: "Premium Mix", program: "AH Basis", programType: "year-round", weeksActive: 48, totalOrders: 412, revenue: 482000, avgMargin: 22.1, recipeVariationIndex: 0.12, lineStabilityIndex: 0.92, seasonPhase: "year-round" },
  { id: "pl2", productFamily: "Standaard Boeket", program: "Jumbo Standaard", programType: "year-round", weeksActive: 52, totalOrders: 386, revenue: 356000, avgMargin: 17.0, recipeVariationIndex: 0.18, lineStabilityIndex: 0.88, seasonPhase: "year-round" },
  { id: "pl3", productFamily: "Budget Basis", program: "Aldi Actie", programType: "promotional", weeksActive: 26, totalOrders: 298, revenue: 284000, avgMargin: 12.0, recipeVariationIndex: 0.45, lineStabilityIndex: 0.52, seasonPhase: "promotional" },
  { id: "pl4", productFamily: "Promo Tulp", program: "Lidl Promo", programType: "promotional", weeksActive: 18, totalOrders: 186, revenue: 198000, avgMargin: 13.0, recipeVariationIndex: 0.62, lineStabilityIndex: 0.44, seasonPhase: "promotional" },
  { id: "pl5", productFamily: "Seizoensmix", program: "Deka Seasonal", programType: "seasonal", weeksActive: 32, totalOrders: 148, revenue: 142000, avgMargin: 21.0, recipeVariationIndex: 0.82, lineStabilityIndex: 0.61, seasonPhase: "seasonal" },
  { id: "pl6", productFamily: "Plus Premium", program: "Plus Premium", programType: "year-round", weeksActive: 44, totalOrders: 204, revenue: 168000, avgMargin: 20.0, recipeVariationIndex: 0.15, lineStabilityIndex: 0.89, seasonPhase: "year-round" },
  { id: "pl7", productFamily: "Actie Mix", program: "Coop Basis", programType: "promotional", weeksActive: 14, totalOrders: 96, revenue: 96000, avgMargin: 12.0, recipeVariationIndex: 0.71, lineStabilityIndex: 0.31, seasonPhase: "promotional" },
  { id: "pl8", productFamily: "Value Line", program: "Dirk Value", programType: "year-round", weeksActive: 40, totalOrders: 178, revenue: 124000, avgMargin: 16.0, recipeVariationIndex: 0.22, lineStabilityIndex: 0.84, seasonPhase: "year-round" },
  { id: "pl9", productFamily: "Valentijn Special", program: "Multi-klant", programType: "seasonal", weeksActive: 6, totalOrders: 89, revenue: 112000, avgMargin: 24.5, recipeVariationIndex: 0.35, lineStabilityIndex: 0.72, seasonPhase: "seasonal" },
  { id: "pl10", productFamily: "Moederdag Deluxe", program: "Multi-klant", programType: "seasonal", weeksActive: 4, totalOrders: 72, revenue: 98000, avgMargin: 26.2, recipeVariationIndex: 0.28, lineStabilityIndex: 0.68, seasonPhase: "seasonal" },
  { id: "pl11", productFamily: "Roos Selectie", program: "AH Premium", programType: "year-round", weeksActive: 50, totalOrders: 324, revenue: 268000, avgMargin: 19.8, recipeVariationIndex: 0.14, lineStabilityIndex: 0.91, seasonPhase: "year-round" },
  { id: "pl12", productFamily: "Orchidee Lijn", program: "Multi-klant", programType: "year-round", weeksActive: 46, totalOrders: 156, revenue: 186000, avgMargin: 23.4, recipeVariationIndex: 0.09, lineStabilityIndex: 0.95, seasonPhase: "year-round" },
  { id: "pl13", productFamily: "Zomermix", program: "Multi-klant", programType: "seasonal", weeksActive: 16, totalOrders: 134, revenue: 118000, avgMargin: 18.2, recipeVariationIndex: 0.54, lineStabilityIndex: 0.58, seasonPhase: "seasonal" },
  { id: "pl14", productFamily: "Field Bouquet", program: "Jumbo Special", programType: "year-round", weeksActive: 42, totalOrders: 248, revenue: 198000, avgMargin: 15.6, recipeVariationIndex: 0.32, lineStabilityIndex: 0.76, seasonPhase: "year-round" },
  { id: "pl15", productFamily: "Kerst Arrangement", program: "Multi-klant", programType: "seasonal", weeksActive: 5, totalOrders: 68, revenue: 94000, avgMargin: 27.1, recipeVariationIndex: 0.41, lineStabilityIndex: 0.65, seasonPhase: "seasonal" },
  { id: "pl16", productFamily: "Pastel Collectie", program: "Dekamarkt", programType: "seasonal", weeksActive: 12, totalOrders: 98, revenue: 76000, avgMargin: 19.4, recipeVariationIndex: 0.38, lineStabilityIndex: 0.71, seasonPhase: "seasonal" },
  { id: "pl17", productFamily: "Eco Boeket", program: "Plus Groen", programType: "year-round", weeksActive: 36, totalOrders: 164, revenue: 132000, avgMargin: 14.8, recipeVariationIndex: 0.26, lineStabilityIndex: 0.82, seasonPhase: "year-round" },
  { id: "pl18", productFamily: "Luxe Gift", program: "Multi-klant", programType: "promotional", weeksActive: 8, totalOrders: 42, revenue: 68000, avgMargin: 28.6, recipeVariationIndex: 0.58, lineStabilityIndex: 0.48, seasonPhase: "promotional" },
  { id: "pl19", productFamily: "Tulpen Classic", program: "AH Basis", programType: "seasonal", weeksActive: 14, totalOrders: 218, revenue: 156000, avgMargin: 16.8, recipeVariationIndex: 0.19, lineStabilityIndex: 0.86, seasonPhase: "seasonal" },
  { id: "pl20", productFamily: "Zonnebloem Lijn", program: "Multi-klant", programType: "seasonal", weeksActive: 10, totalOrders: 112, revenue: 88000, avgMargin: 17.5, recipeVariationIndex: 0.44, lineStabilityIndex: 0.63, seasonPhase: "seasonal" },
];

/* ── Seasonality Heatmap Data ── */
const generateWeeks = (pattern: "stable" | "spring" | "summer" | "winter" | "valentine" | "mother" | "christmas"): WeekHeatCell[] => {
  const weeks: WeekHeatCell[] = [];
  for (let w = 1; w <= 52; w++) {
    let vol = 0;
    switch (pattern) {
      case "stable": vol = 40 + Math.random() * 20; break;
      case "spring": vol = w >= 10 && w <= 22 ? 60 + Math.random() * 40 : 10 + Math.random() * 15; break;
      case "summer": vol = w >= 22 && w <= 36 ? 55 + Math.random() * 45 : 8 + Math.random() * 12; break;
      case "winter": vol = (w >= 44 || w <= 8) ? 50 + Math.random() * 50 : 5 + Math.random() * 10; break;
      case "valentine": vol = w >= 5 && w <= 7 ? 80 + Math.random() * 20 : 5 + Math.random() * 10; break;
      case "mother": vol = w >= 18 && w <= 20 ? 75 + Math.random() * 25 : 5 + Math.random() * 8; break;
      case "christmas": vol = w >= 48 && w <= 52 ? 70 + Math.random() * 30 : 3 + Math.random() * 7; break;
    }
    weeks.push({ week: w, volume: Math.round(vol) });
  }
  return weeks;
};

export const seasonData: SeasonRow[] = [
  { productFamily: "Premium Mix", weeks: generateWeeks("stable") },
  { productFamily: "Standaard Boeket", weeks: generateWeeks("stable") },
  { productFamily: "Roos Selectie", weeks: generateWeeks("stable") },
  { productFamily: "Orchidee Lijn", weeks: generateWeeks("stable") },
  { productFamily: "Seizoensmix", weeks: generateWeeks("spring") },
  { productFamily: "Zomermix", weeks: generateWeeks("summer") },
  { productFamily: "Valentijn Special", weeks: generateWeeks("valentine") },
  { productFamily: "Moederdag Deluxe", weeks: generateWeeks("mother") },
  { productFamily: "Kerst Arrangement", weeks: generateWeeks("christmas") },
  { productFamily: "Tulpen Classic", weeks: generateWeeks("spring") },
  { productFamily: "Pastel Collectie", weeks: generateWeeks("spring") },
  { productFamily: "Zonnebloem Lijn", weeks: generateWeeks("summer") },
  { productFamily: "Field Bouquet", weeks: generateWeeks("stable") },
  { productFamily: "Promo Tulp", weeks: generateWeeks("spring") },
  { productFamily: "Actie Mix", weeks: generateWeeks("stable") },
];

/* ── Style maps ── */
export const marginStatusCls: Record<MarginStatus, string> = {
  above: "text-accent bg-accent/10",
  "on-target": "text-primary bg-primary/10",
  below: "text-yellow-500 bg-yellow-500/10",
  critical: "text-destructive bg-destructive/10",
};
export const marginStatusLabel: Record<MarginStatus, string> = {
  above: "Boven target", "on-target": "Op target", below: "Onder target", critical: "Kritiek",
};
export const riskCls: Record<RiskLevel, string> = {
  none: "text-accent", low: "text-primary", medium: "text-yellow-500", high: "text-destructive",
};

export const seasonPhaseCls: Record<SeasonPhase, { bg: string; text: string; label: string }> = {
  "year-round": { bg: "bg-accent/10 border-accent/20", text: "text-accent", label: "Jaarrond" },
  seasonal: { bg: "bg-yellow-500/10 border-yellow-500/20", text: "text-yellow-500", label: "Seizoen" },
  promotional: { bg: "bg-destructive/10 border-destructive/20", text: "text-destructive", label: "Promotie" },
};

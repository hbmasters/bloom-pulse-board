import {
  DollarSign, TrendingUp, Percent, ShieldAlert, AlertTriangle,
  Star, LineChart, Activity
} from "lucide-react";

/* ── Types ── */
export type MarginStatus = "above" | "on-target" | "below" | "critical";
export type RiskLevel = "none" | "low" | "medium" | "high";
export type AlertSeverity = "critical" | "warning" | "info";
export type SeasonPhase = "year-round" | "seasonal" | "promotional";
export type CustomerType = "year_round_customer" | "seasonal_customer" | "promotion_customer" | "unstable_customer";

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
  type: "risk" | "opportunity" | "stability" | "recipe" | "season" | "margin-vol" | "customer-stability" | "customer-margin" | "customer-fragmentation" | "customer-seasonal";
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

/* ── Customer Types ── */
export interface CustomerRow {
  id: string;
  customer: string;
  customerType: CustomerType;
  totalRevenue: number;
  marginEur: number;
  marginPct: number;
  targetMarginPct: number;
  marginGap: number;
  weeksActive: number;
  orderFrequency: number; // orders per week
  avgOrderSize: number;
  productionVolume: number;
  forecastVolume: number;
  confirmedVolume: number;
  seasonalityIndex: number; // 0-1: 0=flat, 1=extreme peaks
  stabilityIndex: number; // 0-1
  inefficiencyPct: number;
  orderFragmentation: number; // 0-1
  productionPressure: number; // 0-10
  forecastAccuracy: number; // 0-100%
  owner: string;
  programs: CustomerProgramRow[];
}

export interface CustomerProgramRow {
  id: string;
  programName: string;
  durationWeeks: number;
  revenue: number;
  marginPct: number;
  stabilityIndex: number;
  productFamily: string;
}

export interface CustomerSeasonRow {
  customer: string;
  weeks: WeekHeatCell[];
}

/* ── Helpers ── */
export const fmt = (n: number) => n.toLocaleString("nl-NL");
export const fmtEur = (n: number) => `€${Math.abs(n) >= 1000 ? (n / 1000).toFixed(0) + "K" : fmt(n)}`;

/* ── Customer Type Styling ── */
export const customerTypeCls: Record<CustomerType, { bg: string; text: string; label: string; dot: string }> = {
  year_round_customer: { bg: "bg-accent/10 border-accent/20", text: "text-accent", label: "Jaarrond", dot: "bg-accent" },
  seasonal_customer: { bg: "bg-yellow-500/10 border-yellow-500/20", text: "text-yellow-500", label: "Seizoen", dot: "bg-yellow-500" },
  promotion_customer: { bg: "bg-orange-500/10 border-orange-500/20", text: "text-orange-500", label: "Promotie", dot: "bg-orange-500" },
  unstable_customer: { bg: "bg-destructive/10 border-destructive/20", text: "text-destructive", label: "Instabiel", dot: "bg-destructive" },
};

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

/* ── Customer Data ── */
export const customerRows: CustomerRow[] = [
  {
    id: "cust1", customer: "Albert Heijn", customerType: "year_round_customer",
    totalRevenue: 750000, marginEur: 157500, marginPct: 21.0, targetMarginPct: 20, marginGap: 1.0,
    weeksActive: 52, orderFrequency: 3.2, avgOrderSize: 4500, productionVolume: 168000, forecastVolume: 175000, confirmedVolume: 168000,
    seasonalityIndex: 0.12, stabilityIndex: 0.94, inefficiencyPct: 4.2, orderFragmentation: 0.08, productionPressure: 2.1, forecastAccuracy: 96,
    owner: "Mark",
    programs: [
      { id: "p1a", programName: "AH Basis Wekelijks", durationWeeks: 52, revenue: 482000, marginPct: 22.1, stabilityIndex: 0.92, productFamily: "Premium Mix" },
      { id: "p1b", programName: "AH Premium Roos", durationWeeks: 50, revenue: 268000, marginPct: 19.8, stabilityIndex: 0.91, productFamily: "Roos Selectie" },
    ],
  },
  {
    id: "cust2", customer: "Jumbo", customerType: "year_round_customer",
    totalRevenue: 554000, marginEur: 94180, marginPct: 17.0, targetMarginPct: 18, marginGap: -1.0,
    weeksActive: 52, orderFrequency: 2.8, avgOrderSize: 3800, productionVolume: 142000, forecastVolume: 150000, confirmedVolume: 138000,
    seasonalityIndex: 0.15, stabilityIndex: 0.86, inefficiencyPct: 6.8, orderFragmentation: 0.14, productionPressure: 3.4, forecastAccuracy: 92,
    owner: "Sandra",
    programs: [
      { id: "p2a", programName: "Jumbo Standaard", durationWeeks: 52, revenue: 356000, marginPct: 17.0, stabilityIndex: 0.88, productFamily: "Standaard Boeket" },
      { id: "p2b", programName: "Jumbo Special Field", durationWeeks: 42, revenue: 198000, marginPct: 15.6, stabilityIndex: 0.76, productFamily: "Field Bouquet" },
    ],
  },
  {
    id: "cust3", customer: "Aldi", customerType: "promotion_customer",
    totalRevenue: 284000, marginEur: 34080, marginPct: 12.0, targetMarginPct: 15, marginGap: -3.0,
    weeksActive: 26, orderFrequency: 1.4, avgOrderSize: 7800, productionVolume: 228000, forecastVolume: 240000, confirmedVolume: 210000,
    seasonalityIndex: 0.62, stabilityIndex: 0.48, inefficiencyPct: 14.2, orderFragmentation: 0.52, productionPressure: 7.8, forecastAccuracy: 78,
    owner: "Mark",
    programs: [
      { id: "p3a", programName: "Aldi Actie Wekelijks", durationWeeks: 26, revenue: 284000, marginPct: 12.0, stabilityIndex: 0.52, productFamily: "Budget Basis" },
    ],
  },
  {
    id: "cust4", customer: "Lidl", customerType: "promotion_customer",
    totalRevenue: 198000, marginEur: 25740, marginPct: 13.0, targetMarginPct: 14, marginGap: -1.0,
    weeksActive: 18, orderFrequency: 1.1, avgOrderSize: 10000, productionVolume: 162000, forecastVolume: 170000, confirmedVolume: 155000,
    seasonalityIndex: 0.58, stabilityIndex: 0.44, inefficiencyPct: 16.5, orderFragmentation: 0.61, productionPressure: 8.2, forecastAccuracy: 74,
    owner: "Sandra",
    programs: [
      { id: "p4a", programName: "Lidl Promo Tulp", durationWeeks: 18, revenue: 198000, marginPct: 13.0, stabilityIndex: 0.44, productFamily: "Promo Tulp" },
    ],
  },
  {
    id: "cust5", customer: "Dekamarkt", customerType: "seasonal_customer",
    totalRevenue: 218000, marginEur: 43600, marginPct: 20.0, targetMarginPct: 19, marginGap: 1.0,
    weeksActive: 44, orderFrequency: 2.0, avgOrderSize: 2500, productionVolume: 88000, forecastVolume: 92000, confirmedVolume: 86000,
    seasonalityIndex: 0.42, stabilityIndex: 0.72, inefficiencyPct: 8.4, orderFragmentation: 0.22, productionPressure: 4.1, forecastAccuracy: 91,
    owner: "Mark",
    programs: [
      { id: "p5a", programName: "Deka Seasonal Mix", durationWeeks: 32, revenue: 142000, marginPct: 21.0, stabilityIndex: 0.61, productFamily: "Seizoensmix" },
      { id: "p5b", programName: "Dekamarkt Pastel", durationWeeks: 12, revenue: 76000, marginPct: 19.4, stabilityIndex: 0.71, productFamily: "Pastel Collectie" },
    ],
  },
  {
    id: "cust6", customer: "Plus", customerType: "year_round_customer",
    totalRevenue: 300000, marginEur: 58500, marginPct: 19.5, targetMarginPct: 20, marginGap: -0.5,
    weeksActive: 48, orderFrequency: 2.4, avgOrderSize: 2400, productionVolume: 96000, forecastVolume: 98000, confirmedVolume: 94000,
    seasonalityIndex: 0.18, stabilityIndex: 0.88, inefficiencyPct: 5.6, orderFragmentation: 0.12, productionPressure: 2.8, forecastAccuracy: 95,
    owner: "Sandra",
    programs: [
      { id: "p6a", programName: "Plus Premium Line", durationWeeks: 44, revenue: 168000, marginPct: 20.0, stabilityIndex: 0.89, productFamily: "Plus Premium" },
      { id: "p6b", programName: "Plus Groen Eco", durationWeeks: 36, revenue: 132000, marginPct: 14.8, stabilityIndex: 0.82, productFamily: "Eco Boeket" },
    ],
  },
  {
    id: "cust7", customer: "Coop", customerType: "unstable_customer",
    totalRevenue: 96000, marginEur: 11520, marginPct: 12.0, targetMarginPct: 16, marginGap: -4.0,
    weeksActive: 14, orderFrequency: 0.8, avgOrderSize: 8570, productionVolume: 48000, forecastVolume: 58000, confirmedVolume: 42000,
    seasonalityIndex: 0.72, stabilityIndex: 0.31, inefficiencyPct: 22.4, orderFragmentation: 0.74, productionPressure: 9.1, forecastAccuracy: 62,
    owner: "Mark",
    programs: [
      { id: "p7a", programName: "Coop Basis Actie", durationWeeks: 14, revenue: 96000, marginPct: 12.0, stabilityIndex: 0.31, productFamily: "Actie Mix" },
    ],
  },
  {
    id: "cust8", customer: "Dirk", customerType: "year_round_customer",
    totalRevenue: 124000, marginEur: 19840, marginPct: 16.0, targetMarginPct: 15, marginGap: 1.0,
    weeksActive: 40, orderFrequency: 2.2, avgOrderSize: 1410, productionVolume: 56400, forecastVolume: 58000, confirmedVolume: 55000,
    seasonalityIndex: 0.14, stabilityIndex: 0.84, inefficiencyPct: 7.2, orderFragmentation: 0.18, productionPressure: 3.0, forecastAccuracy: 93,
    owner: "Sandra",
    programs: [
      { id: "p8a", programName: "Dirk Value Lijn", durationWeeks: 40, revenue: 124000, marginPct: 16.0, stabilityIndex: 0.84, productFamily: "Value Line" },
    ],
  },
  {
    id: "cust9", customer: "REWE", customerType: "year_round_customer",
    totalRevenue: 420000, marginEur: 84000, marginPct: 20.0, targetMarginPct: 19, marginGap: 1.0,
    weeksActive: 50, orderFrequency: 3.0, avgOrderSize: 2800, productionVolume: 140000, forecastVolume: 145000, confirmedVolume: 138000,
    seasonalityIndex: 0.16, stabilityIndex: 0.91, inefficiencyPct: 3.8, orderFragmentation: 0.10, productionPressure: 2.4, forecastAccuracy: 95,
    owner: "Mark",
    programs: [
      { id: "p9a", programName: "REWE Colorful Series", durationWeeks: 50, revenue: 420000, marginPct: 20.0, stabilityIndex: 0.91, productFamily: "Premium Mix" },
    ],
  },
  {
    id: "cust10", customer: "Vomar", customerType: "seasonal_customer",
    totalRevenue: 156000, marginEur: 28080, marginPct: 18.0, targetMarginPct: 17, marginGap: 1.0,
    weeksActive: 36, orderFrequency: 1.8, avgOrderSize: 2400, productionVolume: 64800, forecastVolume: 68000, confirmedVolume: 62000,
    seasonalityIndex: 0.48, stabilityIndex: 0.68, inefficiencyPct: 9.8, orderFragmentation: 0.28, productionPressure: 4.6, forecastAccuracy: 88,
    owner: "Sandra",
    programs: [
      { id: "p10a", programName: "Vomar Fleur Line", durationWeeks: 36, revenue: 156000, marginPct: 18.0, stabilityIndex: 0.68, productFamily: "Seizoensmix" },
    ],
  },
];

/* ── Commercial Rows (kept for detail table) ── */
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
  // Customer alerts
  { id: "ca1", severity: "critical", title: "Coop: instabiel orderpatroon", description: "Stability index 0.31 — onvoorspelbare volumes, hoge fragmentatie (0.74). Productiedruk score 9.1/10.", customer: "Coop", time: "07:15", type: "customer-stability" },
  { id: "ca2", severity: "critical", title: "Aldi: marge 3pp onder target", description: "Marge 12% vs target 15%. Promotioneel klantprofiel met hoge productiedruk (7.8/10).", customer: "Aldi", time: "07:30", type: "customer-margin" },
  { id: "ca3", severity: "warning", title: "Lidl: hoge orderfragmentatie", description: "Fragmentatie index 0.61 — veel kleine/wisselende orders veroorzaken productie-inefficiëntie (16.5%).", customer: "Lidl", time: "08:00", type: "customer-fragmentation" },
  { id: "ca4", severity: "warning", title: "Dekamarkt: seizoenspiek verwacht", description: "Seizoensindex 0.42 — verwacht volume-piek in voorjaar. Forecast accuracy 91%.", customer: "Dekamarkt", time: "08:15", type: "customer-seasonal" },
  { id: "ca5", severity: "warning", title: "Coop: dalende marge trend", description: "Marge 12% vs target 16%, marge gap −4pp. Forecast accuracy slechts 62%.", customer: "Coop", time: "08:30", type: "customer-margin" },
  { id: "ca6", severity: "info", title: "REWE: stabiel & groei-kandidaat", description: "Stability 0.91, marge +1pp boven target, 50 weken actief. Ideale groei-klant.", customer: "REWE", time: "09:00", type: "customer-stability" },
  { id: "ca7", severity: "info", title: "Albert Heijn: sterke jaarrond basis", description: "Hoogste stability (0.94), marge boven target, betrouwbare forecast (96%).", customer: "Albert Heijn", time: "09:15", type: "customer-stability" },
  // Legacy risk/opportunity
  { id: "r1", severity: "critical", title: "Aldi marge 3pp onder target", description: "Programma Wk12 Aldi Actie realiseert 12% marge vs 15% target.", customer: "Aldi", time: "08:45", type: "risk" },
  { id: "r2", severity: "critical", title: "Coop programma verliesgevend risico", description: "Marge 12% vs target 16%. Factuurdelta −€13K.", customer: "Coop", time: "09:10", type: "risk" },
  { id: "r3", severity: "warning", title: "Klantconcentratie AH 20%", description: "Albert Heijn vertegenwoordigt 20% van omzet.", customer: "Albert Heijn", time: "09:30", type: "risk" },
  { id: "r4", severity: "warning", title: "Factuur vs verwacht −€68K", description: "Gecumuleerde afwijking verwachte vs gefactureerde omzet.", time: "10:00", type: "risk" },
  { id: "o1", severity: "info", title: "Dekamarkt marge +2pp boven target", description: "Seasonal programma presteert sterk. Mogelijkheid tot volume-uitbreiding.", customer: "Dekamarkt", time: "08:30", type: "opportunity" },
  { id: "o2", severity: "info", title: "Dirk Value boven margetarget", description: "Budget-programma Dirk realiseert 16% vs 15% target.", customer: "Dirk", time: "09:00", type: "opportunity" },
  // Product line alerts
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

/* ── Customer Seasonality Heatmap Data ── */
export const customerSeasonData: CustomerSeasonRow[] = [
  { customer: "Albert Heijn", weeks: generateWeeks("stable") },
  { customer: "Jumbo", weeks: generateWeeks("stable") },
  { customer: "REWE", weeks: generateWeeks("stable") },
  { customer: "Plus", weeks: generateWeeks("stable") },
  { customer: "Dirk", weeks: generateWeeks("stable") },
  { customer: "Dekamarkt", weeks: generateWeeks("spring") },
  { customer: "Vomar", weeks: generateWeeks("spring") },
  { customer: "Aldi", weeks: generateWeeks("valentine") },
  { customer: "Lidl", weeks: generateWeeks("mother") },
  { customer: "Coop", weeks: generateWeeks("winter") },
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

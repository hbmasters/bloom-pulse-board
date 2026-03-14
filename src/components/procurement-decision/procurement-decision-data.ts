// Procurement Decision List — mock data layer

export type ProcurementAction =
  | "buy_now"
  | "use_stock"
  | "consider_substitute"
  | "spread_purchase"
  | "markdown_candidate"
  | "markup_opportunity"
  | "sales_push"
  | "review_supplier";

export const actionLabels: Record<ProcurementAction, string> = {
  buy_now: "Buy now",
  use_stock: "Use stock first",
  consider_substitute: "Consider substitute",
  spread_purchase: "Spread purchase",
  markdown_candidate: "Markdown candidate",
  markup_opportunity: "Markup opportunity",
  sales_push: "Sales push",
  review_supplier: "Review supplier choice",
};

export const actionColors: Record<ProcurementAction, string> = {
  buy_now: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  use_stock: "bg-sky-500/20 text-sky-300 border-sky-500/30",
  consider_substitute: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  spread_purchase: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  markdown_candidate: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  markup_opportunity: "bg-teal-500/20 text-teal-300 border-teal-500/30",
  sales_push: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  review_supplier: "bg-slate-500/20 text-slate-300 border-slate-500/30",
};

export interface SubstituteCandidate {
  name: string;
  confidence: number; // 0-100
  price: number;
  availability: "high" | "medium" | "low";
}

export interface PurchaseMixLine {
  product: string;
  units: number;
  price: number;
  type: "planned" | "substitute";
}

export interface ProcurementDecisionRow {
  id: string;
  product: string;
  substitute_bundle: string;
  required_units: number;
  current_stock: number;
  free_stock: number;
  order_units: number;
  market_price: number;
  historical_price_last_month: number;
  historical_price_last_year: number;
  supplier: string;
  supplier_quality_score: number; // 0-100
  supplier_reliability_score: number; // 0-100
  waste_risk_adjusted_price: number;
  price_stability_index: number; // 0-100
  price_deviation_pct: number;
  inventory_pressure_score: number; // 0-100
  stock_days: number;
  turnover_risk: "low" | "medium" | "high";
  substitute_candidates: SubstituteCandidate[];
  purchase_mix_proposal: PurchaseMixLine[];
  weighted_purchase_price: number;
  markdown_advice: string | null;
  markup_advice: string | null;
  advised_valuation_price: number;
  sales_push_advice: string | null;
  procurement_action: ProcurementAction;
}

export const mockDecisionRows: ProcurementDecisionRow[] = [
  {
    id: "1",
    product: "Roos Red Naomi 60cm",
    substitute_bundle: "Premium Rozen",
    required_units: 12000,
    current_stock: 3200,
    free_stock: 1800,
    order_units: 8800,
    market_price: 0.38,
    historical_price_last_month: 0.35,
    historical_price_last_year: 0.32,
    supplier: "Royal FloraHolland",
    supplier_quality_score: 92,
    supplier_reliability_score: 95,
    waste_risk_adjusted_price: 0.41,
    price_stability_index: 78,
    price_deviation_pct: 8.6,
    inventory_pressure_score: 35,
    stock_days: 2.1,
    turnover_risk: "low",
    substitute_candidates: [
      { name: "Roos Freedom 60cm", confidence: 85, price: 0.32, availability: "high" },
      { name: "Roos Avalanche 60cm", confidence: 72, price: 0.29, availability: "medium" },
    ],
    purchase_mix_proposal: [
      { product: "Roos Red Naomi 60cm", units: 6000, price: 0.38, type: "planned" },
      { product: "Roos Freedom 60cm", units: 2800, price: 0.32, type: "substitute" },
    ],
    weighted_purchase_price: 0.36,
    markdown_advice: null,
    markup_advice: "Market price 8.6% above last year — consider upward revaluation",
    advised_valuation_price: 0.40,
    sales_push_advice: null,
    procurement_action: "buy_now",
  },
  {
    id: "2",
    product: "Tulp Strong Gold 40cm",
    substitute_bundle: "Tulpen Mix",
    required_units: 8000,
    current_stock: 6500,
    free_stock: 4200,
    order_units: 1500,
    market_price: 0.18,
    historical_price_last_month: 0.20,
    historical_price_last_year: 0.22,
    supplier: "FleuraMetz",
    supplier_quality_score: 78,
    supplier_reliability_score: 82,
    waste_risk_adjusted_price: 0.21,
    price_stability_index: 65,
    price_deviation_pct: -10.0,
    inventory_pressure_score: 72,
    stock_days: 5.8,
    turnover_risk: "medium",
    substitute_candidates: [
      { name: "Tulp Mondial 40cm", confidence: 90, price: 0.16, availability: "high" },
    ],
    purchase_mix_proposal: [
      { product: "Tulp Strong Gold 40cm", units: 1500, price: 0.18, type: "planned" },
    ],
    weighted_purchase_price: 0.18,
    markdown_advice: "Stock pressure high (5.8 days) — consider markdown to accelerate turnover",
    markup_advice: null,
    advised_valuation_price: 0.16,
    sales_push_advice: "Push via sales to reduce stock pressure before ageing risk",
    procurement_action: "use_stock",
  },
  {
    id: "3",
    product: "Chrysant Bacardi 70cm",
    substitute_bundle: "Chrysanten Wit",
    required_units: 5000,
    current_stock: 800,
    free_stock: 400,
    order_units: 4200,
    market_price: 0.45,
    historical_price_last_month: 0.42,
    historical_price_last_year: 0.38,
    supplier: "Van der Plas",
    supplier_quality_score: 65,
    supplier_reliability_score: 58,
    waste_risk_adjusted_price: 0.52,
    price_stability_index: 42,
    price_deviation_pct: 18.4,
    inventory_pressure_score: 15,
    stock_days: 1.1,
    turnover_risk: "low",
    substitute_candidates: [
      { name: "Chrysant Pina Colada 70cm", confidence: 78, price: 0.38, availability: "high" },
      { name: "Chrysant Zembla 70cm", confidence: 65, price: 0.35, availability: "medium" },
      { name: "Lisianthus Wit 60cm", confidence: 45, price: 0.55, availability: "low" },
    ],
    purchase_mix_proposal: [
      { product: "Chrysant Bacardi 70cm", units: 2500, price: 0.45, type: "planned" },
      { product: "Chrysant Pina Colada 70cm", units: 1200, price: 0.38, type: "substitute" },
      { product: "Chrysant Zembla 70cm", units: 500, price: 0.35, type: "substitute" },
    ],
    weighted_purchase_price: 0.41,
    markdown_advice: null,
    markup_advice: null,
    advised_valuation_price: 0.43,
    sales_push_advice: null,
    procurement_action: "consider_substitute",
  },
  {
    id: "4",
    product: "Gerbera Kimsey 50cm",
    substitute_bundle: "Gerbera Mix",
    required_units: 3000,
    current_stock: 2800,
    free_stock: 2200,
    order_units: 200,
    market_price: 0.28,
    historical_price_last_month: 0.30,
    historical_price_last_year: 0.32,
    supplier: "Zurel",
    supplier_quality_score: 88,
    supplier_reliability_score: 91,
    waste_risk_adjusted_price: 0.30,
    price_stability_index: 85,
    price_deviation_pct: -12.5,
    inventory_pressure_score: 82,
    stock_days: 7.2,
    turnover_risk: "high",
    substitute_candidates: [],
    purchase_mix_proposal: [
      { product: "Gerbera Kimsey 50cm", units: 200, price: 0.28, type: "planned" },
    ],
    weighted_purchase_price: 0.28,
    markdown_advice: "High stock days (7.2) with ageing risk — markdown 15% recommended",
    markup_advice: null,
    advised_valuation_price: 0.24,
    sales_push_advice: "Urgent sales push — turnover risk high",
    procurement_action: "markdown_candidate",
  },
  {
    id: "5",
    product: "Lelie Oriental Stargazer",
    substitute_bundle: "Lelies Premium",
    required_units: 2000,
    current_stock: 200,
    free_stock: 100,
    order_units: 1800,
    market_price: 1.20,
    historical_price_last_month: 1.35,
    historical_price_last_year: 1.45,
    supplier: "Royal FloraHolland",
    supplier_quality_score: 94,
    supplier_reliability_score: 96,
    waste_risk_adjusted_price: 1.28,
    price_stability_index: 55,
    price_deviation_pct: -17.2,
    inventory_pressure_score: 8,
    stock_days: 0.7,
    turnover_risk: "low",
    substitute_candidates: [
      { name: "Lelie LA Brindisi", confidence: 70, price: 0.85, availability: "high" },
    ],
    purchase_mix_proposal: [
      { product: "Lelie Oriental Stargazer", units: 1400, price: 1.20, type: "planned" },
      { product: "Lelie LA Brindisi", units: 400, price: 0.85, type: "substitute" },
    ],
    weighted_purchase_price: 1.12,
    markdown_advice: null,
    markup_advice: "Market price 17% below last year — strong markup opportunity on current stock",
    advised_valuation_price: 1.30,
    sales_push_advice: null,
    procurement_action: "markup_opportunity",
  },
  {
    id: "6",
    product: "Zonnebloem Vincent 60cm",
    substitute_bundle: "Zonnebloemen",
    required_units: 6000,
    current_stock: 1000,
    free_stock: 600,
    order_units: 5000,
    market_price: 0.55,
    historical_price_last_month: 0.50,
    historical_price_last_year: 0.48,
    supplier: "FleuraMetz",
    supplier_quality_score: 72,
    supplier_reliability_score: 68,
    waste_risk_adjusted_price: 0.62,
    price_stability_index: 50,
    price_deviation_pct: 14.6,
    inventory_pressure_score: 20,
    stock_days: 1.2,
    turnover_risk: "low",
    substitute_candidates: [
      { name: "Zonnebloem Sunrich 55cm", confidence: 88, price: 0.48, availability: "high" },
    ],
    purchase_mix_proposal: [
      { product: "Zonnebloem Vincent 60cm", units: 3000, price: 0.55, type: "planned" },
      { product: "Zonnebloem Sunrich 55cm", units: 2000, price: 0.48, type: "substitute" },
    ],
    weighted_purchase_price: 0.52,
    markdown_advice: null,
    markup_advice: null,
    advised_valuation_price: 0.54,
    sales_push_advice: "Volume product — push via seasonal bundles",
    procurement_action: "spread_purchase",
  },
  {
    id: "7",
    product: "Hortensia Magical Amethyst",
    substitute_bundle: "Hortensia Mix",
    required_units: 1500,
    current_stock: 350,
    free_stock: 200,
    order_units: 1150,
    market_price: 2.80,
    historical_price_last_month: 2.65,
    historical_price_last_year: 2.50,
    supplier: "Van der Plas",
    supplier_quality_score: 60,
    supplier_reliability_score: 55,
    waste_risk_adjusted_price: 3.25,
    price_stability_index: 38,
    price_deviation_pct: 12.0,
    inventory_pressure_score: 28,
    stock_days: 1.6,
    turnover_risk: "low",
    substitute_candidates: [
      { name: "Hortensia Schneeball", confidence: 75, price: 2.40, availability: "medium" },
    ],
    purchase_mix_proposal: [
      { product: "Hortensia Magical Amethyst", units: 800, price: 2.80, type: "planned" },
      { product: "Hortensia Schneeball", units: 350, price: 2.40, type: "substitute" },
    ],
    weighted_purchase_price: 2.66,
    markdown_advice: null,
    markup_advice: null,
    advised_valuation_price: 2.75,
    sales_push_advice: null,
    procurement_action: "review_supplier",
  },
  {
    id: "8",
    product: "Alstroemeria Virginia",
    substitute_bundle: "Alstroemeria Mix",
    required_units: 4000,
    current_stock: 3800,
    free_stock: 3200,
    order_units: 0,
    market_price: 0.22,
    historical_price_last_month: 0.24,
    historical_price_last_year: 0.25,
    supplier: "Zurel",
    supplier_quality_score: 85,
    supplier_reliability_score: 88,
    waste_risk_adjusted_price: 0.24,
    price_stability_index: 90,
    price_deviation_pct: -12.0,
    inventory_pressure_score: 88,
    stock_days: 6.8,
    turnover_risk: "high",
    substitute_candidates: [],
    purchase_mix_proposal: [],
    weighted_purchase_price: 0.22,
    markdown_advice: "Overstock — markdown 20% to clear before ageing",
    markup_advice: null,
    advised_valuation_price: 0.18,
    sales_push_advice: "Urgent push — include in value bundles",
    procurement_action: "sales_push",
  },
];

// KPI summary helpers
export const computeKPIs = (rows: ProcurementDecisionRow[]) => {
  const totalRequired = rows.reduce((s, r) => s + r.required_units, 0);
  const totalStock = rows.reduce((s, r) => s + r.current_stock, 0);
  const totalFree = rows.reduce((s, r) => s + r.free_stock, 0);
  const totalOrder = rows.reduce((s, r) => s + r.order_units, 0);
  const avgPressure = Math.round(rows.reduce((s, r) => s + r.inventory_pressure_score, 0) / rows.length);
  const avgDeviation = +(rows.reduce((s, r) => s + r.price_deviation_pct, 0) / rows.length).toFixed(1);
  const actionNeeded = rows.filter(r => r.procurement_action !== "use_stock").length;
  const markdownCandidates = rows.filter(r => r.markdown_advice).length;
  const markupOpportunities = rows.filter(r => r.markup_advice).length;

  return { totalRequired, totalStock, totalFree, totalOrder, avgPressure, avgDeviation, actionNeeded, markdownCandidates, markupOpportunities };
};

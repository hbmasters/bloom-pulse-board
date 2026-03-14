/* ── Procurement Intelligence Data Layer ──
   Decision intelligence signals for Procurement Cockpit V1.5
   Future: Replace with API calls to HBMaster Procurement Decision Engine
*/

// ── Inventory Pressure ──
export type InventoryPressureStatus = "fresh" | "normal" | "slow" | "critical";

export interface InventoryPressureItem {
  product_id: string;
  status: InventoryPressureStatus;
  stock_days: number;
  turnover_speed: "fast" | "normal" | "slow";
  historical_movement: "increasing" | "stable" | "decreasing";
  explanation: string;
}

export const inventoryPressureLabels: Record<InventoryPressureStatus, { label: string; color: string }> = {
  fresh: { label: "Vers", color: "text-accent bg-accent/10 border-accent/20" },
  normal: { label: "Normaal", color: "text-foreground/70 bg-muted border-border" },
  slow: { label: "Traag", color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20" },
  critical: { label: "Kritiek", color: "text-destructive bg-destructive/10 border-destructive/20" },
};

export const inventoryPressureData: InventoryPressureItem[] = [
  { product_id: "1", status: "normal", stock_days: 2.4, turnover_speed: "normal", historical_movement: "stable", explanation: "Voorraad draait normaal. Geen actie nodig." },
  { product_id: "2", status: "fresh", stock_days: 0.8, turnover_speed: "fast", historical_movement: "increasing", explanation: "Zeer snelle omloop — hoge vraag. Voorraad is vers en wordt snel verbruikt." },
  { product_id: "3", status: "slow", stock_days: 4.2, turnover_speed: "slow", historical_movement: "decreasing", explanation: "Omloopsnelheid daalt. Overweeg markdown of sales push." },
  { product_id: "4", status: "critical", stock_days: 6.8, turnover_speed: "slow", historical_movement: "decreasing", explanation: "Voorraaddruk hoog — 6.8 dagen voorraad bij dalende vraag. Direct actie nodig." },
  { product_id: "5", status: "normal", stock_days: 2.1, turnover_speed: "normal", historical_movement: "stable", explanation: "Voorraad draait normaal. Geen bijzonderheden." },
  { product_id: "6", status: "critical", stock_days: 5.5, turnover_speed: "slow", historical_movement: "decreasing", explanation: "Hoge voorraaddruk door stijgende prijs en dalende vraag. Overweeg substituut." },
  { product_id: "7", status: "fresh", stock_days: 1.2, turnover_speed: "fast", historical_movement: "stable", explanation: "Vers product met snelle omloop. Seizoensproduct in piek." },
  { product_id: "8", status: "normal", stock_days: 1.8, turnover_speed: "normal", historical_movement: "stable", explanation: "Stabiele omloop. Geen actie nodig." },
  { product_id: "9", status: "slow", stock_days: 3.8, turnover_speed: "slow", historical_movement: "decreasing", explanation: "Omloopsnelheid neemt af. Monitor en overweeg volume-aanpassing." },
  { product_id: "10", status: "normal", stock_days: 1.5, turnover_speed: "normal", historical_movement: "increasing", explanation: "Vraag stijgt — voorraad draait goed." },
];

// ── Substitute Suggestions ──
export type SubstituteStatus = "available" | "recommended" | "none";

export interface SubstituteSuggestion {
  product_id: string;
  status: SubstituteStatus;
  candidates: {
    name: string;
    family_match: boolean;
    color_compatible: boolean;
    length_compatible: boolean;
    availability: "high" | "medium" | "low";
    price: number;
    confidence: number; // 0-100
  }[];
}

export const substituteStatusLabels: Record<SubstituteStatus, { label: string; color: string }> = {
  available: { label: "Substituut beschikbaar", color: "text-primary bg-primary/10 border-primary/20" },
  recommended: { label: "Substituut aanbevolen", color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20" },
  none: { label: "—", color: "text-muted-foreground bg-muted border-border" },
};

export const substituteSuggestions: SubstituteSuggestion[] = [
  { product_id: "1", status: "available", candidates: [
    { name: "Chrysant Baltica White", family_match: true, color_compatible: false, length_compatible: true, availability: "high", price: 0.066, confidence: 72 },
    { name: "Chrysant Pina Colada", family_match: true, color_compatible: true, length_compatible: true, availability: "medium", price: 0.078, confidence: 65 },
  ]},
  { product_id: "2", status: "recommended", candidates: [
    { name: "Roos Avalanche+", family_match: true, color_compatible: false, length_compatible: true, availability: "high", price: 0.130, confidence: 85 },
    { name: "Roos Freedom", family_match: true, color_compatible: true, length_compatible: true, availability: "medium", price: 0.115, confidence: 78 },
  ]},
  { product_id: "3", status: "none", candidates: [] },
  { product_id: "4", status: "available", candidates: [
    { name: "Gerbera Garvinea", family_match: true, color_compatible: true, length_compatible: true, availability: "medium", price: 0.048, confidence: 68 },
  ]},
  { product_id: "5", status: "none", candidates: [] },
  { product_id: "6", status: "recommended", candidates: [
    { name: "Alstroemeria Summer Dance", family_match: true, color_compatible: true, length_compatible: true, availability: "high", price: 0.058, confidence: 88 },
    { name: "Alstroemeria Inca Ice", family_match: true, color_compatible: false, length_compatible: true, availability: "medium", price: 0.055, confidence: 72 },
  ]},
  { product_id: "7", status: "none", candidates: [] },
  { product_id: "8", status: "available", candidates: [
    { name: "Roos Freedom", family_match: true, color_compatible: false, length_compatible: true, availability: "high", price: 0.115, confidence: 70 },
  ]},
  { product_id: "9", status: "none", candidates: [] },
  { product_id: "10", status: "available", candidates: [
    { name: "Lelie Siberia", family_match: true, color_compatible: false, length_compatible: true, availability: "medium", price: 0.170, confidence: 75 },
  ]},
];

// ── Purchase Mix Suggestions ──
export interface PurchaseMixSuggestion {
  product_id: string;
  has_mix: boolean;
  lines: { product: string; units: number; price: number; type: "main" | "substitute" }[];
  total_cost: number;
  savings_vs_single: number; // percentage
}

export const purchaseMixSuggestions: PurchaseMixSuggestion[] = [
  { product_id: "1", has_mix: false, lines: [], total_cost: 0, savings_vs_single: 0 },
  { product_id: "2", has_mix: true, lines: [
    { product: "Roos Red Naomi", units: 5000, price: 0.118, type: "main" },
    { product: "Roos Avalanche+", units: 1500, price: 0.130, type: "substitute" },
    { product: "Roos Freedom", units: 1400, price: 0.115, type: "substitute" },
  ], total_cost: 0.121, savings_vs_single: 2.5 },
  { product_id: "4", has_mix: true, lines: [
    { product: "Gerbera Kimsey", units: 5000, price: 0.044, type: "main" },
    { product: "Gerbera Garvinea", units: 2800, price: 0.048, type: "substitute" },
  ], total_cost: 0.046, savings_vs_single: 0 },
  { product_id: "6", has_mix: true, lines: [
    { product: "Alstroemeria Virginia", units: 3000, price: 0.068, type: "main" },
    { product: "Alstroemeria Summer Dance", units: 1600, price: 0.058, type: "substitute" },
  ], total_cost: 0.064, savings_vs_single: 5.9 },
  { product_id: "8", has_mix: true, lines: [
    { product: "Roos Avalanche+", units: 3500, price: 0.130, type: "main" },
    { product: "Roos Freedom", units: 1700, price: 0.115, type: "substitute" },
  ], total_cost: 0.125, savings_vs_single: 3.8 },
];

// ── Supplier Quality Grades (for Market Supply) ──
export type SupplierGrade = "A" | "B" | "C";

export interface SupplierQualityEntry {
  product: string;
  suppliers: {
    name: string;
    grade: SupplierGrade;
    quality_consistency: number; // 0-100
    delivery_reliability: number; // 0-100
    waste_risk: number; // percentage
  }[];
}

export const supplierGradeLabels: Record<SupplierGrade, { label: string; color: string }> = {
  A: { label: "A", color: "text-accent bg-accent/10 border-accent/20" },
  B: { label: "B", color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20" },
  C: { label: "C", color: "text-destructive bg-destructive/10 border-destructive/20" },
};

export const supplierQualityData: SupplierQualityEntry[] = [
  { product: "Roos Red Naomi", suppliers: [
    { name: "Bloem & Blad NL", grade: "A", quality_consistency: 97, delivery_reliability: 96, waste_risk: 2.1 },
    { name: "Van der Berg Flowers", grade: "A", quality_consistency: 95, delivery_reliability: 94, waste_risk: 2.8 },
    { name: "Kenya Direct BV", grade: "C", quality_consistency: 78, delivery_reliability: 72, waste_risk: 8.5 },
  ]},
  { product: "Roos Avalanche+", suppliers: [
    { name: "Bloem & Blad NL", grade: "A", quality_consistency: 98, delivery_reliability: 97, waste_risk: 1.8 },
    { name: "Rosalina BV", grade: "B", quality_consistency: 89, delivery_reliability: 88, waste_risk: 4.2 },
  ]},
  { product: "Chrysant Ringa Yellow", suppliers: [
    { name: "Van der Berg Flowers", grade: "A", quality_consistency: 94, delivery_reliability: 95, waste_risk: 2.5 },
    { name: "Flora Holland Pool", grade: "B", quality_consistency: 86, delivery_reliability: 84, waste_risk: 5.1 },
  ]},
  { product: "Chrysant Baltica White", suppliers: [
    { name: "Van der Berg Flowers", grade: "A", quality_consistency: 93, delivery_reliability: 94, waste_risk: 2.8 },
  ]},
  { product: "Tulp Strong Gold", suppliers: [
    { name: "Flora Holland Pool", grade: "B", quality_consistency: 85, delivery_reliability: 82, waste_risk: 4.8 },
  ]},
  { product: "Gerbera Kimsey", suppliers: [
    { name: "Gerbera Kwekerij Jansen", grade: "B", quality_consistency: 87, delivery_reliability: 83, waste_risk: 5.5 },
    { name: "Flora Holland Pool", grade: "B", quality_consistency: 84, delivery_reliability: 80, waste_risk: 6.2 },
  ]},
  { product: "Lisianthus Rosita White", suppliers: [
    { name: "Bloem & Blad NL", grade: "A", quality_consistency: 96, delivery_reliability: 95, waste_risk: 2.2 },
  ]},
  { product: "Alstroemeria Virginia", suppliers: [
    { name: "Bloem & Blad NL", grade: "A", quality_consistency: 95, delivery_reliability: 94, waste_risk: 3.0 },
    { name: "Flora Holland Pool", grade: "C", quality_consistency: 76, delivery_reliability: 74, waste_risk: 7.8 },
  ]},
  { product: "Zonnebloem Sunrich", suppliers: [
    { name: "Van der Berg Flowers", grade: "A", quality_consistency: 92, delivery_reliability: 93, waste_risk: 3.2 },
  ]},
  { product: "Lelie Stargazer", suppliers: [
    { name: "Rosalina BV", grade: "B", quality_consistency: 88, delivery_reliability: 86, waste_risk: 4.5 },
    { name: "Van der Berg Flowers", grade: "A", quality_consistency: 94, delivery_reliability: 95, waste_risk: 2.6 },
  ]},
];

// ── Effective Price Data (for Market Supply) ──
export interface EffectivePriceItem {
  product: string;
  best_price: number;
  waste_risk_pct: number;
  effective_price: number;
  best_effective_supplier: string;
}

export const effectivePriceData: EffectivePriceItem[] = [
  { product: "Roos Red Naomi", best_price: 0.112, waste_risk_pct: 2.1, effective_price: 0.114, best_effective_supplier: "Bloem & Blad NL" },
  { product: "Roos Avalanche+", best_price: 0.125, waste_risk_pct: 1.8, effective_price: 0.127, best_effective_supplier: "Bloem & Blad NL" },
  { product: "Chrysant Ringa Yellow", best_price: 0.065, waste_risk_pct: 2.5, effective_price: 0.067, best_effective_supplier: "Van der Berg Flowers" },
  { product: "Chrysant Baltica White", best_price: 0.060, waste_risk_pct: 2.8, effective_price: 0.062, best_effective_supplier: "Van der Berg Flowers" },
  { product: "Tulp Strong Gold", best_price: 0.048, waste_risk_pct: 4.8, effective_price: 0.050, best_effective_supplier: "Flora Holland Pool" },
  { product: "Gerbera Kimsey", best_price: 0.042, waste_risk_pct: 5.5, effective_price: 0.044, best_effective_supplier: "Gerbera Kwekerij Jansen" },
  { product: "Lisianthus Rosita White", best_price: 0.088, waste_risk_pct: 2.2, effective_price: 0.090, best_effective_supplier: "Bloem & Blad NL" },
  { product: "Alstroemeria Virginia", best_price: 0.062, waste_risk_pct: 3.0, effective_price: 0.064, best_effective_supplier: "Bloem & Blad NL" },
  { product: "Zonnebloem Sunrich", best_price: 0.082, waste_risk_pct: 3.2, effective_price: 0.085, best_effective_supplier: "Van der Berg Flowers" },
  { product: "Lelie Stargazer", best_price: 0.168, waste_risk_pct: 2.6, effective_price: 0.172, best_effective_supplier: "Van der Berg Flowers" },
];

// ── Design Stability (for Trade Registry) ──
export type DesignStability = "stable" | "limited_availability" | "price_risk";

export const designStabilityLabels: Record<DesignStability, { label: string; color: string }> = {
  stable: { label: "Stabiele keuze", color: "text-accent bg-accent/10 border-accent/20" },
  limited_availability: { label: "Beperkt beschikbaar", color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20" },
  price_risk: { label: "Prijsrisico", color: "text-destructive bg-destructive/10 border-destructive/20" },
};

/** Derive design stability from week data */
export function getDesignStability(
  availability: "high" | "medium" | "low" | "none",
  riskLevel: "low" | "medium" | "high",
  priceMultiplier?: number
): DesignStability {
  if (availability === "none" || availability === "low") return "limited_availability";
  if (riskLevel === "high") return "price_risk";
  return "stable";
}

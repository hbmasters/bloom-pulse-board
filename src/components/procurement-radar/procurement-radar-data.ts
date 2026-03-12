/* ── Mock data for Procurement Market Radar v0.1 ── */

export interface MarketProduct {
  id: string;
  product: string;
  product_family: string;
  required_volume: number;
  available_stock: number;
  reserved_stock: number;
  free_stock: number;
  contracted_volume: number;
  open_buy_need: number;
  calculated_price: number;
  clock_price: number;
  direct_price: number;
  best_market_price: number;
  variance_vs_calculated: number;
  supplier_count: number;
  urgency: "high" | "medium" | "low";
}

export interface SupplierOffer {
  supplier_name: string;
  offer_price: number;
  offer_quantity: number;
  delivery_timing: string;
  supplier_quality_score: number;
  supplier_reliability_score: number;
  price_stability_index: number;
  variance_vs_calculated: number;
  variance_vs_clock: number;
}

export interface SupplierPerformance {
  name: string;
  quality_accepted: number;
  rejection_pct: number;
  delivery_reliability: number;
  price_stability: number;
}

export interface Signal {
  type: "opportunity" | "risk" | "info";
  product: string;
  message: string;
}

/* ── Products ── */
export const marketProducts: MarketProduct[] = [
  { id: "1", product: "Chrysant Ringa Yellow", product_family: "Chrysant", required_volume: 12000, available_stock: 3200, reserved_stock: 1800, free_stock: 1400, contracted_volume: 5000, open_buy_need: 5600, calculated_price: 0.075, clock_price: 0.092, direct_price: 0.078, best_market_price: 0.072, variance_vs_calculated: -4.0, supplier_count: 5, urgency: "medium" },
  { id: "2", product: "Roos Red Naomi 50cm", product_family: "Roos", required_volume: 18000, available_stock: 2100, reserved_stock: 2100, free_stock: 0, contracted_volume: 8000, open_buy_need: 7900, calculated_price: 0.125, clock_price: 0.142, direct_price: 0.128, best_market_price: 0.118, variance_vs_calculated: -5.6, supplier_count: 8, urgency: "high" },
  { id: "3", product: "Tulp Strong Gold", product_family: "Tulp", required_volume: 9500, available_stock: 4800, reserved_stock: 2000, free_stock: 2800, contracted_volume: 3000, open_buy_need: 1700, calculated_price: 0.055, clock_price: 0.068, direct_price: 0.058, best_market_price: 0.052, variance_vs_calculated: -5.5, supplier_count: 4, urgency: "low" },
  { id: "4", product: "Gerbera Kimsey", product_family: "Gerbera", required_volume: 15000, available_stock: 1200, reserved_stock: 1200, free_stock: 0, contracted_volume: 6000, open_buy_need: 7800, calculated_price: 0.046, clock_price: 0.054, direct_price: 0.048, best_market_price: 0.044, variance_vs_calculated: -4.3, supplier_count: 6, urgency: "high" },
  { id: "5", product: "Lisianthus Rosita White", product_family: "Lisianthus", required_volume: 6000, available_stock: 2400, reserved_stock: 800, free_stock: 1600, contracted_volume: 2000, open_buy_need: 1600, calculated_price: 0.095, clock_price: 0.118, direct_price: 0.098, best_market_price: 0.091, variance_vs_calculated: -4.2, supplier_count: 3, urgency: "low" },
  { id: "6", product: "Alstroemeria Virginia", product_family: "Alstroemeria", required_volume: 8000, available_stock: 900, reserved_stock: 900, free_stock: 0, contracted_volume: 2500, open_buy_need: 4600, calculated_price: 0.062, clock_price: 0.074, direct_price: 0.065, best_market_price: 0.068, variance_vs_calculated: 9.7, supplier_count: 3, urgency: "high" },
  { id: "7", product: "Zonnebloem Sunrich", product_family: "Zonnebloem", required_volume: 5000, available_stock: 3100, reserved_stock: 1000, free_stock: 2100, contracted_volume: 1500, open_buy_need: 400, calculated_price: 0.088, clock_price: 0.098, direct_price: 0.090, best_market_price: 0.085, variance_vs_calculated: -3.4, supplier_count: 4, urgency: "low" },
  { id: "8", product: "Roos Avalanche+ 60cm", product_family: "Roos", required_volume: 14000, available_stock: 1800, reserved_stock: 1800, free_stock: 0, contracted_volume: 7000, open_buy_need: 5200, calculated_price: 0.135, clock_price: 0.155, direct_price: 0.138, best_market_price: 0.130, variance_vs_calculated: -3.7, supplier_count: 7, urgency: "medium" },
];

/* ── Supplier offers per product id ── */
export const supplierOffers: Record<string, SupplierOffer[]> = {
  "1": [
    { supplier_name: "Van der Berg Flowers", offer_price: 0.072, offer_quantity: 4000, delivery_timing: "Morgen", supplier_quality_score: 97, supplier_reliability_score: 96, price_stability_index: 94, variance_vs_calculated: -4.0, variance_vs_clock: -21.7 },
    { supplier_name: "Flora Holland Pool", offer_price: 0.078, offer_quantity: 6000, delivery_timing: "Morgen", supplier_quality_score: 93, supplier_reliability_score: 91, price_stability_index: 82, variance_vs_calculated: 4.0, variance_vs_clock: -15.2 },
    { supplier_name: "Kenya Direct BV", offer_price: 0.065, offer_quantity: 8000, delivery_timing: "3 dagen", supplier_quality_score: 88, supplier_reliability_score: 82, price_stability_index: 68, variance_vs_calculated: -13.3, variance_vs_clock: -29.3 },
  ],
  "2": [
    { supplier_name: "Bloem & Blad NL", offer_price: 0.118, offer_quantity: 5000, delivery_timing: "Morgen", supplier_quality_score: 99, supplier_reliability_score: 97, price_stability_index: 96, variance_vs_calculated: -5.6, variance_vs_clock: -16.9 },
    { supplier_name: "Van der Berg Flowers", offer_price: 0.122, offer_quantity: 3000, delivery_timing: "Morgen", supplier_quality_score: 97, supplier_reliability_score: 96, price_stability_index: 94, variance_vs_calculated: -2.4, variance_vs_clock: -14.1 },
    { supplier_name: "Rosalina BV", offer_price: 0.128, offer_quantity: 6000, delivery_timing: "Morgen", supplier_quality_score: 95, supplier_reliability_score: 93, price_stability_index: 90, variance_vs_calculated: 2.4, variance_vs_clock: -9.9 },
    { supplier_name: "Kenya Direct BV", offer_price: 0.112, offer_quantity: 10000, delivery_timing: "4 dagen", supplier_quality_score: 86, supplier_reliability_score: 80, price_stability_index: 65, variance_vs_calculated: -10.4, variance_vs_clock: -21.1 },
  ],
  "4": [
    { supplier_name: "Flora Holland Pool", offer_price: 0.044, offer_quantity: 5000, delivery_timing: "Morgen", supplier_quality_score: 93, supplier_reliability_score: 91, price_stability_index: 85, variance_vs_calculated: -4.3, variance_vs_clock: -18.5 },
    { supplier_name: "Van der Berg Flowers", offer_price: 0.046, offer_quantity: 4000, delivery_timing: "Morgen", supplier_quality_score: 97, supplier_reliability_score: 96, price_stability_index: 94, variance_vs_calculated: 0.0, variance_vs_clock: -14.8 },
    { supplier_name: "Gerbera Kwekerij Jansen", offer_price: 0.042, offer_quantity: 8000, delivery_timing: "2 dagen", supplier_quality_score: 91, supplier_reliability_score: 88, price_stability_index: 78, variance_vs_calculated: -8.7, variance_vs_clock: -22.2 },
  ],
  "6": [
    { supplier_name: "Flora Holland Pool", offer_price: 0.068, offer_quantity: 3000, delivery_timing: "Morgen", supplier_quality_score: 93, supplier_reliability_score: 91, price_stability_index: 82, variance_vs_calculated: 9.7, variance_vs_clock: -8.1 },
    { supplier_name: "Bloem & Blad NL", offer_price: 0.064, offer_quantity: 2000, delivery_timing: "2 dagen", supplier_quality_score: 99, supplier_reliability_score: 97, price_stability_index: 96, variance_vs_calculated: 3.2, variance_vs_clock: -13.5 },
  ],
  "8": [
    { supplier_name: "Bloem & Blad NL", offer_price: 0.130, offer_quantity: 4000, delivery_timing: "Morgen", supplier_quality_score: 99, supplier_reliability_score: 97, price_stability_index: 96, variance_vs_calculated: -3.7, variance_vs_clock: -16.1 },
    { supplier_name: "Rosalina BV", offer_price: 0.135, offer_quantity: 3000, delivery_timing: "Morgen", supplier_quality_score: 95, supplier_reliability_score: 93, price_stability_index: 90, variance_vs_calculated: 0.0, variance_vs_clock: -12.9 },
    { supplier_name: "Kenya Direct BV", offer_price: 0.125, offer_quantity: 7000, delivery_timing: "4 dagen", supplier_quality_score: 86, supplier_reliability_score: 80, price_stability_index: 65, variance_vs_calculated: -7.4, variance_vs_clock: -19.4 },
  ],
};

/* ── Supplier performance ── */
export const supplierPerformance: SupplierPerformance[] = [
  { name: "Bloem & Blad NL", quality_accepted: 99.1, rejection_pct: 0.9, delivery_reliability: 97, price_stability: 96 },
  { name: "Van der Berg Flowers", quality_accepted: 97.4, rejection_pct: 2.6, delivery_reliability: 96, price_stability: 94 },
  { name: "Rosalina BV", quality_accepted: 95.2, rejection_pct: 4.8, delivery_reliability: 93, price_stability: 90 },
  { name: "Flora Holland Pool", quality_accepted: 93.5, rejection_pct: 6.5, delivery_reliability: 91, price_stability: 82 },
  { name: "Gerbera Kwekerij Jansen", quality_accepted: 91.0, rejection_pct: 9.0, delivery_reliability: 88, price_stability: 78 },
  { name: "Kenya Direct BV", quality_accepted: 86.2, rejection_pct: 13.8, delivery_reliability: 80, price_stability: 65 },
];

/* ── Signals ── */
export const signals: Signal[] = [
  { type: "opportunity", product: "Chrysant Ringa Yellow", message: "Kenya Direct biedt 13% onder berekende prijs – check kwaliteit" },
  { type: "opportunity", product: "Roos Red Naomi 50cm", message: "Bloem & Blad biedt top-kwaliteit 5.6% onder berekend" },
  { type: "risk", product: "Alstroemeria Virginia", message: "Beste marktprijs 9.7% boven berekend – prijsdruk" },
  { type: "risk", product: "Gerbera Kimsey", message: "Geen vrije voorraad – volledige inkoopbehoefte open" },
  { type: "risk", product: "Roos Red Naomi 50cm", message: "Geen vrije voorraad – hoge urgentie" },
  { type: "info", product: "Tulp Strong Gold", message: "Ruim voldoende voorraad – overweeg minder inkopen" },
  { type: "info", product: "Zonnebloem Sunrich", message: "Slechts 400 stuks nodig – laag risico" },
];

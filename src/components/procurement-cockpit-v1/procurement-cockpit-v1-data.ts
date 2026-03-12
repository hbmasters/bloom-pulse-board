/* ── Mock data for Procurement Cockpit v1 ── */

export type Urgency = "high" | "medium" | "low";
export type AIAdvice = "buy_now" | "wait" | "use_stock" | "prefer_supplier" | "contract_ok" | "price_high";

export interface ProcurementRow {
  id: string;
  product: string;
  product_family: string;
  customer: string;
  program: string;
  required_volume: number;
  available_stock: number;
  reserved_stock: number;
  free_stock: number;
  contracted_volume: number;
  open_buy_need: number;
  calculated_price: number;
  clock_price: number;
  direct_price: number;
  best_price: number;
  preferred_supplier: string;
  supplier_quality: number;
  supplier_reliability: number;
  supplier_score: number;
  variance_vs_calculated: number;
  ai_advice: AIAdvice;
  urgency: Urgency;
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

export const aiAdviceLabels: Record<AIAdvice, { label: string; color: string }> = {
  buy_now: { label: "Koop nu", color: "bg-accent/10 text-accent border-accent/20" },
  wait: { label: "Afwachten", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
  use_stock: { label: "Gebruik voorraad", color: "bg-primary/10 text-primary border-primary/20" },
  prefer_supplier: { label: "Voorkeur leverancier", color: "bg-accent/10 text-accent border-accent/20" },
  contract_ok: { label: "Contract voldoende", color: "bg-muted text-muted-foreground border-border" },
  price_high: { label: "Prijs te hoog", color: "bg-destructive/10 text-destructive border-destructive/20" },
};

/* ── Procurement rows ── */
export const procurementRows: ProcurementRow[] = [
  { id: "1", product: "Chrysant Ringa Yellow", product_family: "Chrysant", customer: "Bloemenveiling NL", program: "Week 12 – Pasen", required_volume: 12000, available_stock: 3200, reserved_stock: 1800, free_stock: 1400, contracted_volume: 5000, open_buy_need: 5600, calculated_price: 0.075, clock_price: 0.092, direct_price: 0.078, best_price: 0.072, preferred_supplier: "Van der Berg Flowers", supplier_quality: 97, supplier_reliability: 96, supplier_score: 95, variance_vs_calculated: -4.0, ai_advice: "buy_now", urgency: "medium" },
  { id: "2", product: "Roos Red Naomi 50cm", product_family: "Roos", customer: "Fleurop DE", program: "Week 12 – Valentijn restock", required_volume: 18000, available_stock: 2100, reserved_stock: 2100, free_stock: 0, contracted_volume: 8000, open_buy_need: 7900, calculated_price: 0.125, clock_price: 0.142, direct_price: 0.128, best_price: 0.118, preferred_supplier: "Bloem & Blad NL", supplier_quality: 99, supplier_reliability: 97, supplier_score: 98, variance_vs_calculated: -5.6, ai_advice: "buy_now", urgency: "high" },
  { id: "3", product: "Tulp Strong Gold", product_family: "Tulp", customer: "Albert Heijn", program: "Week 12 – Lente actie", required_volume: 9500, available_stock: 4800, reserved_stock: 2000, free_stock: 2800, contracted_volume: 3000, open_buy_need: 1700, calculated_price: 0.055, clock_price: 0.068, direct_price: 0.058, best_price: 0.052, preferred_supplier: "Flora Holland Pool", supplier_quality: 93, supplier_reliability: 91, supplier_score: 88, variance_vs_calculated: -5.5, ai_advice: "use_stock", urgency: "low" },
  { id: "4", product: "Gerbera Kimsey", product_family: "Gerbera", customer: "ALDI NL", program: "Week 12-13 Continu", required_volume: 15000, available_stock: 1200, reserved_stock: 1200, free_stock: 0, contracted_volume: 6000, open_buy_need: 7800, calculated_price: 0.046, clock_price: 0.054, direct_price: 0.048, best_price: 0.044, preferred_supplier: "Flora Holland Pool", supplier_quality: 93, supplier_reliability: 91, supplier_score: 88, variance_vs_calculated: -4.3, ai_advice: "buy_now", urgency: "high" },
  { id: "5", product: "Lisianthus Rosita White", product_family: "Lisianthus", customer: "Jumbo", program: "Week 13 – Moederdag prep", required_volume: 6000, available_stock: 2400, reserved_stock: 800, free_stock: 1600, contracted_volume: 2000, open_buy_need: 1600, calculated_price: 0.095, clock_price: 0.118, direct_price: 0.098, best_price: 0.091, preferred_supplier: "Bloem & Blad NL", supplier_quality: 99, supplier_reliability: 97, supplier_score: 98, variance_vs_calculated: -4.2, ai_advice: "wait", urgency: "low" },
  { id: "6", product: "Alstroemeria Virginia", product_family: "Alstroemeria", customer: "Lidl NL", program: "Week 12 – Actie", required_volume: 8000, available_stock: 900, reserved_stock: 900, free_stock: 0, contracted_volume: 2500, open_buy_need: 4600, calculated_price: 0.062, clock_price: 0.074, direct_price: 0.065, best_price: 0.068, preferred_supplier: "Bloem & Blad NL", supplier_quality: 99, supplier_reliability: 97, supplier_score: 98, variance_vs_calculated: 9.7, ai_advice: "price_high", urgency: "high" },
  { id: "7", product: "Zonnebloem Sunrich", product_family: "Zonnebloem", customer: "Bloemenveiling NL", program: "Week 13 – Zomer", required_volume: 5000, available_stock: 3100, reserved_stock: 1000, free_stock: 2100, contracted_volume: 1500, open_buy_need: 400, calculated_price: 0.088, clock_price: 0.098, direct_price: 0.090, best_price: 0.085, preferred_supplier: "Van der Berg Flowers", supplier_quality: 97, supplier_reliability: 96, supplier_score: 95, variance_vs_calculated: -3.4, ai_advice: "contract_ok", urgency: "low" },
  { id: "8", product: "Roos Avalanche+ 60cm", product_family: "Roos", customer: "Fleurop DE", program: "Week 12 – Bruiloft seizoen", required_volume: 14000, available_stock: 1800, reserved_stock: 1800, free_stock: 0, contracted_volume: 7000, open_buy_need: 5200, calculated_price: 0.135, clock_price: 0.155, direct_price: 0.138, best_price: 0.130, preferred_supplier: "Bloem & Blad NL", supplier_quality: 99, supplier_reliability: 97, supplier_score: 98, variance_vs_calculated: -3.7, ai_advice: "prefer_supplier", urgency: "medium" },
  { id: "9", product: "Chrysant Baltica White", product_family: "Chrysant", customer: "Albert Heijn", program: "Week 12-14 Continu", required_volume: 10000, available_stock: 5200, reserved_stock: 3000, free_stock: 2200, contracted_volume: 4000, open_buy_need: 800, calculated_price: 0.068, clock_price: 0.082, direct_price: 0.070, best_price: 0.066, preferred_supplier: "Van der Berg Flowers", supplier_quality: 97, supplier_reliability: 96, supplier_score: 95, variance_vs_calculated: -2.9, ai_advice: "use_stock", urgency: "low" },
  { id: "10", product: "Lelie Stargazer", product_family: "Lelie", customer: "Bloemenveiling NL", program: "Week 13 – Premium", required_volume: 4000, available_stock: 600, reserved_stock: 600, free_stock: 0, contracted_volume: 1500, open_buy_need: 1900, calculated_price: 0.185, clock_price: 0.210, direct_price: 0.190, best_price: 0.178, preferred_supplier: "Rosalina BV", supplier_quality: 95, supplier_reliability: 93, supplier_score: 91, variance_vs_calculated: -3.8, ai_advice: "buy_now", urgency: "medium" },
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
  "5": [
    { supplier_name: "Bloem & Blad NL", offer_price: 0.091, offer_quantity: 3000, delivery_timing: "Morgen", supplier_quality_score: 99, supplier_reliability_score: 97, price_stability_index: 96, variance_vs_calculated: -4.2, variance_vs_clock: -22.9 },
    { supplier_name: "Flora Holland Pool", offer_price: 0.098, offer_quantity: 4000, delivery_timing: "Morgen", supplier_quality_score: 93, supplier_reliability_score: 91, price_stability_index: 82, variance_vs_calculated: 3.2, variance_vs_clock: -16.9 },
  ],
  "10": [
    { supplier_name: "Rosalina BV", offer_price: 0.178, offer_quantity: 2000, delivery_timing: "Morgen", supplier_quality_score: 95, supplier_reliability_score: 93, price_stability_index: 90, variance_vs_calculated: -3.8, variance_vs_clock: -15.2 },
    { supplier_name: "Van der Berg Flowers", offer_price: 0.185, offer_quantity: 1500, delivery_timing: "Morgen", supplier_quality_score: 97, supplier_reliability_score: 96, price_stability_index: 94, variance_vs_calculated: 0.0, variance_vs_clock: -11.9 },
    { supplier_name: "Kenya Direct BV", offer_price: 0.168, offer_quantity: 3000, delivery_timing: "4 dagen", supplier_quality_score: 86, supplier_reliability_score: 80, price_stability_index: 65, variance_vs_calculated: -9.2, variance_vs_clock: -20.0 },
  ],
};

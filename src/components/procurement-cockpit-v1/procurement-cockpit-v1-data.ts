/* ── Mock data for Procurement Cockpit v1 ── */

export type Urgency = "high" | "medium" | "low";
export type AIAdvice = "buy_now" | "wait" | "use_stock" | "prefer_supplier" | "contract_ok" | "price_high";
export type ProcurementStatus = "current" | "urgent" | "today" | "completed";
export type ShopSyncStatus = "connected" | "delayed" | "no_data" | "outdated" | "error";

export interface ProcurementRow {
  id: string;
  product: string;
  stem_length: string;
  product_family: string;
  customers: string[];
  programs: string[];
  required_volume: number;
  available_stock: number;
  reserved_stock: number;
  free_stock: number;
  open_buy_need: number;
  historical_price: number;
  offer_price: number;
  advised_price: number;
  preferred_supplier: string;
  supplier_quality: number;
  supplier_reliability: number;
  supplier_score: number;
  external_quality: "A1" | "A2";
  internal_quality: number;
  variance_vs_calculated: number;
  ai_advice: AIAdvice;
  urgency: Urgency;
  status: ProcurementStatus;
}

export interface SupplierOffer {
  supplier_name: string;
  offer_price: number;
  offer_quantity: number;
  delivery_timing: string;
  supplier_quality_score: number;
  supplier_reliability_score: number;
  price_stability_index: number;
  variance_vs_historical: number;
  variance_vs_offer: number;
}

export interface ShopStatus {
  id: string;
  name: string;
  status: ShopSyncStatus;
  last_update: string;
  offers_count: number;
  sync_message: string;
}

export const aiAdviceLabels: Record<AIAdvice, { label: string; color: string }> = {
  buy_now: { label: "Koop nu", color: "bg-accent/10 text-accent border-accent/20" },
  wait: { label: "Afwachten", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
  use_stock: { label: "Gebruik voorraad", color: "bg-primary/10 text-primary border-primary/20" },
  prefer_supplier: { label: "Voorkeur leverancier", color: "bg-accent/10 text-accent border-accent/20" },
  contract_ok: { label: "Voldoende", color: "bg-muted text-muted-foreground border-border" },
  price_high: { label: "Prijs te hoog", color: "bg-destructive/10 text-destructive border-destructive/20" },
};

export const statusLabels: Record<ProcurementStatus, { label: string; color: string }> = {
  current: { label: "Actueel", color: "bg-primary/10 text-primary border-primary/20" },
  urgent: { label: "Urgent", color: "bg-destructive/10 text-destructive border-destructive/20" },
  today: { label: "Vandaag", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
  completed: { label: "Afgerond", color: "bg-accent/10 text-accent border-accent/20" },
};

export const shopSyncStatusLabels: Record<ShopSyncStatus, { label: string; color: string }> = {
  connected: { label: "Verbonden", color: "text-accent" },
  delayed: { label: "Vertraagd", color: "text-yellow-500" },
  no_data: { label: "Geen data", color: "text-muted-foreground" },
  outdated: { label: "Verouderd", color: "text-yellow-500" },
  error: { label: "Fout", color: "text-destructive" },
};

/* ── Shop statuses ── */
export const shopStatuses: ShopStatus[] = [
  { id: "s1", name: "Flora Holland", status: "connected", last_update: "12 mrt 2026, 08:32", offers_count: 248, sync_message: "Alle data actueel" },
  { id: "s2", name: "Van der Berg Flowers", status: "connected", last_update: "12 mrt 2026, 08:28", offers_count: 156, sync_message: "Alle data actueel" },
  { id: "s3", name: "Bloem & Blad NL", status: "connected", last_update: "12 mrt 2026, 08:30", offers_count: 312, sync_message: "Alle data actueel" },
  { id: "s4", name: "Rosalina BV", status: "delayed", last_update: "12 mrt 2026, 07:15", offers_count: 89, sync_message: "Laatste sync >1 uur geleden" },
  { id: "s5", name: "Kenya Direct BV", status: "outdated", last_update: "11 mrt 2026, 22:00", offers_count: 64, sync_message: "Data van gisteren" },
  { id: "s6", name: "Gerbera Kwekerij Jansen", status: "connected", last_update: "12 mrt 2026, 08:25", offers_count: 42, sync_message: "Alle data actueel" },
];

/* ── Procurement rows ── */
export const procurementRows: ProcurementRow[] = [
  { id: "1", product: "Chrysant Ringa Yellow", stem_length: "70cm", product_family: "Chrysant", customers: ["Bloemenveiling NL", "Albert Heijn"], programs: ["Week 12 – Pasen"], required_volume: 12000, available_stock: 3200, reserved_stock: 1800, free_stock: 1400, open_buy_need: 5600, historical_price: 0.075, offer_price: 0.072, advised_price: 0.074, preferred_supplier: "Van der Berg Flowers", supplier_quality: 97, supplier_reliability: 96, supplier_score: 95, external_quality: "A1", internal_quality: 96, variance_vs_calculated: -4.0, ai_advice: "buy_now", urgency: "medium", status: "current" },
  { id: "2", product: "Roos Red Naomi", stem_length: "50cm", product_family: "Roos", customers: ["Fleurop DE"], programs: ["Week 12 – Valentijn restock"], required_volume: 18000, available_stock: 2100, reserved_stock: 2100, free_stock: 0, open_buy_need: 7900, historical_price: 0.125, offer_price: 0.118, advised_price: 0.122, preferred_supplier: "Bloem & Blad NL", supplier_quality: 99, supplier_reliability: 97, supplier_score: 98, external_quality: "A1", internal_quality: 98, variance_vs_calculated: -5.6, ai_advice: "buy_now", urgency: "high", status: "urgent" },
  { id: "3", product: "Tulp Strong Gold", stem_length: "40cm", product_family: "Tulp", customers: ["Albert Heijn", "Jumbo"], programs: ["Week 12 – Lente actie"], required_volume: 9500, available_stock: 4800, reserved_stock: 2000, free_stock: 2800, open_buy_need: 1700, historical_price: 0.055, offer_price: 0.052, advised_price: 0.054, preferred_supplier: "Flora Holland Pool", supplier_quality: 93, supplier_reliability: 91, supplier_score: 88, external_quality: "A1", internal_quality: 91, variance_vs_calculated: -5.5, ai_advice: "use_stock", urgency: "low", status: "current" },
  { id: "4", product: "Gerbera Kimsey", stem_length: "55cm", product_family: "Gerbera", customers: ["ALDI NL"], programs: ["Week 12-13 Continu"], required_volume: 15000, available_stock: 1200, reserved_stock: 1200, free_stock: 0, open_buy_need: 7800, historical_price: 0.046, offer_price: 0.044, advised_price: 0.045, preferred_supplier: "Gerbera Kwekerij Jansen", supplier_quality: 91, supplier_reliability: 88, supplier_score: 88, external_quality: "A2", internal_quality: 87, variance_vs_calculated: -4.3, ai_advice: "buy_now", urgency: "high", status: "today" },
  { id: "5", product: "Lisianthus Rosita White", stem_length: "60cm", product_family: "Lisianthus", customers: ["Jumbo"], programs: ["Week 13 – Moederdag prep"], required_volume: 6000, available_stock: 2400, reserved_stock: 800, free_stock: 1600, open_buy_need: 1600, historical_price: 0.095, offer_price: 0.091, advised_price: 0.093, preferred_supplier: "Bloem & Blad NL", supplier_quality: 99, supplier_reliability: 97, supplier_score: 98, external_quality: "A1", internal_quality: 95, variance_vs_calculated: -4.2, ai_advice: "wait", urgency: "low", status: "current" },
  { id: "6", product: "Alstroemeria Virginia", stem_length: "65cm", product_family: "Alstroemeria", customers: ["Lidl NL"], programs: ["Week 12 – Actie"], required_volume: 8000, available_stock: 900, reserved_stock: 900, free_stock: 0, open_buy_need: 4600, historical_price: 0.062, offer_price: 0.068, advised_price: 0.064, preferred_supplier: "Bloem & Blad NL", supplier_quality: 99, supplier_reliability: 97, supplier_score: 98, external_quality: "A1", internal_quality: 94, variance_vs_calculated: 9.7, ai_advice: "price_high", urgency: "high", status: "urgent" },
  { id: "7", product: "Zonnebloem Sunrich", stem_length: "80cm", product_family: "Zonnebloem", customers: ["Bloemenveiling NL"], programs: ["Week 13 – Zomer"], required_volume: 5000, available_stock: 3100, reserved_stock: 1000, free_stock: 2100, open_buy_need: 400, historical_price: 0.088, offer_price: 0.085, advised_price: 0.087, preferred_supplier: "Van der Berg Flowers", supplier_quality: 97, supplier_reliability: 96, supplier_score: 95, external_quality: "A1", internal_quality: 97, variance_vs_calculated: -3.4, ai_advice: "contract_ok", urgency: "low", status: "completed" },
  { id: "8", product: "Roos Avalanche+", stem_length: "60cm", product_family: "Roos", customers: ["Fleurop DE", "Bloemenveiling NL"], programs: ["Week 12 – Bruiloft seizoen"], required_volume: 14000, available_stock: 1800, reserved_stock: 1800, free_stock: 0, open_buy_need: 5200, historical_price: 0.135, offer_price: 0.130, advised_price: 0.133, preferred_supplier: "Bloem & Blad NL", supplier_quality: 99, supplier_reliability: 97, supplier_score: 98, external_quality: "A1", internal_quality: 96, variance_vs_calculated: -3.7, ai_advice: "prefer_supplier", urgency: "medium", status: "current" },
  { id: "9", product: "Chrysant Baltica White", stem_length: "70cm", product_family: "Chrysant", customers: ["Albert Heijn"], programs: ["Week 12-14 Continu"], required_volume: 10000, available_stock: 5200, reserved_stock: 3000, free_stock: 2200, open_buy_need: 800, historical_price: 0.068, offer_price: 0.066, advised_price: 0.067, preferred_supplier: "Van der Berg Flowers", supplier_quality: 97, supplier_reliability: 96, supplier_score: 95, external_quality: "A1", internal_quality: 93, variance_vs_calculated: -2.9, ai_advice: "use_stock", urgency: "low", status: "completed" },
  { id: "10", product: "Lelie Stargazer", stem_length: "75cm", product_family: "Lelie", customers: ["Bloemenveiling NL"], programs: ["Week 13 – Premium"], required_volume: 4000, available_stock: 600, reserved_stock: 600, free_stock: 0, open_buy_need: 1900, historical_price: 0.185, offer_price: 0.178, advised_price: 0.182, preferred_supplier: "Rosalina BV", supplier_quality: 95, supplier_reliability: 93, supplier_score: 91, external_quality: "A1", internal_quality: 92, variance_vs_calculated: -3.8, ai_advice: "buy_now", urgency: "medium", status: "today" },
];

/* ── Supplier offers per product id ── */
export const supplierOffers: Record<string, SupplierOffer[]> = {
  "1": [
    { supplier_name: "Van der Berg Flowers", offer_price: 0.072, offer_quantity: 4000, delivery_timing: "Morgen", supplier_quality_score: 97, supplier_reliability_score: 96, price_stability_index: 94, variance_vs_historical: -4.0, variance_vs_offer: 0.0 },
    { supplier_name: "Flora Holland Pool", offer_price: 0.078, offer_quantity: 6000, delivery_timing: "Morgen", supplier_quality_score: 93, supplier_reliability_score: 91, price_stability_index: 82, variance_vs_historical: 4.0, variance_vs_offer: 8.3 },
    { supplier_name: "Kenya Direct BV", offer_price: 0.065, offer_quantity: 8000, delivery_timing: "3 dagen", supplier_quality_score: 88, supplier_reliability_score: 82, price_stability_index: 68, variance_vs_historical: -13.3, variance_vs_offer: -9.7 },
  ],
  "2": [
    { supplier_name: "Bloem & Blad NL", offer_price: 0.118, offer_quantity: 5000, delivery_timing: "Morgen", supplier_quality_score: 99, supplier_reliability_score: 97, price_stability_index: 96, variance_vs_historical: -5.6, variance_vs_offer: 0.0 },
    { supplier_name: "Van der Berg Flowers", offer_price: 0.122, offer_quantity: 3000, delivery_timing: "Morgen", supplier_quality_score: 97, supplier_reliability_score: 96, price_stability_index: 94, variance_vs_historical: -2.4, variance_vs_offer: 3.4 },
    { supplier_name: "Rosalina BV", offer_price: 0.128, offer_quantity: 6000, delivery_timing: "Morgen", supplier_quality_score: 95, supplier_reliability_score: 93, price_stability_index: 90, variance_vs_historical: 2.4, variance_vs_offer: 8.5 },
    { supplier_name: "Kenya Direct BV", offer_price: 0.112, offer_quantity: 10000, delivery_timing: "4 dagen", supplier_quality_score: 86, supplier_reliability_score: 80, price_stability_index: 65, variance_vs_historical: -10.4, variance_vs_offer: -5.1 },
  ],
  "4": [
    { supplier_name: "Gerbera Kwekerij Jansen", offer_price: 0.042, offer_quantity: 8000, delivery_timing: "2 dagen", supplier_quality_score: 91, supplier_reliability_score: 88, price_stability_index: 78, variance_vs_historical: -8.7, variance_vs_offer: -4.5 },
    { supplier_name: "Flora Holland Pool", offer_price: 0.044, offer_quantity: 5000, delivery_timing: "Morgen", supplier_quality_score: 93, supplier_reliability_score: 91, price_stability_index: 85, variance_vs_historical: -4.3, variance_vs_offer: 0.0 },
    { supplier_name: "Van der Berg Flowers", offer_price: 0.046, offer_quantity: 4000, delivery_timing: "Morgen", supplier_quality_score: 97, supplier_reliability_score: 96, price_stability_index: 94, variance_vs_historical: 0.0, variance_vs_offer: 4.5 },
  ],
  "6": [
    { supplier_name: "Bloem & Blad NL", offer_price: 0.064, offer_quantity: 2000, delivery_timing: "2 dagen", supplier_quality_score: 99, supplier_reliability_score: 97, price_stability_index: 96, variance_vs_historical: 3.2, variance_vs_offer: -5.9 },
    { supplier_name: "Flora Holland Pool", offer_price: 0.068, offer_quantity: 3000, delivery_timing: "Morgen", supplier_quality_score: 93, supplier_reliability_score: 91, price_stability_index: 82, variance_vs_historical: 9.7, variance_vs_offer: 0.0 },
  ],
  "8": [
    { supplier_name: "Bloem & Blad NL", offer_price: 0.130, offer_quantity: 4000, delivery_timing: "Morgen", supplier_quality_score: 99, supplier_reliability_score: 97, price_stability_index: 96, variance_vs_historical: -3.7, variance_vs_offer: 0.0 },
    { supplier_name: "Rosalina BV", offer_price: 0.135, offer_quantity: 3000, delivery_timing: "Morgen", supplier_quality_score: 95, supplier_reliability_score: 93, price_stability_index: 90, variance_vs_historical: 0.0, variance_vs_offer: 3.8 },
    { supplier_name: "Kenya Direct BV", offer_price: 0.125, offer_quantity: 7000, delivery_timing: "4 dagen", supplier_quality_score: 86, supplier_reliability_score: 80, price_stability_index: 65, variance_vs_historical: -7.4, variance_vs_offer: -3.8 },
  ],
  "5": [
    { supplier_name: "Bloem & Blad NL", offer_price: 0.091, offer_quantity: 3000, delivery_timing: "Morgen", supplier_quality_score: 99, supplier_reliability_score: 97, price_stability_index: 96, variance_vs_historical: -4.2, variance_vs_offer: 0.0 },
    { supplier_name: "Flora Holland Pool", offer_price: 0.098, offer_quantity: 4000, delivery_timing: "Morgen", supplier_quality_score: 93, supplier_reliability_score: 91, price_stability_index: 82, variance_vs_historical: 3.2, variance_vs_offer: 7.7 },
  ],
  "10": [
    { supplier_name: "Rosalina BV", offer_price: 0.178, offer_quantity: 2000, delivery_timing: "Morgen", supplier_quality_score: 95, supplier_reliability_score: 93, price_stability_index: 90, variance_vs_historical: -3.8, variance_vs_offer: 0.0 },
    { supplier_name: "Van der Berg Flowers", offer_price: 0.185, offer_quantity: 1500, delivery_timing: "Morgen", supplier_quality_score: 97, supplier_reliability_score: 96, price_stability_index: 94, variance_vs_historical: 0.0, variance_vs_offer: 3.9 },
    { supplier_name: "Kenya Direct BV", offer_price: 0.168, offer_quantity: 3000, delivery_timing: "4 dagen", supplier_quality_score: 86, supplier_reliability_score: 80, price_stability_index: 65, variance_vs_historical: -9.2, variance_vs_offer: -5.6 },
  ],
};

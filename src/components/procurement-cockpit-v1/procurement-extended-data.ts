/* ── Extended data for Procurement Cockpit: Market Supply, Trade Registry, Design Advisory, Price Check ── */

export type SupplyPressure = "low" | "normal" | "high" | "critical";
export type Seasonality = "in_season" | "shoulder" | "off_season";
export type RiskLevel = "low" | "medium" | "high";
export type DesignAdvice = "good_choice" | "expensive" | "limited_availability" | "substitute_recommended" | "stable_option";
export type MarkupAdvice = "markup_possible" | "markdown_advised" | "hold" | "none";

/* ── Market Supply ── */
export interface MarketSupplyItem {
  product_family: string;
  product: string;
  available_supply: number;
  supplier_count: number;
  price_low: number;
  price_high: number;
  best_price: number;
  price_trend: number; // % MoM
  supply_pressure: SupplyPressure;
  last_updated: string;
}

export const marketSupplyData: MarketSupplyItem[] = [
  { product_family: "Roos", product: "Roos Red Naomi", available_supply: 45000, supplier_count: 6, price_low: 0.105, price_high: 0.145, best_price: 0.112, price_trend: 8.4, supply_pressure: "high", last_updated: "12 mrt 08:30" },
  { product_family: "Roos", product: "Roos Avalanche+", available_supply: 32000, supplier_count: 5, price_low: 0.118, price_high: 0.155, best_price: 0.125, price_trend: 3.2, supply_pressure: "normal", last_updated: "12 mrt 08:30" },
  { product_family: "Chrysant", product: "Chrysant Ringa Yellow", available_supply: 68000, supplier_count: 4, price_low: 0.058, price_high: 0.085, best_price: 0.065, price_trend: -2.1, supply_pressure: "low", last_updated: "12 mrt 08:28" },
  { product_family: "Chrysant", product: "Chrysant Baltica White", available_supply: 52000, supplier_count: 4, price_low: 0.055, price_high: 0.078, best_price: 0.060, price_trend: -1.5, supply_pressure: "low", last_updated: "12 mrt 08:28" },
  { product_family: "Tulp", product: "Tulp Strong Gold", available_supply: 120000, supplier_count: 8, price_low: 0.042, price_high: 0.065, best_price: 0.048, price_trend: -5.2, supply_pressure: "low", last_updated: "12 mrt 08:32" },
  { product_family: "Gerbera", product: "Gerbera Kimsey", available_supply: 18000, supplier_count: 3, price_low: 0.038, price_high: 0.052, best_price: 0.042, price_trend: 12.1, supply_pressure: "critical", last_updated: "12 mrt 08:25" },
  { product_family: "Lisianthus", product: "Lisianthus Rosita White", available_supply: 14000, supplier_count: 3, price_low: 0.082, price_high: 0.105, best_price: 0.088, price_trend: 1.8, supply_pressure: "normal", last_updated: "12 mrt 08:30" },
  { product_family: "Alstroemeria", product: "Alstroemeria Virginia", available_supply: 9500, supplier_count: 2, price_low: 0.058, price_high: 0.074, best_price: 0.062, price_trend: 6.5, supply_pressure: "high", last_updated: "12 mrt 08:30" },
  { product_family: "Zonnebloem", product: "Zonnebloem Sunrich", available_supply: 28000, supplier_count: 4, price_low: 0.075, price_high: 0.098, best_price: 0.082, price_trend: -0.8, supply_pressure: "low", last_updated: "12 mrt 08:32" },
  { product_family: "Lelie", product: "Lelie Stargazer", available_supply: 8500, supplier_count: 3, price_low: 0.155, price_high: 0.198, best_price: 0.168, price_trend: 4.2, supply_pressure: "high", last_updated: "12 mrt 08:28" },
];

export const supplyPressureLabels: Record<SupplyPressure, { label: string; color: string }> = {
  low: { label: "Ruim", color: "text-accent bg-accent/10 border-accent/20" },
  normal: { label: "Normaal", color: "text-foreground/70 bg-muted border-border" },
  high: { label: "Krap", color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20" },
  critical: { label: "Kritiek", color: "text-destructive bg-destructive/10 border-destructive/20" },
};

/* ── Trade Registry (52 weeks) ── */
export interface TradeRegistryEntry {
  product_family: string;
  product: string;
  weeks: TradeWeek[];
}

export interface TradeWeek {
  week: number;
  year: number;
  expected_availability: "high" | "medium" | "low" | "none";
  expected_price_low: number;
  expected_price_high: number;
  supplier_count: number;
  seasonality: Seasonality;
  risk_level: RiskLevel;
  /** true = realized historic data, false/undefined = forecast */
  historical?: boolean;
  /** Actual realized price (only for historical weeks) */
  actual_price?: number;
  /** Actual realized volume (only for historical weeks) */
  actual_volume?: number;
}

const CURRENT_WEEK = 11; // week 11 of 2026
const HISTORY_WEEKS = 12; // show 12 weeks of history

const generateWeeks = (
  basePrice: number,
  seasonPattern: number[],
  availPattern: ("high" | "medium" | "low" | "none")[],
  riskPattern: RiskLevel[],
  supplierBase: number
): TradeWeek[] => {
  const totalWeeks = HISTORY_WEEKS + 52; // 12 past + 52 future
  return Array.from({ length: totalWeeks }, (_, i) => {
    const offset = i - HISTORY_WEEKS; // negative = past, 0 = current week, positive = future
    const rawWeek = CURRENT_WEEK + offset;
    const week = ((rawWeek - 1 + 520) % 52) + 1; // normalize to 1-52
    const year = rawWeek <= 0 ? 2025 : rawWeek > 52 ? 2027 : 2026;
    const idx = ((i % seasonPattern.length) + seasonPattern.length) % seasonPattern.length;
    const priceMultiplier = seasonPattern[idx];
    const seasonality: Seasonality = priceMultiplier > 1.15 ? "off_season" : priceMultiplier < 0.9 ? "in_season" : "shoulder";
    const isHistorical = offset < 0;
    const priceLow = +(basePrice * priceMultiplier * 0.85).toFixed(3);
    const priceHigh = +(basePrice * priceMultiplier * 1.15).toFixed(3);
    return {
      week,
      year,
      expected_availability: availPattern[idx % availPattern.length],
      expected_price_low: priceLow,
      expected_price_high: priceHigh,
      supplier_count: Math.max(1, supplierBase + (availPattern[idx % availPattern.length] === "high" ? 2 : availPattern[idx % availPattern.length] === "low" ? -1 : 0)),
      seasonality,
      risk_level: riskPattern[idx % riskPattern.length],
      historical: isHistorical || undefined,
      actual_price: isHistorical ? +(basePrice * priceMultiplier * (0.92 + Math.random() * 0.16)).toFixed(3) : undefined,
      actual_volume: isHistorical ? Math.round(800 + Math.random() * 4000) : undefined,
    };
  });
};

export const tradeRegistry: TradeRegistryEntry[] = [
  {
    product_family: "Roos",
    product: "Roos Red Naomi",
    weeks: generateWeeks(0.125, [1.0, 1.0, 1.05, 1.1, 1.2, 1.35, 1.4, 1.3, 1.1, 0.95, 0.9, 0.85], ["high", "high", "high", "medium", "medium", "low", "low", "medium", "high", "high", "high", "high"], ["low", "low", "medium", "medium", "high", "high", "high", "medium", "low", "low", "low", "low"], 5),
  },
  {
    product_family: "Roos",
    product: "Roos Avalanche+",
    weeks: generateWeeks(0.135, [1.0, 1.0, 1.05, 1.1, 1.15, 1.25, 1.3, 1.2, 1.05, 0.95, 0.9, 0.88], ["high", "high", "high", "medium", "medium", "low", "low", "medium", "high", "high", "high", "high"], ["low", "low", "low", "medium", "medium", "high", "high", "medium", "low", "low", "low", "low"], 4),
  },
  {
    product_family: "Chrysant",
    product: "Chrysant Ringa Yellow",
    weeks: generateWeeks(0.075, [0.9, 0.85, 0.85, 0.9, 1.0, 1.1, 1.15, 1.1, 1.0, 0.95, 0.9, 0.88], ["high", "high", "high", "high", "medium", "medium", "low", "medium", "high", "high", "high", "high"], ["low", "low", "low", "low", "low", "medium", "medium", "medium", "low", "low", "low", "low"], 4),
  },
  {
    product_family: "Tulp",
    product: "Tulp Strong Gold",
    weeks: generateWeeks(0.055, [0.8, 0.75, 0.78, 0.85, 1.0, 1.3, 1.5, 1.5, 1.2, 1.0, 0.9, 0.82], ["high", "high", "high", "high", "medium", "low", "none", "none", "low", "medium", "high", "high"], ["low", "low", "low", "low", "medium", "high", "high", "high", "medium", "low", "low", "low"], 7),
  },
  {
    product_family: "Gerbera",
    product: "Gerbera Kimsey",
    weeks: generateWeeks(0.046, [1.0, 1.0, 1.0, 1.05, 1.1, 1.15, 1.2, 1.15, 1.05, 1.0, 0.95, 0.95], ["medium", "medium", "medium", "medium", "low", "low", "low", "low", "medium", "medium", "medium", "medium"], ["medium", "medium", "medium", "medium", "high", "high", "high", "high", "medium", "medium", "medium", "medium"], 3),
  },
  {
    product_family: "Lisianthus",
    product: "Lisianthus Rosita White",
    weeks: generateWeeks(0.095, [1.2, 1.15, 1.1, 1.0, 0.9, 0.85, 0.82, 0.85, 0.9, 1.0, 1.1, 1.15], ["low", "low", "medium", "high", "high", "high", "high", "high", "medium", "medium", "low", "low"], ["high", "high", "medium", "low", "low", "low", "low", "low", "medium", "medium", "high", "high"], 3),
  },
  {
    product_family: "Alstroemeria",
    product: "Alstroemeria Virginia",
    weeks: generateWeeks(0.062, [1.0, 0.95, 0.92, 0.9, 0.95, 1.05, 1.1, 1.15, 1.1, 1.05, 1.0, 1.0], ["medium", "high", "high", "high", "high", "medium", "medium", "low", "medium", "medium", "medium", "medium"], ["medium", "low", "low", "low", "low", "medium", "medium", "high", "medium", "medium", "medium", "medium"], 2),
  },
  {
    product_family: "Zonnebloem",
    product: "Zonnebloem Sunrich",
    weeks: generateWeeks(0.088, [1.4, 1.5, 1.5, 1.3, 1.0, 0.8, 0.75, 0.78, 0.85, 1.0, 1.2, 1.35], ["none", "none", "none", "low", "medium", "high", "high", "high", "high", "medium", "low", "none"], ["high", "high", "high", "high", "medium", "low", "low", "low", "low", "medium", "high", "high"], 3),
  },
  {
    product_family: "Lelie",
    product: "Lelie Stargazer",
    weeks: generateWeeks(0.185, [1.1, 1.05, 1.0, 0.95, 0.9, 0.88, 0.9, 0.95, 1.0, 1.05, 1.1, 1.12], ["medium", "medium", "high", "high", "high", "high", "high", "high", "medium", "medium", "medium", "medium"], ["medium", "low", "low", "low", "low", "low", "low", "low", "medium", "medium", "medium", "medium"], 3),
  },
];

export const seasonalityLabels: Record<Seasonality, { label: string; color: string }> = {
  in_season: { label: "Seizoen", color: "text-accent" },
  shoulder: { label: "Overgang", color: "text-yellow-500" },
  off_season: { label: "Buiten seizoen", color: "text-destructive" },
};

export const riskLabels: Record<RiskLevel, { label: string; color: string }> = {
  low: { label: "Laag", color: "text-accent" },
  medium: { label: "Medium", color: "text-yellow-500" },
  high: { label: "Hoog", color: "text-destructive" },
};

export const availabilityLabels: Record<string, { label: string; color: string; bg: string }> = {
  high: { label: "Hoog", color: "text-accent", bg: "bg-accent/20" },
  medium: { label: "Medium", color: "text-yellow-500", bg: "bg-yellow-500/20" },
  low: { label: "Laag", color: "text-destructive", bg: "bg-destructive/20" },
  none: { label: "Niet beschikbaar", color: "text-muted-foreground", bg: "bg-muted" },
};

/* ── Design Advisory per product ── */
export interface DesignAdvisoryItem {
  product_id: string;
  product: string;
  design_advice: DesignAdvice;
  advice_detail: string;
  substitute?: string;
  market_price: number;
  markup_advice: MarkupAdvice;
  markup_detail: string;
}

export const designAdviceLabels: Record<DesignAdvice, { label: string; color: string; icon: string }> = {
  good_choice: { label: "Goede keuze", color: "text-accent bg-accent/10 border-accent/20", icon: "✓" },
  expensive: { label: "Duur", color: "text-destructive bg-destructive/10 border-destructive/20", icon: "€€" },
  limited_availability: { label: "Beperkt beschikbaar", color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20", icon: "!" },
  substitute_recommended: { label: "Substituut aangeraden", color: "text-primary bg-primary/10 border-primary/20", icon: "↔" },
  stable_option: { label: "Stabiele optie", color: "text-foreground/70 bg-muted border-border", icon: "—" },
};

export const markupAdviceLabels: Record<MarkupAdvice, { label: string; color: string }> = {
  markup_possible: { label: "Markup mogelijk", color: "text-accent bg-accent/10 border-accent/20" },
  markdown_advised: { label: "Markdown advies", color: "text-destructive bg-destructive/10 border-destructive/20" },
  hold: { label: "Vasthouden", color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20" },
  none: { label: "—", color: "text-muted-foreground bg-muted border-border" },
};

export const designAdvisoryData: DesignAdvisoryItem[] = [
  { product_id: "1", product: "Chrysant Ringa Yellow", design_advice: "good_choice", advice_detail: "Ruim beschikbaar, prijs stabiel. Geschikt voor volume-ontwerpen.", market_price: 0.068, markup_advice: "markup_possible", markup_detail: "Inkoopprijs onder marktgemiddelde — ruimte voor opwaartse waardering." },
  { product_id: "2", product: "Roos Red Naomi", design_advice: "expensive", advice_detail: "Prijstrend stijgend (+8.4% MoM). Overweeg alternatief of volumekorting.", market_price: 0.128, substitute: "Roos Avalanche+", markup_advice: "hold", markup_detail: "Marktprijs fluctueert — afwachten voor stabielere marge." },
  { product_id: "3", product: "Tulp Strong Gold", design_advice: "good_choice", advice_detail: "Volop in seizoen, lage prijzen. Ideaal voor voorjaarsontwerpen.", market_price: 0.052, markup_advice: "markup_possible", markup_detail: "Prijs 5.5% onder historisch — goede marge-opportuniteit." },
  { product_id: "4", product: "Gerbera Kimsey", design_advice: "limited_availability", advice_detail: "Marktaanbod beperkt. Prijsstijging +12.1% MoM. Snel handelen.", market_price: 0.048, markup_advice: "markdown_advised", markup_detail: "Voorraaddruk hoog — overweeg markdown om voorraad te verplaatsen." },
  { product_id: "5", product: "Lisianthus Rosita White", design_advice: "stable_option", advice_detail: "Prijs en beschikbaarheid stabiel. Betrouwbaar voor planning.", market_price: 0.094, markup_advice: "none", markup_detail: "Markt in evenwicht, geen bijzondere actie nodig." },
  { product_id: "6", product: "Alstroemeria Virginia", design_advice: "substitute_recommended", advice_detail: "Prijs boven target (+9.7%). Overweeg Alstroemeria Summer Dance.", market_price: 0.066, substitute: "Alstroemeria Summer Dance", markup_advice: "markdown_advised", markup_detail: "Marktprijs boven verwachting — pas offerteprijs aan." },
  { product_id: "7", product: "Zonnebloem Sunrich", design_advice: "good_choice", advice_detail: "Prijs stabiel, goed beschikbaar. Geschikt voor zomerlijnen.", market_price: 0.086, markup_advice: "markup_possible", markup_detail: "Inkoop 3.4% onder historisch — opwaartse marge mogelijk." },
  { product_id: "8", product: "Roos Avalanche+", design_advice: "stable_option", advice_detail: "Betrouwbare leverancier, marktprijs voorspelbaar.", market_price: 0.132, markup_advice: "hold", markup_detail: "Marktprijs dicht bij referentie — hold advies." },
  { product_id: "9", product: "Chrysant Baltica White", design_advice: "good_choice", advice_detail: "Volop beschikbaar, lage marktdruk. Goed voor volume.", market_price: 0.065, markup_advice: "markup_possible", markup_detail: "Voorraad afdoende, prijs gunstig." },
  { product_id: "10", product: "Lelie Stargazer", design_advice: "expensive", advice_detail: "Premium segment. Prijs stijgend (+4.2%). Alleen voor high-end ontwerpen.", market_price: 0.180, substitute: "Lelie Siberia", markup_advice: "hold", markup_detail: "Premium product — marge houden maar monitoren." },
];

/* ── Price Check data for quotation advisory ── */
export interface PriceCheckItem {
  product_id: string;
  product: string;
  offer_price: number;
  market_price: number;
  recent_purchase_price: number;
  advised_price: number;
  margin_safe: boolean;
  price_check_status: "ok" | "warning" | "critical";
  advice_text: string;
}

export const priceCheckData: PriceCheckItem[] = [
  { product_id: "1", product: "Chrysant Ringa Yellow", offer_price: 0.072, market_price: 0.068, recent_purchase_price: 0.070, advised_price: 0.074, margin_safe: true, price_check_status: "ok", advice_text: "Ontwerp binnen verwacht marktbereik" },
  { product_id: "2", product: "Roos Red Naomi", offer_price: 0.118, market_price: 0.128, recent_purchase_price: 0.122, advised_price: 0.122, margin_safe: false, price_check_status: "critical", advice_text: "Offerteprijs onder marktprijs — marge onder druk" },
  { product_id: "3", product: "Tulp Strong Gold", offer_price: 0.052, market_price: 0.052, recent_purchase_price: 0.054, advised_price: 0.054, margin_safe: true, price_check_status: "ok", advice_text: "Ontwerp binnen verwacht marktbereik" },
  { product_id: "4", product: "Gerbera Kimsey", offer_price: 0.044, market_price: 0.048, recent_purchase_price: 0.046, advised_price: 0.045, margin_safe: false, price_check_status: "warning", advice_text: "Marktprijs boven target — monitor" },
  { product_id: "5", product: "Lisianthus Rosita White", offer_price: 0.091, market_price: 0.094, recent_purchase_price: 0.093, advised_price: 0.093, margin_safe: true, price_check_status: "ok", advice_text: "Ontwerp binnen verwacht marktbereik" },
  { product_id: "6", product: "Alstroemeria Virginia", offer_price: 0.068, market_price: 0.066, recent_purchase_price: 0.064, advised_price: 0.064, margin_safe: false, price_check_status: "critical", advice_text: "Ontwerp te duur — substituut beschikbaar" },
  { product_id: "7", product: "Zonnebloem Sunrich", offer_price: 0.085, market_price: 0.086, recent_purchase_price: 0.087, advised_price: 0.087, margin_safe: true, price_check_status: "ok", advice_text: "Ontwerp binnen verwacht marktbereik" },
  { product_id: "8", product: "Roos Avalanche+", offer_price: 0.130, market_price: 0.132, recent_purchase_price: 0.133, advised_price: 0.133, margin_safe: true, price_check_status: "ok", advice_text: "Ontwerp binnen verwacht marktbereik" },
  { product_id: "9", product: "Chrysant Baltica White", offer_price: 0.066, market_price: 0.065, recent_purchase_price: 0.067, advised_price: 0.067, margin_safe: true, price_check_status: "ok", advice_text: "Ontwerp binnen verwacht marktbereik" },
  { product_id: "10", product: "Lelie Stargazer", offer_price: 0.178, market_price: 0.180, recent_purchase_price: 0.182, advised_price: 0.182, margin_safe: true, price_check_status: "warning", advice_text: "Marktprijs boven target — premium segment" },
];

export const priceCheckStatusLabels: Record<string, { label: string; color: string }> = {
  ok: { label: "OK", color: "text-accent bg-accent/10 border-accent/20" },
  warning: { label: "Let op", color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20" },
  critical: { label: "Risico", color: "text-destructive bg-destructive/10 border-destructive/20" },
};

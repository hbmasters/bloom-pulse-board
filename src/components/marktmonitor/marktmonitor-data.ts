/* ── Marktmonitor: comprehensive market intelligence data for procurement ── */

export type PriceTrend = "rising" | "stable" | "falling";
export type Confidence = "low" | "medium" | "high";
export type BuyAdvice = "buy_now" | "buy_phased" | "wait" | "risk_shortage" | "risk_expensive" | "chance_drop";

/* ── Per-product market monitor record ── */
export interface MarktMonitorProduct {
  id: string;
  product: string;
  product_family: string;
  cultivar?: string;
  quality?: string;

  /* Current market */
  current_price: number;
  price_vs_yesterday: number;   // % change
  price_vs_last_week: number;   // % change
  availability: number;         // stems available
  market_trend: PriceTrend;

  /* Historical */
  avg_price_7d: number;
  avg_price_30d: number;
  avg_price_same_period_ly: number;
  avg_consumption_comparable_weeks: number; // stems
  season_pattern: string;       // human-readable

  /* Forecast */
  forecast_price_1w: number;
  forecast_price_2w: number;
  forecast_demand_1w: number;   // stems
  forecast_demand_2w: number;   // stems
  confidence: Confidence;

  /* Stem demand expectations */
  expected_history: number;     // stems based on history
  expected_forecast: number;    // stems based on forecast
  expected_market: number;      // stems based on market signals

  /* Combined */
  weighted_advice: number;      // stems
  current_purchased: number;    // stems
  delta_vs_advice: number;      // weighted_advice - current_purchased

  /* Explanations */
  explanation_history: string;
  explanation_forecast: string;
  explanation_market: string;
  summary: string;

  /* Buy advice */
  buy_advice: BuyAdvice;

  /* Historical price data for chart (last 12 weeks) */
  price_history: { week: number; price: number }[];
  /* Volume history (last 12 weeks) */
  volume_history: { week: number; volume: number }[];
  /* Forecast price (next 8 weeks) */
  price_forecast: { week: number; price: number }[];
}

/* ── Weights (configurable) ── */
export const DEFAULT_WEIGHTS = {
  history: 0.40,
  forecast: 0.40,
  market: 0.20,
};

/* ── Labels ── */
export const trendLabels: Record<PriceTrend, { label: string; color: string; icon: string }> = {
  rising:  { label: "Stijgend", color: "text-destructive", icon: "↑" },
  stable:  { label: "Stabiel",  color: "text-muted-foreground", icon: "→" },
  falling: { label: "Dalend",   color: "text-accent", icon: "↓" },
};

export const confidenceLabels: Record<Confidence, { label: string; color: string }> = {
  low:    { label: "Laag",   color: "text-destructive bg-destructive/10 border-destructive/20" },
  medium: { label: "Middel", color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20" },
  high:   { label: "Hoog",   color: "text-accent bg-accent/10 border-accent/20" },
};

export const buyAdviceLabels: Record<BuyAdvice, { label: string; color: string; emoji: string }> = {
  buy_now:        { label: "Koop nu",           color: "text-accent bg-accent/10 border-accent/20", emoji: "🟢" },
  buy_phased:     { label: "Koop gefaseerd",    color: "text-primary bg-primary/10 border-primary/20", emoji: "🔵" },
  wait:           { label: "Wacht af",          color: "text-muted-foreground bg-muted border-border", emoji: "⏸" },
  risk_shortage:  { label: "Risico op tekort",  color: "text-destructive bg-destructive/10 border-destructive/20", emoji: "🔴" },
  risk_expensive: { label: "Te duur inkopen",   color: "text-orange-500 bg-orange-500/10 border-orange-500/20", emoji: "🟠" },
  chance_drop:    { label: "Kans op prijsdaling", color: "text-accent bg-accent/10 border-accent/20", emoji: "💰" },
};

/* ── Helper to generate price history ── */
const genPriceHistory = (base: number, volatility: number): { week: number; price: number }[] =>
  Array.from({ length: 12 }, (_, i) => ({
    week: ((11 - 12 + i + 52) % 52) + 1, // weeks leading up to current
    price: +(base * (0.92 + Math.random() * volatility)).toFixed(3),
  }));

const genVolumeHistory = (base: number): { week: number; volume: number }[] =>
  Array.from({ length: 12 }, (_, i) => ({
    week: ((11 - 12 + i + 52) % 52) + 1,
    volume: Math.round(base * (0.75 + Math.random() * 0.5)),
  }));

const genPriceForecast = (base: number, trend: number): { week: number; price: number }[] =>
  Array.from({ length: 8 }, (_, i) => ({
    week: 12 + i,
    price: +(base * (1 + trend * (i + 1) * 0.01) * (0.97 + Math.random() * 0.06)).toFixed(3),
  }));

const calcWeighted = (h: number, f: number, m: number) =>
  Math.round(h * DEFAULT_WEIGHTS.history + f * DEFAULT_WEIGHTS.forecast + m * DEFAULT_WEIGHTS.market);

/* ── Mock data ── */
export const marktMonitorData: MarktMonitorProduct[] = [
  {
    id: "mm-1",
    product: "Roos Red Naomi",
    product_family: "Roos",
    cultivar: "Red Naomi",
    quality: "A1",
    current_price: 0.128,
    price_vs_yesterday: 2.4,
    price_vs_last_week: 8.4,
    availability: 45000,
    market_trend: "rising",
    avg_price_7d: 0.122,
    avg_price_30d: 0.115,
    avg_price_same_period_ly: 0.108,
    avg_consumption_comparable_weeks: 12800,
    season_pattern: "Piek richting Moederdag, stijgende vraag",
    forecast_price_1w: 0.135,
    forecast_price_2w: 0.142,
    forecast_demand_1w: 14200,
    forecast_demand_2w: 15800,
    confidence: "high",
    expected_history: 12500,
    expected_forecast: 14200,
    expected_market: 13100,
    weighted_advice: 13420,
    current_purchased: 11000,
    delta_vs_advice: 2420,
    explanation_history: "Gemiddeld verbruik in W10-W12 vorig jaar was 12.500 stelen. Trend is stabiel.",
    explanation_forecast: "Prognose verwacht 14.200 stelen door verwachte piek in Moederdag-orders.",
    explanation_market: "Markt laat stijgende prijs (+8.4% WoW) en beperkte beschikbaarheid zien.",
    summary: "De verwachte behoefte voor Red Naomi ligt op 13.420 stelen. De prognose ligt boven het historisch gemiddelde en de markt laat stijgende prijzen zien. Huidige inkoop ligt 2.420 stelen onder advies. Advies: aanvullend inkopen op korte termijn.",
    buy_advice: "buy_now",
    price_history: genPriceHistory(0.118, 0.18),
    volume_history: genVolumeHistory(12500),
    price_forecast: genPriceForecast(0.128, 1.2),
  },
  {
    id: "mm-2",
    product: "Roos Avalanche+",
    product_family: "Roos",
    cultivar: "Avalanche+",
    quality: "A1",
    current_price: 0.132,
    price_vs_yesterday: 0.8,
    price_vs_last_week: 3.2,
    availability: 32000,
    market_trend: "stable",
    avg_price_7d: 0.130,
    avg_price_30d: 0.126,
    avg_price_same_period_ly: 0.118,
    avg_consumption_comparable_weeks: 9200,
    season_pattern: "Stabiel seizoenspatroon, lichte stijging richting voorjaar",
    forecast_price_1w: 0.134,
    forecast_price_2w: 0.136,
    forecast_demand_1w: 9800,
    forecast_demand_2w: 10200,
    confidence: "high",
    expected_history: 9200,
    expected_forecast: 9800,
    expected_market: 9500,
    weighted_advice: 9520,
    current_purchased: 9000,
    delta_vs_advice: 520,
    explanation_history: "Historisch verbruik vergelijkbaar met huidige periode. Stabiel patroon.",
    explanation_forecast: "Lichte stijging verwacht door seizoenseffect.",
    explanation_market: "Markt stabiel, prijs op verwacht niveau.",
    summary: "Avalanche+ zit nagenoeg in lijn. Kleine aanvulling van 520 stelen aanbevolen. Markt en prognose wijken minimaal af van historie.",
    buy_advice: "buy_phased",
    price_history: genPriceHistory(0.126, 0.14),
    volume_history: genVolumeHistory(9200),
    price_forecast: genPriceForecast(0.132, 0.5),
  },
  {
    id: "mm-3",
    product: "Chrysant Ringa Yellow",
    product_family: "Chrysant",
    cultivar: "Ringa Yellow",
    quality: "A1",
    current_price: 0.065,
    price_vs_yesterday: -0.5,
    price_vs_last_week: -2.1,
    availability: 68000,
    market_trend: "falling",
    avg_price_7d: 0.068,
    avg_price_30d: 0.072,
    avg_price_same_period_ly: 0.070,
    avg_consumption_comparable_weeks: 18500,
    season_pattern: "In seizoen, ruim beschikbaar",
    forecast_price_1w: 0.063,
    forecast_price_2w: 0.061,
    forecast_demand_1w: 17800,
    forecast_demand_2w: 18200,
    confidence: "high",
    expected_history: 18500,
    expected_forecast: 17800,
    expected_market: 19200,
    weighted_advice: 18380,
    current_purchased: 18000,
    delta_vs_advice: 380,
    explanation_history: "Verbruik vorig jaar W11: 18.500. Stabiel patroon.",
    explanation_forecast: "Iets lagere vraag verwacht, geen bijzondere pieken.",
    explanation_market: "Dalende prijs en ruim aanbod — markt verwacht hoger volume beschikbaar.",
    summary: "Chrysant Ringa Yellow is goed gedekt. Markt biedt kans op gunstigere inkoop door dalende prijs. Kleine aanvulling van 380 stelen voldoende.",
    buy_advice: "chance_drop",
    price_history: genPriceHistory(0.072, 0.12),
    volume_history: genVolumeHistory(18500),
    price_forecast: genPriceForecast(0.065, -0.8),
  },
  {
    id: "mm-4",
    product: "Tulp Strong Gold",
    product_family: "Tulp",
    cultivar: "Strong Gold",
    quality: "A1",
    current_price: 0.048,
    price_vs_yesterday: -1.2,
    price_vs_last_week: -5.2,
    availability: 120000,
    market_trend: "falling",
    avg_price_7d: 0.052,
    avg_price_30d: 0.058,
    avg_price_same_period_ly: 0.055,
    avg_consumption_comparable_weeks: 25000,
    season_pattern: "Volop in seizoen, overaanbod mogelijk",
    forecast_price_1w: 0.046,
    forecast_price_2w: 0.044,
    forecast_demand_1w: 22000,
    forecast_demand_2w: 20000,
    confidence: "medium",
    expected_history: 25000,
    expected_forecast: 22000,
    expected_market: 28000,
    weighted_advice: 24400,
    current_purchased: 22000,
    delta_vs_advice: 2400,
    explanation_history: "Vorig jaar zelfde week: 25.000 stelen. Seizoenseffect.",
    explanation_forecast: "Verwachte afname door einde tulpenseizoen.",
    explanation_market: "Overaanbod op de markt, prijs onder druk. Hoog volume beschikbaar.",
    summary: "Tulp Strong Gold zit in de eindfase van het seizoen. Prijs daalt fors. Historie zegt meer dan forecast. Aanvulling van 2.400 stelen, maar wacht op verdere prijsdaling.",
    buy_advice: "wait",
    price_history: genPriceHistory(0.058, 0.20),
    volume_history: genVolumeHistory(25000),
    price_forecast: genPriceForecast(0.048, -2.0),
  },
  {
    id: "mm-5",
    product: "Gerbera Kimsey",
    product_family: "Gerbera",
    cultivar: "Kimsey",
    quality: "A1",
    current_price: 0.048,
    price_vs_yesterday: 3.5,
    price_vs_last_week: 12.1,
    availability: 18000,
    market_trend: "rising",
    avg_price_7d: 0.044,
    avg_price_30d: 0.040,
    avg_price_same_period_ly: 0.038,
    avg_consumption_comparable_weeks: 8200,
    season_pattern: "Beperkt seizoensaanbod, kwetsbaar voor tekorten",
    forecast_price_1w: 0.052,
    forecast_price_2w: 0.055,
    forecast_demand_1w: 9500,
    forecast_demand_2w: 9800,
    confidence: "low",
    expected_history: 8200,
    expected_forecast: 9500,
    expected_market: 7200,
    weighted_advice: 8480,
    current_purchased: 6500,
    delta_vs_advice: 1980,
    explanation_history: "Historisch verbruik op 8.200 stelen, maar dat was zonder schaarste.",
    explanation_forecast: "Prognose hoger door verwachte orders en beperkt alternatief.",
    explanation_market: "Markt onder druk: +12.1% WoW, beschikbaarheid kritiek. Verwacht lager volume.",
    summary: "Gerbera Kimsey staat onder zware marktdruk. Prijs stijgt snel, beschikbaarheid is kritiek. Huidige inkoop 1.980 stelen onder advies. Advies: direct aanvullend inkopen, risico op tekort.",
    buy_advice: "risk_shortage",
    price_history: genPriceHistory(0.040, 0.22),
    volume_history: genVolumeHistory(8200),
    price_forecast: genPriceForecast(0.048, 2.5),
  },
  {
    id: "mm-6",
    product: "Lisianthus Rosita White",
    product_family: "Lisianthus",
    cultivar: "Rosita White",
    quality: "A1",
    current_price: 0.094,
    price_vs_yesterday: 0.2,
    price_vs_last_week: 1.8,
    availability: 14000,
    market_trend: "stable",
    avg_price_7d: 0.093,
    avg_price_30d: 0.091,
    avg_price_same_period_ly: 0.088,
    avg_consumption_comparable_weeks: 5400,
    season_pattern: "Stabiel jaarrond, licht seizoenseffect in zomer",
    forecast_price_1w: 0.095,
    forecast_price_2w: 0.096,
    forecast_demand_1w: 5600,
    forecast_demand_2w: 5800,
    confidence: "medium",
    expected_history: 5400,
    expected_forecast: 5600,
    expected_market: 5500,
    weighted_advice: 5500,
    current_purchased: 5200,
    delta_vs_advice: 300,
    explanation_history: "Consistent verbruik, vergelijkbaar met vorig jaar.",
    explanation_forecast: "Lichte stijging verwacht door seizoenseffect.",
    explanation_market: "Markt in evenwicht, geen bijzondere signalen.",
    summary: "Lisianthus Rosita White is stabiel. Minimale aanvulling van 300 stelen voldoende. Geen urgente actie nodig.",
    buy_advice: "buy_phased",
    price_history: genPriceHistory(0.091, 0.10),
    volume_history: genVolumeHistory(5400),
    price_forecast: genPriceForecast(0.094, 0.3),
  },
  {
    id: "mm-7",
    product: "Alstroemeria Virginia",
    product_family: "Alstroemeria",
    cultivar: "Virginia",
    quality: "A1",
    current_price: 0.066,
    price_vs_yesterday: 1.8,
    price_vs_last_week: 6.5,
    availability: 9500,
    market_trend: "rising",
    avg_price_7d: 0.063,
    avg_price_30d: 0.060,
    avg_price_same_period_ly: 0.056,
    avg_consumption_comparable_weeks: 6800,
    season_pattern: "Stijgend richting piek, beperkt aanbod",
    forecast_price_1w: 0.070,
    forecast_price_2w: 0.074,
    forecast_demand_1w: 7200,
    forecast_demand_2w: 7500,
    confidence: "medium",
    expected_history: 6800,
    expected_forecast: 7200,
    expected_market: 6200,
    weighted_advice: 6840,
    current_purchased: 5800,
    delta_vs_advice: 1040,
    explanation_history: "Verbruik vorig jaar was 6.800, maar prijs lag 15% lager.",
    explanation_forecast: "Hogere vraag verwacht, commerciële orders boven historie.",
    explanation_market: "Prijs stijgt snel, beschikbaarheid krap. Markt verwacht lager volume.",
    summary: "Alstroemeria Virginia is 1.040 stelen onder advies. Prijs stijgt (+6.5% WoW) en beschikbaarheid is krap. Advies: snel bijkopen om risico op te duur inkopen te beperken.",
    buy_advice: "risk_expensive",
    price_history: genPriceHistory(0.060, 0.16),
    volume_history: genVolumeHistory(6800),
    price_forecast: genPriceForecast(0.066, 1.8),
  },
  {
    id: "mm-8",
    product: "Zonnebloem Sunrich",
    product_family: "Zonnebloem",
    cultivar: "Sunrich",
    quality: "A1",
    current_price: 0.082,
    price_vs_yesterday: -0.3,
    price_vs_last_week: -0.8,
    availability: 28000,
    market_trend: "stable",
    avg_price_7d: 0.084,
    avg_price_30d: 0.086,
    avg_price_same_period_ly: 0.080,
    avg_consumption_comparable_weeks: 4200,
    season_pattern: "Seizoensstart, aanbod groeit",
    forecast_price_1w: 0.080,
    forecast_price_2w: 0.078,
    forecast_demand_1w: 4500,
    forecast_demand_2w: 5000,
    confidence: "medium",
    expected_history: 4200,
    expected_forecast: 4500,
    expected_market: 4800,
    weighted_advice: 4440,
    current_purchased: 4000,
    delta_vs_advice: 440,
    explanation_history: "Historisch verbruik op dit moment in het seizoen is 4.200.",
    explanation_forecast: "Verwachte groei door seizoensstart.",
    explanation_market: "Ruim aanbod, licht dalende prijs. Markt verwacht hoger volume.",
    summary: "Zonnebloem Sunrich is nagenoeg op schema. Kleine aanvulling van 440 stelen. Markt biedt gunstige condities.",
    buy_advice: "buy_phased",
    price_history: genPriceHistory(0.086, 0.12),
    volume_history: genVolumeHistory(4200),
    price_forecast: genPriceForecast(0.082, -0.5),
  },
  {
    id: "mm-9",
    product: "Lelie Stargazer",
    product_family: "Lelie",
    cultivar: "Stargazer",
    quality: "A1 Extra",
    current_price: 0.180,
    price_vs_yesterday: 1.1,
    price_vs_last_week: 4.2,
    availability: 8500,
    market_trend: "rising",
    avg_price_7d: 0.175,
    avg_price_30d: 0.170,
    avg_price_same_period_ly: 0.162,
    avg_consumption_comparable_weeks: 3800,
    season_pattern: "Premium segment, beperkt volume, seizoensgebonden",
    forecast_price_1w: 0.185,
    forecast_price_2w: 0.190,
    forecast_demand_1w: 4000,
    forecast_demand_2w: 4200,
    confidence: "medium",
    expected_history: 3800,
    expected_forecast: 4000,
    expected_market: 3500,
    weighted_advice: 3820,
    current_purchased: 3600,
    delta_vs_advice: 220,
    explanation_history: "Vorig jaar 3.800 stelen in deze periode.",
    explanation_forecast: "Lichte stijging verwacht, premium vraag neemt toe.",
    explanation_market: "Prijs stijgt, maar premium segment is minder prijsgevoelig.",
    summary: "Lelie Stargazer is een premium product met beperkt volume. Kleine aanvulling van 220 stelen. Let op stijgende prijs.",
    buy_advice: "buy_phased",
    price_history: genPriceHistory(0.170, 0.14),
    volume_history: genVolumeHistory(3800),
    price_forecast: genPriceForecast(0.180, 0.8),
  },
  {
    id: "mm-10",
    product: "Chrysant Baltica White",
    product_family: "Chrysant",
    cultivar: "Baltica White",
    quality: "A1",
    current_price: 0.062,
    price_vs_yesterday: -0.8,
    price_vs_last_week: -1.5,
    availability: 52000,
    market_trend: "falling",
    avg_price_7d: 0.064,
    avg_price_30d: 0.068,
    avg_price_same_period_ly: 0.065,
    avg_consumption_comparable_weeks: 15200,
    season_pattern: "In seizoen, stabiel aanbod",
    forecast_price_1w: 0.060,
    forecast_price_2w: 0.058,
    forecast_demand_1w: 14800,
    forecast_demand_2w: 15000,
    confidence: "high",
    expected_history: 15200,
    expected_forecast: 14800,
    expected_market: 16000,
    weighted_advice: 15200,
    current_purchased: 15000,
    delta_vs_advice: 200,
    explanation_history: "Consistent verbruik, in lijn met vorig jaar.",
    explanation_forecast: "Stabiele vraag verwacht.",
    explanation_market: "Dalende prijs, ruim aanbod. Gunstig moment voor inkoop.",
    summary: "Chrysant Baltica White is vrijwel volledig gedekt. Minimale aanvulling van 200 stelen. Dalende prijs biedt kans op extra marge.",
    buy_advice: "chance_drop",
    price_history: genPriceHistory(0.068, 0.10),
    volume_history: genVolumeHistory(15200),
    price_forecast: genPriceForecast(0.062, -0.6),
  },
];

/* ── Filter options ── */
export const productFamilies = [...new Set(marktMonitorData.map(m => m.product_family))];

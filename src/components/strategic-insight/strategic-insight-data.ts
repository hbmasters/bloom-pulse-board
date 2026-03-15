// Strategic & Market Insight — mock data layer
// Ready for future backend integration

export type SignalLevel = "growth" | "pressure" | "risk" | "opportunity" | "watch" | "candidate";

export interface StrategicKPI {
  id: string;
  label: string;
  value: string;
  change?: string;
  changeDir?: "up" | "down" | "stable";
  signal: SignalLevel;
  detail?: string;
}

export interface TrendItem {
  id: string;
  name: string;
  category: string;
  direction: "growing" | "declining" | "stable" | "accelerating" | "slowing";
  change: string;
  detail?: string;
}

export interface MarketSignal {
  id: string;
  category: string;
  product?: string;
  signal: "price_up" | "price_down" | "volatile" | "stable" | "pressure" | "shortage";
  value: string;
  detail?: string;
}

export interface ForecastShift {
  id: string;
  period: string;
  type: "spike" | "slowdown" | "shift" | "pressure";
  product_group: string;
  magnitude: string;
  detail?: string;
}

export interface StrategicOpportunity {
  id: string;
  title: string;
  type: "year_round" | "standardization" | "stable_recurring" | "attractive_group";
  reason: string;
  confidence: "high" | "medium" | "low";
  next_step: string;
}

export interface StrategicRisk {
  id: string;
  title: string;
  type: "margin_pressure" | "supplier_concentration" | "seasonal_shortage" | "unstable_category" | "quotation_risk";
  severity: "high" | "medium" | "low";
  detail: string;
}

export interface ManagementTopic {
  id: string;
  question: string;
  context: string;
  category: "strategy" | "risk" | "opportunity" | "planning";
}

// ── Signal styles ──
export const signalStyles: Record<SignalLevel, { label: string; bg: string; text: string; border: string }> = {
  growth:      { label: "Groei",        bg: "bg-accent/10",       text: "text-accent",          border: "border-accent/20" },
  pressure:    { label: "Druk",         bg: "bg-yellow-500/10",   text: "text-yellow-500",      border: "border-yellow-500/20" },
  risk:        { label: "Risico",       bg: "bg-destructive/10",  text: "text-destructive",     border: "border-destructive/20" },
  opportunity: { label: "Kans",         bg: "bg-primary/10",      text: "text-primary",         border: "border-primary/20" },
  watch:       { label: "Monitor",      bg: "bg-muted",           text: "text-muted-foreground", border: "border-border" },
  candidate:   { label: "Kandidaat",    bg: "bg-accent/10",       text: "text-accent",          border: "border-accent/20" },
};

export const directionLabels: Record<string, { label: string; color: string }> = {
  growing:      { label: "Groeiend",     color: "text-accent" },
  declining:    { label: "Dalend",       color: "text-destructive" },
  stable:       { label: "Stabiel",      color: "text-muted-foreground" },
  accelerating: { label: "Versnellend",  color: "text-accent" },
  slowing:      { label: "Vertragend",   color: "text-yellow-500" },
};

export const confidenceLabels: Record<string, { label: string; color: string }> = {
  high:   { label: "Hoog",   color: "text-accent" },
  medium: { label: "Gemiddeld", color: "text-yellow-500" },
  low:    { label: "Laag",   color: "text-muted-foreground" },
};

export const severityLabels: Record<string, { label: string; bg: string; text: string; border: string }> = {
  high:   { label: "Hoog",      bg: "bg-destructive/10", text: "text-destructive",     border: "border-destructive/20" },
  medium: { label: "Gemiddeld", bg: "bg-yellow-500/10",  text: "text-yellow-500",      border: "border-yellow-500/20" },
  low:    { label: "Laag",      bg: "bg-muted",          text: "text-muted-foreground", border: "border-border" },
};

// ── Mock data ──

export const strategicKPIs: StrategicKPI[] = [
  { id: "k1", label: "Omzettrend", value: "+4.2%", changeDir: "up", signal: "growth", detail: "Q1 vs vorig jaar" },
  { id: "k2", label: "Marktprijsdruk", value: "Gemiddeld", change: "+6%", changeDir: "up", signal: "pressure", detail: "Klokaanvoer stijgend" },
  { id: "k3", label: "Forecast verschuiving", value: "3 alerts", signal: "watch", detail: "Komende 4 weken" },
  { id: "k4", label: "Strategische risico's", value: "4", signal: "risk", detail: "2 hoog, 2 gemiddeld" },
  { id: "k5", label: "Strategische kansen", value: "5", signal: "opportunity", detail: "3 jaarrond kandidaten" },
  { id: "k6", label: "Jaarrond kandidaten", value: "3", signal: "candidate", detail: "Gereed voor evaluatie" },
];

export const salesTrends: TrendItem[] = [
  { id: "t1", name: "Gemengd Boeket", category: "Productgroep", direction: "growing", change: "+12%", detail: "Sterk Q1, breed klantenbestand" },
  { id: "t2", name: "Mono Roos", category: "Productgroep", direction: "declining", change: "-8%", detail: "Seizoensgebonden daling" },
  { id: "t3", name: "Albert Heijn", category: "Klant", direction: "growing", change: "+15%", detail: "Nieuw weekprogramma" },
  { id: "t4", name: "Aldi NL", category: "Klant", direction: "stable", change: "0%", detail: "Ongewijzigd volume" },
  { id: "t5", name: "Voorjaarsboeket", category: "Programma", direction: "accelerating", change: "+22%", detail: "Sterk seizoenseffect" },
  { id: "t6", name: "Tulpenlijn", category: "Productgroep", direction: "slowing", change: "-3%", detail: "Einde seizoen" },
];

export const marketSignals: MarketSignal[] = [
  { id: "m1", category: "Rozen", signal: "price_up", value: "+14%", detail: "Klokaanvoer daalt, directe inkoop stabiel" },
  { id: "m2", category: "Chrysant", signal: "stable", value: "±0%", detail: "Ruim aanbod, stabiele prijs" },
  { id: "m3", category: "Tulpen", signal: "price_down", value: "-18%", detail: "Einde seizoen, overvloedig aanbod" },
  { id: "m4", category: "Gerbera", signal: "volatile", value: "±12%", detail: "Onvoorspelbare klokveilingresultaten" },
  { id: "m5", category: "Lelie", signal: "pressure", value: "Krap", detail: "Beperkt aanbod, hoge vraag" },
  { id: "m6", category: "Zonnebloem", product: "Sunrich Gold", signal: "shortage", value: "Tekort", detail: "Verwacht leveringsprobleem week 14-16" },
];

export const forecastShifts: ForecastShift[] = [
  { id: "f1", period: "Week 14-15", type: "spike", product_group: "Voorjaarsboeketten", magnitude: "+35%", detail: "Pasen + mooi weer voorspelling" },
  { id: "f2", period: "Week 16-18", type: "slowdown", product_group: "Tulpenlijnen", magnitude: "-40%", detail: "Seizoenseinde tulpen" },
  { id: "f3", period: "Week 19-20", type: "spike", product_group: "Moederdagboeketten", magnitude: "+60%", detail: "Moederdag piek" },
  { id: "f4", period: "Week 20-24", type: "shift", product_group: "Zomerboeketten", magnitude: "Transitie", detail: "Overschakeling naar zomer assortiment" },
  { id: "f5", period: "Week 14", type: "pressure", product_group: "Gemengd boeket", magnitude: "Hoog", detail: "Samenloop Pasen + regulier weekprogramma" },
];

export const strategicOpportunities: StrategicOpportunity[] = [
  { id: "o1", title: "Gemengd Veldbloemen → Jaarrond", type: "year_round", reason: "Stabiele vraag over 40+ weken, breed klantenbestand, goede marge", confidence: "high", next_step: "Business case uitwerken met vaste leveranciers" },
  { id: "o2", title: "Standaardisatie pastellijn", type: "standardization", reason: "3 recepten kunnen naar 1 met minimaal klantverlies", confidence: "medium", next_step: "Impact analyse per klant uitvoeren" },
  { id: "o3", title: "Chrysant boeket structureel", type: "stable_recurring", reason: "Stabiel volume, betrouwbare leveranciers, lage waste", confidence: "high", next_step: "Leverancierscontract verlengen" },
  { id: "o4", title: "Seizoensverlenging zonnebloem", type: "attractive_group", reason: "Marge boven target, groeiende vraag, beperkte concurrentie", confidence: "medium", next_step: "Leverancier capaciteit bespreken" },
  { id: "o5", title: "Kenya roos directe inkoop", type: "year_round", reason: "Prijsvoordeel 8-12% vs klok, stabiel volume mogelijk", confidence: "low", next_step: "Pilot met 2 leveranciers opstarten" },
];

export const strategicRisks: StrategicRisk[] = [
  { id: "r1", title: "Margedruk rozenassortiment", type: "margin_pressure", severity: "high", detail: "Inkoopprijs +14% zonder verkoopprijsverhoging. Margeverlies €0.02/steel op 800K stelen/maand." },
  { id: "r2", title: "Leveranciersconcentratie Lelie", type: "supplier_concentration", severity: "high", detail: "78% volume via 1 leverancier. Bij uitval geen alternatief beschikbaar." },
  { id: "r3", title: "Seizoenstekort zonnebloem week 14-16", type: "seasonal_shortage", severity: "medium", detail: "Verwacht leveringstekort van 30%. Alternatieve bronnen beperkt." },
  { id: "r4", title: "Gerbera prijsvolatiliteit", type: "unstable_category", severity: "medium", detail: "Klokveilingprijs varieert ±12% per week. Moeilijk voor vaste offertes." },
  { id: "r5", title: "Offerterisico voorjaarsboeketten", type: "quotation_risk", severity: "low", detail: "Vaste prijs geoffereerd maar inkoopprijs stijgt. Break-even bij +8% inkoop." },
];

export const managementTopics: ManagementTopic[] = [
  { id: "mt1", question: "Moet Gemengd Veldbloemen een vaste jaarrondlijn worden?", context: "Stabiele vraag, 3 klanten, goede marge. Vereist vast leverancierscontract.", category: "strategy" },
  { id: "mt2", question: "Moeten we leveranciersspreiding voor Lelie forceren?", context: "Huidige concentratie is 78% bij één leverancier. Risico bij uitval is hoog.", category: "risk" },
  { id: "mt3", question: "Is de rozenmarge houdbaar zonder prijsverhoging?", context: "Bij ongewijzigd beleid verliest de rozenlijn €16K/maand aan marge.", category: "risk" },
  { id: "mt4", question: "Kunnen we 3 pastelrecepten standaardiseren naar 1?", context: "Receptvariatie kost extra productietijd. Klantimpact lijkt beperkt.", category: "opportunity" },
  { id: "mt5", question: "Moeten we zonnebloem seizoensverlenging onderzoeken?", context: "Groeiende vraag, beperkte concurrentie, marge boven target.", category: "opportunity" },
  { id: "mt6", question: "Hoe bereiden we ons voor op de Moederdag piek?", context: "+60% forecast. Voldoende capaciteit en inkoop gepland?", category: "planning" },
];

// Signal labels for market signals
export const marketSignalLabels: Record<string, { label: string; bg: string; text: string; border: string }> = {
  price_up:  { label: "Prijs ↑",   bg: "bg-destructive/10", text: "text-destructive",      border: "border-destructive/20" },
  price_down:{ label: "Prijs ↓",   bg: "bg-accent/10",      text: "text-accent",           border: "border-accent/20" },
  volatile:  { label: "Volatiel",   bg: "bg-yellow-500/10",  text: "text-yellow-500",       border: "border-yellow-500/20" },
  stable:    { label: "Stabiel",    bg: "bg-muted",          text: "text-muted-foreground",  border: "border-border" },
  pressure:  { label: "Druk",       bg: "bg-yellow-500/10",  text: "text-yellow-500",       border: "border-yellow-500/20" },
  shortage:  { label: "Tekort",     bg: "bg-destructive/10", text: "text-destructive",      border: "border-destructive/20" },
};

export const forecastTypeLabels: Record<string, { label: string; bg: string; text: string; border: string }> = {
  spike:    { label: "Piek",        bg: "bg-primary/10",      text: "text-primary",          border: "border-primary/20" },
  slowdown: { label: "Vertraging",  bg: "bg-yellow-500/10",   text: "text-yellow-500",       border: "border-yellow-500/20" },
  shift:    { label: "Verschuiving",bg: "bg-muted",           text: "text-muted-foreground",  border: "border-border" },
  pressure: { label: "Druk",        bg: "bg-destructive/10",  text: "text-destructive",      border: "border-destructive/20" },
};

export const opportunityTypeLabels: Record<string, string> = {
  year_round: "Jaarrond",
  standardization: "Standaardisatie",
  stable_recurring: "Stabiel terugkerend",
  attractive_group: "Aantrekkelijke groep",
};

export const riskTypeLabels: Record<string, string> = {
  margin_pressure: "Margedruk",
  supplier_concentration: "Leveranciersconcentratie",
  seasonal_shortage: "Seizoenstekort",
  unstable_category: "Instabiele categorie",
  quotation_risk: "Offerterisico",
};

export const topicCategoryLabels: Record<string, { label: string; bg: string; text: string; border: string }> = {
  strategy:    { label: "Strategie",  bg: "bg-primary/10",      text: "text-primary",          border: "border-primary/20" },
  risk:        { label: "Risico",     bg: "bg-destructive/10",  text: "text-destructive",      border: "border-destructive/20" },
  opportunity: { label: "Kans",       bg: "bg-accent/10",       text: "text-accent",           border: "border-accent/20" },
  planning:    { label: "Planning",   bg: "bg-yellow-500/10",   text: "text-yellow-500",       border: "border-yellow-500/20" },
};

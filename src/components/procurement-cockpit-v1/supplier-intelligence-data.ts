/* ── Supplier Intelligence Data Layer ──
   Decision intelligence signals for supplier quality, reliability, and mix proposals.
   Future: Replace with API calls to HBMaster Procurement Decision Engine
*/

// ── Supplier Advice Badge ──
export type SupplierAdvice = "preferred" | "approved" | "review" | "risky" | "spread_mix" | "effective_better" | "quality_over_price";

export const supplierAdviceLabels: Record<SupplierAdvice, { label: string; color: string }> = {
  preferred: { label: "Voorkeur", color: "text-accent bg-accent/10 border-accent/20" },
  approved: { label: "Goedgekeurd", color: "text-foreground/70 bg-muted border-border" },
  review: { label: "Beoordelen", color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20" },
  risky: { label: "Risico", color: "text-destructive bg-destructive/10 border-destructive/20" },
  spread_mix: { label: "Spreid mix", color: "text-primary bg-primary/10 border-primary/20" },
  effective_better: { label: "Eff. prijs beter", color: "text-accent bg-accent/10 border-accent/20" },
  quality_over_price: { label: "Kwaliteit > prijs", color: "text-primary bg-primary/10 border-primary/20" },
};

// ── Supplier Reliability Class ──
export type ReliabilityClass = "high" | "medium" | "low";

export const reliabilityLabels: Record<ReliabilityClass, { label: string; color: string }> = {
  high: { label: "Hoog", color: "text-accent bg-accent/10 border-accent/20" },
  medium: { label: "Medium", color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20" },
  low: { label: "Laag", color: "text-destructive bg-destructive/10 border-destructive/20" },
};

// ── Supplier Intelligence per product ──
export interface SupplierIntelligenceItem {
  product_id: string;
  product: string;
  supplier_name: string;
  purchase_price: number;
  effective_price: number;
  waste_risk_adjusted_price: number;
  supplier_quality_score: number;
  supplier_reliability_score: number;
  supplier_risk_score: number;
  supplier_total_score: number;
  supplier_class: "A" | "B" | "C";
  reliability_class: ReliabilityClass;
  advice: SupplierAdvice;
  preferred_supplier_reason: string;
  effective_price_explanation: string;
  alternative_suppliers: {
    name: string;
    purchase_price: number;
    effective_price: number;
    quality_score: number;
    reliability_score: number;
    class: "A" | "B" | "C";
    advice: SupplierAdvice;
    note: string;
  }[];
}

export const supplierIntelligenceData: SupplierIntelligenceItem[] = [
  {
    product_id: "1", product: "Chrysant Ringa Yellow",
    supplier_name: "Van der Berg Flowers", purchase_price: 0.072, effective_price: 0.074, waste_risk_adjusted_price: 0.074,
    supplier_quality_score: 97, supplier_reliability_score: 96, supplier_risk_score: 8, supplier_total_score: 95,
    supplier_class: "A", reliability_class: "high", advice: "preferred",
    preferred_supplier_reason: "Consistente topkwaliteit met zeer lage afvalrisico. Betrouwbare levering binnen 24 uur.",
    effective_price_explanation: "Nominale prijs €0.072, effectieve prijs €0.074 na correctie voor 2.5% afvalrisico. Ondanks iets hogere nominale prijs, laagste effectieve kosten.",
    alternative_suppliers: [
      { name: "Flora Holland Pool", purchase_price: 0.078, effective_price: 0.082, quality_score: 93, reliability_score: 91, class: "B", advice: "approved", note: "Betrouwbaar maar hogere effectieve prijs door 5.1% afvalrisico." },
      { name: "Kenya Direct BV", purchase_price: 0.065, effective_price: 0.071, quality_score: 78, reliability_score: 72, class: "C", advice: "risky", note: "Laagste nominale prijs, maar hoog afvalrisico (8.5%) maakt effectieve prijs bijna gelijk." },
    ],
  },
  {
    product_id: "2", product: "Roos Red Naomi",
    supplier_name: "Bloem & Blad NL", purchase_price: 0.118, effective_price: 0.120, waste_risk_adjusted_price: 0.120,
    supplier_quality_score: 99, supplier_reliability_score: 97, supplier_risk_score: 5, supplier_total_score: 98,
    supplier_class: "A", reliability_class: "high", advice: "preferred",
    preferred_supplier_reason: "Beste kwaliteit in de markt. Zeer lage afvalrisico en consistente levering.",
    effective_price_explanation: "Nominale prijs €0.118. Effectieve prijs €0.120 na 2.1% afvalcorrectie. Kenya Direct BV biedt €0.112 nominaal, maar €0.122 effectief door 8.5% afval.",
    alternative_suppliers: [
      { name: "Van der Berg Flowers", purchase_price: 0.122, effective_price: 0.126, quality_score: 95, reliability_score: 94, class: "A", advice: "approved", note: "Goede kwaliteit, iets hogere prijs." },
      { name: "Kenya Direct BV", purchase_price: 0.112, effective_price: 0.122, quality_score: 78, reliability_score: 72, class: "C", advice: "risky", note: "Laagste nominale prijs maar hoogste effectieve prijs door afval." },
    ],
  },
  {
    product_id: "3", product: "Tulp Strong Gold",
    supplier_name: "Flora Holland Pool", purchase_price: 0.052, effective_price: 0.054, waste_risk_adjusted_price: 0.054,
    supplier_quality_score: 85, supplier_reliability_score: 82, supplier_risk_score: 18, supplier_total_score: 84,
    supplier_class: "B", reliability_class: "medium", advice: "approved",
    preferred_supplier_reason: "Ruim beschikbaar in seizoen. Geen grade A leverancier actief — Flora Holland Pool is de meest betrouwbare optie.",
    effective_price_explanation: "Nominale prijs €0.052, effectieve prijs €0.054 na 4.8% afvalcorrectie. Acceptabel voor seizoensproduct.",
    alternative_suppliers: [],
  },
  {
    product_id: "4", product: "Gerbera Kimsey",
    supplier_name: "Gerbera Kwekerij Jansen", purchase_price: 0.042, effective_price: 0.044, waste_risk_adjusted_price: 0.044,
    supplier_quality_score: 87, supplier_reliability_score: 83, supplier_risk_score: 22, supplier_total_score: 82,
    supplier_class: "B", reliability_class: "medium", advice: "spread_mix",
    preferred_supplier_reason: "Beperkt aanbod met slechts 2 leveranciers. Adviseer leveranciersmix om risico te spreiden.",
    effective_price_explanation: "Nominale prijs €0.042, effectieve prijs €0.044 door 5.5% afvalrisico. Beide leveranciers grade B — geen premium optie beschikbaar.",
    alternative_suppliers: [
      { name: "Flora Holland Pool", purchase_price: 0.044, effective_price: 0.047, quality_score: 84, reliability_score: 80, class: "B", advice: "approved", note: "Vergelijkbare kwaliteit, hogere afvalrisico (6.2%)." },
    ],
  },
  {
    product_id: "5", product: "Lisianthus Rosita White",
    supplier_name: "Bloem & Blad NL", purchase_price: 0.091, effective_price: 0.093, waste_risk_adjusted_price: 0.093,
    supplier_quality_score: 96, supplier_reliability_score: 95, supplier_risk_score: 7, supplier_total_score: 96,
    supplier_class: "A", reliability_class: "high", advice: "preferred",
    preferred_supplier_reason: "Enige grade A leverancier voor dit product. Uitstekende kwaliteit en betrouwbaarheid.",
    effective_price_explanation: "Nominale prijs €0.091, effectieve prijs €0.093. Zeer lage afvalcorrectie (2.2%).",
    alternative_suppliers: [],
  },
  {
    product_id: "6", product: "Alstroemeria Virginia",
    supplier_name: "Bloem & Blad NL", purchase_price: 0.064, effective_price: 0.066, waste_risk_adjusted_price: 0.066,
    supplier_quality_score: 95, supplier_reliability_score: 94, supplier_risk_score: 10, supplier_total_score: 94,
    supplier_class: "A", reliability_class: "high", advice: "quality_over_price",
    preferred_supplier_reason: "Flora Holland Pool biedt €0.068 nominaal maar €0.073 effectief door 7.8% afval. Bloem & Blad is voordeliger ondanks hogere kwaliteit.",
    effective_price_explanation: "Nominale prijs €0.064, effectieve prijs €0.066 (3.0% afval). Flora Holland Pool: €0.068 nominaal maar €0.073 effectief. Kwaliteit wint.",
    alternative_suppliers: [
      { name: "Flora Holland Pool", purchase_price: 0.068, effective_price: 0.073, quality_score: 76, reliability_score: 74, class: "C", advice: "risky", note: "Goedkoopste nominaal, maar hoog afvalrisico maakt het duurder. Grade C leverancier." },
    ],
  },
  {
    product_id: "7", product: "Zonnebloem Sunrich",
    supplier_name: "Van der Berg Flowers", purchase_price: 0.085, effective_price: 0.088, waste_risk_adjusted_price: 0.088,
    supplier_quality_score: 92, supplier_reliability_score: 93, supplier_risk_score: 12, supplier_total_score: 91,
    supplier_class: "A", reliability_class: "high", advice: "preferred",
    preferred_supplier_reason: "Enige leverancier met grade A classificatie. Consistente kwaliteit en leveringsbetrouwbaarheid.",
    effective_price_explanation: "Nominale prijs €0.085, effectieve prijs €0.088. Afvalcorrectie 3.2% — acceptabel voor seizoensproduct.",
    alternative_suppliers: [],
  },
  {
    product_id: "8", product: "Roos Avalanche+",
    supplier_name: "Bloem & Blad NL", purchase_price: 0.130, effective_price: 0.132, waste_risk_adjusted_price: 0.132,
    supplier_quality_score: 98, supplier_reliability_score: 97, supplier_risk_score: 5, supplier_total_score: 97,
    supplier_class: "A", reliability_class: "high", advice: "effective_better",
    preferred_supplier_reason: "Kenya Direct BV biedt €0.125 nominaal maar €0.136 effectief. Bloem & Blad is effectief goedkoper.",
    effective_price_explanation: "Nominale prijs €0.130, effectieve prijs €0.132 (1.8% afval). Kenya Direct: €0.125 nominaal maar €0.136 effectief (8.5% afval). Effectief €0.004 goedkoper bij Bloem & Blad.",
    alternative_suppliers: [
      { name: "Rosalina BV", purchase_price: 0.135, effective_price: 0.141, quality_score: 89, reliability_score: 88, class: "B", advice: "approved", note: "Betrouwbaar alternatief. Hogere prijs maar stabiele kwaliteit." },
      { name: "Kenya Direct BV", purchase_price: 0.125, effective_price: 0.136, quality_score: 78, reliability_score: 72, class: "C", advice: "risky", note: "Laagste nominale prijs, hoogste effectieve prijs. Niet aanbevolen." },
    ],
  },
  {
    product_id: "9", product: "Chrysant Baltica White",
    supplier_name: "Van der Berg Flowers", purchase_price: 0.066, effective_price: 0.068, waste_risk_adjusted_price: 0.068,
    supplier_quality_score: 93, supplier_reliability_score: 94, supplier_risk_score: 10, supplier_total_score: 92,
    supplier_class: "A", reliability_class: "high", advice: "preferred",
    preferred_supplier_reason: "Enige leverancier — betrouwbare grade A kwaliteit met lage afvalrisico.",
    effective_price_explanation: "Nominale prijs €0.066, effectieve prijs €0.068 (2.8% afval). Geen alternatief beschikbaar.",
    alternative_suppliers: [],
  },
  {
    product_id: "10", product: "Lelie Stargazer",
    supplier_name: "Van der Berg Flowers", purchase_price: 0.185, effective_price: 0.190, waste_risk_adjusted_price: 0.190,
    supplier_quality_score: 94, supplier_reliability_score: 95, supplier_risk_score: 9, supplier_total_score: 93,
    supplier_class: "A", reliability_class: "high", advice: "quality_over_price",
    preferred_supplier_reason: "Rosalina BV biedt €0.178 nominaal, maar Van der Berg levert hogere kwaliteit (94% vs 88%) met lager afvalrisico.",
    effective_price_explanation: "Nominale prijs €0.185, effectieve prijs €0.190 (2.6% afval). Rosalina: €0.178 nominaal, €0.186 effectief (4.5% afval). Premium van €0.004 gerechtvaardigd door betere kwaliteit.",
    alternative_suppliers: [
      { name: "Rosalina BV", purchase_price: 0.178, effective_price: 0.186, quality_score: 88, reliability_score: 86, class: "B", advice: "approved", note: "Goedkoper nominaal. Acceptabele kwaliteit voor niet-premium ontwerpen." },
      { name: "Kenya Direct BV", purchase_price: 0.168, effective_price: 0.182, quality_score: 78, reliability_score: 72, class: "C", advice: "risky", note: "Laagste prijs maar 8% afvalrisico. Niet geschikt voor premium segment." },
    ],
  },
];

// ── Supplier Mix Proposal ──
export interface SupplierMixProposal {
  product_id: string;
  has_mix: boolean;
  total_need: number;
  suppliers: {
    name: string;
    volume: number;
    price: number;
    effective_price: number;
    class: "A" | "B" | "C";
  }[];
  weighted_price: number;
  weighted_effective_price: number;
  rationale: string;
}

export const supplierMixProposals: SupplierMixProposal[] = [
  {
    product_id: "2", has_mix: true, total_need: 7900,
    suppliers: [
      { name: "Bloem & Blad NL", volume: 5000, price: 0.118, effective_price: 0.120, class: "A" },
      { name: "Van der Berg Flowers", volume: 2900, price: 0.122, effective_price: 0.126, class: "A" },
    ],
    weighted_price: 0.120, weighted_effective_price: 0.122,
    rationale: "Twee grade A leveranciers om leveringsrisico te spreiden bij groot volume. Kenya Direct vermeden wegens kwaliteitsrisico.",
  },
  {
    product_id: "4", has_mix: true, total_need: 7800,
    suppliers: [
      { name: "Gerbera Kwekerij Jansen", volume: 4500, price: 0.042, effective_price: 0.044, class: "B" },
      { name: "Flora Holland Pool", volume: 3300, price: 0.044, effective_price: 0.047, class: "B" },
    ],
    weighted_price: 0.043, weighted_effective_price: 0.045,
    rationale: "Volume verdeeld over beide beschikbare leveranciers. Geen grade A beschikbaar — spreiding beperkt risico.",
  },
  {
    product_id: "8", has_mix: true, total_need: 5200,
    suppliers: [
      { name: "Bloem & Blad NL", volume: 3500, price: 0.130, effective_price: 0.132, class: "A" },
      { name: "Rosalina BV", volume: 1700, price: 0.135, effective_price: 0.141, class: "B" },
    ],
    weighted_price: 0.132, weighted_effective_price: 0.135,
    rationale: "Hoofdvolume bij voorkeursleverancier, rest bij goedgekeurd alternatief. Kenya Direct vermeden.",
  },
  {
    product_id: "10", has_mix: true, total_need: 1900,
    suppliers: [
      { name: "Van der Berg Flowers", volume: 1200, price: 0.185, effective_price: 0.190, class: "A" },
      { name: "Rosalina BV", volume: 700, price: 0.178, effective_price: 0.186, class: "B" },
    ],
    weighted_price: 0.182, weighted_effective_price: 0.189,
    rationale: "Kernvolume bij premium leverancier, aanvullend volume bij Rosalina voor kostenbesparing op niet-premium lijnen.",
  },
];

// ── Supplier Stability (for Trade Registry) ──
export type SupplierStability = "stable" | "concentrated_risk" | "seasonal_risk";

export const supplierStabilityLabels: Record<SupplierStability, { label: string; color: string }> = {
  stable: { label: "Stabiel leveranciersbase", color: "text-accent bg-accent/10 border-accent/20" },
  concentrated_risk: { label: "Geconcentreerd risico", color: "text-destructive bg-destructive/10 border-destructive/20" },
  seasonal_risk: { label: "Seizoensrisico", color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20" },
};

export interface ProductSupplierStability {
  product: string;
  stability: SupplierStability;
  supplier_count: number;
  top_supplier_share: number; // percentage of volume from top supplier
}

export const productSupplierStabilityData: ProductSupplierStability[] = [
  { product: "Roos Red Naomi", stability: "stable", supplier_count: 3, top_supplier_share: 55 },
  { product: "Roos Avalanche+", stability: "stable", supplier_count: 3, top_supplier_share: 60 },
  { product: "Chrysant Ringa Yellow", stability: "stable", supplier_count: 2, top_supplier_share: 65 },
  { product: "Tulp Strong Gold", stability: "concentrated_risk", supplier_count: 1, top_supplier_share: 100 },
  { product: "Gerbera Kimsey", stability: "seasonal_risk", supplier_count: 2, top_supplier_share: 58 },
  { product: "Lisianthus Rosita White", stability: "concentrated_risk", supplier_count: 1, top_supplier_share: 100 },
  { product: "Alstroemeria Virginia", stability: "seasonal_risk", supplier_count: 2, top_supplier_share: 70 },
  { product: "Zonnebloem Sunrich", stability: "concentrated_risk", supplier_count: 1, top_supplier_share: 100 },
  { product: "Lelie Stargazer", stability: "stable", supplier_count: 2, top_supplier_share: 60 },
];

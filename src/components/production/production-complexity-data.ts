/* ══════════════════════════════════════════
   PRODUCTION COMPLEXITY DATA MODEL
   Shared types & mock data for stems/hour,
   recipe intelligence, and complexity index.
   ══════════════════════════════════════════ */

export type ComplexityLevel = "low" | "medium" | "high" | "very-high";
export type RecipeStability = "stable" | "variable" | "unstable";

export interface BouquetRecipe {
  id: string;
  name: string;
  productFamily: string;
  /** Total stems in one bouquet */
  stemsPerBouquet: number;
  /** Number of unique flower types */
  flowerTypeCount: number;
  /** List of flower components with proportions */
  components: { flower: string; percentage: number; stemLength?: number }[];
  /** Recipe stability indicator */
  recipeStability: RecipeStability;
  /** Variation index 0-10 */
  recipeVariationIndex: number;
  /** Handling intensity: how much manual work per bouquet */
  handlingIntensity: number; // 1-10
  /** Computed complexity index */
  complexityIndex: number;
  complexityLevel: ComplexityLevel;
}

export interface LineStemsData {
  line: string;
  dept: "Hand" | "Band";
  stemsPerHour: number;
  stemsPerHourPerPerson: number;
  bouquetsPerHour: number;
  persons: number;
  stemsProcessedToday: number;
  currentProduct: string;
  complexityLevel: ComplexityLevel;
  /** Expected stems/hour based on recipe complexity */
  expectedStemsPerHour: number;
  /** Deviation from expected */
  deviationPct: number;
}

export interface DeptStemsSummary {
  dept: string;
  stemsPerHour: number;
  stemsPerHourPerPerson: number;
  stemsProcessedToday: number;
  stemsProcessedPeriod: number;
  bouquetsPerHour: number;
  totalPersons: number;
}

export interface OperationalComplexityRow {
  product: string;
  productFamily: string;
  stemsPerBouquet: number;
  flowerTypes: number;
  complexityIndex: number;
  complexityLevel: ComplexityLevel;
  stemsPerHour: number;
  expectedOperationalPressure: "low" | "medium" | "high" | "very-high";
  actualPerformance: number; // % of expected
  line: string;
  dept: string;
}

export interface LineComplexityImpact {
  line: string;
  dept: string;
  avgComplexity: number;
  complexityLevel: ComplexityLevel;
  lineSpeedImpact: number; // % deviation from norm
  checksFrequency: number; // checks/hour
  delayRiskLevel: "low" | "medium" | "high";
  capacityUsagePct: number;
  efficiencyLossPct: number;
  currentProducts: string[];
}

/* ── HELPER ── */
export const complexityColor = (l: ComplexityLevel) => {
  switch (l) {
    case "low": return { text: "text-accent", bg: "bg-accent/10", border: "border-accent/20", label: "Laag" };
    case "medium": return { text: "text-primary", bg: "bg-primary/10", border: "border-primary/20", label: "Medium" };
    case "high": return { text: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20", label: "Hoog" };
    case "very-high": return { text: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20", label: "Zeer Hoog" };
  }
};

export const stabilityLabel = (s: RecipeStability) =>
  s === "stable" ? "Stabiel" : s === "variable" ? "Variabel" : "Instabiel";

export const stabilityColor = (s: RecipeStability) =>
  s === "stable" ? "text-accent" : s === "variable" ? "text-yellow-500" : "text-destructive";

/* ══════════════════════════════════════════
   MOCK DATA
   ══════════════════════════════════════════ */

export const bouquetRecipes: BouquetRecipe[] = [
  {
    id: "bq-charme-xl", name: "BQ Charme XL", productFamily: "Charme",
    stemsPerBouquet: 25, flowerTypeCount: 7,
    components: [
      { flower: "Roos", percentage: 28, stemLength: 50 },
      { flower: "Chrysant", percentage: 20, stemLength: 60 },
      { flower: "Lelie", percentage: 12, stemLength: 55 },
      { flower: "Gerbera", percentage: 12, stemLength: 45 },
      { flower: "Gypsophila", percentage: 12, stemLength: 50 },
      { flower: "Eucalyptus", percentage: 8, stemLength: 55 },
      { flower: "Statice", percentage: 8, stemLength: 40 },
    ],
    recipeStability: "stable", recipeVariationIndex: 1.8,
    handlingIntensity: 7, complexityIndex: 7.2, complexityLevel: "high",
  },
  {
    id: "bq-elegance", name: "BQ Elegance", productFamily: "Elegance",
    stemsPerBouquet: 20, flowerTypeCount: 5,
    components: [
      { flower: "Roos", percentage: 40, stemLength: 60 },
      { flower: "Chrysant", percentage: 20, stemLength: 55 },
      { flower: "Eucalyptus", percentage: 15, stemLength: 55 },
      { flower: "Gypsophila", percentage: 15, stemLength: 50 },
      { flower: "Ruscus", percentage: 10, stemLength: 45 },
    ],
    recipeStability: "stable", recipeVariationIndex: 1.2,
    handlingIntensity: 5, complexityIndex: 4.8, complexityLevel: "medium",
  },
  {
    id: "bq-trend", name: "BQ Trend", productFamily: "Trend",
    stemsPerBouquet: 15, flowerTypeCount: 4,
    components: [
      { flower: "Chrysant", percentage: 35, stemLength: 55 },
      { flower: "Gerbera", percentage: 30, stemLength: 45 },
      { flower: "Solidago", percentage: 20, stemLength: 50 },
      { flower: "Ruscus", percentage: 15, stemLength: 45 },
    ],
    recipeStability: "stable", recipeVariationIndex: 1.0,
    handlingIntensity: 3, complexityIndex: 2.9, complexityLevel: "low",
  },
  {
    id: "bq-de-luxe", name: "BQ De Luxe", productFamily: "De Luxe",
    stemsPerBouquet: 30, flowerTypeCount: 9,
    components: [
      { flower: "Roos", percentage: 22, stemLength: 60 },
      { flower: "Lelie", percentage: 14, stemLength: 55 },
      { flower: "Chrysant", percentage: 12, stemLength: 60 },
      { flower: "Gerbera", percentage: 10, stemLength: 45 },
      { flower: "Alstroemeria", percentage: 10, stemLength: 50 },
      { flower: "Hypericum", percentage: 8, stemLength: 45 },
      { flower: "Eucalyptus", percentage: 8, stemLength: 55 },
      { flower: "Gypsophila", percentage: 8, stemLength: 50 },
      { flower: "Statice", percentage: 8, stemLength: 40 },
    ],
    recipeStability: "variable", recipeVariationIndex: 4.5,
    handlingIntensity: 9, complexityIndex: 8.8, complexityLevel: "very-high",
  },
  {
    id: "bq-lovely", name: "BQ Lovely", productFamily: "Lovely",
    stemsPerBouquet: 18, flowerTypeCount: 5,
    components: [
      { flower: "Roos", percentage: 35, stemLength: 50 },
      { flower: "Chrysant", percentage: 25, stemLength: 50 },
      { flower: "Gypsophila", percentage: 15, stemLength: 45 },
      { flower: "Solidago", percentage: 15, stemLength: 45 },
      { flower: "Ruscus", percentage: 10, stemLength: 40 },
    ],
    recipeStability: "stable", recipeVariationIndex: 1.5,
    handlingIntensity: 4, complexityIndex: 3.8, complexityLevel: "low",
  },
  {
    id: "bq-field-l", name: "BQ Field L", productFamily: "Field",
    stemsPerBouquet: 22, flowerTypeCount: 8,
    components: [
      { flower: "Zonnebloem", percentage: 18, stemLength: 60 },
      { flower: "Chrysant", percentage: 15, stemLength: 55 },
      { flower: "Roos", percentage: 12, stemLength: 50 },
      { flower: "Gerbera", percentage: 12, stemLength: 45 },
      { flower: "Delphinium", percentage: 12, stemLength: 65 },
      { flower: "Solidago", percentage: 12, stemLength: 50 },
      { flower: "Eucalyptus", percentage: 10, stemLength: 55 },
      { flower: "Statice", percentage: 9, stemLength: 40 },
    ],
    recipeStability: "variable", recipeVariationIndex: 3.8,
    handlingIntensity: 7, complexityIndex: 6.9, complexityLevel: "high",
  },
  {
    id: "bq-chique", name: "BQ Chique", productFamily: "Chique",
    stemsPerBouquet: 20, flowerTypeCount: 6,
    components: [
      { flower: "Roos", percentage: 30, stemLength: 55 },
      { flower: "Chrysant", percentage: 20, stemLength: 55 },
      { flower: "Alstroemeria", percentage: 15, stemLength: 50 },
      { flower: "Eucalyptus", percentage: 15, stemLength: 55 },
      { flower: "Gypsophila", percentage: 10, stemLength: 50 },
      { flower: "Ruscus", percentage: 10, stemLength: 45 },
    ],
    recipeStability: "stable", recipeVariationIndex: 2.0,
    handlingIntensity: 6, complexityIndex: 5.4, complexityLevel: "medium",
  },
  {
    id: "bq-moederdag", name: "BQ Moederdag Special", productFamily: "Seizoen",
    stemsPerBouquet: 28, flowerTypeCount: 10,
    components: [
      { flower: "Roos", percentage: 20, stemLength: 55 },
      { flower: "Pioen", percentage: 12, stemLength: 45 },
      { flower: "Lelie", percentage: 10, stemLength: 55 },
      { flower: "Chrysant", percentage: 10, stemLength: 55 },
      { flower: "Gerbera", percentage: 10, stemLength: 45 },
      { flower: "Alstroemeria", percentage: 8, stemLength: 50 },
      { flower: "Freesia", percentage: 8, stemLength: 40 },
      { flower: "Eucalyptus", percentage: 8, stemLength: 55 },
      { flower: "Gypsophila", percentage: 7, stemLength: 50 },
      { flower: "Statice", percentage: 7, stemLength: 40 },
    ],
    recipeStability: "unstable", recipeVariationIndex: 6.2,
    handlingIntensity: 9, complexityIndex: 9.1, complexityLevel: "very-high",
  },
];

export const lineStemsData: LineStemsData[] = [
  { line: "H1", dept: "Hand", stemsPerHour: 4950, stemsPerHourPerPerson: 550, bouquetsPerHour: 225, persons: 9, stemsProcessedToday: 29700, currentProduct: "BQ Elegance", complexityLevel: "medium", expectedStemsPerHour: 5200, deviationPct: -4.8 },
  { line: "H2", dept: "Hand", stemsPerHour: 4400, stemsPerHourPerPerson: 489, bouquetsPerHour: 220, persons: 9, stemsProcessedToday: 26400, currentProduct: "BQ Trend", complexityLevel: "low", expectedStemsPerHour: 4800, deviationPct: -8.3 },
  { line: "H3", dept: "Hand", stemsPerHour: 4875, stemsPerHourPerPerson: 488, bouquetsPerHour: 195, persons: 10, stemsProcessedToday: 19500, currentProduct: "BQ Charme XL", complexityLevel: "high", expectedStemsPerHour: 4600, deviationPct: 6.0 },
  { line: "H4", dept: "Hand", stemsPerHour: 5060, stemsPerHourPerPerson: 563, bouquetsPerHour: 230, persons: 9, stemsProcessedToday: 30360, currentProduct: "BQ Lovely", complexityLevel: "low", expectedStemsPerHour: 5100, deviationPct: -0.8 },
  { line: "H5", dept: "Hand", stemsPerHour: 4360, stemsPerHourPerPerson: 545, bouquetsPerHour: 218, persons: 8, stemsProcessedToday: 26160, currentProduct: "BQ Chique", complexityLevel: "medium", expectedStemsPerHour: 4600, deviationPct: -5.2 },
  { line: "H6", dept: "Hand", stemsPerHour: 6150, stemsPerHourPerPerson: 513, bouquetsPerHour: 205, persons: 12, stemsProcessedToday: 24600, currentProduct: "BQ De Luxe", complexityLevel: "very-high", expectedStemsPerHour: 5800, deviationPct: 6.0 },
  { line: "H7", dept: "Hand", stemsPerHour: 4884, stemsPerHourPerPerson: 542, bouquetsPerHour: 222, persons: 9, stemsProcessedToday: 29304, currentProduct: "BQ Elegance", complexityLevel: "medium", expectedStemsPerHour: 5200, deviationPct: -6.1 },
  { line: "B1", dept: "Band", stemsPerHour: 6120, stemsPerHourPerPerson: 765, bouquetsPerHour: 340, persons: 8, stemsProcessedToday: 42840, currentProduct: "BQ Trend", complexityLevel: "low", expectedStemsPerHour: 6300, deviationPct: -2.9 },
  { line: "B2", dept: "Band", stemsPerHour: 6200, stemsPerHourPerPerson: 689, bouquetsPerHour: 310, persons: 9, stemsProcessedToday: 37200, currentProduct: "BQ Chique", complexityLevel: "medium", expectedStemsPerHour: 6500, deviationPct: -4.6 },
  { line: "B3", dept: "Band", stemsPerHour: 7000, stemsPerHourPerPerson: 778, bouquetsPerHour: 350, persons: 9, stemsProcessedToday: 49000, currentProduct: "BQ Lovely", complexityLevel: "low", expectedStemsPerHour: 6800, deviationPct: 2.9 },
  { line: "B4", dept: "Band", stemsPerHour: 6500, stemsPerHourPerPerson: 722, bouquetsPerHour: 325, persons: 9, stemsProcessedToday: 39000, currentProduct: "BQ Field L", complexityLevel: "high", expectedStemsPerHour: 6200, deviationPct: 4.8 },
  { line: "B5", dept: "Band", stemsPerHour: 8700, stemsPerHourPerPerson: 725, bouquetsPerHour: 290, persons: 12, stemsProcessedToday: 34800, currentProduct: "BQ De Luxe", complexityLevel: "very-high", expectedStemsPerHour: 8400, deviationPct: 3.6 },
];

export const deptStemsSummary: DeptStemsSummary[] = [
  { dept: "Hand", stemsPerHour: 34679, stemsPerHourPerPerson: 527, stemsProcessedToday: 186024, stemsProcessedPeriod: 982000, bouquetsPerHour: 1515, totalPersons: 66 },
  { dept: "Band", stemsPerHour: 34520, stemsPerHourPerPerson: 735, stemsProcessedToday: 202840, stemsProcessedPeriod: 1048000, bouquetsPerHour: 1615, totalPersons: 47 },
  { dept: "Totaal", stemsPerHour: 69199, stemsPerHourPerPerson: 613, stemsProcessedToday: 388864, stemsProcessedPeriod: 2030000, bouquetsPerHour: 3130, totalPersons: 113 },
];

export const operationalComplexityRows: OperationalComplexityRow[] = [
  { product: "BQ De Luxe", productFamily: "De Luxe", stemsPerBouquet: 30, flowerTypes: 9, complexityIndex: 8.8, complexityLevel: "very-high", stemsPerHour: 7425, expectedOperationalPressure: "very-high", actualPerformance: 88, line: "H6/B5", dept: "Hand/Band" },
  { product: "BQ Moederdag Special", productFamily: "Seizoen", stemsPerBouquet: 28, flowerTypes: 10, complexityIndex: 9.1, complexityLevel: "very-high", stemsPerHour: 0, expectedOperationalPressure: "very-high", actualPerformance: 0, line: "—", dept: "Nog niet gepland" },
  { product: "BQ Charme XL", productFamily: "Charme", stemsPerBouquet: 25, flowerTypes: 7, complexityIndex: 7.2, complexityLevel: "high", stemsPerHour: 4875, expectedOperationalPressure: "high", actualPerformance: 94, line: "H3", dept: "Hand" },
  { product: "BQ Field L", productFamily: "Field", stemsPerBouquet: 22, flowerTypes: 8, complexityIndex: 6.9, complexityLevel: "high", stemsPerHour: 6500, expectedOperationalPressure: "high", actualPerformance: 96, line: "B4", dept: "Band" },
  { product: "BQ Chique", productFamily: "Chique", stemsPerBouquet: 20, flowerTypes: 6, complexityIndex: 5.4, complexityLevel: "medium", stemsPerHour: 5280, expectedOperationalPressure: "medium", actualPerformance: 97, line: "H5/B2", dept: "Hand/Band" },
  { product: "BQ Elegance", productFamily: "Elegance", stemsPerBouquet: 20, flowerTypes: 5, complexityIndex: 4.8, complexityLevel: "medium", stemsPerHour: 4917, expectedOperationalPressure: "medium", actualPerformance: 95, line: "H1/H7", dept: "Hand" },
  { product: "BQ Lovely", productFamily: "Lovely", stemsPerBouquet: 18, flowerTypes: 5, complexityIndex: 3.8, complexityLevel: "low", stemsPerHour: 5530, expectedOperationalPressure: "low", actualPerformance: 101, line: "H4/B3", dept: "Hand/Band" },
  { product: "BQ Trend", productFamily: "Trend", stemsPerBouquet: 15, flowerTypes: 4, complexityIndex: 2.9, complexityLevel: "low", stemsPerHour: 5260, expectedOperationalPressure: "low", actualPerformance: 103, line: "H2/B1", dept: "Hand/Band" },
];

export const lineComplexityImpacts: LineComplexityImpact[] = [
  { line: "H3", dept: "Hand", avgComplexity: 7.2, complexityLevel: "high", lineSpeedImpact: -11, checksFrequency: 0.5, delayRiskLevel: "high", capacityUsagePct: 92, efficiencyLossPct: 8.5, currentProducts: ["BQ Charme XL"] },
  { line: "H6", dept: "Hand", avgComplexity: 8.8, complexityLevel: "very-high", lineSpeedImpact: -7, checksFrequency: 0.8, delayRiskLevel: "high", capacityUsagePct: 98, efficiencyLossPct: 12.1, currentProducts: ["BQ De Luxe"] },
  { line: "B5", dept: "Band", avgComplexity: 8.8, complexityLevel: "very-high", lineSpeedImpact: -12, checksFrequency: 1.1, delayRiskLevel: "high", capacityUsagePct: 95, efficiencyLossPct: 14.2, currentProducts: ["BQ De Luxe"] },
  { line: "B4", dept: "Band", avgComplexity: 6.9, complexityLevel: "high", lineSpeedImpact: -2, checksFrequency: 0.6, delayRiskLevel: "medium", capacityUsagePct: 88, efficiencyLossPct: 5.8, currentProducts: ["BQ Field L"] },
  { line: "H5", dept: "Hand", avgComplexity: 5.4, complexityLevel: "medium", lineSpeedImpact: -1, checksFrequency: 1.1, delayRiskLevel: "low", capacityUsagePct: 82, efficiencyLossPct: 3.2, currentProducts: ["BQ Chique"] },
  { line: "H1", dept: "Hand", avgComplexity: 4.8, complexityLevel: "medium", lineSpeedImpact: 2, checksFrequency: 1.8, delayRiskLevel: "low", capacityUsagePct: 85, efficiencyLossPct: 2.1, currentProducts: ["BQ Elegance"] },
  { line: "B3", dept: "Band", avgComplexity: 3.8, complexityLevel: "low", lineSpeedImpact: 6, checksFrequency: 1.4, delayRiskLevel: "low", capacityUsagePct: 78, efficiencyLossPct: 0.8, currentProducts: ["BQ Lovely"] },
  { line: "H4", dept: "Hand", avgComplexity: 3.8, complexityLevel: "low", lineSpeedImpact: 5, checksFrequency: 1.4, delayRiskLevel: "low", capacityUsagePct: 80, efficiencyLossPct: 1.2, currentProducts: ["BQ Lovely"] },
  { line: "B1", dept: "Band", avgComplexity: 2.9, complexityLevel: "low", lineSpeedImpact: 3, checksFrequency: 1.3, delayRiskLevel: "low", capacityUsagePct: 75, efficiencyLossPct: 0.5, currentProducts: ["BQ Trend"] },
  { line: "H2", dept: "Hand", avgComplexity: 2.9, complexityLevel: "low", lineSpeedImpact: 0, checksFrequency: 1.5, delayRiskLevel: "low", capacityUsagePct: 76, efficiencyLossPct: 1.8, currentProducts: ["BQ Trend"] },
  { line: "B2", dept: "Band", avgComplexity: 5.4, complexityLevel: "medium", lineSpeedImpact: -6, checksFrequency: 1.0, delayRiskLevel: "medium", capacityUsagePct: 84, efficiencyLossPct: 4.5, currentProducts: ["BQ Chique"] },
  { line: "H7", dept: "Hand", avgComplexity: 4.8, complexityLevel: "medium", lineSpeedImpact: 1, checksFrequency: 1.6, delayRiskLevel: "low", capacityUsagePct: 83, efficiencyLossPct: 2.4, currentProducts: ["BQ Elegance"] },
];

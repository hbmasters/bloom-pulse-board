// Verdelen allocation cockpit data

export type AllocationStatus = "action" | "blocked" | "ready" | "completed";
export type MarginRisk = "ok" | "warning" | "critical";
export type AIIndicator = "ai-prepared" | "substitute-available" | "margin-risk" | "allocation-warning";
export type ProductCategory = "hand" | "band" | "arrangement";

export type TrackTraceStatus = "binnengemeld" | "onderweg" | "verwacht" | "onbekend";

export interface StockBatch {
  id: string;
  articleName: string;
  articleCode: string;
  ave: number; // Available units
  ape: number; // Already allocated units
  totalStock: number;
  valuationPrice: number; // Waarderingsprijs
  supplier: string;
  ageDays: number;
  quality: "A" | "B" | "C";
  origin: string;
  deliveryDate: string;
  trackTrace: TrackTraceStatus;
  expectedArrival?: string; // only if onderweg/verwacht
  binnengemeldAt?: string; // timestamp when checked in
}

export interface ArticleLine {
  id: string;
  articleName: string;
  articleCode?: string;
  needed: number;
  allocated: number;
  allocatedBatches: { batchId: string; quantity: number }[];
  substituteAvailable: boolean;
  substituteConfidence?: number;
  substituteName?: string;
  marginImpact?: number;
  quantityFormula?: string; // e.g. "2x130=260"
  color?: string;
  perBouquet?: number; // stems per bouquet/emmer
  purchasePrice?: number; // inkoop per stuk
}

export interface MaterialLine {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Bewerkingen {
  lengte?: string;
  aantalPerVerpakking?: string;
  transportdrager?: string;
  belading?: string;
}

export interface ProductionOrder {
  id: string;
  orderNumber: string;
  internNummer?: string;
  customer: string;
  bouquet: string;
  bouquetImage: string;
  productionLine: string;
  quantity: number;
  departureDate: string;
  allocationProgress: number;
  status: AllocationStatus;
  marginRisk: MarginRisk;
  targetMarginPct: number;
  currentMarginPct: number;
  targetMarginEur: number;
  currentMarginEur: number;
  sellingPrice: number;
  costPrice: number;
  laborCost?: number;
  aiIndicators: AIIndicator[];
  articles: ArticleLine[];
  materials?: MaterialLine[];
  bewerkingen?: Bewerkingen;
}

export interface AIAction {
  id: string;
  label: string;
  type: "use-aged" | "substitute" | "split-batch" | "protect-premium" | "ready-picklist" | "auto-allocate";
  orderId: string;
  done: boolean;
}

export interface PicklistEntry {
  id: string;
  orderNumber: string;
  customer: string;
  bouquet: string;
  generatedAt: string;
  generatedBy: string;
  status: "pending" | "printed" | "completed";
}

export interface AllocationLog {
  user: string;
  time: string;
  orderId: string;
  aiSuggestion: string;
  overrideReason?: string;
}

// --- Stock batches ---
export const stockBatches: StockBatch[] = [
  { id: "b1", articleName: "Roos Red Naomi 60cm", articleCode: "RN60", ave: 1200, ape: 480, totalStock: 1680, valuationPrice: 0.42, supplier: "HBM Flowers Kenya", ageDays: 1, quality: "A", origin: "Kenya", deliveryDate: "2026-03-15", trackTrace: "binnengemeld", binnengemeldAt: "2026-03-15 05:30" },
  { id: "b2", articleName: "Roos Red Naomi 60cm", articleCode: "RN60", ave: 800, ape: 200, totalStock: 1000, valuationPrice: 0.38, supplier: "Flora Holland Aalsmeer", ageDays: 3, quality: "B", origin: "NL", deliveryDate: "2026-03-13", trackTrace: "binnengemeld", binnengemeldAt: "2026-03-13 06:15" },
  { id: "b3", articleName: "Eucalyptus Parvifolia", articleCode: "EUP", ave: 3600, ape: 900, totalStock: 4500, valuationPrice: 0.12, supplier: "Decorum Plants", ageDays: 2, quality: "A", origin: "IL", deliveryDate: "2026-03-14", trackTrace: "binnengemeld", binnengemeldAt: "2026-03-14 07:00" },
  { id: "b4", articleName: "Gerbera Pasta", articleCode: "GPA", ave: 320, ape: 160, totalStock: 480, valuationPrice: 0.29, supplier: "Flora Holland Aalsmeer", ageDays: 2, quality: "A", origin: "NL", deliveryDate: "2026-03-14", trackTrace: "binnengemeld", binnengemeldAt: "2026-03-14 06:45" },
  { id: "b5", articleName: "Gerbera Kimsey", articleCode: "GKI", ave: 600, ape: 0, totalStock: 600, valuationPrice: 0.25, supplier: "Flora Holland Aalsmeer", ageDays: 1, quality: "A", origin: "NL", deliveryDate: "2026-03-15", trackTrace: "binnengemeld", binnengemeldAt: "2026-03-15 06:00" },
  { id: "b6", articleName: "Lisianthus wit", articleCode: "LW", ave: 1500, ape: 400, totalStock: 1900, valuationPrice: 0.35, supplier: "Decorum Plants", ageDays: 1, quality: "A", origin: "NL", deliveryDate: "2026-03-15", trackTrace: "binnengemeld", binnengemeldAt: "2026-03-15 05:45" },
  { id: "b7", articleName: "Chrysant Bacardi", articleCode: "CB", ave: 200, ape: 100, totalStock: 300, valuationPrice: 0.18, supplier: "HBM Flowers Kenya", ageDays: 2, quality: "A", origin: "Kenya", deliveryDate: "2026-03-14", trackTrace: "binnengemeld", binnengemeldAt: "2026-03-14 05:30" },
  { id: "b8", articleName: "Chrysant Baltica", articleCode: "CBL", ave: 900, ape: 0, totalStock: 900, valuationPrice: 0.16, supplier: "Flora Holland Aalsmeer", ageDays: 1, quality: "A", origin: "NL", deliveryDate: "2026-03-15", trackTrace: "binnengemeld", binnengemeldAt: "2026-03-15 06:30" },
  { id: "b9", articleName: "Alstroemeria mix", articleCode: "AM", ave: 2400, ape: 600, totalStock: 3000, valuationPrice: 0.15, supplier: "Decorum Plants", ageDays: 1, quality: "A", origin: "NL", deliveryDate: "2026-03-15", trackTrace: "binnengemeld", binnengemeldAt: "2026-03-15 06:00" },
  { id: "b10", articleName: "Solidago", articleCode: "SOL", ave: 150, ape: 50, totalStock: 200, valuationPrice: 0.08, supplier: "Flora Holland Aalsmeer", ageDays: 3, quality: "B", origin: "NL", deliveryDate: "2026-03-13", trackTrace: "binnengemeld", binnengemeldAt: "2026-03-13 07:00" },
  { id: "b11", articleName: "Hypericum", articleCode: "HYP", ave: 400, ape: 0, totalStock: 400, valuationPrice: 0.14, supplier: "HBM Flowers Kenya", ageDays: 1, quality: "A", origin: "Kenya", deliveryDate: "2026-03-15", trackTrace: "onderweg", expectedArrival: "2026-03-16 04:00" },
  { id: "b12", articleName: "Pittosporum", articleCode: "PIT", ave: 80, ape: 60, totalStock: 140, valuationPrice: 0.10, supplier: "Decorum Plants", ageDays: 4, quality: "B", origin: "IL", deliveryDate: "2026-03-12", trackTrace: "binnengemeld", binnengemeldAt: "2026-03-12 06:30" },
  { id: "b13", articleName: "Tulp mix", articleCode: "TM", ave: 0, ape: 0, totalStock: 0, valuationPrice: 0.22, supplier: "Van Dijk Tulpen", ageDays: 0, quality: "A", origin: "NL", deliveryDate: "2026-03-17", trackTrace: "verwacht", expectedArrival: "2026-03-17 05:00" },
  { id: "b14", articleName: "Freesia wit", articleCode: "FW", ave: 180, ape: 0, totalStock: 180, valuationPrice: 0.19, supplier: "Flora Holland Aalsmeer", ageDays: 2, quality: "A", origin: "NL", deliveryDate: "2026-03-14", trackTrace: "binnengemeld", binnengemeldAt: "2026-03-14 06:00" },
  { id: "b15", articleName: "Freesia crème", articleCode: "FC", ave: 500, ape: 0, totalStock: 500, valuationPrice: 0.17, supplier: "Flora Holland Aalsmeer", ageDays: 1, quality: "A", origin: "NL", deliveryDate: "2026-03-15", trackTrace: "binnengemeld", binnengemeldAt: "2026-03-15 06:15" },
  { id: "b16", articleName: "Roos Avalanche 70cm", articleCode: "RA70", ave: 600, ape: 240, totalStock: 840, valuationPrice: 0.55, supplier: "HBM Flowers Kenya", ageDays: 1, quality: "A", origin: "Kenya", deliveryDate: "2026-03-15", trackTrace: "binnengemeld", binnengemeldAt: "2026-03-15 05:30" },
  { id: "b17", articleName: "Hydrangea wit", articleCode: "HW", ave: 120, ape: 40, totalStock: 160, valuationPrice: 1.85, supplier: "Decorum Plants", ageDays: 1, quality: "A", origin: "NL", deliveryDate: "2026-03-15", trackTrace: "binnengemeld", binnengemeldAt: "2026-03-15 07:00" },
  { id: "b18", articleName: "Lisianthus roze", articleCode: "LR", ave: 800, ape: 300, totalStock: 1100, valuationPrice: 0.33, supplier: "Flora Holland Aalsmeer", ageDays: 1, quality: "A", origin: "NL", deliveryDate: "2026-03-15", trackTrace: "binnengemeld", binnengemeldAt: "2026-03-15 06:00" },
  { id: "b19", articleName: "Roos Pink Floyd 50cm", articleCode: "RPF50", ave: 450, ape: 160, totalStock: 610, valuationPrice: 0.36, supplier: "HBM Flowers Kenya", ageDays: 1, quality: "A", origin: "Kenya", deliveryDate: "2026-03-15", trackTrace: "binnengemeld", binnengemeldAt: "2026-03-15 05:45" },
  { id: "b20", articleName: "Gypsophila", articleCode: "GYP", ave: 2000, ape: 400, totalStock: 2400, valuationPrice: 0.06, supplier: "Flora Holland Aalsmeer", ageDays: 2, quality: "A", origin: "NL", deliveryDate: "2026-03-14", trackTrace: "binnengemeld", binnengemeldAt: "2026-03-14 06:30" },
  { id: "b21", articleName: "Asparagus", articleCode: "ASP", ave: 1800, ape: 320, totalStock: 2120, valuationPrice: 0.04, supplier: "Decorum Plants", ageDays: 2, quality: "A", origin: "NL", deliveryDate: "2026-03-14", trackTrace: "binnengemeld", binnengemeldAt: "2026-03-14 07:15" },
];

// --- Production orders ---
export const productionOrders: ProductionOrder[] = [
  {
    id: "po-1",
    orderNumber: "PO-2026-0341",
    internNummer: "1697559",
    customer: "Jumbo Bloemen",
    bouquet: "Charme XL",
    bouquetImage: "product-charme-xl.jpg",
    productionLine: "Lijn 1",
    quantity: 480,
    departureDate: "2026-03-17",
    allocationProgress: 85,
    status: "action",
    marginRisk: "ok",
    targetMarginPct: 35,
    currentMarginPct: 34,
    targetMarginEur: 2.10,
    currentMarginEur: 1.92,
    sellingPrice: 5.65,
    costPrice: 3.73,
    laborCost: 0.96,
    aiIndicators: ["ai-prepared"],
    articles: [
      { id: "a1", articleName: "Roos Red Naomi 60cm", articleCode: "RN60", needed: 5, allocated: 5, allocatedBatches: [{ batchId: "b1", quantity: 5 }], substituteAvailable: false, quantityFormula: "2x130=260", color: "GRI", perBouquet: 1, purchasePrice: 0.42 },
      { id: "a2", articleName: "Eucalyptus Parvifolia", articleCode: "EUP", needed: 3, allocated: 3, allocatedBatches: [{ batchId: "b3", quantity: 3 }], substituteAvailable: false, quantityFormula: "2x100+60=260", color: "GR", perBouquet: 1, purchasePrice: 0.12 },
      { id: "a3", articleName: "Gerbera Pasta", articleCode: "GPA", needed: 3, allocated: 2, allocatedBatches: [{ batchId: "b4", quantity: 2 }], substituteAvailable: true, substituteConfidence: 92, substituteName: "Gerbera Kimsey", marginImpact: -0.04, quantityFormula: "5x50+10=260", color: "RZ", perBouquet: 1, purchasePrice: 0.29 },
      { id: "a4", articleName: "Lisianthus wit", articleCode: "LW", needed: 2, allocated: 2, allocatedBatches: [{ batchId: "b6", quantity: 2 }], substituteAvailable: false, quantityFormula: "3x80+20=260", color: "CR", perBouquet: 1, purchasePrice: 0.35 },
    ],
    materials: [
      { id: "m1", name: "t-bag / chrysal/sticker", quantity: 260, price: 0.10 },
      { id: "m2", name: "emmer 10L x2", quantity: 260, price: 0.16 },
      { id: "m3", name: "Smart prefold 44*50 nat", quantity: 260, price: 0.226 },
    ],
    bewerkingen: { lengte: "50 cm", aantalPerVerpakking: "x2", transportdrager: "", belading: "0 x 0" },
  },
  {
    id: "po-2",
    orderNumber: "PO-2026-0342",
    internNummer: "1697560",
    customer: "Albert Heijn",
    bouquet: "Field M",
    bouquetImage: "product-field-m.jpg",
    productionLine: "Lijn 2",
    quantity: 960,
    departureDate: "2026-03-17",
    allocationProgress: 45,
    status: "action",
    marginRisk: "warning",
    targetMarginPct: 30,
    currentMarginPct: 22,
    targetMarginEur: 1.20,
    currentMarginEur: 0.88,
    sellingPrice: 4.00,
    costPrice: 3.12,
    laborCost: 0.85,
    aiIndicators: ["margin-risk", "substitute-available"],
    articles: [
      { id: "a5", articleName: "Chrysant Bacardi", articleCode: "CB", needed: 4, allocated: 2, allocatedBatches: [{ batchId: "b7", quantity: 2 }], substituteAvailable: true, substituteConfidence: 87, substituteName: "Chrysant Baltica", marginImpact: 0.02, quantityFormula: "4x240=960", color: "RZ", perBouquet: 1, purchasePrice: 0.18 },
      { id: "a6", articleName: "Alstroemeria mix", articleCode: "AM", needed: 3, allocated: 3, allocatedBatches: [{ batchId: "b9", quantity: 3 }], substituteAvailable: false, quantityFormula: "3x320=960", color: "MIX", perBouquet: 1, purchasePrice: 0.15 },
      { id: "a7", articleName: "Solidago", articleCode: "SOL", needed: 2, allocated: 0, allocatedBatches: [], substituteAvailable: true, substituteConfidence: 78, substituteName: "Hypericum", marginImpact: -0.12, quantityFormula: "2x480=960", color: "GR", perBouquet: 1, purchasePrice: 0.08 },
      { id: "a8", articleName: "Pittosporum", articleCode: "PIT", needed: 2, allocated: 0, allocatedBatches: [], substituteAvailable: false, quantityFormula: "2x480=960", color: "GR", perBouquet: 1, purchasePrice: 0.10 },
    ],
    materials: [
      { id: "m4", name: "t-bag / chrysal/sticker", quantity: 960, price: 0.10 },
      { id: "m5", name: "emmer 10L x2", quantity: 960, price: 0.16 },
    ],
    bewerkingen: { lengte: "45 cm", aantalPerVerpakking: "x2", belading: "0 x 0" },
  },
  {
    id: "po-3",
    orderNumber: "PO-2026-0343",
    internNummer: "1697561",
    customer: "Aldi Blumen",
    bouquet: "Trend",
    bouquetImage: "product-trend.jpg",
    productionLine: "Lijn 1",
    quantity: 320,
    departureDate: "2026-03-18",
    allocationProgress: 0,
    status: "blocked",
    marginRisk: "critical",
    targetMarginPct: 28,
    currentMarginPct: 12,
    targetMarginEur: 1.05,
    currentMarginEur: 0.38,
    sellingPrice: 3.75,
    costPrice: 3.37,
    laborCost: 0.72,
    aiIndicators: ["margin-risk", "allocation-warning"],
    articles: [
      { id: "a9", articleName: "Tulp mix", articleCode: "TM", needed: 7, allocated: 0, allocatedBatches: [], substituteAvailable: false, quantityFormula: "7x46=322", color: "MIX", perBouquet: 1, purchasePrice: 0.22 },
      { id: "a10", articleName: "Freesia wit", articleCode: "FW", needed: 3, allocated: 0, allocatedBatches: [], substituteAvailable: true, substituteConfidence: 65, substituteName: "Freesia crème", marginImpact: -0.02, quantityFormula: "3x107=321", color: "CR", perBouquet: 1, purchasePrice: 0.19 },
    ],
    materials: [
      { id: "m6", name: "t-bag / chrysal/sticker", quantity: 320, price: 0.10 },
      { id: "m7", name: "Smart prefold 44*50 nat", quantity: 320, price: 0.226 },
    ],
    bewerkingen: { lengte: "40 cm", aantalPerVerpakking: "x1", belading: "0 x 0" },
  },
  {
    id: "po-4",
    orderNumber: "PO-2026-0340",
    internNummer: "1697558",
    customer: "Lidl NL",
    bouquet: "De Luxe",
    bouquetImage: "product-de-luxe.jpg",
    productionLine: "Lijn 3",
    quantity: 240,
    departureDate: "2026-03-16",
    allocationProgress: 100,
    status: "completed",
    marginRisk: "ok",
    targetMarginPct: 38,
    currentMarginPct: 41,
    targetMarginEur: 2.90,
    currentMarginEur: 3.15,
    sellingPrice: 7.68,
    costPrice: 4.53,
    laborCost: 1.10,
    aiIndicators: [],
    articles: [
      { id: "a11", articleName: "Roos Avalanche 70cm", articleCode: "RA70", needed: 5, allocated: 5, allocatedBatches: [{ batchId: "b16", quantity: 5 }], substituteAvailable: false, quantityFormula: "5x48=240", color: "CR", perBouquet: 1, purchasePrice: 0.55 },
      { id: "a12", articleName: "Hydrangea wit", articleCode: "HW", needed: 1, allocated: 1, allocatedBatches: [{ batchId: "b17", quantity: 1 }], substituteAvailable: false, quantityFormula: "1x240=240", color: "CR", perBouquet: 1, purchasePrice: 1.85 },
      { id: "a13", articleName: "Lisianthus roze", articleCode: "LR", needed: 3, allocated: 3, allocatedBatches: [{ batchId: "b18", quantity: 3 }], substituteAvailable: false, quantityFormula: "3x80=240", color: "RZ", perBouquet: 1, purchasePrice: 0.33 },
    ],
    materials: [
      { id: "m8", name: "t-bag / chrysal/sticker", quantity: 240, price: 0.10 },
      { id: "m9", name: "emmer 10L x2", quantity: 240, price: 0.16 },
      { id: "m10", name: "Smart prefold 44*50 nat", quantity: 240, price: 0.226 },
    ],
    bewerkingen: { lengte: "60 cm", aantalPerVerpakking: "x2", belading: "0 x 0" },
  },
  {
    id: "po-5",
    orderNumber: "PO-2026-0344",
    internNummer: "1697562",
    customer: "Deen Supermarkt",
    bouquet: "Lovely",
    bouquetImage: "product-lovely.jpg",
    productionLine: "Lijn 2",
    quantity: 160,
    departureDate: "2026-03-17",
    allocationProgress: 100,
    status: "ready",
    marginRisk: "ok",
    targetMarginPct: 36,
    currentMarginPct: 38,
    targetMarginEur: 2.30,
    currentMarginEur: 2.44,
    sellingPrice: 6.42,
    costPrice: 3.98,
    laborCost: 0.90,
    aiIndicators: ["ai-prepared"],
    articles: [
      { id: "a14", articleName: "Roos Pink Floyd 50cm", articleCode: "RPF50", needed: 5, allocated: 5, allocatedBatches: [{ batchId: "b19", quantity: 5 }], substituteAvailable: false, quantityFormula: "5x32=160", color: "RZ", perBouquet: 1, purchasePrice: 0.36 },
      { id: "a15", articleName: "Gypsophila", articleCode: "GYP", needed: 2, allocated: 2, allocatedBatches: [{ batchId: "b20", quantity: 2 }], substituteAvailable: false, quantityFormula: "2x80=160", color: "CR", perBouquet: 1, purchasePrice: 0.06 },
      { id: "a16", articleName: "Asparagus", articleCode: "ASP", needed: 2, allocated: 2, allocatedBatches: [{ batchId: "b21", quantity: 2 }], substituteAvailable: false, quantityFormula: "2x80=160", color: "GR", perBouquet: 1, purchasePrice: 0.04 },
    ],
    materials: [
      { id: "m11", name: "t-bag / chrysal/sticker", quantity: 160, price: 0.10 },
      { id: "m12", name: "emmer 10L x2", quantity: 160, price: 0.16 },
    ],
    bewerkingen: { lengte: "50 cm", aantalPerVerpakking: "x2", belading: "0 x 0" },
  },
];

export const aiActions: AIAction[] = [
  { id: "act-1", label: "Gebruik oudere voorraad Gerbera Pasta (dag 3)", type: "use-aged", orderId: "po-1", done: false },
  { id: "act-2", label: "Vervang Chrysant Bacardi → Baltica", type: "substitute", orderId: "po-2", done: false },
  { id: "act-3", label: "Splits batch Solidago over 2 orders", type: "split-batch", orderId: "po-2", done: false },
  { id: "act-4", label: "Bescherm premium Roos Avalanche", type: "protect-premium", orderId: "po-4", done: true },
  { id: "act-5", label: "PO-0344 gereed voor picklijst", type: "ready-picklist", orderId: "po-5", done: true },
  { id: "act-6", label: "Auto-allocatie PO-0341 beschikbaar", type: "auto-allocate", orderId: "po-1", done: false },
];

export const picklists: PicklistEntry[] = [
  { id: "pk-1", orderNumber: "PO-2026-0340", customer: "Lidl NL", bouquet: "De Luxe", generatedAt: "2026-03-16 06:45", generatedBy: "M. de Vries", status: "completed" },
  { id: "pk-2", orderNumber: "PO-2026-0344", customer: "Deen Supermarkt", bouquet: "Lovely", generatedAt: "2026-03-16 14:20", generatedBy: "AI → bevestigd door J. Bakker", status: "pending" },
];

export const allocationLogs: AllocationLog[] = [
  { user: "M. de Vries", time: "2026-03-16 06:42", orderId: "po-4", aiSuggestion: "Auto-allocatie volledig", overrideReason: undefined },
  { user: "J. Bakker", time: "2026-03-16 14:18", orderId: "po-5", aiSuggestion: "AI prepared + fast path", overrideReason: undefined },
];

export const statusColors: Record<AllocationStatus, string> = {
  action: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  blocked: "bg-destructive/20 text-destructive border-destructive/30",
  ready: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  completed: "bg-muted text-muted-foreground border-border",
};

export const marginColors: Record<MarginRisk, string> = {
  ok: "text-emerald-400",
  warning: "text-amber-400",
  critical: "text-destructive",
};

export const aiIndicatorLabels: Record<AIIndicator, { label: string; className: string }> = {
  "ai-prepared": { label: "AI Prepared", className: "bg-primary/20 text-primary border-primary/30" },
  "substitute-available": { label: "Substitutie", className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  "margin-risk": { label: "Marge Risico", className: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  "allocation-warning": { label: "Allocatie ⚠", className: "bg-destructive/20 text-destructive border-destructive/30" },
};

export const trackTraceColors: Record<TrackTraceStatus, { label: string; className: string }> = {
  binnengemeld: { label: "Binnengemeld", className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  onderweg: { label: "Onderweg", className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  verwacht: { label: "Verwacht", className: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  onbekend: { label: "Onbekend", className: "bg-muted text-muted-foreground border-border" },
};

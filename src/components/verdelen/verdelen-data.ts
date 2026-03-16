// Verdelen allocation cockpit data

export type AllocationStatus = "action" | "blocked" | "ready" | "completed";
export type MarginRisk = "ok" | "warning" | "critical";
export type AIIndicator = "ai-prepared" | "substitute-available" | "margin-risk" | "allocation-warning";

export interface ArticleLine {
  id: string;
  articleName: string;
  needed: number;
  allocated: number;
  batchId?: string;
  batchName?: string;
  substituteAvailable: boolean;
  substituteConfidence?: number;
  substituteName?: string;
  marginImpact?: number;
}

export interface ProductionOrder {
  id: string;
  orderNumber: string;
  customer: string;
  bouquet: string;
  productionLine: string;
  quantity: number;
  departureDate: string;
  allocationProgress: number;
  status: AllocationStatus;
  marginRisk: MarginRisk;
  expectedMarginPct: number;
  expectedMarginEur: number;
  aiIndicators: AIIndicator[];
  articles: ArticleLine[];
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

// --- Mock data ---

export const productionOrders: ProductionOrder[] = [
  {
    id: "po-1",
    orderNumber: "PO-2026-0341",
    customer: "Jumbo Bloemen",
    bouquet: "Charme XL",
    productionLine: "Lijn 1",
    quantity: 480,
    departureDate: "2026-03-17",
    allocationProgress: 85,
    status: "action",
    marginRisk: "ok",
    expectedMarginPct: 34,
    expectedMarginEur: 1.92,
    aiIndicators: ["ai-prepared"],
    articles: [
      { id: "a1", articleName: "Roos Red Naomi 60cm", needed: 5, allocated: 5, substituteAvailable: false },
      { id: "a2", articleName: "Eucalyptus Parvifolia", needed: 3, allocated: 3, substituteAvailable: false },
      { id: "a3", articleName: "Gerbera Pasta", needed: 3, allocated: 2, substituteAvailable: true, substituteConfidence: 92, substituteName: "Gerbera Kimsey", marginImpact: -0.04 },
      { id: "a4", articleName: "Lisianthus wit", needed: 2, allocated: 2, substituteAvailable: false },
    ],
  },
  {
    id: "po-2",
    orderNumber: "PO-2026-0342",
    customer: "Albert Heijn",
    bouquet: "Field M",
    productionLine: "Lijn 2",
    quantity: 960,
    departureDate: "2026-03-17",
    allocationProgress: 45,
    status: "action",
    marginRisk: "warning",
    expectedMarginPct: 22,
    expectedMarginEur: 0.88,
    aiIndicators: ["margin-risk", "substitute-available"],
    articles: [
      { id: "a5", articleName: "Chrysant Bacardi", needed: 4, allocated: 2, substituteAvailable: true, substituteConfidence: 87, substituteName: "Chrysant Baltica", marginImpact: 0.02 },
      { id: "a6", articleName: "Alstroemeria mix", needed: 3, allocated: 3, substituteAvailable: false },
      { id: "a7", articleName: "Solidago", needed: 2, allocated: 0, substituteAvailable: true, substituteConfidence: 78, substituteName: "Hypericum", marginImpact: -0.12 },
      { id: "a8", articleName: "Pittosporum", needed: 2, allocated: 0, substituteAvailable: false },
    ],
  },
  {
    id: "po-3",
    orderNumber: "PO-2026-0343",
    customer: "Aldi Blumen",
    bouquet: "Trend",
    productionLine: "Lijn 1",
    quantity: 320,
    departureDate: "2026-03-18",
    allocationProgress: 0,
    status: "blocked",
    marginRisk: "critical",
    expectedMarginPct: 12,
    expectedMarginEur: 0.38,
    aiIndicators: ["margin-risk", "allocation-warning"],
    articles: [
      { id: "a9", articleName: "Tulp mix", needed: 7, allocated: 0, substituteAvailable: false },
      { id: "a10", articleName: "Freesia wit", needed: 3, allocated: 0, substituteAvailable: true, substituteConfidence: 65, substituteName: "Freesia crème", marginImpact: -0.02 },
    ],
  },
  {
    id: "po-4",
    orderNumber: "PO-2026-0340",
    customer: "Lidl NL",
    bouquet: "De Luxe",
    productionLine: "Lijn 3",
    quantity: 240,
    departureDate: "2026-03-16",
    allocationProgress: 100,
    status: "completed",
    marginRisk: "ok",
    expectedMarginPct: 41,
    expectedMarginEur: 3.15,
    aiIndicators: [],
    articles: [
      { id: "a11", articleName: "Roos Avalanche 70cm", needed: 5, allocated: 5, substituteAvailable: false },
      { id: "a12", articleName: "Hydrangea wit", needed: 1, allocated: 1, substituteAvailable: false },
      { id: "a13", articleName: "Lisianthus roze", needed: 3, allocated: 3, substituteAvailable: false },
    ],
  },
  {
    id: "po-5",
    orderNumber: "PO-2026-0344",
    customer: "Deen Supermarkt",
    bouquet: "Lovely",
    productionLine: "Lijn 2",
    quantity: 160,
    departureDate: "2026-03-17",
    allocationProgress: 100,
    status: "ready",
    marginRisk: "ok",
    expectedMarginPct: 38,
    expectedMarginEur: 2.44,
    aiIndicators: ["ai-prepared"],
    articles: [
      { id: "a14", articleName: "Roos Pink Floyd 50cm", needed: 5, allocated: 5, substituteAvailable: false },
      { id: "a15", articleName: "Gypsophila", needed: 2, allocated: 2, substituteAvailable: false },
      { id: "a16", articleName: "Asparagus", needed: 2, allocated: 2, substituteAvailable: false },
    ],
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

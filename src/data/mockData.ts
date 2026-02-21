import productFieldL from "@/assets/product-field-l.jpg";
import productDeLuxe from "@/assets/product-de-luxe.jpg";
import productFieldM from "@/assets/product-field-m.jpg";
import productElegance from "@/assets/product-elegance.jpg";
import productCharmeXL from "@/assets/product-charme-xl.jpg";
import productLovely from "@/assets/product-lovely.jpg";
import productChique from "@/assets/product-chique.jpg";
import productTrend from "@/assets/product-trend.jpg";

export interface ActiveProduct {
  id: number;
  name: string;
  image: string;
  startTime: string;
  expectedEndTime: string;
  people: number;
  produced: number;
  target: number;
  minutesActive: number;
  piecesPerHour: number;
  plannedPiecesPerHour: number;
  status: "op-schema" | "sneller" | "hoog-tempo";
}

export interface CompletedProduct {
  id: number;
  name: string;
  quantity: number;
  plannedMinutes: number;
  actualMinutes: number;
  completedAt: string;
}

export interface CrossLineAlert {
  line: string;
  product: string;
  message: string;
  metric: string;
}

export interface YesterdayStats {
  totalProduced: number;
  avgPcsPerHour: number;
  peakHourPcsPerHour: number;
  avgPeople: number;
  bestOrder: string;
  bestOrderPcs: number;
  performanceVsPlanned: number;
}

// Hand Line 1 active production orders
export const activeProducts: ActiveProduct[] = [
  {
    id: 1,
    name: "BQ Field L",
    image: productFieldL,
    startTime: "07:00",
    expectedEndTime: "11:30",
    people: 3,
    produced: 287,
    target: 400,
    minutesActive: 195,
    piecesPerHour: 88,
    plannedPiecesPerHour: 80,
    status: "sneller",
  },
  {
    id: 2,
    name: "BQ Elegance",
    image: productElegance,
    startTime: "07:15",
    expectedEndTime: "12:00",
    people: 2,
    produced: 356,
    target: 400,
    minutesActive: 180,
    piecesPerHour: 119,
    plannedPiecesPerHour: 100,
    status: "hoog-tempo",
  },
  {
    id: 3,
    name: "BQ Charme XL",
    image: productCharmeXL,
    startTime: "08:00",
    expectedEndTime: "13:00",
    people: 2,
    produced: 198,
    target: 350,
    minutesActive: 135,
    piecesPerHour: 88,
    plannedPiecesPerHour: 85,
    status: "op-schema",
  },
];

// Hand Line 1 completed today
export const completedProducts: CompletedProduct[] = [
  { id: 1, name: "BQ de Luxe", quantity: 350, plannedMinutes: 240, actualMinutes: 210, completedAt: "08:45" },
  { id: 2, name: "BQ Lovely", quantity: 200, plannedMinutes: 180, actualMinutes: 180, completedAt: "09:30" },
  { id: 3, name: "BQ Chique", quantity: 150, plannedMinutes: 120, actualMinutes: 105, completedAt: "11:00" },
];

export const hbMasterMessages = [
  { text: "Sterk tempo dit uur — +6% boven planning.", mode: "flow" as const },
  { text: "Output per persoon stijgt. Sterke lijn.", mode: "flow" as const },
  { text: "Nog 4% voor een nieuw dagrecord.", mode: "flow" as const },
  { text: "Nieuwe order gestart: BQ Charme XL. Bouw tempo gecontroleerd op.", mode: "stabilisatie" as const },
  { text: "Jullie liggen voor op planning — excellent werk.", mode: "flow" as const },
  { text: "Snelheid stabiel rond planning. Solide productie.", mode: "stabilisatie" as const },
];

export const crossLineAlerts: CrossLineAlert[] = [
  { line: "Handlijn 3", product: "BQ Field M", message: "+12% boven planning", metric: "112%" },
  { line: "Bandlijn 2", product: "BQ Trend", message: "Nieuw uurrecord: 1.480 PCS/H", metric: "Record" },
  { line: "Handlijn 5", product: "BQ Coffee S", message: "+9% versnelling dit uur", metric: "+9%" },
];

export const lineStats = {
  lineName: "HAND LINE 1",
  totalPeople: 7,
  totalProduced: 1.541,
  plannedPiecesPerHour: 80,
  currentPiecesPerHour: 88,
  performanceVsPlanned: 110,
  outputPerPerson: 12.6,
  efficiencyScore: 94,
  peopleLastUpdated: 12, // minutes ago
};

export const yesterdayStats: YesterdayStats = {
  totalProduced: 4820,
  avgPcsPerHour: 86,
  peakHourPcsPerHour: 1320,
  avgPeople: 7,
  bestOrder: "BQ Field L",
  bestOrderPcs: 680,
  performanceVsPlanned: 106,
};

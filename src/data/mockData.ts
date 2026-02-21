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
  customer?: string;
  departureDate: string;
  startTime: string;
  expectedEndTime: string;
  people: number;
  produced: number;
  target: number;
  minutesActive: number;
  piecesPerHour: number;
  plannedPiecesPerHour: number;
  status: "on-schedule" | "faster" | "high-pace";
}

export interface CompletedProduct {
  id: number;
  name: string;
  quantity: number;
  departureDate: string;
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

export const activeProducts: ActiveProduct[] = [
  {
    id: 1,
    name: "BQ Field L",
    image: productFieldL,
    departureDate: "21 feb",
    startTime: "07:00",
    expectedEndTime: "11:30",
    people: 3,
    produced: 287,
    target: 400,
    minutesActive: 195,
    piecesPerHour: 88,
    plannedPiecesPerHour: 80,
    status: "faster",
  },
  {
    id: 2,
    name: "BQ Elegance",
    image: productElegance,
    departureDate: "22 feb",
    startTime: "07:15",
    expectedEndTime: "12:00",
    people: 2,
    produced: 356,
    target: 400,
    minutesActive: 180,
    piecesPerHour: 119,
    plannedPiecesPerHour: 100,
    status: "high-pace",
  },
  {
    id: 3,
    name: "BQ Charme XL",
    image: productCharmeXL,
    departureDate: "21 feb",
    startTime: "08:00",
    expectedEndTime: "13:00",
    people: 2,
    produced: 198,
    target: 350,
    minutesActive: 135,
    piecesPerHour: 88,
    plannedPiecesPerHour: 85,
    status: "on-schedule",
  },
  {
    id: 4,
    name: "BQ Spring Mix",
    image: "",
    customer: "HBM WS",
    departureDate: "23 feb",
    startTime: "09:30",
    expectedEndTime: "14:00",
    people: 2,
    produced: 95,
    target: 300,
    minutesActive: 60,
    piecesPerHour: 95,
    plannedPiecesPerHour: 90,
    status: "faster",
  },
];

export const completedProducts: CompletedProduct[] = [
  { id: 1, name: "BQ de Luxe", quantity: 350, departureDate: "21 feb", plannedMinutes: 240, actualMinutes: 210, completedAt: "08:45" },
  { id: 2, name: "BQ Lovely", quantity: 200, departureDate: "22 feb", plannedMinutes: 180, actualMinutes: 180, completedAt: "09:30" },
  { id: 3, name: "BQ Chique", quantity: 150, departureDate: "21 feb", plannedMinutes: 120, actualMinutes: 105, completedAt: "11:00" },
];

export const hbMasterMessages = [
  { text: "Strong tempo this hour — +6% above planned.", mode: "flow" as const },
  { text: "Output per person is rising. Solid line.", mode: "flow" as const },
  { text: "4% more to hit a new daily record.", mode: "flow" as const },
  { text: "New order started: BQ Charme XL. Building pace.", mode: "stabilisatie" as const },
  { text: "You are ahead of schedule — excellent work.", mode: "flow" as const },
  { text: "Speed stable around target. Solid production.", mode: "stabilisatie" as const },
];

export const crossLineAlerts: CrossLineAlert[] = [
  { line: "Hand Line 3", product: "BQ Field M", message: "+12% above planned", metric: "112%" },
  { line: "Belt Line 2", product: "BQ Trend", message: "New hourly record: 1,480 PCS/H", metric: "Record" },
  { line: "Hand Line 5", product: "BQ Coffee S", message: "+9% speed increase this hour", metric: "+9%" },
];

export interface TeamLeader {
  name: string;
  initials: string;
  role: string;
}

export const teamLeaders: TeamLeader[] = [
  { name: "Ingrida", initials: "IN", role: "Bandleider" },
  { name: "Greta", initials: "GR", role: "Bandleider" },
];

export const lineStats = {
  lineName: "HAND LINE 1",
  totalPeople: 7,
  totalProduced: 1541,
  plannedPiecesPerHour: 80,
  currentPiecesPerHour: 88,
  performanceVsPlanned: 110,
  outputPerPerson: 12.6,
  efficiencyScore: 94,
  peopleLastUpdated: 12,
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

import productSpringBouquet from "@/assets/product-spring-bouquet.jpg";
import productMoederdag from "@/assets/product-moederdag.jpg";
import productTulpen from "@/assets/product-tulpen.jpg";
import productPastel from "@/assets/product-pastel.jpg";
import productZonnebloem from "@/assets/product-zonnebloem.jpg";
import productRoos from "@/assets/product-roos.jpg";
import productOrchidee from "@/assets/product-orchidee.jpg";
import productZomermix from "@/assets/product-zomermix.jpg";

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

// Hand Line 1 active production orders
export const activeProducts: ActiveProduct[] = [
  {
    id: 1,
    name: "Luxe Voorjaarsboeket",
    image: productSpringBouquet,
    startTime: "07:00",
    expectedEndTime: "11:30",
    people: 3,
    produced: 287,
    target: 400,
    minutesActive: 195,
    piecesPerHour: 88,
    status: "op-schema",
  },
  {
    id: 2,
    name: "Moederdag Arrangement",
    image: productMoederdag,
    startTime: "07:15",
    expectedEndTime: "12:00",
    people: 2,
    produced: 356,
    target: 400,
    minutesActive: 180,
    piecesPerHour: 119,
    status: "sneller",
  },
  {
    id: 3,
    name: "Seizoens Mix Pastel",
    image: productPastel,
    startTime: "08:00",
    expectedEndTime: "13:00",
    people: 2,
    produced: 198,
    target: 350,
    minutesActive: 135,
    piecesPerHour: 88,
    status: "hoog-tempo",
  },
];

// Hand Line 1 completed today
export const completedProducts: CompletedProduct[] = [
  { id: 1, name: "Lenteweelde Boeket", quantity: 350, plannedMinutes: 240, actualMinutes: 210, completedAt: "08:45" },
  { id: 2, name: "Premium Roos Arrangement", quantity: 200, plannedMinutes: 180, actualMinutes: 180, completedAt: "09:30" },
  { id: 3, name: "Orchidee Deluxe", quantity: 150, plannedMinutes: 120, actualMinutes: 105, completedAt: "11:00" },
];

export const hbMasterMessages = [
  "Sterk tempo dit uur — blijf pushen.",
  "Snelheid met 7% gestegen t.o.v. vorig uur.",
  "Jullie liggen voor op planning — excellent werk.",
  "Nog 5% erbij en jullie zetten een nieuw dagrecord.",
  "Mooi momentum — houd dit vast, Hand Lijn 1.",
  "De kwaliteit en snelheid liggen perfect in balans.",
];

export const crossLineAlerts = [
  { line: "Handlijn 3", message: "heeft zojuist 12% boven planning bereikt." },
  { line: "Bandlijn 2", message: "zette een nieuw uurrecord neer." },
  { line: "Handlijn 5", message: "versnelde met 9% dit uur." },
];

export const lineStats = {
  lineName: "HANDLIJN 1",
  totalPeople: 7,
  totalProduced: 991,
  plannedPiecesPerHour: 80,
  currentPiecesPerHour: 88,
  performanceVsPlanned: 110, // percentage
};

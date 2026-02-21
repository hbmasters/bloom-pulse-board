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
  line: string;
  lineType: "hand" | "band";
  startTime: string;
  expectedEndTime: string;
  people: number;
  produced: number;
  target: number;
  minutesActive: number;
  status: "op-schema" | "sneller" | "onder-check";
  checkStartTime?: string;
  checkPeople?: number;
  checkEndTime?: string;
}

export interface CompletedProduct {
  id: number;
  name: string;
  image: string;
  quantity: number;
  plannedMinutes: number;
  actualMinutes: number;
  line: string;
  completedAt: string;
}

export interface ProductionLine {
  id: number;
  name: string;
  type: "hand" | "band";
  people: number;
  produced: number;
  hoursActive: number;
  avgSpeed: number;
  badge?: string;
}

export const activeProducts: ActiveProduct[] = [
  {
    id: 1,
    name: "Luxe Voorjaarsboeket",
    image: productSpringBouquet,
    line: "Handlijn 3",
    lineType: "hand",
    startTime: "07:00",
    expectedEndTime: "11:30",
    people: 6,
    produced: 287,
    target: 400,
    minutesActive: 195,
    status: "op-schema",
  },
  {
    id: 2,
    name: "Moederdag Arrangement",
    image: productMoederdag,
    line: "Bandlijn 2",
    lineType: "band",
    startTime: "07:15",
    expectedEndTime: "12:00",
    people: 8,
    produced: 356,
    target: 400,
    minutesActive: 180,
    status: "sneller",
  },
  {
    id: 3,
    name: "Mono Plus Tulpen",
    image: productTulpen,
    line: "Bandlijn 4",
    lineType: "band",
    startTime: "06:30",
    expectedEndTime: "10:30",
    people: 5,
    produced: 412,
    target: 500,
    minutesActive: 225,
    status: "op-schema",
  },
  {
    id: 4,
    name: "Seizoens Mix Pastel",
    image: productPastel,
    line: "Handlijn 1",
    lineType: "hand",
    startTime: "08:00",
    expectedEndTime: "13:00",
    people: 7,
    produced: 198,
    target: 350,
    minutesActive: 135,
    status: "sneller",
  },
  {
    id: 5,
    name: "Orchidee Deluxe",
    image: productOrchidee,
    line: "Handlijn 5",
    lineType: "hand",
    startTime: "09:00",
    expectedEndTime: "14:00",
    people: 4,
    produced: 45,
    target: 150,
    minutesActive: 75,
    status: "onder-check",
    checkStartTime: "10:05",
    checkPeople: 2,
    checkEndTime: "10:30",
  },
];

export const completedProducts: CompletedProduct[] = [
  {
    id: 1,
    name: "Lenteweelde Boeket",
    image: productZonnebloem,
    quantity: 350,
    plannedMinutes: 240,
    actualMinutes: 210,
    line: "Bandlijn 1",
    completedAt: "08:45",
  },
  {
    id: 2,
    name: "Premium Roos Arrangement",
    image: productRoos,
    quantity: 200,
    plannedMinutes: 180,
    actualMinutes: 180,
    line: "Handlijn 2",
    completedAt: "09:30",
  },
  {
    id: 3,
    name: "Zomermix Gerbera",
    image: productZomermix,
    quantity: 500,
    plannedMinutes: 300,
    actualMinutes: 265,
    line: "Bandlijn 3",
    completedAt: "10:15",
  },
  {
    id: 4,
    name: "Zonnebloem Vreugde",
    image: productZonnebloem,
    quantity: 275,
    plannedMinutes: 200,
    actualMinutes: 195,
    line: "Handlijn 4",
    completedAt: "11:00",
  },
];

export const productionLines: ProductionLine[] = [
  { id: 1, name: "Handlijn 1", type: "hand", people: 7, produced: 548, hoursActive: 5.2, avgSpeed: 105, badge: "Meeste output" },
  { id: 2, name: "Handlijn 2", type: "hand", people: 5, produced: 420, hoursActive: 4.8, avgSpeed: 88 },
  { id: 3, name: "Handlijn 3", type: "hand", people: 6, produced: 487, hoursActive: 5.0, avgSpeed: 97, badge: "Sterkste groei" },
  { id: 4, name: "Handlijn 4", type: "hand", people: 4, produced: 375, hoursActive: 4.5, avgSpeed: 83 },
  { id: 5, name: "Handlijn 5", type: "hand", people: 4, produced: 295, hoursActive: 3.8, avgSpeed: 78 },
  { id: 6, name: "Handlijn 6", type: "hand", people: 6, produced: 410, hoursActive: 4.6, avgSpeed: 89 },
  { id: 7, name: "Handlijn 7", type: "hand", people: 5, produced: 365, hoursActive: 4.2, avgSpeed: 87 },
  { id: 8, name: "Bandlijn 1", type: "band", people: 8, produced: 720, hoursActive: 5.5, avgSpeed: 131, badge: "Beste tempo" },
  { id: 9, name: "Bandlijn 2", type: "band", people: 8, produced: 656, hoursActive: 5.2, avgSpeed: 126 },
  { id: 10, name: "Bandlijn 3", type: "band", people: 7, produced: 600, hoursActive: 5.0, avgSpeed: 120 },
  { id: 11, name: "Bandlijn 4", type: "band", people: 5, produced: 512, hoursActive: 4.8, avgSpeed: 107 },
  { id: 12, name: "Bandlijn 5", type: "band", people: 6, produced: 480, hoursActive: 4.5, avgSpeed: 107 },
];

export const dashboardStats = {
  totalPeople: 85,
  totalProduced: 6868,
  avgSpeed: 545,
};

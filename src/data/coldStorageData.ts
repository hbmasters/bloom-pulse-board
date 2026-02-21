import hbmFieldL from "@/assets/hbm-field-l.jpg";
import hbmDeLuxe from "@/assets/hbm-de-luxe.jpg";
import hbmFieldM from "@/assets/hbm-field-m.jpg";
import hbmElegance from "@/assets/hbm-elegance.jpg";
import hbmCharmeXL from "@/assets/hbm-charme-xl.jpg";
import hbmLovely from "@/assets/hbm-lovely.jpg";
import hbmChique from "@/assets/hbm-chique.jpg";
import hbmTrend from "@/assets/hbm-trend.jpg";
import hbmCharme from "@/assets/hbm-charme.jpg";
import hbmCoffeeS from "@/assets/hbm-coffee-s.png";

export interface ColdStorageOrder {
  id: number;
  name: string;
  quantity: number;
  estimatedMinutes: number;
  printedBy?: string;
  departureDate?: string;
  pickedBy?: string;
  advisedLine?: string;
  category?: string;
  accountManager?: string;
  progress?: number;
}

export interface PickedOrder extends ColdStorageOrder {
  picker: string;
  startTime: string;
  image: string;
}

export const printedOrders: ColdStorageOrder[] = [
  { id: 1, name: "BQ Field L", quantity: 400, estimatedMinutes: 180, printedBy: "Jan", departureDate: "21 Feb", accountManager: "Peter", category: "Hand" },
  { id: 2, name: "BQ de Luxe", quantity: 250, estimatedMinutes: 120, printedBy: "Pieter", departureDate: "21 Feb", accountManager: "Sandra", category: "Band" },
  { id: 3, name: "BQ Elegance", quantity: 300, estimatedMinutes: 150, printedBy: "Jan", departureDate: "22 Feb", accountManager: "Peter", category: "Hand" },
  { id: 4, name: "BQ Charme XL", quantity: 180, estimatedMinutes: 90, printedBy: "Pieter", departureDate: "21 Feb", accountManager: "Sandra", category: "Band" },
  { id: 18, name: "BQ Lovely", quantity: 220, estimatedMinutes: 110, printedBy: "Jan", departureDate: "22 Feb", accountManager: "Peter", category: "Hand" },
  { id: 19, name: "BQ Trend", quantity: 150, estimatedMinutes: 75, printedBy: "Pieter", departureDate: "21 Feb", accountManager: "Sandra", category: "Band" },
  { id: 20, name: "BQ Charme", quantity: 350, estimatedMinutes: 170, printedBy: "Jan", departureDate: "23 Feb", accountManager: "Peter", category: "Others" },
  { id: 21, name: "BQ Field M", quantity: 280, estimatedMinutes: 140, printedBy: "Pieter", departureDate: "21 Feb", accountManager: "Sandra", category: "Hand" },
  { id: 22, name: "BQ Chique", quantity: 200, estimatedMinutes: 100, printedBy: "Jan", departureDate: "22 Feb", accountManager: "Peter", category: "Band" },
  { id: 23, name: "BQ Coffee S", quantity: 320, estimatedMinutes: 160, printedBy: "Pieter", departureDate: "21 Feb", accountManager: "Sandra", category: "Band" },
  { id: 24, name: "BQ Field L", quantity: 180, estimatedMinutes: 90, printedBy: "Jan", departureDate: "23 Feb", accountManager: "Peter", category: "Hand" },
  { id: 25, name: "BQ de Luxe", quantity: 150, estimatedMinutes: 80, printedBy: "Pieter", departureDate: "22 Feb", accountManager: "Sandra", category: "Others" },
];

export const pickedOrders: PickedOrder[] = [
  { id: 5, name: "BQ Field L", quantity: 350, estimatedMinutes: 160, picker: "Anna", startTime: "07:15", image: hbmFieldL, departureDate: "21 Feb" },
  { id: 6, name: "BQ de Luxe", quantity: 200, estimatedMinutes: 100, picker: "Mark", startTime: "08:00", image: hbmDeLuxe, departureDate: "21 Feb" },
  { id: 7, name: "BQ Elegance", quantity: 280, estimatedMinutes: 140, picker: "Sophie", startTime: "08:30", image: hbmElegance, departureDate: "22 Feb" },
  { id: 15, name: "BQ Field M", quantity: 220, estimatedMinutes: 110, picker: "Daan", startTime: "07:45", image: hbmFieldM, departureDate: "21 Feb" },
  { id: 16, name: "BQ Chique", quantity: 180, estimatedMinutes: 95, picker: "Lisa", startTime: "08:15", image: hbmChique, departureDate: "22 Feb" },
  { id: 17, name: "BQ Charme XL", quantity: 300, estimatedMinutes: 145, picker: "Tom", startTime: "09:00", image: hbmCharmeXL, departureDate: "23 Feb" },
];

export const waitingForHandOrders: ColdStorageOrder[] = [
  { id: 8, name: "BQ Field L", quantity: 400, estimatedMinutes: 210, pickedBy: "Anna", advisedLine: "H1", departureDate: "21 Feb", progress: 0 },
  { id: 9, name: "BQ Elegance", quantity: 300, estimatedMinutes: 180, pickedBy: "Mark", advisedLine: "H2", departureDate: "22 Feb", progress: 0 },
  { id: 10, name: "BQ Charme XL", quantity: 250, estimatedMinutes: 150, pickedBy: "Sophie", advisedLine: "H1", departureDate: "21 Feb", progress: 0 },
  { id: 26, name: "BQ Lovely", quantity: 200, estimatedMinutes: 100, pickedBy: "Daan", advisedLine: "H3", departureDate: "22 Feb", progress: 0 },
  { id: 27, name: "BQ Charme", quantity: 180, estimatedMinutes: 90, pickedBy: "Lisa", advisedLine: "H1", departureDate: "21 Feb", progress: 0 },
];

export const waitingForBandOrders: ColdStorageOrder[] = [
  { id: 11, name: "BQ Coffee S", quantity: 500, estimatedMinutes: 120, pickedBy: "Tom", advisedLine: "B1", departureDate: "21 Feb", progress: 0 },
  { id: 12, name: "BQ Trend", quantity: 350, estimatedMinutes: 90, pickedBy: "Anna", advisedLine: "B2", departureDate: "22 Feb", progress: 0 },
  { id: 13, name: "BQ de Luxe", quantity: 400, estimatedMinutes: 105, pickedBy: "Mark", advisedLine: "B1", departureDate: "21 Feb", progress: 0 },
  { id: 14, name: "BQ Lovely", quantity: 200, estimatedMinutes: 80, pickedBy: "Sophie", advisedLine: "B1", departureDate: "23 Feb", progress: 0 },
];

export const waitingForOthersOrders: ColdStorageOrder[] = [
  { id: 28, name: "Orchidee Mix", quantity: 120, estimatedMinutes: 60, pickedBy: "Daan", advisedLine: "A1", departureDate: "21 Feb", category: "Arrangement", progress: 0 },
  { id: 29, name: "Succulent Set", quantity: 80, estimatedMinutes: 45, pickedBy: "Lisa", advisedLine: "P1", departureDate: "22 Feb", category: "Plants", progress: 0 },
  { id: 30, name: "Rose Arrangement", quantity: 150, estimatedMinutes: 90, pickedBy: "Tom", advisedLine: "A2", departureDate: "21 Feb", category: "Arrangement", progress: 0 },
];

export interface FastestPicker {
  name: string;
  ordersCompleted: number;
  avgMinutesPerOrder: number;
}

export const fastestPicker: FastestPicker = {
  name: "Daan",
  ordersCompleted: 12,
  avgMinutesPerOrder: 18,
};

export const coldStorageStats = {
  lineName: "COLD STORAGE",
  totalPickers: 8,
  totalOrders: 17,
  totalPiecesToday: 4360,
  peopleLastUpdated: 8,
};

export const coldStorageHBMessages = [
  { text: "Picking pace is steady — all pickers on track.", mode: "flow" as const },
  { text: "3 orders ready for Hand line. Keep them flowing.", mode: "stabilisatie" as const },
  { text: "Anna leads with 65% picked on BQ Tulpen.", mode: "flow" as const },
  { text: "Band line queue is filling up — solid prep work.", mode: "flow" as const },
  { text: "New batch printed: BQ Charme — 180 pieces.", mode: "stabilisatie" as const },
];

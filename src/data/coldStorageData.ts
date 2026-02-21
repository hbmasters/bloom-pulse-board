import productTulpen from "@/assets/product-tulpen.jpg";
import productSpringBouquet from "@/assets/product-spring-bouquet.jpg";
import productMoederdag from "@/assets/product-moederdag.jpg";
import productFieldM from "@/assets/product-field-m.jpg";
import productChique from "@/assets/product-chique.jpg";
import productPastel from "@/assets/product-pastel.jpg";

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
}

export interface PickedOrder extends ColdStorageOrder {
  picker: string;
  startTime: string;
  progress: number;
  image: string;
}

export const printedOrders: ColdStorageOrder[] = [
  { id: 1, name: "BQ Pastel", quantity: 400, estimatedMinutes: 180, printedBy: "Jan", departureDate: "21 Feb" },
  { id: 2, name: "BQ Orchidee", quantity: 250, estimatedMinutes: 120, printedBy: "Pieter", departureDate: "21 Feb" },
  { id: 3, name: "BQ Zomermix", quantity: 300, estimatedMinutes: 150, printedBy: "Jan", departureDate: "22 Feb" },
  { id: 4, name: "BQ Roos", quantity: 180, estimatedMinutes: 90, printedBy: "Pieter", departureDate: "21 Feb" },
  { id: 18, name: "BQ Lovely", quantity: 220, estimatedMinutes: 110, printedBy: "Jan", departureDate: "22 Feb" },
  { id: 19, name: "BQ Trend", quantity: 150, estimatedMinutes: 75, printedBy: "Pieter", departureDate: "21 Feb" },
  { id: 20, name: "BQ de Luxe", quantity: 350, estimatedMinutes: 170, printedBy: "Jan", departureDate: "23 Feb" },
  { id: 21, name: "BQ Field L", quantity: 280, estimatedMinutes: 140, printedBy: "Pieter", departureDate: "21 Feb" },
  { id: 22, name: "BQ Elegance", quantity: 200, estimatedMinutes: 100, printedBy: "Jan", departureDate: "22 Feb" },
  { id: 23, name: "BQ Charme XL", quantity: 320, estimatedMinutes: 160, printedBy: "Pieter", departureDate: "21 Feb" },
  { id: 24, name: "BQ Zonnebloem", quantity: 180, estimatedMinutes: 90, printedBy: "Jan", departureDate: "23 Feb" },
  { id: 25, name: "BQ Chique", quantity: 150, estimatedMinutes: 80, printedBy: "Pieter", departureDate: "22 Feb" },
];

export const pickedOrders: PickedOrder[] = [
  { id: 5, name: "BQ Tulpen", quantity: 350, estimatedMinutes: 160, picker: "Anna", startTime: "07:15", progress: 65, image: productTulpen, departureDate: "21 Feb" },
  { id: 6, name: "BQ Spring Bouquet", quantity: 200, estimatedMinutes: 100, picker: "Mark", startTime: "08:00", progress: 40, image: productSpringBouquet, departureDate: "21 Feb" },
  { id: 7, name: "BQ Moederdag", quantity: 280, estimatedMinutes: 140, picker: "Sophie", startTime: "08:30", progress: 20, image: productMoederdag, departureDate: "22 Feb" },
  { id: 15, name: "BQ Field M", quantity: 220, estimatedMinutes: 110, picker: "Daan", startTime: "07:45", progress: 75, image: productFieldM, departureDate: "21 Feb" },
  { id: 16, name: "BQ Chique", quantity: 180, estimatedMinutes: 95, picker: "Lisa", startTime: "08:15", progress: 55, image: productChique, departureDate: "22 Feb" },
  { id: 17, name: "BQ Pastel", quantity: 300, estimatedMinutes: 145, picker: "Tom", startTime: "09:00", progress: 10, image: productPastel, departureDate: "23 Feb" },
];

export const waitingForHandOrders: ColdStorageOrder[] = [
  { id: 8, name: "BQ Field L", quantity: 400, estimatedMinutes: 210, pickedBy: "Anna", advisedLine: "H1", departureDate: "21 Feb" },
  { id: 9, name: "BQ Elegance", quantity: 300, estimatedMinutes: 180, pickedBy: "Mark", advisedLine: "H2", departureDate: "22 Feb" },
  { id: 10, name: "BQ Charme XL", quantity: 250, estimatedMinutes: 150, pickedBy: "Sophie", advisedLine: "H1", departureDate: "21 Feb" },
  { id: 26, name: "BQ Lovely", quantity: 200, estimatedMinutes: 100, pickedBy: "Daan", advisedLine: "H3", departureDate: "22 Feb" },
  { id: 27, name: "BQ Roos", quantity: 180, estimatedMinutes: 90, pickedBy: "Lisa", advisedLine: "H1", departureDate: "21 Feb" },
];

export const waitingForBandOrders: ColdStorageOrder[] = [
  { id: 11, name: "BQ Zonnebloem", quantity: 500, estimatedMinutes: 120, pickedBy: "Tom", advisedLine: "B1", departureDate: "21 Feb" },
  { id: 12, name: "BQ Trend", quantity: 350, estimatedMinutes: 90, pickedBy: "Anna", advisedLine: "B2", departureDate: "22 Feb" },
  { id: 13, name: "BQ de Luxe", quantity: 400, estimatedMinutes: 105, pickedBy: "Mark", advisedLine: "B1", departureDate: "21 Feb" },
  { id: 14, name: "BQ Lovely", quantity: 200, estimatedMinutes: 80, pickedBy: "Sophie", advisedLine: "B1", departureDate: "23 Feb" },
];

export const waitingForOthersOrders: ColdStorageOrder[] = [
  { id: 28, name: "Orchidee Mix", quantity: 120, estimatedMinutes: 60, pickedBy: "Daan", advisedLine: "A1", departureDate: "21 Feb", category: "Arrangement" },
  { id: 29, name: "Succulent Set", quantity: 80, estimatedMinutes: 45, pickedBy: "Lisa", advisedLine: "P1", departureDate: "22 Feb", category: "Plants" },
  { id: 30, name: "Rose Arrangement", quantity: 150, estimatedMinutes: 90, pickedBy: "Tom", advisedLine: "A2", departureDate: "21 Feb", category: "Arrangement" },
  { id: 31, name: "Ficus Collection", quantity: 60, estimatedMinutes: 30, pickedBy: "Anna", advisedLine: "P1", departureDate: "23 Feb", category: "Plants" },
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
  { text: "New batch printed: BQ Roos — 180 pieces.", mode: "stabilisatie" as const },
];

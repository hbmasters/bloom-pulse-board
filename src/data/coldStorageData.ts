import productTulpen from "@/assets/product-tulpen.jpg";
import productSpringBouquet from "@/assets/product-spring-bouquet.jpg";
import productMoederdag from "@/assets/product-moederdag.jpg";
import productPastel from "@/assets/product-pastel.jpg";
import productOrchidee from "@/assets/product-orchidee.jpg";
import productZomermix from "@/assets/product-zomermix.jpg";
import productRoos from "@/assets/product-roos.jpg";
import productFieldL from "@/assets/product-field-l.jpg";
import productElegance from "@/assets/product-elegance.jpg";
import productCharmeXL from "@/assets/product-charme-xl.jpg";
import productZonnebloem from "@/assets/product-zonnebloem.jpg";
import productTrend from "@/assets/product-trend.jpg";
import productDeLuxe from "@/assets/product-de-luxe.jpg";
import productLovely from "@/assets/product-lovely.jpg";
import productFieldM from "@/assets/product-field-m.jpg";
import productChique from "@/assets/product-chique.jpg";

export interface ColdStorageOrder {
  id: number;
  name: string;
  quantity: number;
  estimatedMinutes: number;
  printedBy?: string;
}

export interface PickedOrder extends ColdStorageOrder {
  picker: string;
  startTime: string;
  progress: number;
  image: string;
}

export const printedOrders: ColdStorageOrder[] = [
  { id: 1, name: "BQ Pastel", quantity: 400, estimatedMinutes: 180, printedBy: "Jan" },
  { id: 2, name: "BQ Orchidee", quantity: 250, estimatedMinutes: 120, printedBy: "Pieter" },
  { id: 3, name: "BQ Zomermix", quantity: 300, estimatedMinutes: 150, printedBy: "Jan" },
  { id: 4, name: "BQ Roos", quantity: 180, estimatedMinutes: 90, printedBy: "Pieter" },
];

export const pickedOrders: PickedOrder[] = [
  { id: 5, name: "BQ Tulpen", quantity: 350, estimatedMinutes: 160, picker: "Anna", startTime: "07:15", progress: 65, image: productTulpen },
  { id: 6, name: "BQ Spring Bouquet", quantity: 200, estimatedMinutes: 100, picker: "Mark", startTime: "08:00", progress: 40, image: productSpringBouquet },
  { id: 7, name: "BQ Moederdag", quantity: 280, estimatedMinutes: 140, picker: "Sophie", startTime: "08:30", progress: 20, image: productMoederdag },
  { id: 15, name: "BQ Field M", quantity: 220, estimatedMinutes: 110, picker: "Daan", startTime: "07:45", progress: 75, image: productFieldM },
  { id: 16, name: "BQ Chique", quantity: 180, estimatedMinutes: 95, picker: "Lisa", startTime: "08:15", progress: 55, image: productChique },
  { id: 17, name: "BQ Pastel", quantity: 300, estimatedMinutes: 145, picker: "Tom", startTime: "09:00", progress: 10, image: productPastel },
];

export const waitingForHandOrders: ColdStorageOrder[] = [
  { id: 8, name: "BQ Field L", quantity: 400, estimatedMinutes: 210 },
  { id: 9, name: "BQ Elegance", quantity: 300, estimatedMinutes: 180 },
  { id: 10, name: "BQ Charme XL", quantity: 250, estimatedMinutes: 150 },
];

export const waitingForBandOrders: ColdStorageOrder[] = [
  { id: 11, name: "BQ Zonnebloem", quantity: 500, estimatedMinutes: 120 },
  { id: 12, name: "BQ Trend", quantity: 350, estimatedMinutes: 90 },
  { id: 13, name: "BQ de Luxe", quantity: 400, estimatedMinutes: 105 },
  { id: 14, name: "BQ Lovely", quantity: 200, estimatedMinutes: 80 },
];

export const coldStorageStats = {
  lineName: "COLD STORAGE",
  totalPeople: 8,
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

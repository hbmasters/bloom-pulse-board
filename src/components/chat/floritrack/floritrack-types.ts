export interface FloritrackTimelineEvent {
  status: string;
  date: string;
  time: string;
  location: string;
  unit: string;
  vehicle: string;
}

export interface FloritrackTransaction {
  id: string;
  status: "Aangekocht" | "Onderweg" | "Afgeleverd" | "Onbekend";
  article: string;
  articleCode: string;
  location: string;
  purchaseTime: string;
  transactionNumber: string;
  content: number;
  quantity: { delivered: number; total: number };
  remark: string;
  seat: string;
  clock: string;
  buyer: string;
  place: string;
  supplier: string;
  packaging: string;
  batchSequenceNumber: string;
  destination: string;
  currentLocation: string;
  lastUpdate: string;
  expectedDeliveryTime?: string;
  timeline: FloritrackTimelineEvent[];
}

export interface FloritrackSummary {
  total: number;
  purchased: number;
  inTransit: number;
  delivered: number;
  lastUpdated: string;
}

export interface FloritrackData {
  summary: FloritrackSummary;
  transactions: FloritrackTransaction[];
}

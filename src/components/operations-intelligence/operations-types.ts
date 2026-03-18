/* ───── Operations Intelligence Types ───── */

export type DeviationLevel = "ok" | "warning" | "critical";
export type ShipmentStatus = "Gepland" | "Geladen" | "Onderweg" | "Gelost" | "Afgeleverd" | "Afwijking";
export type TransactionStatus = "Aangekocht" | "Inslag" | "Onderweg" | "Afgeleverd" | "Onbekend";
export type VehicleStatus = "actief" | "stilstaand" | "afgerond";

export interface TrackTraceEvent {
  status: string;
  date: string;
  time: string;
  location: string;
  unit: string;
  vehicle: string;
}

export interface OpsTransaction {
  id: string;
  status: TransactionStatus;
  article: string;
  articleCode: string;
  quantity: { delivered: number; total: number };
  content: number;
  clock: string;
  buyer: string;
  supplier: string;
  packaging: string;
  brief: string;
  deviation?: { type: string; message: string };
  timeline: TrackTraceEvent[];
}

export interface Shipment {
  id: string;
  status: ShipmentStatus;
  time: string;
  client: string;
  location: string;
  loadUnit: string;
  logisticsProvider: string;
  label: string;
  plate?: string;
  vehicleStatus?: VehicleStatus;
  deviation: DeviationLevel;
  deviationMessage?: string;
  transactions: OpsTransaction[];
}

export interface VehicleEvent {
  time: string;
  status: string;
  location: string;
  shipmentId?: string;
}

export interface VehicleFlow {
  plate: string;
  status: VehicleStatus;
  events: VehicleEvent[];
}

export interface OpsSummary {
  totalShipments: number;
  loadUnits: number;
  shipmentsByStatus: Record<string, number>;
  totalTransactions: number;
  packagingUnits: number;
  transactionsByStatus: Record<string, number>;
  activeVehicles: number;
  delayedShipments: number;
  deviationCount: number;
}

export interface OpsIntelligenceData {
  date: string;
  summary: OpsSummary;
  shipments: Shipment[];
  vehicleFlows: VehicleFlow[];
}

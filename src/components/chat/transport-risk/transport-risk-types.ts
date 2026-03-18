export type RiskLevel = "low" | "medium" | "high";

export interface TransportRiskBouquet {
  name: string;
  quantity: number;
  departure: string; // HH:MM
  customer?: string;
}

export interface TransportRiskItem {
  shipment_id: string;
  status: "Aangekocht" | "Onderweg" | "Afgeleverd" | "Afwijking";
  risk_level: RiskLevel;
  article: string;
  supplier: string;
  expected_arrival: string; // HH:MM
  delay_minutes?: number;
  bouquets_affected: TransportRiskBouquet[];
  risk_message: string;
  escalation_target?: string;
}

export interface TransportRiskSummary {
  total_at_risk: number;
  high: number;
  medium: number;
  low: number;
  bouquets_impacted: number;
}

export interface TransportRiskData {
  summary: TransportRiskSummary;
  risks: TransportRiskItem[];
}

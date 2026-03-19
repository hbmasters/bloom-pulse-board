/**
 * HBM Source-Verified Response — Type System
 *
 * Enforces that every chat response carries verification status,
 * source references, and explicit missing-data declarations.
 */

/* ── Verification status ── */
export type VerificationStatus = "confirmed" | "partial" | "unconfirmed";

export const VERIFICATION_CONFIG: Record<VerificationStatus, {
  label: string;
  sublabel: string;
  color: string;
  bg: string;
  border: string;
  icon: string;
}> = {
  confirmed: {
    label: "Bevestigd",
    sublabel: "Alle brondata geverifieerd",
    color: "text-accent",
    bg: "bg-accent/8",
    border: "border-accent/20",
    icon: "✓",
  },
  partial: {
    label: "Gedeeltelijk bevestigd",
    sublabel: "Niet alle bronnen beschikbaar",
    color: "text-yellow-500",
    bg: "bg-yellow-500/8",
    border: "border-yellow-500/20",
    icon: "◐",
  },
  unconfirmed: {
    label: "Niet bevestigd",
    sublabel: "Geen bevestigde bronmatch gevonden",
    color: "text-destructive",
    bg: "bg-destructive/8",
    border: "border-destructive/20",
    icon: "✗",
  },
};

/* ── Source reference ── */
export interface SourceReference {
  name: string;                         // e.g. "HBM Production", "Floritrack"
  match_on: string;                     // e.g. "productieorder 452819"
  timestamp: string;                    // e.g. "2026-03-19 09:42"
  table?: string;                       // e.g. "production_orders"
  endpoint?: string;                    // e.g. "/api/v1/orders"
  query_context?: string;              // e.g. "WHERE order_id = 452819"
  record_id?: string;                   // e.g. "PO-452819"
}

/* ── Missing data item ── */
export interface MissingDataItem {
  field: string;                        // e.g. "artikelcode", "productieorder"
  reason?: string;                      // e.g. "Geen match in HBM Production"
}

/* ── Data quality indicators ── */
export type MatchQuality = "exact" | "partial" | "not_found";
export type Timeliness = "current" | "stale" | "unknown";
export type Reliability = "high" | "limited" | "none";

export interface DataQuality {
  match: MatchQuality;
  timeliness: Timeliness;
  reliability: Reliability;
}

export const MATCH_LABELS: Record<MatchQuality, { label: string; color: string }> = {
  exact: { label: "Exact", color: "text-accent" },
  partial: { label: "Gedeeltelijk", color: "text-yellow-500" },
  not_found: { label: "Niet gevonden", color: "text-destructive" },
};

export const TIMELINESS_LABELS: Record<Timeliness, { label: string; color: string }> = {
  current: { label: "Actueel", color: "text-accent" },
  stale: { label: "Verouderd", color: "text-yellow-500" },
  unknown: { label: "Onbekend", color: "text-muted-foreground" },
};

export const RELIABILITY_LABELS: Record<Reliability, { label: string; color: string }> = {
  high: { label: "Hoog", color: "text-accent" },
  limited: { label: "Beperkt", color: "text-yellow-500" },
  none: { label: "Geen", color: "text-destructive" },
};

/* ── Fuzzy match suggestion ── */
export interface FuzzyMatchSuggestion {
  label: string;                        // e.g. "Lovely Rose Mix 40cm"
  source?: string;                      // e.g. "HBM Production"
  record_id?: string;                   // e.g. "ART-12345"
}

/* ── Source-verified table record ── */
export interface VerifiedTableRow {
  data: Record<string, string | number | null>;
  source: string;                       // Source system name
  confirmed: boolean;
}

export interface VerifiedTableColumn {
  key: string;
  label: string;
  align?: "left" | "right" | "center";
  mono?: boolean;
}

/* ── Complete verified response ── */
export interface VerifiedResponseData {
  status: VerificationStatus;
  answer: string;                       // Factual answer text
  sources: SourceReference[];
  missing?: MissingDataItem[];
  data_quality?: DataQuality;
  fuzzy_matches?: FuzzyMatchSuggestion[];
  table?: {
    columns: VerifiedTableColumn[];
    rows: VerifiedTableRow[];
  };
  refine_suggestions?: string[];        // e.g. "Verfijn met artikelcode"
}

/* ── Known source systems ── */
export const SOURCE_SYSTEMS: Record<string, { label: string; color: string }> = {
  "hbm-production": { label: "HBM Production", color: "text-primary" },
  "floritrack": { label: "Floritrack", color: "text-blue-500" },
  "axerrio": { label: "Axerrio", color: "text-purple-500" },
  "business-central": { label: "Business Central", color: "text-orange-500" },
  "unconfirmed": { label: "Niet bevestigd", color: "text-destructive" },
};

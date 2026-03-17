export type LabourAssessment = "aligned" | "likely_undercharged" | "likely_overcharged" | "needs_review";

export interface LabourTruthItem {
  id: string;
  product: string;
  dept: "hand" | "band";
  /** Werkelijke APU — gemeten op de vloer */
  w_apu: number;
  /** Orderbevestiging APU — wat de klant betaalt */
  o_apu: number;
  /** Calculatie APU — best achievable benchmark */
  c_apu: number;
  /** Planning APU — waarmee de planning rekent */
  p_apu: number;
  /** Normatieve APU — standaardwaarde */
  apu: number;
  /** Aantal stelen per persoon per uur */
  stelen_per_persoon_per_uur: number;
  /** Arbeid per stuk in minuten */
  arbeid_per_stuk: number;
  /** Assessment */
  assessment: LabourAssessment;
  confidence: number; // 0–1
  reason: string;
  recommendation: string;
  /** Meta */
  labor_source: string;
  calculation_method: string;
  period: string;
  updated_at: string;
}

export const assessmentConfig: Record<LabourAssessment, { label: string; bg: string; text: string; border: string; dot: string }> = {
  aligned:              { label: "Aligned",             bg: "bg-accent/10",       text: "text-accent",          border: "border-accent/20",       dot: "bg-accent" },
  likely_undercharged:  { label: "Likely Undercharged", bg: "bg-orange-500/10",   text: "text-orange-500",      border: "border-orange-500/20",   dot: "bg-orange-500" },
  likely_overcharged:   { label: "Likely Overcharged",  bg: "bg-yellow-500/10",   text: "text-yellow-500",      border: "border-yellow-500/20",   dot: "bg-yellow-500" },
  needs_review:         { label: "Needs Review",        bg: "bg-violet-500/10",   text: "text-violet-500",      border: "border-violet-500/20",   dot: "bg-violet-500" },
};

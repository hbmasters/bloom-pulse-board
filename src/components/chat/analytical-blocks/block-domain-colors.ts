/**
 * HBM Analytical Block — Domain Color System
 * 
 * Fixed color families per analytical domain.
 * Used across headers, pills, chart accents, icons, badges.
 * All colors reference HSL values for Tailwind compatibility.
 */

export type AnalyticalDomain =
  | "executive"
  | "procurement"
  | "production"
  | "margin"
  | "logistics"
  | "alert"
  | "compare"
  | "decision";

export interface DomainColorSet {
  /** Tailwind bg class for headers/pills */
  bg: string;
  /** Tailwind bg class with lower opacity */
  bgMuted: string;
  /** Tailwind text class */
  text: string;
  /** Tailwind border class */
  border: string;
  /** CSS color string for charts */
  chartColor: string;
  /** Secondary chart color */
  chartColorAlt: string;
  /** Icon class */
  iconClass: string;
  /** Label */
  label: string;
}

export const DOMAIN_COLORS: Record<AnalyticalDomain, DomainColorSet> = {
  executive: {
    bg: "bg-slate-600",
    bgMuted: "bg-slate-500/10",
    text: "text-slate-300",
    border: "border-slate-500/30",
    chartColor: "hsl(215, 25%, 45%)",
    chartColorAlt: "hsl(215, 20%, 60%)",
    iconClass: "text-slate-400",
    label: "Executive",
  },
  procurement: {
    bg: "bg-emerald-600",
    bgMuted: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
    chartColor: "hsl(155, 55%, 42%)",
    chartColorAlt: "hsl(160, 45%, 55%)",
    iconClass: "text-emerald-400",
    label: "Inkoop",
  },
  production: {
    bg: "bg-amber-600",
    bgMuted: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/30",
    chartColor: "hsl(38, 80%, 55%)",
    chartColorAlt: "hsl(45, 70%, 65%)",
    iconClass: "text-amber-400",
    label: "Productie",
  },
  margin: {
    bg: "bg-purple-600",
    bgMuted: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/30",
    chartColor: "hsl(270, 50%, 55%)",
    chartColorAlt: "hsl(280, 40%, 65%)",
    iconClass: "text-purple-400",
    label: "Marge",
  },
  logistics: {
    bg: "bg-blue-600",
    bgMuted: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/30",
    chartColor: "hsl(211, 80%, 55%)",
    chartColorAlt: "hsl(200, 60%, 60%)",
    iconClass: "text-blue-400",
    label: "Logistiek",
  },
  alert: {
    bg: "bg-red-600",
    bgMuted: "bg-red-500/10",
    text: "text-red-400",
    border: "border-red-500/30",
    chartColor: "hsl(0, 65%, 55%)",
    chartColorAlt: "hsl(25, 80%, 55%)",
    iconClass: "text-red-400",
    label: "Alert",
  },
  compare: {
    bg: "bg-cyan-600",
    bgMuted: "bg-cyan-500/10",
    text: "text-cyan-400",
    border: "border-cyan-500/30",
    chartColor: "hsl(185, 60%, 45%)",
    chartColorAlt: "hsl(195, 50%, 55%)",
    iconClass: "text-cyan-400",
    label: "Vergelijking",
  },
  decision: {
    bg: "bg-rose-600",
    bgMuted: "bg-rose-500/10",
    text: "text-rose-400",
    border: "border-rose-500/30",
    chartColor: "hsl(350, 60%, 55%)",
    chartColorAlt: "hsl(340, 50%, 65%)",
    iconClass: "text-rose-400",
    label: "Beslissing",
  },
};

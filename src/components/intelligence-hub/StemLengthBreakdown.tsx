import { useState } from "react";
import { ChevronDown, Ruler } from "lucide-react";
import { DataMaturityBadge, ForecastEmptyState, type DataMaturity } from "./DataMaturityBadge";

/* ══════════════════════════════════════════
   STEM LENGTH BREAKDOWN
   UI patterns ready for article variants
   split by length:
   - Grouped chips
   - Expandable per-length rows
   - Detail drawer readiness
   ══════════════════════════════════════════ */

interface StemVariant {
  length: string;
  demand?: number;
  covered?: number;
  price?: string;
  maturity: DataMaturity;
}

interface StemGroup {
  article: string;
  variants: StemVariant[];
  maturity: DataMaturity;
}

/* Static placeholder data */
const stemGroups: StemGroup[] = [
  {
    article: "Pistacia",
    maturity: "partial",
    variants: [
      { length: "40cm", maturity: "placeholder" },
      { length: "50cm", maturity: "placeholder" },
      { length: "60cm", maturity: "partial" },
      { length: "70cm", maturity: "missing" },
    ],
  },
  {
    article: "Germini Franky",
    maturity: "partial",
    variants: [
      { length: "50cm", maturity: "partial" },
      { length: "60cm", maturity: "partial" },
    ],
  },
  {
    article: "Dianthus",
    maturity: "missing",
    variants: [
      { length: "50cm", maturity: "missing" },
      { length: "60cm", maturity: "missing" },
      { length: "70cm", maturity: "missing" },
    ],
  },
  {
    article: "Alstroemeria",
    maturity: "missing",
    variants: [
      { length: "60cm", maturity: "missing" },
      { length: "70cm", maturity: "missing" },
    ],
  },
];

/* ── Length Chips ── */
export const LengthChips = ({ variants }: { variants: StemVariant[] }) => (
  <div className="flex flex-wrap gap-1">
    {variants.map((v) => (
      <span
        key={v.length}
        className={`inline-flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded-full border ${
          v.maturity === "live" ? "border-accent/20 bg-accent/8 text-accent" :
          v.maturity === "partial" ? "border-yellow-500/20 bg-yellow-500/5 text-yellow-500" :
          v.maturity === "placeholder" ? "border-primary/15 bg-primary/5 text-primary/60" :
          "border-border bg-muted/15 text-muted-foreground/40"
        }`}
      >
        {v.length}
        {v.demand != null && <span className="font-semibold">({v.demand.toLocaleString()})</span>}
      </span>
    ))}
  </div>
);

/* ── Expandable Stem Group ── */
const StemGroupCard = ({ group }: { group: StemGroup }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted/10 transition-colors text-left"
      >
        <Ruler className="w-3.5 h-3.5 text-primary/50 shrink-0" />
        <span className="text-[11px] font-bold text-foreground flex-1">{group.article}</span>
        <LengthChips variants={group.variants} />
        <DataMaturityBadge maturity={group.maturity} size="sm" />
        <ChevronDown className={`w-3 h-3 text-muted-foreground/40 transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>

      {expanded && (
        <div className="border-t border-border">
          <div className="grid grid-cols-5 text-[9px] text-muted-foreground/40 font-mono px-3 py-1.5 bg-muted/10 border-b border-border/50">
            <span>Lengte</span>
            <span>Vraag</span>
            <span>Gedekt</span>
            <span>Prijs</span>
            <span>Status</span>
          </div>
          {group.variants.map((v) => (
            <div key={v.length} className="grid grid-cols-5 text-[11px] px-3 py-2 border-b border-border/30 last:border-0">
              <span className="font-mono font-semibold text-foreground">{v.length}</span>
              <span className="font-mono text-muted-foreground/40">{v.demand != null ? v.demand.toLocaleString() : "—"}</span>
              <span className="font-mono text-muted-foreground/40">{v.covered != null ? v.covered.toLocaleString() : "—"}</span>
              <span className="font-mono text-muted-foreground/40">{v.price ?? "—"}</span>
              <span><DataMaturityBadge maturity={v.maturity} size="sm" /></span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ── Main Component ── */
export const StemLengthBreakdown = () => (
  <div className="space-y-2">
    <div className="flex items-center gap-2 mb-1">
      <Ruler className="w-3.5 h-3.5 text-primary/40" />
      <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider">
        Artikel × lengte breakdown
      </span>
      <DataMaturityBadge maturity="partial" size="sm" />
    </div>
    {stemGroups.map((g) => (
      <StemGroupCard key={g.article} group={g} />
    ))}
    <p className="text-[9px] font-mono text-muted-foreground/40 text-center pt-1">
      Vraag- en dekkingsdata wordt zichtbaar zodra forecastbron en supply coverage beschikbaar zijn
    </p>
  </div>
);

export default StemLengthBreakdown;

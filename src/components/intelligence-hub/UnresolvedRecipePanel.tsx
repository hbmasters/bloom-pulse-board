import { AlertTriangle, Package, ArrowRight, ChevronDown } from "lucide-react";
import { useState } from "react";
import { DataMaturityBadge, ForecastEmptyState } from "./DataMaturityBadge";
import { DepartmentBadge } from "@/components/department/DepartmentBadge";

/* ══════════════════════════════════════════
   UNRESOLVED RECIPE PANEL
   Shows when future demand exists but recipes
   are missing — the #1 forecast blocker.
   ══════════════════════════════════════════ */

interface UnresolvedRecipeItem {
  bouquetFamily: string;
  customer: string;
  program?: string;
  impactedOrders: number;
  reason: string;
  firstDelivery?: string;
}

/* Static placeholder data — will be replaced by backend */
const unresolvedRecipes: UnresolvedRecipeItem[] = [
  {
    bouquetFamily: "BQ Seasonal Mix",
    customer: "Albert Heijn",
    program: "AH Seizoens",
    impactedOrders: 42,
    reason: "Recept niet gekoppeld aan productgroep",
    firstDelivery: "Wk 14",
  },
  {
    bouquetFamily: "Veldboeket Premium",
    customer: "Jumbo",
    program: "Jumbo Bloemen",
    impactedOrders: 28,
    reason: "Nieuw product — recept nog niet aangemaakt",
    firstDelivery: "Wk 15",
  },
  {
    bouquetFamily: "Tulpenboeket Aktie",
    customer: "Lidl",
    impactedOrders: 35,
    reason: "Seizoenswisseling — oud recept verlopen",
    firstDelivery: "Wk 13",
  },
  {
    bouquetFamily: "Roos Mono Luxe",
    customer: "REWE",
    program: "REWE Monat",
    impactedOrders: 19,
    reason: "Variant niet gedefinieerd in receptsysteem",
    firstDelivery: "Wk 16",
  },
  {
    bouquetFamily: "Mixed Garden",
    customer: "Action",
    impactedOrders: 25,
    reason: "Productidentiteit onbekend — placeholder gebruikt",
    firstDelivery: "Wk 14",
  },
];

const totalImpacted = unresolvedRecipes.reduce((sum, r) => sum + r.impactedOrders, 0);

export const UnresolvedRecipePanel = () => {
  const [expanded, setExpanded] = useState(false);
  const visibleItems = expanded ? unresolvedRecipes : unresolvedRecipes.slice(0, 3);

  return (
    <div className="space-y-3">
      {/* Summary alert */}
      <div className="flex items-center gap-3 rounded-xl border border-orange-500/20 bg-orange-500/5 p-4">
        <div className="w-9 h-9 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-4.5 h-4.5 text-orange-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-foreground">
              {unresolvedRecipes.length} boeketten zonder receptkoppeling
            </span>
            <DataMaturityBadge maturity="unresolved" />
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {totalImpacted} toekomstige orders kunnen niet volledig worden doorgerekend naar inkoopbehoefte.
            Steelvraag voor deze orders is niet beschikbaar totdat recepten zijn gekoppeld.
          </p>
        </div>
      </div>

      {/* Item rows */}
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="grid grid-cols-6 text-[10px] text-muted-foreground/50 font-mono px-3 py-2 bg-muted/20 border-b border-border">
          <span className="col-span-2">Boeket / Familie</span>
          <span>Klant</span>
          <span>Orders</span>
          <span>1e levering</span>
          <span>Status</span>
        </div>
        {visibleItems.map((r) => (
          <div key={`${r.bouquetFamily}-${r.customer}`} className="grid grid-cols-6 text-[11px] px-3 py-2.5 border-b border-border/50 last:border-0 hover:bg-orange-500/3 transition-colors items-center">
            <span className="col-span-2 flex items-center gap-2">
              <Package className="w-3 h-3 text-orange-500/60 shrink-0" />
              <div className="min-w-0">
                <span className="font-medium text-foreground block truncate">{r.bouquetFamily}</span>
                <span className="text-[9px] text-muted-foreground/50">{r.reason}</span>
              </div>
            </span>
            <span className="text-foreground/70 truncate">
              {r.customer}
              {r.program && (
                <span className="text-[9px] text-muted-foreground/40 block">{r.program}</span>
              )}
            </span>
            <span className="font-mono font-bold text-orange-500">{r.impactedOrders}</span>
            <span className="text-foreground/60 font-mono">{r.firstDelivery ?? "—"}</span>
            <span>
              <DataMaturityBadge maturity="unresolved" size="sm" showLabel={false} />
            </span>
          </div>
        ))}
      </div>

      {/* Expand toggle */}
      {unresolvedRecipes.length > 3 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-[10px] font-mono text-primary hover:text-primary/80 transition-colors mx-auto"
        >
          <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? "rotate-180" : ""}`} />
          {expanded ? "Minder tonen" : `Alle ${unresolvedRecipes.length} tonen`}
        </button>
      )}

      {/* Impact explanation */}
      <div className="rounded-lg border border-border bg-muted/10 p-3">
        <h4 className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">
          Waarom is dit belangrijk?
        </h4>
        <div className="space-y-1.5">
          {[
            "Zonder receptkoppeling kan de steelvraag per order niet berekend worden",
            "Supply coverage voor deze orders is onbekend",
            "Inkoopwaarde kan niet volledig worden bepaald",
            "Productiecapaciteit kan niet nauwkeurig worden gepland",
          ].map((text, i) => (
            <div key={i} className="flex items-start gap-1.5 text-[10px]">
              <ArrowRight className="w-3 h-3 mt-0.5 text-orange-500/50 shrink-0" />
              <span className="text-muted-foreground/60">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UnresolvedRecipePanel;

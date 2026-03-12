import { Flower2, ShoppingCart } from "lucide-react";
import IHSectionShell from "./IHSectionShell";

/* ══════════════════════════════════════════
   COMMERCIAL FORECAST
   ══════════════════════════════════════════ */

interface CommForecastRow {
  customer: string;
  planned: number;
  actual: number;
  delta: number;
  status: "healthy" | "warning" | "critical";
}

const commercialForecast: CommForecastRow[] = [
  { customer: "Albert Heijn", planned: 18000, actual: 18400, delta: 400, status: "healthy" },
  { customer: "Jumbo", planned: 14000, actual: 14200, delta: 200, status: "healthy" },
  { customer: "Aldi", planned: 20000, actual: 22800, delta: 2800, status: "critical" },
  { customer: "Lidl", planned: 15000, actual: 16200, delta: 1200, status: "warning" },
  { customer: "Dekamarkt", planned: 6000, actual: 6800, delta: 800, status: "warning" },
  { customer: "Plus", planned: 7000, actual: 7200, delta: 200, status: "healthy" },
  { customer: "REWE", planned: 12000, actual: 12200, delta: 200, status: "healthy" },
  { customer: "Vomar", planned: 5000, actual: 4800, delta: -200, status: "healthy" },
];

const totalPlanned = commercialForecast.reduce((a, r) => a + r.planned, 0);
const totalActual = commercialForecast.reduce((a, r) => a + r.actual, 0);
const totalDelta = totalActual - totalPlanned;

/* ══════════════════════════════════════════
   PROCUREMENT FORECAST
   ══════════════════════════════════════════ */

interface ProcForecastRow {
  flower: string;
  required: number;
  contracted: number;
  buyNeeded: number;
  status: "healthy" | "warning" | "critical";
}

const procurementForecast: ProcForecastRow[] = [
  { flower: "Chrysant Ringa Yellow", required: 120000, contracted: 90000, buyNeeded: 30000, status: "critical" },
  { flower: "Roos Red Naomi 50cm", required: 85000, contracted: 88000, buyNeeded: 0, status: "healthy" },
  { flower: "Tulp Strong Gold", required: 60000, contracted: 58000, buyNeeded: 2000, status: "warning" },
  { flower: "Gerbera Kimsey", required: 45000, contracted: 45000, buyNeeded: 0, status: "healthy" },
  { flower: "Lisianthus Rosita White", required: 32000, contracted: 25000, buyNeeded: 7000, status: "critical" },
  { flower: "Alstroemeria Virginia", required: 28000, contracted: 30000, buyNeeded: 0, status: "healthy" },
  { flower: "Chrysant Baltica", required: 55000, contracted: 50000, buyNeeded: 5000, status: "warning" },
  { flower: "Roos Avalanche 60cm", required: 70000, contracted: 72000, buyNeeded: 0, status: "healthy" },
];

const totalRequired = procurementForecast.reduce((a, r) => a + r.required, 0);
const totalContracted = procurementForecast.reduce((a, r) => a + r.contracted, 0);
const totalBuyNeeded = procurementForecast.filter(r => r.buyNeeded > 0).reduce((a, r) => a + r.buyNeeded, 0);

const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(0)}K` : n.toString();
const statusDot = (s: string) => s === "healthy" ? "bg-accent" : s === "warning" ? "bg-yellow-500" : "bg-red-500 animate-pulse";

const IHFlowerForecast = () => (
  <div className="space-y-6">
    {/* ── Commercial Forecast ── */}
    <IHSectionShell icon={Flower2} title="Commercial Forecast" subtitle="Geplande vs werkelijke orders per klant" badge={`Delta: ${totalDelta >= 0 ? "+" : ""}${fmt(totalDelta)}`} badgeVariant={Math.abs(totalDelta) > 3000 ? "critical" : "warning"}>
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-center">
          <div className="text-[10px] font-mono text-muted-foreground mb-1">Gepland volume</div>
          <div className="text-lg font-extrabold text-foreground">{fmt(totalPlanned)}</div>
        </div>
        <div className="p-3 rounded-xl bg-accent/5 border border-accent/20 text-center">
          <div className="text-[10px] font-mono text-muted-foreground mb-1">Werkelijke orders</div>
          <div className="text-lg font-extrabold text-foreground">{fmt(totalActual)}</div>
        </div>
        <div className={`p-3 rounded-xl text-center ${totalDelta >= 0 ? "bg-yellow-500/5 border border-yellow-500/20" : "bg-accent/5 border border-accent/20"}`}>
          <div className="text-[10px] font-mono text-muted-foreground mb-1">Forecast surprise</div>
          <div className={`text-lg font-extrabold ${totalDelta > 3000 ? "text-destructive" : totalDelta > 0 ? "text-yellow-500" : "text-accent"}`}>{totalDelta >= 0 ? "+" : ""}{fmt(totalDelta)}</div>
        </div>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <div className="grid grid-cols-4 text-[10px] text-muted-foreground/50 font-mono px-3 py-2 bg-muted/20 border-b border-border">
          <span>Klant</span><span>Gepland</span><span>Werkelijk</span><span>Delta</span>
        </div>
        {commercialForecast.map((r) => (
          <div key={r.customer} className="grid grid-cols-4 text-[11px] px-3 py-2 border-b border-border/50 last:border-0 hover:bg-muted/10 transition-colors items-center">
            <span className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${statusDot(r.status)}`} />
              <span className="font-medium text-foreground">{r.customer}</span>
            </span>
            <span className="text-foreground/70 font-mono">{r.planned.toLocaleString()}</span>
            <span className="text-foreground/70 font-mono">{r.actual.toLocaleString()}</span>
            <span className={`font-mono font-semibold ${r.delta > 1000 ? "text-destructive" : r.delta > 0 ? "text-yellow-500" : "text-accent"}`}>
              {r.delta >= 0 ? "+" : ""}{r.delta.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </IHSectionShell>

    {/* ── Procurement Forecast ── */}
    <IHSectionShell icon={ShoppingCart} title="Procurement Forecast" subtitle="Forecastvraag vs gecontracteerd volume • Open inkoopbehoefte" badge={`Open: ${fmt(totalBuyNeeded)}`} badgeVariant={totalBuyNeeded > 30000 ? "critical" : "warning"}>
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-center">
          <div className="text-[10px] font-mono text-muted-foreground mb-1">Benodigd</div>
          <div className="text-lg font-extrabold text-foreground">{fmt(totalRequired)}</div>
        </div>
        <div className="p-3 rounded-xl bg-accent/5 border border-accent/20 text-center">
          <div className="text-[10px] font-mono text-muted-foreground mb-1">Gecontracteerd</div>
          <div className="text-lg font-extrabold text-foreground">{fmt(totalContracted)}</div>
        </div>
        <div className={`p-3 rounded-xl text-center ${totalBuyNeeded > 0 ? "bg-red-500/5 border border-red-500/20" : "bg-accent/5 border border-accent/20"}`}>
          <div className="text-[10px] font-mono text-muted-foreground mb-1">Open inkoop</div>
          <div className={`text-lg font-extrabold ${totalBuyNeeded > 0 ? "text-red-500" : "text-accent"}`}>{fmt(totalBuyNeeded)}</div>
        </div>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <div className="grid grid-cols-5 text-[10px] text-muted-foreground/50 font-mono px-3 py-2 bg-muted/20 border-b border-border">
          <span className="col-span-2">Bloem</span><span>Benodigd</span><span>Contract</span><span>Te kopen</span>
        </div>
        {procurementForecast.map((r) => (
          <div key={r.flower} className="grid grid-cols-5 text-[11px] px-3 py-2 border-b border-border/50 last:border-0 hover:bg-muted/10 transition-colors items-center">
            <span className="col-span-2 flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${statusDot(r.status)}`} />
              <span className="font-medium text-foreground truncate">{r.flower}</span>
            </span>
            <span className="text-foreground/70 font-mono">{r.required.toLocaleString()}</span>
            <span className="text-foreground/70 font-mono">{r.contracted.toLocaleString()}</span>
            <span className={`font-mono font-bold ${r.buyNeeded > 0 ? "text-red-500" : "text-accent"}`}>
              {r.buyNeeded > 0 ? r.buyNeeded.toLocaleString() : "—"}
            </span>
          </div>
        ))}
      </div>
    </IHSectionShell>
  </div>
);

export default IHFlowerForecast;

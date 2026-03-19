import { X, TrendingUp, TrendingDown, Minus, Package, BarChart3, Target, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } from "recharts";
import { type MarktMonitorProduct, trendLabels, confidenceLabels, buyAdviceLabels, DEFAULT_WEIGHTS } from "./marktmonitor-data";

const fmt = (n: number) => n.toLocaleString("nl-NL");
const fmtPrice = (n: number) => `€${n.toFixed(3)}`;
const fmtPct = (n: number) => `${n > 0 ? "+" : ""}${n.toFixed(1)}%`;

interface Props {
  product: MarktMonitorProduct;
  onClose: () => void;
}

const MarktMonitorDetailDrawer = ({ product: p, onClose }: Props) => {
  const trend = trendLabels[p.market_trend];
  const conf = confidenceLabels[p.confidence];

  const priceChartData = [
    ...p.price_history.map(h => ({ week: `W${h.week}`, prijs: h.price, type: "historie" })),
    ...p.price_forecast.map(f => ({ week: `W${f.week}`, forecast: f.price, type: "forecast" })),
  ];

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-xl z-50 bg-card border-l border-border shadow-2xl overflow-y-auto animate-slide-in">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border px-5 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-foreground">{p.product}</h2>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] text-muted-foreground">{p.product_family}</span>
            {p.cultivar && <span className="text-[10px] text-muted-foreground">· {p.cultivar}</span>}
            {p.quality && <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{p.quality}</span>}
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <div className="p-5 space-y-5">
        {/* Confidence badge */}
        <div className="flex items-center gap-2">
          <span className={cn("text-[9px] font-medium px-2 py-0.5 rounded-full border", conf.color)}>
            Confidence: {conf.label}
          </span>
          <span className={cn("flex items-center gap-1 text-[10px] font-medium", trend.color)}>
            {trend.icon} {trend.label}
          </span>
        </div>

        {/* Key metrics row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Actuele prijs", value: fmtPrice(p.current_price), sub: `${fmtPct(p.price_vs_yesterday)} vs gisteren` },
            { label: "7d gemiddeld", value: fmtPrice(p.avg_price_7d), sub: `30d: ${fmtPrice(p.avg_price_30d)}` },
            { label: "Vorig jaar", value: fmtPrice(p.avg_price_same_period_ly), sub: `Δ ${fmtPct(((p.current_price - p.avg_price_same_period_ly) / p.avg_price_same_period_ly) * 100)}` },
          ].map(m => (
            <div key={m.label} className="rounded-xl border border-border bg-background p-3">
              <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-wide block">{m.label}</span>
              <span className="text-sm font-bold font-mono text-foreground block mt-0.5">{m.value}</span>
              <span className="text-[9px] text-muted-foreground">{m.sub}</span>
            </div>
          ))}
        </div>

        {/* Price chart */}
        <div className="rounded-xl border border-border bg-background p-4 space-y-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-[10px] font-semibold text-foreground uppercase tracking-wide">Prijsontwikkeling</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={priceChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 88%)" />
              <XAxis dataKey="week" tick={{ fontSize: 9 }} stroke="hsl(220 10% 50%)" />
              <YAxis tick={{ fontSize: 9 }} stroke="hsl(220 10% 50%)" tickFormatter={v => `€${v.toFixed(2)}`} domain={['auto', 'auto']} />
              <Tooltip formatter={(v: number) => fmtPrice(v)} labelStyle={{ fontSize: 10 }} contentStyle={{ fontSize: 10, borderRadius: 8, border: '1px solid hsl(220 15% 88%)' }} />
              <Line type="monotone" dataKey="prijs" stroke="hsl(211 100% 50%)" strokeWidth={2} dot={{ r: 2 }} name="Historisch" />
              <Line type="monotone" dataKey="forecast" stroke="hsl(155 55% 42%)" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 2 }} name="Forecast" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Volume history chart */}
        <div className="rounded-xl border border-border bg-background p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Package className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-[10px] font-semibold text-foreground uppercase tracking-wide">Volume historie (stelen)</span>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={p.volume_history}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 88%)" />
              <XAxis dataKey="week" tick={{ fontSize: 9 }} stroke="hsl(220 10% 50%)" tickFormatter={w => `W${w}`} />
              <YAxis tick={{ fontSize: 9 }} stroke="hsl(220 10% 50%)" />
              <Tooltip formatter={(v: number) => fmt(v)} labelFormatter={w => `Week ${w}`} contentStyle={{ fontSize: 10, borderRadius: 8 }} />
              <Bar dataKey="volume" fill="hsl(211 100% 50%)" radius={[3, 3, 0, 0]} opacity={0.7} />
              <ReferenceLine y={p.avg_consumption_comparable_weeks} stroke="hsl(155 55% 42%)" strokeDasharray="4 4" label={{ value: "Gem.", fontSize: 9, fill: "hsl(155 55% 42%)" }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Stem demand breakdown */}
        <div className="rounded-xl border border-border bg-background p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Target className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-[10px] font-semibold text-foreground uppercase tracking-wide">Stelenbehoefte analyse</span>
          </div>

          {/* Three pillars */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Historie", value: p.expected_history, weight: `${DEFAULT_WEIGHTS.history * 100}%`, color: "border-primary/30 bg-primary/5", text: p.explanation_history },
              { label: "Prognose", value: p.expected_forecast, weight: `${DEFAULT_WEIGHTS.forecast * 100}%`, color: "border-accent/30 bg-accent/5", text: p.explanation_forecast },
              { label: "Markt", value: p.expected_market, weight: `${DEFAULT_WEIGHTS.market * 100}%`, color: "border-yellow-500/30 bg-yellow-500/5", text: p.explanation_market },
            ].map(pillar => (
              <div key={pillar.label} className={cn("rounded-lg border p-3 space-y-1.5", pillar.color)}>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-semibold text-muted-foreground uppercase">{pillar.label}</span>
                  <span className="text-[8px] font-mono text-muted-foreground/60">Weging: {pillar.weight}</span>
                </div>
                <span className="text-base font-bold font-mono text-foreground block">{fmt(pillar.value)}</span>
                <span className="text-[9px] text-muted-foreground leading-relaxed block">{pillar.text}</span>
              </div>
            ))}
          </div>

          {/* Combined result */}
          <div className="rounded-lg border border-border bg-muted/20 p-3">
            <div className="flex justify-between text-[11px]">
              <span className="text-muted-foreground">Gewogen advies</span>
              <span className="font-bold font-mono text-foreground">{fmt(p.weighted_advice)} stelen</span>
            </div>
          </div>
        </div>

        {/* Forecast prices */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border bg-background p-3">
            <span className="text-[9px] font-medium text-muted-foreground uppercase block">Prijs forecast 1 week</span>
            <span className="text-sm font-bold font-mono text-foreground block mt-0.5">{fmtPrice(p.forecast_price_1w)}</span>
            <span className="text-[9px] text-muted-foreground">Behoefte: {fmt(p.forecast_demand_1w)} stelen</span>
          </div>
          <div className="rounded-xl border border-border bg-background p-3">
            <span className="text-[9px] font-medium text-muted-foreground uppercase block">Prijs forecast 2 weken</span>
            <span className="text-sm font-bold font-mono text-foreground block mt-0.5">{fmtPrice(p.forecast_price_2w)}</span>
            <span className="text-[9px] text-muted-foreground">Behoefte: {fmt(p.forecast_demand_2w)} stelen</span>
          </div>
        </div>

        {/* Season + market explanation */}
        <div className="rounded-xl border border-border bg-background p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-[10px] font-semibold text-foreground uppercase tracking-wide">Markt & seizoen</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-[10px]">
            <div>
              <span className="text-muted-foreground block">Seizoenspatroon</span>
              <span className="text-foreground">{p.season_pattern}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Beschikbaarheid</span>
              <span className="font-mono text-foreground">{fmt(p.availability)} stelen</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Markttrend</span>
              <span className={cn("font-medium", trend.color)}>{trend.icon} {trend.label}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Hist. verbruik (gem. week)</span>
              <span className="font-mono text-foreground">{fmt(p.avg_consumption_comparable_weeks)} stelen</span>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="rounded-xl border border-border bg-muted/10 p-4">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide block mb-1">Samenvatting</span>
          <span className="text-[11px] text-foreground leading-relaxed block">{p.summary}</span>
        </div>
      </div>
    </div>
  );
};

export default MarktMonitorDetailDrawer;

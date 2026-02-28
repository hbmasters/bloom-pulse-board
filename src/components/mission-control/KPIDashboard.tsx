import { useState } from "react";
import {
  TrendingUp, TrendingDown, Minus, BarChart3,
  Factory, Users, PackageX, PieChart, Gauge, ShoppingCart,
  BedDouble, Globe, Sparkles, Filter, ChevronDown
} from "lucide-react";

type KPIStatus = "up" | "down" | "neutral";
type KPICategory = "productie" | "financieel" | "logistiek" | "hr";

interface KPI {
  id: number;
  title: string;
  subtitle: string;
  value: string;
  target: string;
  unit: string;
  status: KPIStatus;
  change: string;
  category: KPICategory;
  icon: typeof Factory;
  sparkline: number[];
}

const kpis: KPI[] = [
  {
    id: 1, title: "Productiebeheersing", subtitle: "Output vs. planning",
    value: "94.2", target: "95", unit: "%", status: "up", change: "+1.8%",
    category: "productie", icon: Factory,
    sparkline: [88, 90, 91, 89, 93, 94, 94],
  },
  {
    id: 2, title: "Arbeid Per Steel", subtitle: "Arbeidskosten per eenheid",
    value: "€0.42", target: "€0.40", unit: "", status: "down", change: "-3.1%",
    category: "financieel", icon: Users,
    sparkline: [0.48, 0.46, 0.45, 0.44, 0.43, 0.42, 0.42],
  },
  {
    id: 3, title: "Derving & Uitboeking", subtitle: "Verliespercentage",
    value: "2.1", target: "< 2.5", unit: "%", status: "up", change: "-0.4%",
    category: "logistiek", icon: PackageX,
    sparkline: [3.2, 2.9, 2.7, 2.5, 2.3, 2.2, 2.1],
  },
  {
    id: 4, title: "Omzetverdeling & Groei", subtitle: "Maandelijkse groei",
    value: "+8.3", target: "> 5", unit: "%", status: "up", change: "+2.1%",
    category: "financieel", icon: PieChart,
    sparkline: [4.2, 5.1, 5.8, 6.2, 7.0, 7.8, 8.3],
  },
  {
    id: 5, title: "Productie Efficiency", subtitle: "Kostprijs per bouquet",
    value: "€3.18", target: "€3.25", unit: "", status: "up", change: "-€0.12",
    category: "productie", icon: Gauge,
    sparkline: [3.45, 3.40, 3.35, 3.30, 3.25, 3.20, 3.18],
  },
  {
    id: 6, title: "Inkoopverhouding", subtitle: "Waardering & marge",
    value: "68.4", target: "65", unit: "%", status: "up", change: "+3.4%",
    category: "financieel", icon: ShoppingCart,
    sparkline: [62, 63, 64, 65, 66, 67, 68],
  },
  {
    id: 7, title: "Bedden & Bezetting", subtitle: "Capaciteitsbenutting",
    value: "87.5", target: "85", unit: "%", status: "neutral", change: "+0.2%",
    category: "hr", icon: BedDouble,
    sparkline: [85, 86, 86, 87, 87, 87, 88],
  },
  {
    id: 8, title: "HBM Kenya", subtitle: "Kenya operatie score",
    value: "91.0", target: "90", unit: "%", status: "up", change: "+2.0%",
    category: "productie", icon: Globe,
    sparkline: [84, 86, 87, 88, 89, 90, 91],
  },
  {
    id: 9, title: "Kwaliteitsindex", subtitle: "Klachten & retouren",
    value: "97.8", target: "96", unit: "%", status: "up", change: "+0.5%",
    category: "productie", icon: Sparkles,
    sparkline: [96.0, 96.3, 96.8, 97.0, 97.2, 97.5, 97.8],
  },
];

const categoryConfig: Record<KPICategory, { label: string; className: string }> = {
  productie:  { label: "Productie",  className: "bg-primary/10 text-primary border-primary/20" },
  financieel: { label: "Financieel", className: "bg-bloom-warm/10 text-bloom-warm border-bloom-warm/20" },
  logistiek:  { label: "Logistiek",  className: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" },
  hr:         { label: "HR & Capaciteit", className: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
};

const statusConfig: Record<KPIStatus, { icon: typeof TrendingUp; color: string }> = {
  up:      { icon: TrendingUp,   color: "text-accent" },
  down:    { icon: TrendingDown, color: "text-red-400" },
  neutral: { icon: Minus,        color: "text-muted-foreground" },
};

// Mini sparkline SVG
const Sparkline = ({ data, status }: { data: number[]; status: KPIStatus }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 28;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  }).join(" ");

  const color = status === "up" ? "hsl(150, 55%, 55%)" : status === "down" ? "hsl(0, 55%, 60%)" : "hsl(228, 40%, 60%)";

  return (
    <svg width={w} height={h} className="shrink-0">
      <defs>
        <linearGradient id={`spark-fill-${status}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Area fill */}
      <polygon
        points={`0,${h} ${points} ${w},${h}`}
        fill={`url(#spark-fill-${status})`}
      />
    </svg>
  );
};

const KPIDashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState<KPICategory | "all">("all");

  const filtered = selectedCategory === "all"
    ? kpis
    : kpis.filter(k => k.category === selectedCategory);

  return (
    <div className="flex flex-col h-full p-3 md:p-4 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 className="w-4 h-4 text-muted-foreground" />
        <h2 className="text-xs font-black text-foreground uppercase tracking-wider">KPI Dashboard</h2>
        <span className="text-[9px] font-mono text-muted-foreground/50 ml-1">9 indicatoren</span>
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-1.5 mb-4 flex-wrap">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`text-[9px] font-mono font-bold px-2.5 py-1 rounded-full border transition-all ${
            selectedCategory === "all"
              ? "bg-primary/15 text-primary border-primary/30"
              : "bg-card text-muted-foreground border-border hover:border-primary/20"
          }`}
        >
          Alles
        </button>
        {(Object.entries(categoryConfig) as [KPICategory, typeof categoryConfig[KPICategory]][]).map(([key, cfg]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key)}
            className={`text-[9px] font-mono font-bold px-2.5 py-1 rounded-full border transition-all ${
              selectedCategory === key
                ? cfg.className
                : "bg-card text-muted-foreground border-border hover:border-primary/20"
            }`}
          >
            {cfg.label}
          </button>
        ))}
      </div>

      {/* KPI grid */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map(kpi => {
            const StatusIcon = statusConfig[kpi.status].icon;
            const KpiIcon = kpi.icon;
            const statusColor = statusConfig[kpi.status].color;
            const catCfg = categoryConfig[kpi.category];

            return (
              <div
                key={kpi.id}
                className="group p-4 rounded-xl bg-card border border-border hover:border-primary/20 transition-all hover:shadow-lg hover:shadow-primary/5"
              >
                {/* Top row: icon + category + status */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-muted/50 border border-border flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors">
                      <KpiIcon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-muted-foreground/60">KPI {kpi.id}</span>
                      <span className={`ml-1.5 text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-full ${catCfg.className}`}>
                        {catCfg.label}
                      </span>
                    </div>
                  </div>
                  <div className={`flex items-center gap-0.5 ${statusColor}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-mono font-bold">{kpi.change}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xs font-bold text-foreground mb-0.5">{kpi.title}</h3>
                <p className="text-[10px] text-muted-foreground/60 mb-3">{kpi.subtitle}</p>

                {/* Value + sparkline */}
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-xl font-black text-foreground leading-none">
                      {kpi.value}<span className="text-xs font-normal text-muted-foreground ml-0.5">{kpi.unit}</span>
                    </div>
                    <div className="text-[9px] font-mono text-muted-foreground/50 mt-1">
                      Target: {kpi.target}{kpi.unit && ` ${kpi.unit}`}
                    </div>
                  </div>
                  <Sparkline data={kpi.sparkline} status={kpi.status} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default KPIDashboard;

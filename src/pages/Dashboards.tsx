import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, BarChart3, Factory, Briefcase, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import KPICardGrid from "@/components/dashboards/KPICardGrid";
import HighlightsFeed from "@/components/dashboards/HighlightsFeed";
import InkoopStatsToday from "@/components/dashboards/InkoopStatsToday";
import VerkoopBouquets from "@/components/dashboards/VerkoopBouquets";
import {
  inkoopKPIs, inkoopHighlights,
  verkoopKPIs, verkoopHighlights,
  productieKPIs, productieHighlights,
  directieKPIs, directieHighlights,
} from "@/data/dashboardMockData";

type TabId = "inkoop" | "verkoop" | "productie" | "directie";

const tabs: {
  id: TabId; label: string; icon: typeof Factory;
  title: string; subtitle: string;
  accentBg: string; accentText: string; accentBorder: string; accentDot: string;
}[] = [
  {
    id: "inkoop", label: "Inkoop", icon: ShoppingCart,
    title: "Inkoop Dashboard", subtitle: "Inkoopvolume, leveranciers & steelprijzen",
    accentBg: "bg-bloom-warm/10", accentText: "text-bloom-warm", accentBorder: "border-bloom-warm/20", accentDot: "bg-bloom-warm",
  },
  {
    id: "verkoop", label: "Verkoop", icon: BarChart3,
    title: "Verkoop & Transport", subtitle: "Omzet, ordervulling & logistiek",
    accentBg: "bg-bloom-sky/10", accentText: "text-bloom-sky", accentBorder: "border-bloom-sky/20", accentDot: "bg-bloom-sky",
  },
  {
    id: "productie", label: "Productie", icon: Factory,
    title: "Productie Dashboard", subtitle: "Efficiency, output & kwaliteit",
    accentBg: "bg-accent/10", accentText: "text-accent", accentBorder: "border-accent/20", accentDot: "bg-accent",
  },
  {
    id: "directie", label: "Directie", icon: Briefcase,
    title: "Directie Dashboard", subtitle: "Strategisch overzicht & kerncijfers",
    accentBg: "bg-primary/10", accentText: "text-primary", accentBorder: "border-primary/20", accentDot: "bg-primary",
  },
];

const tabData = {
  inkoop: { kpis: inkoopKPIs, highlights: inkoopHighlights },
  verkoop: { kpis: verkoopKPIs, highlights: verkoopHighlights },
  productie: { kpis: productieKPIs, highlights: productieHighlights },
  directie: { kpis: directieKPIs, highlights: directieHighlights },
};

const Dashboards = () => {
  const [activeTab, setActiveTab] = useState<TabId>("inkoop");
  const navigate = useNavigate();
  const current = tabs.find((t) => t.id === activeTab)!;
  const data = tabData[activeTab];

  return (
    <div className="h-screen w-screen flex flex-col bg-background overflow-hidden">
      {/* Top bar */}
      <header className="shrink-0 border-b border-border bg-card/80 backdrop-blur-sm px-4 md:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-sm font-bold text-foreground tracking-tight">HBM Project Dashboards</h1>
            <p className="text-[10px] text-muted-foreground">Bloom & HBMaster</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${current.accentDot}`} />
          <span className="text-[10px] font-mono text-muted-foreground">
            Laatst bijgewerkt: vandaag 14:30
          </span>
        </div>
      </header>

      {/* Tab navigation — each tab gets its own accent color */}
      <nav className="shrink-0 border-b border-border bg-card/40 px-4 md:px-6">
        <div className="flex gap-1 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                  active
                    ? `${tab.accentBorder} ${tab.accentText}`
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Dashboard content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
        {/* Header with department accent */}
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${current.accentBg} border ${current.accentBorder} flex items-center justify-center ${current.accentText}`}>
            <current.icon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">{current.title}</h2>
            <p className="text-xs text-muted-foreground">{current.subtitle}</p>
          </div>
        </div>

        {/* Inkoop: two-column layout with Stats Today */}
        {activeTab === "inkoop" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <KPICardGrid kpis={data.kpis} />
              <HighlightsFeed highlights={data.highlights} />
            </div>
            <div className="lg:col-span-1">
              <InkoopStatsToday />
            </div>
          </div>
        )}

        {/* Verkoop: KPIs + bouquets gallery */}
        {activeTab === "verkoop" && (
          <div className="space-y-6">
            <KPICardGrid kpis={data.kpis} />
            <VerkoopBouquets />
            <HighlightsFeed highlights={data.highlights} />
          </div>
        )}

        {/* Productie & Directie: standard layout */}
        {(activeTab === "productie" || activeTab === "directie") && (
          <div className="space-y-6">
            <KPICardGrid kpis={data.kpis} />
            <HighlightsFeed highlights={data.highlights} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboards;

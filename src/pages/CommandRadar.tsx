import { useState } from "react";
import { Activity, Shield, TrendingUp, Banknote, Zap, Radar } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MCHologramBackground } from "@/components/mission-control/MCHologramBackground";

/* ── Lazy-style imports of existing page content ── */
import IntelligenceHub from "./IntelligenceHub";
import RiskRadar from "./RiskRadar";
import ChanceRadar from "./ChanceRadar";
import ProfitEngine from "./ProfitEngine";

/* ── Types ── */
type TabId = "intelligence" | "risk" | "chance" | "profit" | "actions";

interface SummarySignal {
  label: string;
  value: string;
  status: "healthy" | "warning" | "critical" | "neutral";
}

/* ── Executive summary signals ── */
const signals: SummarySignal[] = [
  { label: "Production Health", value: "92%", status: "healthy" },
  { label: "Margin Health", value: "−2.6pp", status: "warning" },
  { label: "Supply Stability", value: "88%", status: "warning" },
  { label: "Forecast Reliability", value: "87%", status: "healthy" },
  { label: "Profit Status", value: "+4.1%", status: "healthy" },
];

const statusDot: Record<string, string> = {
  healthy: "bg-accent",
  warning: "bg-yellow-500",
  critical: "bg-red-500",
  neutral: "bg-muted-foreground",
};

const statusBorder: Record<string, string> = {
  healthy: "border-accent/20",
  warning: "border-yellow-500/20",
  critical: "border-red-500/20",
  neutral: "border-border",
};

const statusBg: Record<string, string> = {
  healthy: "bg-accent/5",
  warning: "bg-yellow-500/5",
  critical: "bg-red-500/5",
  neutral: "bg-muted/10",
};

const statusText: Record<string, string> = {
  healthy: "text-accent",
  warning: "text-yellow-500",
  critical: "text-red-500",
  neutral: "text-muted-foreground",
};

/* ── Tab definitions ── */
const tabs: { id: TabId; label: string; icon: typeof Activity; shortLabel: string }[] = [
  { id: "intelligence", label: "Intelligence Hub", icon: Radar, shortLabel: "Intelligence" },
  { id: "risk", label: "Risk Radar", icon: Shield, shortLabel: "Risico's" },
  { id: "chance", label: "Chance Radar", icon: TrendingUp, shortLabel: "Kansen" },
  { id: "profit", label: "Profit Engine", icon: Banknote, shortLabel: "Winst" },
  { id: "actions", label: "Action Engine", icon: Zap, shortLabel: "Acties" },
];

/* ── Action Engine (extracted from ChanceRadar's action section) ── */
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import IHSectionShell from "@/components/intelligence-hub/IHSectionShell";
import { DepartmentBadge, DepartmentFilter, mapLegacyDept, type Department } from "@/components/department/DepartmentBadge";

interface ActionItem {
  action_title: string;
  department: "Procurement" | "Production" | "Sales" | "Design" | "Planning";
  priority: "High" | "Medium" | "Low";
  driver: string;
  flower?: string;
  recommended_action: string;
  expected_impact: string;
  constraints?: string;
  data_sources_used: string[];
}

const actionItems: ActionItem[] = [
  { action_title: "Secure flower supply", department: "Procurement", priority: "High", driver: "forecast_gap", flower: "Germini Franky", recommended_action: "Secure 45,000 stems before week 38", expected_impact: "+1.2% margin improvement", constraints: "Maintain orange color palette", data_sources_used: ["HBM Production", "Picklist", "Axerrio DW"] },
  { action_title: "Shift high-margin products to B3", department: "Production", priority: "High", driver: "production_efficiency", recommended_action: "Verplaats BQ Elegance en Charme XL naar lijn B3 (350 st/u)", expected_impact: "+€2.1K/week extra output", constraints: "B3 capaciteit max 8 uur/dag", data_sources_used: ["HBM Production"] },
  { action_title: "Increase price BQ Fleur", department: "Sales", priority: "High", driver: "margin_gap", flower: "BQ Fleur", recommended_action: "Verhoog verkoopprijs met €0.05 richting Vomar", expected_impact: "+0.8% marge-verbetering", data_sources_used: ["Axerrio DW", "Picklist"] },
  { action_title: "Optimize bouquet recipe", department: "Design", priority: "Medium", driver: "design_efficiency", flower: "Boeket Charme XL", recommended_action: "Vervang Alstroemeria door Chrysant – 18% snellere productie", expected_impact: "−€0.006 arbeid/bos", constraints: "Kleurpalet behouden", data_sources_used: ["Picklist", "HBM Production"] },
  { action_title: "Plan extra weekend shift", department: "Planning", priority: "Medium", driver: "demand_surge", recommended_action: "Plan zaterdagshift voor week 39 – orders 14% boven forecast", expected_impact: "+4.200 extra boeketten", constraints: "Personeelsbeschikbaarheid", data_sources_used: ["HBM Production", "Axerrio DW"] },
  { action_title: "Extend tulip contract volume", department: "Procurement", priority: "Medium", driver: "supply_risk", flower: "Tulp Premium Mix", recommended_action: "Verleng contractvolume met 20.000 stelen voor Q4", expected_impact: "Leveringszekerheid +15%", data_sources_used: ["Picklist", "Axerrio DW"] },
  { action_title: "Monitor rose quality", department: "Procurement", priority: "Low", driver: "quality_signal", flower: "Roos Avalanche 60cm", recommended_action: "Track uitval% komende 3 leveringen partij KE-2024-0834", expected_impact: "Preventie afkeur −2%", data_sources_used: ["HBM Production"] },
];

const allDepts: (Department | "All")[] = ["All", "Verkoop", "Inkoop", "Productie", "Administratie", "Financieel"];
const priorityOrder = { High: 0, Medium: 1, Low: 2 };
const priorityStyle = {
  High: "text-red-500 bg-red-500/10 border-red-500/20",
  Medium: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
  Low: "text-muted-foreground bg-muted/20 border-border",
};

const ActionEngineContent = () => {
  const [deptFilter, setDeptFilter] = useState<string>("All");
  const filtered = actionItems
    .filter((a) => deptFilter === "All" || mapLegacyDept(a.department) === deptFilter)
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return (
    <div className="relative flex-1 min-h-0 overflow-hidden">
      <ScrollArea className="h-full relative z-10">
        <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-8 rounded-full bg-primary" />
            <div>
              <h1 className="text-lg md:text-xl font-black tracking-tight text-foreground uppercase">Action Engine</h1>
              <p className="text-[11px] font-mono text-muted-foreground">Intelligence → Concrete operationele acties per afdeling</p>
            </div>
          </div>
          <IHSectionShell icon={Zap} title="Operationele Acties" subtitle="Geprioriteerd op impact, urgentie & financieel belang" badge={`${filtered.length} ACTIES`} badgeVariant="success">
            <DepartmentFilter departments={allDepts} active={deptFilter} onChange={setDeptFilter} className="mb-4" />
            <div className="space-y-3">
              {filtered.map((action) => (
                <div key={action.action_title} className={`rounded-xl border p-4 transition-all hover:shadow-md ${
                  action.priority === "High" ? "border-red-500/30 bg-red-500/5" :
                  action.priority === "Medium" ? "border-yellow-500/30 bg-yellow-500/5" :
                  "border-border bg-muted/10"
                }`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Zap className={`w-3.5 h-3.5 ${action.priority === "High" ? "text-red-500" : "text-primary"}`} />
                      <span className="text-sm font-bold text-foreground">{action.action_title}</span>
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${priorityStyle[action.priority]}`}>{action.priority.toUpperCase()}</span>
                      <DepartmentBadge department={mapLegacyDept(action.department)} />
                    </div>
                  </div>
                  {action.flower && (
                    <div className="text-[10px] font-mono text-muted-foreground mb-2">
                      Bloem: <span className="text-foreground font-semibold">{action.flower}</span>
                      <span className="mx-2 text-border">|</span>
                      Driver: <span className="text-foreground font-semibold">{action.driver.replace(/_/g, " ")}</span>
                    </div>
                  )}
                  {!action.flower && (
                    <div className="text-[10px] font-mono text-muted-foreground mb-2">
                      Driver: <span className="text-foreground font-semibold">{action.driver.replace(/_/g, " ")}</span>
                    </div>
                  )}
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <h4 className="text-[10px] font-bold text-foreground/60 uppercase tracking-wider mb-1">Aanbevolen actie</h4>
                      <div className="flex items-start gap-1.5 text-[11px]">
                        <ArrowRight className="w-3 h-3 mt-0.5 text-accent shrink-0" />
                        <span className="text-foreground/80">{action.recommended_action}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-foreground/60 uppercase tracking-wider mb-1">Verwacht effect</h4>
                      <span className="text-[11px] font-mono font-bold text-accent">{action.expected_impact}</span>
                      {action.constraints && (
                        <div className="mt-1 text-[10px] text-muted-foreground">
                          <span className="text-foreground/50">Constraint:</span> {action.constraints}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {action.data_sources_used.map((ds) => (
                      <Badge key={ds} variant="outline" className="text-[8px] font-mono px-1.5 py-0 h-4">{ds}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </IHSectionShell>
        </div>
      </ScrollArea>
    </div>
  );
};

/* ══════════════════════════════════════════
   COMMAND RADAR PAGE
   ══════════════════════════════════════════ */

const CommandRadar = () => {
  const [activeTab, setActiveTab] = useState<TabId>("intelligence");

  return (
    <div className="relative flex-1 min-h-0 overflow-hidden flex flex-col">
      <MCHologramBackground />

      {/* ── Executive Summary Bar ── */}
      <div className="relative z-10 border-b border-border bg-card/60 backdrop-blur-xl px-4 md:px-6 py-3 shrink-0">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-8 rounded-full bg-gradient-brand" />
            <div>
              <h1 className="text-lg md:text-xl font-black tracking-tight text-foreground uppercase">Command Radar</h1>
              <p className="text-[11px] font-mono text-muted-foreground">Executive control center • 5 intelligence modes</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {signals.map((s) => (
              <div key={s.label} className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border ${statusBorder[s.status]} ${statusBg[s.status]} transition-all`}>
                <div className={`w-2 h-2 rounded-full ${statusDot[s.status]} shrink-0`} />
                <div className="min-w-0">
                  <div className="text-[10px] text-muted-foreground/60 truncate">{s.label}</div>
                  <div className={`text-sm font-extrabold font-mono leading-none ${statusText[s.status]}`}>{s.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab Navigation ── */}
      <div className="relative z-10 border-b border-border bg-card/40 backdrop-blur-sm px-4 md:px-6 shrink-0">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex gap-0 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
                    isActive
                      ? "border-primary text-primary bg-primary/5"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/20"
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.shortLabel}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div className="flex-1 min-h-0 relative z-10">
        {activeTab === "intelligence" && <IntelligenceHub />}
        {activeTab === "risk" && <RiskRadar />}
        {activeTab === "chance" && <ChanceRadar />}
        {activeTab === "profit" && <ProfitEngine />}
        {activeTab === "actions" && <ActionEngineContent />}
      </div>
    </div>
  );
};

export default CommandRadar;

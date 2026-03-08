import { useState } from "react";
import { Activity, Shield, TrendingUp, Banknote, Zap, Radar } from "lucide-react";
import { MCHologramBackground } from "@/components/mission-control/MCHologramBackground";
import { useIntelligenceData } from "@/hooks/useIntelligenceData";
import { SignalUnknown, InlineLoader } from "@/components/intelligence-hub/DataStateWrapper";
import type { SignalStatus } from "@/types/intelligence";

/* ── Lazy-style imports of existing page content ── */
import IntelligenceHub from "./IntelligenceHub";
import RiskRadar from "./RiskRadar";
import ChanceRadar from "./ChanceRadar";
import ProfitEngine from "./ProfitEngine";
import { ActionImpactSystem } from "@/components/action-impact/ActionImpactSystem";

/* ── Types ── */
type TabId = "intelligence" | "risk" | "chance" | "profit" | "actions";

/* ── Status styles ── */

const statusDot: Record<SignalStatus, string> = {
  healthy: "bg-accent",
  warning: "bg-yellow-500",
  critical: "bg-red-500",
  unknown: "bg-muted-foreground/40",
};

const statusBorder: Record<SignalStatus, string> = {
  healthy: "border-accent/20",
  warning: "border-yellow-500/20",
  critical: "border-red-500/20",
  unknown: "border-border",
};

const statusBg: Record<SignalStatus, string> = {
  healthy: "bg-accent/5",
  warning: "bg-yellow-500/5",
  critical: "bg-red-500/5",
  unknown: "bg-muted/10",
};

const statusText: Record<SignalStatus, string> = {
  healthy: "text-accent",
  warning: "text-yellow-500",
  critical: "text-red-500",
  unknown: "text-muted-foreground/50",
};

/* ── Tab definitions ── */
const tabs: { id: TabId; label: string; icon: typeof Activity; shortLabel: string }[] = [
  { id: "intelligence", label: "Intelligence Hub", icon: Radar, shortLabel: "Intelligence" },
  { id: "risk", label: "Risk Radar", icon: Shield, shortLabel: "Risico's" },
  { id: "chance", label: "Chance Radar", icon: TrendingUp, shortLabel: "Kansen" },
  { id: "profit", label: "Profit Engine", icon: Banknote, shortLabel: "Winst" },
  { id: "actions", label: "Action Engine", icon: Zap, shortLabel: "Acties" },
];

/* ══════════════════════════════════════════
   COMMAND RADAR PAGE
   ══════════════════════════════════════════ */

const CommandRadar = () => {
  const [activeTab, setActiveTab] = useState<TabId>("intelligence");
  const intelligence = useIntelligenceData();

  const isLoading = intelligence.summary.state === "loading";

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
              <p className="text-[11px] font-mono text-muted-foreground">
                Executive control center • {intelligence.summary.signals.length} signals
                {intelligence.summary.state === "partial" && (
                  <span className="text-yellow-500 ml-2">⚠ partial data</span>
                )}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-lg border border-border bg-muted/10 animate-pulse">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/20 shrink-0" />
                    <div className="min-w-0">
                      <div className="h-2 w-16 bg-muted-foreground/10 rounded mb-1" />
                      <div className="h-3.5 w-10 bg-muted-foreground/10 rounded" />
                    </div>
                  </div>
                ))
              : intelligence.summary.signals.map((s) => (
                  <div
                    key={s.id}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border ${statusBorder[s.status]} ${statusBg[s.status]} transition-all`}
                  >
                    <div className={`w-2 h-2 rounded-full ${statusDot[s.status]} shrink-0`} />
                    <div className="min-w-0">
                      <div className="text-[10px] text-muted-foreground/60 truncate">{s.label}</div>
                      {s.status === "unknown" ? (
                        <SignalUnknown />
                      ) : (
                        <div className={`text-sm font-extrabold font-mono leading-none ${statusText[s.status]}`}>
                          {s.value}
                        </div>
                      )}
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
        {activeTab === "intelligence" && (
          <IntelligenceHub intelligence={intelligence} />
        )}
        {activeTab === "risk" && (
          <RiskRadar intelligence={intelligence} />
        )}
        {activeTab === "chance" && (
          <ChanceRadar intelligence={intelligence} />
        )}
        {activeTab === "profit" && (
          <ProfitEngine intelligence={intelligence} />
        )}
        {activeTab === "actions" && (
          <ActionImpactSystem intelligence={intelligence} />
        )}
      </div>
    </div>
  );
};

export default CommandRadar;

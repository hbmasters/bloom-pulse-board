import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MCSidebar from "@/components/mission-control/MCSidebar";
import MCTopBar from "@/components/mission-control/MCTopBar";
import { MCHologramBackground } from "@/components/mission-control/MCHologramBackground";
import ChatThread from "@/components/mission-control/ChatThread";
import AIHologram from "@/components/mission-control/AIHologram";
import TelemetryPanel from "@/components/mission-control/TelemetryPanel";
import KanbanBoard from "@/components/mission-control/KanbanBoard";
import BuildRadarStrip from "@/components/mission-control/BuildRadarStrip";
import KPIDashboard from "@/components/mission-control/KPIDashboard";
import MCNotifications from "@/components/mission-control/MCNotifications";
import MCWeekPlanner from "@/components/mission-control/MCWeekPlanner";
import ChatHistory from "@/components/mission-control/ChatHistory";
import MCMobileMenu from "@/components/mission-control/MCMobileMenu";
import MCStatusPanel from "@/components/mission-control/MCStatusPanel";
import MCCronJobs from "@/components/mission-control/MCCronJobs";
import MCMethodiek from "@/components/mission-control/MCMethodiek";
import MCAgents from "@/components/mission-control/MCAgents";
import MCSettings from "@/components/mission-control/MCSettings";
import IntelligenceHub from "@/pages/IntelligenceHub";
import RiskRadar from "@/pages/RiskRadar";
import ChanceRadar from "@/pages/ChanceRadar";
import ProfitEngine from "@/pages/ProfitEngine";
import MCWorkingModeToggle from "@/components/mission-control/MCWorkingModeToggle";
import CommandRadar from "@/pages/CommandRadar";
import { ActionImpactSystem } from "@/components/action-impact/ActionImpactSystem";
import ProcurementCockpit from "@/pages/ProcurementCockpit";
import ProductionCockpit from "@/pages/ProductionCockpit";
import CommercialCockpit from "@/pages/CommercialCockpit";

import ProcurementCockpitV1 from "@/pages/ProcurementCockpitV1";
import AIArchitecture from "@/pages/AIArchitecture";
import DevelopmentControl from "@/pages/DevelopmentControl";
import StrategicInsight from "@/pages/StrategicInsight";
import Sentinel from "@/pages/Sentinel";
import ControlCenter from "@/pages/ControlCenter";
import BuildRadar from "@/pages/BuildRadar";
import Verdelen from "@/pages/Verdelen";
import { ChevronUp, ChevronDown } from "lucide-react";

export type MCView = "chat" | "kanban" | "history" | "kpis" | "notifications" | "planner" | "status" | "cronjobs" | "methodiek" | "agents" | "settings" | "intelligence" | "risk-radar" | "chance-radar" | "profit-engine" | "command-radar" | "action-engine" | "procurement" | "production-cockpit" | "commercial" | "procurement-cockpit-v1" | "ai-architecture" | "dev-control" | "strategic-insight" | "sentinel" | "control-center" | "build-radar" | "verdelen";

const routeToView: Record<string, MCView> = {
  "/": "chat",
  "/kanban": "kanban",
  "/kpi": "kpis",
  "/notificaties": "notifications",
  "/weekplanner": "planner",
  "/system-status": "status",
  "/cron-jobs": "cronjobs",
  "/methodiek": "methodiek",
  "/agents": "agents",
  "/history": "history",
  "/settings": "settings",
  "/intelligence": "intelligence",
  "/risk-radar": "risk-radar",
  "/chance-radar": "chance-radar",
  "/profit-engine": "profit-engine",
  "/command-radar": "command-radar",
  "/action-engine": "action-engine",
  "/procurement": "procurement",
  "/production-cockpit": "production-cockpit",
  "/commercial": "commercial",
  
  "/labs/procurement-cockpit-v1": "procurement-cockpit-v1",
  "/labs/strategic-market-insight": "strategic-insight",
  "/labs/sentinel": "sentinel",
  "/labs/control-center": "control-center",
  "/labs/build-radar": "build-radar",
  "/labs/verdelen": "verdelen",
  "/ai-architecture": "ai-architecture",
  "/dev-control": "dev-control",
};

export const viewToRoute: Record<MCView, string> = {
  chat: "/",
  kanban: "/kanban",
  kpis: "/kpi",
  notifications: "/notificaties",
  planner: "/weekplanner",
  status: "/system-status",
  cronjobs: "/cron-jobs",
  methodiek: "/methodiek",
  agents: "/agents",
  history: "/history",
  settings: "/settings",
  intelligence: "/intelligence",
  "risk-radar": "/risk-radar",
  "chance-radar": "/chance-radar",
  "profit-engine": "/profit-engine",
  "command-radar": "/command-radar",
  "action-engine": "/action-engine",
  procurement: "/procurement",
  "production-cockpit": "/production-cockpit",
  commercial: "/commercial",
  
  "procurement-cockpit-v1": "/labs/procurement-cockpit-v1",
  "strategic-insight": "/labs/strategic-market-insight",
  sentinel: "/labs/sentinel",
  "control-center": "/labs/control-center",
  "build-radar": "/labs/build-radar",
  verdelen: "/labs/verdelen",
  "ai-architecture": "/ai-architecture",
  "dev-control": "/dev-control",
};

const MissionControl = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const view = routeToView[location.pathname] || "chat";

  const handleNavigate = (v: MCView) => navigate(viewToRoute[v]);

  const [aiState, setAiState] = useState<"idle" | "thinking" | "responding" | "loading" | "analyse" | "development" | "connectie">("idle");
  const [messageCount, setMessageCount] = useState(0);
  const [showTelemetry, setShowTelemetry] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [workingMode, setWorkingMode] = useState(true);

  return (
    <div className={`${workingMode ? "" : "mc-dark"} flex h-[100dvh] w-full overflow-hidden transition-colors duration-500`}>
      <MCMobileMenu active={view} onNavigate={handleNavigate} open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="hidden md:flex">
        <MCSidebar active={view} onNavigate={handleNavigate} />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden relative">
        {view !== "chat" && <MCHologramBackground />}
        <MCTopBar view={view} onMenuOpen={() => setMenuOpen(true)} onNavigate={handleNavigate} />

        <main className="flex-1 min-h-0 flex flex-col md:flex-row relative z-10">
          <div className="flex-1 min-w-0 min-h-0 flex flex-col">
            {view === "chat" && (
              <div className="flex-1 min-w-0 min-h-0 flex flex-col relative">
                <div className={`flex justify-center transition-all duration-700 ease-out ${
                  messageCount === 0 
                    ? "relative shrink-0 py-3 md:py-6" 
                    : "absolute inset-0 z-0 opacity-30 pointer-events-none items-start pt-4"
                }`}>
                  <AIHologram state={aiState} compact={messageCount > 0} />
                </div>
                <div className={`flex-1 min-h-0 ${messageCount > 0 ? "relative z-10" : ""}`}>
                  <ChatThread onStateChange={setAiState} onMessageCount={setMessageCount} />
                </div>

                <div className="md:hidden xl:hidden">
                  <button
                    onClick={() => setShowTelemetry(!showTelemetry)}
                    className="w-full flex items-center justify-center gap-1 py-2 border-t border-border bg-card/60 backdrop-blur-sm text-muted-foreground text-[10px] font-mono uppercase tracking-wider"
                  >
                    {showTelemetry ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
                    Telemetry
                  </button>
                  {showTelemetry && (
                    <div className="h-64 overflow-y-auto border-t border-border">
                      <TelemetryPanel />
                    </div>
                  )}
                </div>
              </div>
            )}
            {view === "kanban" && <KanbanBoard />}
            {view === "kpis" && <KPIDashboard />}
            {view === "notifications" && <MCNotifications />}
            {view === "planner" && <MCWeekPlanner />}
            {view === "status" && <MCStatusPanel />}
            {view === "cronjobs" && <MCCronJobs />}
            {view === "methodiek" && <MCMethodiek />}
            {view === "agents" && <MCAgents />}
            {view === "history" && <ChatHistory />}
            {view === "settings" && <MCSettings />}
            {view === "intelligence" && <IntelligenceHub />}
            {view === "risk-radar" && <RiskRadar />}
            {view === "chance-radar" && <ChanceRadar />}
            {view === "profit-engine" && <ProfitEngine />}
            {view === "command-radar" && <CommandRadar />}
            {view === "action-engine" && <ActionImpactSystem />}
            {view === "procurement" && <ProcurementCockpit />}
            {view === "production-cockpit" && <ProductionCockpit />}
            {view === "commercial" && <CommercialCockpit />}
            
            {view === "procurement-cockpit-v1" && <ProcurementCockpitV1 />}
            {view === "strategic-insight" && <StrategicInsight />}
            {view === "sentinel" && <Sentinel />}
            {view === "control-center" && <ControlCenter />}
            {view === "build-radar" && <BuildRadar />}
            {view === "verdelen" && <Verdelen />}
            {view === "ai-architecture" && <AIArchitecture />}
            {view === "dev-control" && <DevelopmentControl />}
          </div>

          {view === "chat" && (
            <div className="hidden xl:block w-72 border-l border-border">
              <TelemetryPanel />
            </div>
          )}
        </main>
      </div>
      <MCWorkingModeToggle isWorking={workingMode} onToggle={() => setWorkingMode(!workingMode)} />
    </div>
  );
};

export default MissionControl;

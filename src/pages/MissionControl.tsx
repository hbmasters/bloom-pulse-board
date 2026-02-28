import { useState } from "react";
import MCSidebar from "@/components/mission-control/MCSidebar";
import MCTopBar from "@/components/mission-control/MCTopBar";
import { MCHologramBackground } from "@/components/mission-control/MCHologramBackground";
import ChatThread from "@/components/mission-control/ChatThread";
import AIHologram from "@/components/mission-control/AIHologram";
import TelemetryPanel from "@/components/mission-control/TelemetryPanel";
import KanbanBoard from "@/components/mission-control/KanbanBoard";
import ChatHistory from "@/components/mission-control/ChatHistory";
import MCMobileMenu from "@/components/mission-control/MCMobileMenu";
import { ChevronUp, ChevronDown } from "lucide-react";

type MCView = "chat" | "kanban" | "history" | "settings";

const MissionControl = () => {
  const [view, setView] = useState<MCView>("chat");
  const [aiState, setAiState] = useState<"idle" | "thinking" | "responding" | "loading">("idle");
  const [messageCount, setMessageCount] = useState(0);
  const [showTelemetry, setShowTelemetry] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="mc-dark flex h-[100dvh] w-full overflow-hidden">
      {/* Mobile menu — rendered at root level to be above everything */}
      <MCMobileMenu active={view} onNavigate={setView} open={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <MCSidebar active={view} onNavigate={setView} />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden relative">
        {view !== "chat" && <MCHologramBackground />}
        <MCTopBar view={view} onMenuOpen={() => setMenuOpen(true)} />

        {/* Main content */}
        <main className="flex-1 min-h-0 flex flex-col md:flex-row relative z-10">
          {/* Center panel */}
          <div className="flex-1 min-w-0 min-h-0 flex flex-col">
            {view === "chat" && (
              <div className="flex-1 min-w-0 min-h-0 flex flex-col relative">
                {/* Hologram — absolute behind chat when messages exist */}
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

                {/* Mobile telemetry toggle */}
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
            {view === "history" && <ChatHistory />}
            {view === "settings" && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-muted border border-border mx-auto flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />
                  </div>
                  <p className="text-sm text-muted-foreground">Instellingen — binnenkort beschikbaar</p>
                </div>
              </div>
            )}
          </div>

          {/* Right panel - Telemetry (desktop only) */}
          {view === "chat" && (
            <div className="hidden xl:block w-72 border-l border-border">
              <TelemetryPanel />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MissionControl;

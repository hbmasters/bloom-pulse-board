import { useState } from "react";
import MCSidebar from "@/components/mission-control/MCSidebar";
import MCTopBar from "@/components/mission-control/MCTopBar";
import { MCHologramBackground } from "@/components/mission-control/MCHologramBackground";
import ChatThread from "@/components/mission-control/ChatThread";
import AIHologram from "@/components/mission-control/AIHologram";
import TelemetryPanel from "@/components/mission-control/TelemetryPanel";
import KanbanBoard from "@/components/mission-control/KanbanBoard";
import ChatHistory from "@/components/mission-control/ChatHistory";

type MCView = "chat" | "kanban" | "history" | "settings";

const MissionControl = () => {
  const [view, setView] = useState<MCView>("chat");
  const [aiState, setAiState] = useState<"idle" | "thinking" | "responding" | "loading">("idle");
  const [messageCount, setMessageCount] = useState(0);

  return (
    <div className="mc-dark flex h-screen w-full overflow-hidden">
      <MCSidebar active={view} onNavigate={setView} />

      <div className="flex flex-1 flex-col overflow-hidden relative">
        <MCHologramBackground />
        <MCTopBar view={view} />

        {/* Main content */}
        <main className="flex-1 min-h-0 flex relative z-10">
          {/* Center panel */}
          <div className="flex-1 min-w-0 flex flex-col">
            {view === "chat" && (
              <div className="flex-1 min-w-0 flex flex-col">
                {/* Hologram */}
                <div className={`shrink-0 flex justify-center transition-all duration-700 ease-out ${
                  messageCount === 0 ? "py-6" : "py-2"
                }`}>
                  <AIHologram state={aiState} compact={messageCount > 0} />
                </div>
                <div className="flex-1 min-h-0">
                  <ChatThread onStateChange={setAiState} onMessageCount={setMessageCount} />
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

          {/* Right panel - Telemetry */}
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

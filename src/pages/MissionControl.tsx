import { useState } from "react";
import MCSidebar from "@/components/mission-control/MCSidebar";
import ChatThread from "@/components/mission-control/ChatThread";
import AIHologram from "@/components/mission-control/AIHologram";
import TelemetryPanel from "@/components/mission-control/TelemetryPanel";
import KanbanBoard from "@/components/mission-control/KanbanBoard";
import ChatHistory from "@/components/mission-control/ChatHistory";

type MCView = "chat" | "kanban" | "history" | "settings";

const MissionControl = () => {
  const [view, setView] = useState<MCView>("chat");
  const [aiState, setAiState] = useState<"idle" | "thinking" | "responding">("idle");
  const [messageCount, setMessageCount] = useState(0);

  return (
    <div className="h-screen w-screen bg-background text-foreground flex overflow-hidden floral-watermark">
      {/* Sidebar */}
      <MCSidebar active={view} onNavigate={setView} />

      {/* Main content */}
      <div className="flex-1 min-w-0 flex relative z-10">
        {/* Center panel */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Top bar */}
          <div className="shrink-0 h-12 border-b border-border flex items-center px-4 justify-between bg-card">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-foreground uppercase tracking-wider">
                {view === "chat" ? "HBMaster Chat" : view === "kanban" ? "Kanban Board" : view === "history" ? "Historie" : "Settings"}
              </span>
            </div>
            {view === "chat" && (
              <button className="text-[10px] font-mono text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-secondary">
                + Nieuw gesprek
              </button>
            )}
          </div>

          {/* Content area */}
          <div className="flex-1 min-h-0 flex">
            {view === "chat" && (
              <div className="flex-1 min-w-0 flex flex-col">
                {/* Hologram */}
                <div className={`shrink-0 flex justify-center transition-all duration-500 ${
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
                <p className="text-sm text-muted-foreground font-mono">Settings — coming soon</p>
              </div>
            )}
          </div>
        </div>

        {/* Right panel - Telemetry */}
        {view === "chat" && (
          <div className="hidden xl:block w-72 border-l border-border bg-card/50">
            <TelemetryPanel />
          </div>
        )}
      </div>
    </div>
  );
};

export default MissionControl;

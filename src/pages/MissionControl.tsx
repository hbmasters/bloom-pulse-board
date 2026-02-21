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
          {/* Top bar — 2026 glassmorphism */}
          <div className="shrink-0 h-14 border-b border-border/40 flex items-center px-5 justify-between backdrop-blur-lg bg-card/60">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-5 rounded-full bg-primary/60" />
              <span className="text-xs font-black text-foreground uppercase tracking-[0.15em]">
                {view === "chat" ? "HBMaster Chat" : view === "kanban" ? "Kanban Board" : view === "history" ? "Historie" : "Settings"}
              </span>
            </div>
            {view === "chat" && (
              <button className="text-[10px] font-mono text-muted-foreground/70 hover:text-foreground transition-all duration-300 px-3 py-1.5 rounded-xl hover:bg-primary/5 border border-transparent hover:border-border/50">
                + Nieuw gesprek
              </button>
            )}
          </div>

          {/* Content area */}
          <div className="flex-1 min-h-0 flex">
            {view === "chat" && (
              <div className="flex-1 min-w-0 flex flex-col">
                {/* Hologram */}
                <div className={`shrink-0 flex justify-center transition-all duration-700 ease-out ${
                  messageCount === 0 ? "py-8" : "py-2"
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
                  <div className="w-12 h-12 rounded-2xl bg-primary/5 border border-border/50 mx-auto flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full border-2 border-primary/30" />
                  </div>
                  <p className="text-sm text-muted-foreground/60 font-mono tracking-wide">Settings — coming soon</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right panel - Telemetry */}
        {view === "chat" && (
          <div className="hidden xl:block w-72 border-l border-border/40 backdrop-blur-lg bg-card/40">
            <TelemetryPanel />
          </div>
        )}
      </div>
    </div>
  );
};

export default MissionControl;

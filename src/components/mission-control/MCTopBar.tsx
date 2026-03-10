import { Search, Zap, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import HBMasterLogo from "./HBMasterLogo";
import MCNotificationBell from "./MCNotificationBell";
import type { MCView } from "@/pages/MissionControl";

interface MCTopBarProps {
  view: MCView;
  onNewChat?: () => void;
  onMenuOpen?: () => void;
  onNavigate?: (view: MCView) => void;
}

const viewTitles: Record<MCView, string> = {
  chat: "HBMaster Chat",
  kanban: "Kanban Board",
  kpis: "KPI Dashboard",
  notifications: "Notificaties",
  planner: "Weekplanner",
  status: "Systeem Status",
  cronjobs: "Cron Jobs",
  methodiek: "Analyse Methodiek",
  agents: "OpenClaw Agents",
  history: "Chat Historie",
  settings: "Instellingen",
  intelligence: "Intelligence Hub",
  "risk-radar": "Risk Radar",
  "chance-radar": "Chance Radar",
  "profit-engine": "Profit Engine",
  "command-radar": "Command Radar",
  "action-engine": "Action Engine",
  procurement: "Procurement Cockpit",
  "production-cockpit": "Production Cockpit",
};

const MCTopBar = ({ view, onNewChat, onMenuOpen, onNavigate }: MCTopBarProps) => {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border px-4 md:px-6 flex-shrink-0 bg-card/60 backdrop-blur-xl relative z-40">
      <div className="flex items-center gap-2 md:gap-3">
        <button
          onClick={onMenuOpen}
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <HBMasterLogo size={24} className="md:hidden shrink-0" />
        <Zap className="w-4 h-4 text-primary hidden md:block" />
        <h1 className="text-xs md:text-sm font-black text-foreground uppercase tracking-[0.12em]">{viewTitles[view]}</h1>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Zoeken..." className="w-56 pl-9 h-9 text-sm bg-secondary/50 border-border" />
        </div>

        {onNavigate && <MCNotificationBell onNavigate={onNavigate} />}

        {view === "chat" && onNewChat && (
          <button
            onClick={onNewChat}
            className="text-xs font-bold text-primary hover:text-primary/80 transition-colors px-3 py-1.5 rounded-md border border-primary/30 hover:border-primary/60 hover:bg-primary/10"
          >
            + Nieuw gesprek
          </button>
        )}
      </div>
    </header>
  );
};

export default MCTopBar;

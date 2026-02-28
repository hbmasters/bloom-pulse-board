import { Search, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";

type MCView = "chat" | "kanban" | "history" | "settings";

interface MCTopBarProps {
  view: MCView;
  onNewChat?: () => void;
}

const viewTitles: Record<MCView, string> = {
  chat: "HBMaster Chat",
  kanban: "Kanban Board",
  history: "Chat Historie",
  settings: "Instellingen",
};

const MCTopBar = ({ view, onNewChat }: MCTopBarProps) => {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border px-6 flex-shrink-0 bg-card/60 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <Zap className="w-4 h-4 text-primary" />
        <h1 className="text-sm font-black text-foreground uppercase tracking-[0.12em]">{viewTitles[view]}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Zoeken..." className="w-56 pl-9 h-9 text-sm bg-secondary/50 border-border" />
        </div>

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

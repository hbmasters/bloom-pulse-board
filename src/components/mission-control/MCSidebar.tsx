import { MessageSquare, LayoutGrid, Clock, Settings, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

type MCView = "chat" | "kanban" | "history" | "settings";

interface MCSidebarProps {
  active: MCView;
  onNavigate: (view: MCView) => void;
}

const navItems: { id: MCView; icon: typeof MessageSquare; label: string }[] = [
  { id: "chat", icon: MessageSquare, label: "Chat" },
  { id: "kanban", icon: LayoutGrid, label: "Kanban" },
  { id: "history", icon: Clock, label: "Historie" },
  { id: "settings", icon: Settings, label: "Settings" },
];

const MCSidebar = ({ active, onNavigate }: MCSidebarProps) => {
  const navigate = useNavigate();

  return (
    <div className="w-16 lg:w-52 shrink-0 flex flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="p-3 lg:px-4 lg:py-5 border-b border-border">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4 shrink-0" />
          <span className="hidden lg:block text-xs font-mono">Terug</span>
        </button>
        <div className="mt-3 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center shadow-sm shrink-0">
            <span className="text-[9px] font-black text-primary-foreground">HB</span>
          </div>
          <div className="hidden lg:block">
            <div className="text-xs font-black text-foreground uppercase tracking-wider">HBMaster</div>
            <div className="text-[9px] font-mono text-muted-foreground">Mission Control</div>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              active === item.id
                ? "bg-primary/10 text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <item.icon className="w-4 h-4 shrink-0" />
            <span className="hidden lg:block">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom status */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-2 px-2">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="hidden lg:block text-[10px] font-mono text-muted-foreground">AI Online</span>
        </div>
      </div>
    </div>
  );
};

export default MCSidebar;

import { MessageSquare, LayoutGrid, Clock, Settings, ArrowLeft, PanelLeftClose, PanelLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";
import HBMasterLogo from "./HBMasterLogo";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type MCView = "chat" | "kanban" | "history" | "settings";

interface MCSidebarProps {
  active: MCView;
  onNavigate: (view: MCView) => void;
}

const navItems: { id: MCView; icon: typeof MessageSquare; label: string }[] = [
  { id: "chat", icon: MessageSquare, label: "Chat" },
  { id: "kanban", icon: LayoutGrid, label: "Kanban" },
  { id: "history", icon: Clock, label: "Historie" },
  { id: "settings", icon: Settings, label: "Instellingen" },
];

const MCSidebar = ({ active, onNavigate }: MCSidebarProps) => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex h-screen flex-col bg-sidebar text-sidebar-foreground flex-shrink-0 transition-all duration-200 border-r border-sidebar-border",
        collapsed ? "w-16" : "w-56"
      )}
    >
      {/* Header */}
      <div className="flex h-14 items-center border-b border-sidebar-border px-3 gap-2">
        <HBMasterLogo size={collapsed ? 28 : 32} className="shrink-0" />
        {!collapsed && (
          <div className="flex-1 pl-1">
            <span className="text-sm font-black tracking-wider text-sidebar-primary-foreground">
              HBMASTER
            </span>
            <span className="text-[9px] font-mono text-sidebar-muted block -mt-0.5">AI Command Center</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex h-8 w-8 items-center justify-center rounded-md text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-colors"
        >
          {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </button>
      </div>

      {/* Back button */}
      <div className="px-3 py-2 border-b border-sidebar-border">
        <button
          onClick={() => navigate("/")}
          className={cn(
            "flex items-center rounded-md text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-colors",
            collapsed ? "justify-center px-0 py-2" : "gap-2 px-3 py-2 text-sm"
          )}
        >
          <ArrowLeft className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span className="text-xs">Terug</span>}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 px-2">
        <ul className="space-y-0.5">
          {navItems.map(item => {
            const isActive = active === item.id;

            const linkContent = (
              <button
                onClick={() => onNavigate(item.id)}
                className={cn(
                  "w-full flex items-center rounded-md transition-colors",
                  collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2 text-sm",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
              </button>
            );

            return (
              <li key={item.id}>
                {collapsed ? (
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                    <TooltipContent side="right" sideOffset={8}>
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  linkContent
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom status */}
      <div className="p-3 border-t border-sidebar-border">
        <div className={cn("flex items-center gap-2", collapsed ? "justify-center" : "px-2")}>
          <div className="w-2 h-2 rounded-full bg-sidebar-primary animate-pulse" />
          {!collapsed && <span className="text-[10px] font-mono text-sidebar-muted">AI Online</span>}
        </div>
      </div>
    </aside>
  );
};

export default MCSidebar;

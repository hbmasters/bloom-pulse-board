import { MessageSquare, LayoutGrid, Clock, Settings, PanelLeftClose, PanelLeft, BarChart3, Bell, CalendarDays, Timer, Brain, Bot, Crosshair, Zap, ShoppingCart, Factory, Briefcase, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import HBMasterLogo from "./HBMasterLogo";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { MCView } from "@/pages/MissionControl";

interface MCSidebarProps {
  active: MCView;
  onNavigate: (view: MCView) => void;
}

type NavItem = { id: MCView; icon: typeof MessageSquare; label: string };
type NavGroup = { id: string; icon: typeof MessageSquare; label: string; children: NavItem[] };
type NavEntry = NavItem | NavGroup;

const isGroup = (entry: NavEntry): entry is NavGroup => "children" in entry;

const navEntries: NavEntry[] = [
  { id: "chat", icon: MessageSquare, label: "Chat" },
  { id: "command-radar", icon: Crosshair, label: "Command Radar" },
  {
    id: "management-cockpit",
    icon: Briefcase,
    label: "Management Cockpit",
    children: [
      { id: "procurement", icon: ShoppingCart, label: "Procurement Cockpit" },
      { id: "production-cockpit", icon: Factory, label: "Production Cockpit" },
    ],
  },
  { id: "action-engine", icon: Zap, label: "Action Engine" },
  { id: "kanban", icon: LayoutGrid, label: "Kanban" },
  { id: "kpis", icon: BarChart3, label: "KPI's" },
  { id: "notifications", icon: Bell, label: "Notificaties" },
  { id: "planner", icon: CalendarDays, label: "Weekplanner" },
  { id: "cronjobs", icon: Timer, label: "Cron Jobs" },
  { id: "methodiek", icon: Brain, label: "Methodiek" },
  { id: "agents", icon: Bot, label: "Agents" },
  { id: "history", icon: Clock, label: "Historie" },
  { id: "settings", icon: Settings, label: "Instellingen" },
];

const MCSidebar = ({ active, onNavigate }: MCSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (id: string) => setOpenGroups(prev => ({ ...prev, [id]: !prev[id] }));

  const isChildActive = (group: NavGroup) => group.children.some(c => c.id === active);

  const renderItem = (item: NavItem, indent = false) => {
    const isActive = active === item.id;
    const linkContent = (
      <button
        onClick={() => onNavigate(item.id)}
        className={cn(
          "w-full flex items-center rounded-md transition-colors",
          collapsed ? "justify-center px-0 py-2.5" : "gap-3 py-2 text-sm",
          indent && !collapsed ? "pl-9 pr-3" : collapsed ? "" : "px-3",
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
            <TooltipContent side="right" sideOffset={8}>{item.label}</TooltipContent>
          </Tooltip>
        ) : (
          linkContent
        )}
      </li>
    );
  };

  const renderGroup = (group: NavGroup) => {
    const isOpen = openGroups[group.id] ?? isChildActive(group);
    const childActive = isChildActive(group);

    if (collapsed) {
      // Show children as flat items when collapsed
      return group.children.map(child => renderItem(child));
    }

    return (
      <li key={group.id}>
        <button
          onClick={() => toggleGroup(group.id)}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors",
            childActive
              ? "text-sidebar-accent-foreground font-medium"
              : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
          )}
        >
          <group.icon className="h-4 w-4 flex-shrink-0" />
          <span className="flex-1 text-left">{group.label}</span>
          <ChevronRight className={cn("h-3 w-3 transition-transform duration-200", isOpen && "rotate-90")} />
        </button>
        {isOpen && (
          <ul className="mt-0.5 space-y-0.5">
            {group.children.map(child => renderItem(child, true))}
          </ul>
        )}
      </li>
    );
  };

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
            <span className="text-sm font-black tracking-wider text-sidebar-primary-foreground">HBMASTER</span>
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

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 px-2">
        <ul className="space-y-0.5">
          {navEntries.map(entry =>
            isGroup(entry) ? renderGroup(entry) : renderItem(entry)
          )}
        </ul>
      </nav>

      {/* Bottom status button */}
      <div className="p-3 border-t border-sidebar-border">
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <button
              onClick={() => onNavigate("status")}
              className={cn(
                "w-full flex items-center rounded-md transition-colors",
                collapsed ? "justify-center px-0 py-2" : "gap-2 px-3 py-2 text-sm",
                active === "status"
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
            >
              <div className="relative flex-shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-400/40 animate-ping" />
              </div>
              {!collapsed && <span className="text-[10px] font-mono">Systeem Status</span>}
            </button>
          </TooltipTrigger>
          {collapsed && (
            <TooltipContent side="right" sideOffset={8}>Systeem Status</TooltipContent>
          )}
        </Tooltip>
      </div>
    </aside>
  );
};

export default MCSidebar;

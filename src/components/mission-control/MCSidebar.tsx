import { MessageSquare, LayoutGrid, Clock, Settings, PanelLeftClose, PanelLeft, BarChart3, Bell, CalendarDays, Timer, Brain, Bot, Crosshair, Zap, ShoppingCart, Factory, DollarSign, Cpu, Shield, Compass, ShieldCheck, Monitor } from "lucide-react";
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
type NavSection = { label: string; entries: NavItem[] };

const navSections: NavSection[] = [
  {
    label: "Directie",
    entries: [
      { id: "kpis", icon: BarChart3, label: "Key Performance Indicator" },
      { id: "command-radar", icon: Crosshair, label: "Command Radar" },
      { id: "production-cockpit", icon: Factory, label: "Production Cockpit" },
      { id: "commercial", icon: DollarSign, label: "Commercial Cockpit" },
      { id: "action-engine", icon: Zap, label: "Action Engine" },
    ],
  },
  {
    label: "AI Systemen",
    entries: [
      { id: "chat", icon: MessageSquare, label: "Chat" },
      { id: "kanban", icon: LayoutGrid, label: "Kanban" },
      { id: "notifications", icon: Bell, label: "Notificaties" },
      { id: "planner", icon: CalendarDays, label: "Weekplanner" },
      { id: "cronjobs", icon: Timer, label: "Cron Jobs" },
      { id: "methodiek", icon: Brain, label: "Methodiek" },
      { id: "agents", icon: Bot, label: "Agents" },
      { id: "history", icon: Clock, label: "Historie" },
      { id: "sentinel", icon: ShieldCheck, label: "Sentinel" },
      { id: "ai-architecture", icon: Cpu, label: "AI Architecture" },
      { id: "dev-control", icon: Shield, label: "Dev Control Protocol" },
      { id: "settings", icon: Settings, label: "Instellingen" },
    ],
  },
  {
    label: "LABS",
    entries: [
      { id: "procurement-cockpit-v1", icon: ShoppingCart, label: "Procurement Cockpit V0.5" },
      { id: "strategic-insight", icon: Compass, label: "Strategic & Market Insight" },
    ],
  },
];

const MCSidebar = ({ active, onNavigate }: MCSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const renderItem = (item: NavItem) => {
    const isActive = active === item.id;
    const linkContent = (
      <button
        onClick={() => onNavigate(item.id)}
        className={cn(
          "w-full flex items-center rounded-md transition-colors",
          collapsed ? "justify-center px-0 py-2.5" : "gap-3 py-2 text-sm px-3",
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

  return (
    <aside
      className={cn(
        "flex h-screen flex-col bg-sidebar text-sidebar-foreground flex-shrink-0 transition-all duration-200 border-r border-sidebar-border",
        collapsed ? "w-16" : "w-64"
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
        {navSections.map((section, si) => (
          <div key={section.label}>
            {si > 0 && <div className="my-2 mx-2 border-t border-sidebar-border" />}
            {!collapsed && (
              <div className="px-3 pt-2 pb-1">
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-sidebar-foreground/40">
                  {section.label}
                </span>
              </div>
            )}
            {collapsed && si > 0 && <div className="my-1" />}
            <ul className="space-y-0.5">
              {section.entries.map(entry => renderItem(entry))}
            </ul>
          </div>
        ))}
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

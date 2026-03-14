import { MessageSquare, LayoutGrid, Clock, Settings, X, BarChart3, Bell, CalendarDays, Timer, Brain, Bot, Crosshair, Zap, ShoppingCart, Factory, Briefcase, ChevronRight, DollarSign, Cpu, Shield } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import HBMasterLogo from "./HBMasterLogo";
import type { MCView } from "@/pages/MissionControl";

interface MCMobileMenuProps {
  active: MCView;
  onNavigate: (view: MCView) => void;
  open: boolean;
  onClose: () => void;
}

type NavItem = { id: MCView; icon: typeof MessageSquare; label: string };
type NavGroup = { id: string; icon: typeof MessageSquare; label: string; children: NavItem[] };
type NavEntry = NavItem | NavGroup;

const isGroup = (entry: NavEntry): entry is NavGroup => "children" in entry;

type NavSection = { label: string; entries: NavEntry[] };

const navSections: NavSection[] = [
  {
    label: "Directie",
    entries: [
      { id: "command-radar", icon: Crosshair, label: "Command Radar" },
      {
        id: "management-cockpit",
        icon: Briefcase,
        label: "Management Cockpit",
        children: [
          { id: "procurement", icon: ShoppingCart, label: "Procurement Cockpit" },
          { id: "production-cockpit", icon: Factory, label: "Production Cockpit" },
          { id: "commercial", icon: DollarSign, label: "Commercial Cockpit" },
        ],
      },
      { id: "action-engine", icon: Zap, label: "Action Engine" },
    ],
  },
  {
    label: "AI Systemen",
    entries: [
      { id: "chat", icon: MessageSquare, label: "Chat" },
      { id: "kanban", icon: LayoutGrid, label: "Kanban" },
      { id: "kpis", icon: BarChart3, label: "KPI's" },
      { id: "notifications", icon: Bell, label: "Notificaties" },
      { id: "planner", icon: CalendarDays, label: "Weekplanner" },
      { id: "cronjobs", icon: Timer, label: "Cron Jobs" },
      { id: "methodiek", icon: Brain, label: "Methodiek" },
      { id: "agents", icon: Bot, label: "Agents" },
      { id: "history", icon: Clock, label: "Historie" },
      { id: "settings", icon: Settings, label: "Instellingen" },
    ],
  },
];

const MCMobileMenu = ({ active, onNavigate, open, onClose }: MCMobileMenuProps) => {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const handleNav = (view: MCView) => {
    onNavigate(view);
    onClose();
  };

  const toggleGroup = (id: string) => setOpenGroups(prev => ({ ...prev, [id]: !prev[id] }));
  const isChildActive = (group: NavGroup) => group.children.some(c => c.id === active);

  return (
    <>
      {open && (
        <div
          className="md:hidden fixed inset-0 bg-black/70"
          style={{ zIndex: 9998 }}
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "md:hidden fixed top-0 left-0 h-full w-72 flex flex-col border-r border-sidebar-border transition-transform duration-300 ease-out safe-area-bottom",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        style={{ zIndex: 9999, background: "hsl(228, 22%, 12%)" }}
      >
        <div className="flex h-14 items-center border-b border-sidebar-border px-4 gap-3">
          <HBMasterLogo size={28} className="shrink-0" />
          <div className="flex-1">
            <span className="text-sm font-black tracking-wider text-sidebar-primary-foreground">HBMASTER</span>
            <span className="text-[9px] font-mono text-sidebar-muted block -mt-0.5">AI Command Center</span>
          </div>
          <button onClick={onClose} className="flex items-center justify-center w-8 h-8 rounded-md text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 py-3 px-2 overflow-y-auto">
          {navSections.map((section, si) => (
            <div key={section.label}>
              {si > 0 && <div className="my-2 mx-2 border-t border-sidebar-border" />}
              <div className="px-3 pt-2 pb-1">
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-sidebar-foreground/40">
                  {section.label}
                </span>
              </div>
              <ul className="space-y-0.5">
                {section.entries.map(entry => {
                  if (isGroup(entry)) {
                    const isOpen = openGroups[entry.id] ?? isChildActive(entry);
                    return (
                      <li key={entry.id}>
                        <button
                          onClick={() => toggleGroup(entry.id)}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-md transition-colors",
                            isChildActive(entry)
                              ? "text-sidebar-accent-foreground font-medium"
                              : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                          )}
                        >
                          <entry.icon className="w-4 h-4 shrink-0" />
                          <span className="flex-1 text-left">{entry.label}</span>
                          <ChevronRight className={cn("h-3 w-3 transition-transform duration-200", isOpen && "rotate-90")} />
                        </button>
                        {isOpen && (
                          <ul className="mt-0.5 space-y-0.5">
                            {entry.children.map(child => (
                              <li key={child.id}>
                                <button
                                  onClick={() => handleNav(child.id)}
                                  className={cn(
                                    "w-full flex items-center gap-3 pl-9 pr-3 py-2.5 text-sm rounded-md transition-colors",
                                    active === child.id
                                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                                  )}
                                >
                                  <child.icon className="w-4 h-4 shrink-0" />
                                  <span>{child.label}</span>
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    );
                  }

                  const isActive = active === entry.id;
                  return (
                    <li key={entry.id}>
                      <button
                        onClick={() => handleNav(entry.id)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-md transition-colors",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                        )}
                      >
                        <entry.icon className="w-4 h-4 shrink-0" />
                        <span>{entry.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <button
            onClick={() => handleNav("status")}
            className={cn(
              "w-full flex items-center gap-2 px-3 py-2.5 text-sm rounded-md transition-colors",
              active === "status"
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50"
            )}
          >
            <div className="relative flex-shrink-0">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <span className="text-[10px] font-mono">Systeem Status</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default MCMobileMenu;

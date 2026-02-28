import { MessageSquare, LayoutGrid, Clock, Settings, X, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import HBMasterLogo from "./HBMasterLogo";

type MCView = "chat" | "kanban" | "history" | "settings";

interface MCMobileMenuProps {
  active: MCView;
  onNavigate: (view: MCView) => void;
  open: boolean;
  onClose: () => void;
}

const navItems: { id: MCView; icon: typeof MessageSquare; label: string }[] = [
  { id: "chat", icon: MessageSquare, label: "Chat" },
  { id: "kanban", icon: LayoutGrid, label: "Kanban" },
  { id: "history", icon: Clock, label: "Historie" },
  { id: "settings", icon: Settings, label: "Instellingen" },
];

const MCMobileMenu = ({ active, onNavigate, open, onClose }: MCMobileMenuProps) => {
  const navigate = useNavigate();

  const handleNav = (view: MCView) => {
    onNavigate(view);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="md:hidden fixed inset-0 bg-black/70"
          style={{ zIndex: 9998 }}
          onClick={onClose}
        />
      )}

      {/* Slide-in sidebar */}
      <aside
        className={cn(
          "md:hidden fixed top-0 left-0 h-full w-64 flex flex-col border-r border-sidebar-border transition-transform duration-300 ease-out safe-area-bottom",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        style={{ zIndex: 9999, background: "hsl(228, 22%, 12%)" }}
      >
        {/* Header */}
        <div className="flex h-14 items-center border-b border-sidebar-border px-4 gap-3">
          <HBMasterLogo size={28} className="shrink-0" />
          <div className="flex-1">
            <span className="text-sm font-black tracking-wider text-sidebar-primary-foreground">HBMASTER</span>
            <span className="text-[9px] font-mono text-sidebar-muted block -mt-0.5">AI Command Center</span>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-md text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Back */}
        <div className="px-3 py-2 border-b border-sidebar-border">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-md text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs">Terug</span>
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-3 px-2">
          <ul className="space-y-0.5">
            {navItems.map(item => {
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleNav(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-md transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                    )}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom status */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-2 px-2">
            <div className="w-2 h-2 rounded-full bg-sidebar-primary animate-pulse" />
            <span className="text-[10px] font-mono text-sidebar-muted">AI Online</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default MCMobileMenu;

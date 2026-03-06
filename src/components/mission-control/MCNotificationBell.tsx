import { useState, useRef, useEffect } from "react";
import { Bell, CheckCircle2, AlertTriangle, Info, XCircle, Clock, ChevronRight } from "lucide-react";
import { useNotifications, type NotifLevel } from "@/hooks/useNotifications";
import type { MCView } from "@/pages/MissionControl";

const levelIcon: Record<NotifLevel, typeof Info> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
};

const levelColor: Record<NotifLevel, string> = {
  info: "text-primary",
  success: "text-accent",
  warning: "text-bloom-warm",
  error: "text-red-400",
};

interface Props {
  onNavigate: (view: MCView) => void;
}

const MCNotificationBell = ({ onNavigate }: Props) => {
  const { notifications, unreadCount, markRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const latest = notifications.slice(0, 3);

  return (
    <div ref={ref} className="relative">
      {/* Bell button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative flex items-center justify-center w-9 h-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
        aria-label="Notificaties"
      >
        <Bell className="w-[18px] h-[18px]" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 flex items-center justify-center">
            <span className="text-[10px] font-bold text-primary-foreground leading-none">{unreadCount}</span>
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-12 w-80 rounded-2xl border border-border bg-card shadow-xl z-50 overflow-hidden animate-slide-in">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
            <span className="text-[13px] font-semibold text-foreground">Notificaties</span>
            {unreadCount > 0 && (
              <span className="text-[11px] font-medium text-primary">{unreadCount} nieuw</span>
            )}
          </div>

          {/* Items */}
          <div className="divide-y divide-border/30">
            {latest.map(n => {
              const Icon = levelIcon[n.level];
              return (
                <button
                  key={n.id}
                  onClick={() => { markRead(n.id); }}
                  className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors hover:bg-secondary/30 ${
                    !n.read ? "bg-primary/[0.03]" : ""
                  }`}
                >
                  <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${n.read ? "text-muted-foreground/40" : levelColor[n.level]}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />}
                      <h4 className={`text-[12px] font-semibold truncate ${n.read ? "text-muted-foreground" : "text-foreground"}`}>
                        {n.title}
                      </h4>
                    </div>
                    <p className="text-[11px] text-muted-foreground/60 mt-0.5 line-clamp-1">{n.message}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="w-2.5 h-2.5 text-muted-foreground/30" />
                      <span className="text-[10px] text-muted-foreground/40">{n.time}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <button
            onClick={() => { setOpen(false); onNavigate("notifications"); }}
            className="w-full flex items-center justify-center gap-1.5 px-4 py-3 border-t border-border/50 text-[12px] font-medium text-primary hover:bg-primary/5 transition-colors"
          >
            Alle notificaties bekijken
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default MCNotificationBell;

import { useState } from "react";
import {
  Bell, CheckCircle2, AlertTriangle, Info, XCircle,
  Clock, Trash2
} from "lucide-react";
import PageAgentBadges from "./PageAgentBadges";
import { useNotifications, type NotifLevel } from "@/hooks/useNotifications";

const levelConfig: Record<NotifLevel, { icon: typeof Info; color: string; bg: string; dot: string }> = {
  info:    { icon: Info,          color: "text-primary",     bg: "bg-primary/10 border-primary/20",     dot: "bg-primary" },
  success: { icon: CheckCircle2,  color: "text-accent",      bg: "bg-accent/10 border-accent/20",       dot: "bg-accent" },
  warning: { icon: AlertTriangle, color: "text-bloom-warm",  bg: "bg-bloom-warm/10 border-bloom-warm/20", dot: "bg-bloom-warm" },
  error:   { icon: XCircle,       color: "text-red-400",     bg: "bg-red-500/10 border-red-500/20",     dot: "bg-red-400" },
};

const MCNotifications = () => {
  const { notifications, unreadCount, markRead, markAllRead, deleteNotif } = useNotifications();
  const [filter, setFilter] = useState<NotifLevel | "all">("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const filtered = notifications.filter(n => {
    if (filter !== "all" && n.level !== filter) return false;
    if (showUnreadOnly && n.read) return false;
    return true;
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 pt-4 pb-2">
        <div className="relative">
          <Bell className="w-4 h-4 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 flex items-center justify-center">
              <span className="text-[8px] font-bold text-primary-foreground">{unreadCount}</span>
            </span>
          )}
        </div>
        <h2 className="text-sm font-bold text-foreground tracking-tight">Notificaties</h2>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="ml-auto text-[11px] font-medium text-primary hover:underline"
          >
            Alles gelezen
          </button>
        )}
      </div>
      <PageAgentBadges pageId="notifications" className="px-4 pb-2" />

      {/* Filters */}
      <div className="flex items-center gap-1.5 px-4 pb-3 flex-wrap">
        {(["all", "error", "warning", "success", "info"] as const).map(level => {
          const isAll = level === "all";
          const count = isAll
            ? notifications.length
            : notifications.filter(n => n.level === level).length;
          return (
            <button
              key={level}
              onClick={() => setFilter(level)}
              className={`text-[11px] font-medium px-2.5 py-1 rounded-full border transition-all ${
                filter === level
                  ? isAll
                    ? "bg-primary/15 text-primary border-primary/30"
                    : levelConfig[level].bg + " " + levelConfig[level].color
                  : "bg-card text-muted-foreground border-border hover:border-primary/20"
              }`}
            >
              {isAll ? "Alles" : level === "error" ? "Fout" : level === "warning" ? "Waarschuwing" : level === "success" ? "Succes" : "Info"}
              <span className="ml-1 opacity-50">{count}</span>
            </button>
          );
        })}
        <button
          onClick={() => setShowUnreadOnly(!showUnreadOnly)}
          className={`text-[11px] font-medium px-2.5 py-1 rounded-full border transition-all ml-auto ${
            showUnreadOnly
              ? "bg-primary/15 text-primary border-primary/30"
              : "bg-card text-muted-foreground border-border hover:border-primary/20"
          }`}
        >
          Ongelezen
        </button>
      </div>

      {/* Notification list */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-4">
        <div className="relative">
          <div className="absolute left-[7px] top-2 bottom-0 w-px bg-border/50" />

          {filtered.length === 0 && (
            <div className="flex items-center justify-center py-12 text-[12px] text-muted-foreground/40">
              Geen notificaties
            </div>
          )}

          {filtered.map(notif => {
            const cfg = levelConfig[notif.level];
            const LevelIcon = cfg.icon;

            return (
              <div key={notif.id} className="relative mb-2">
                <div className={`absolute left-0 top-4 w-[15px] h-[15px] rounded-full border-2 z-10 flex items-center justify-center ${
                  notif.read
                    ? "border-border bg-card"
                    : `border-current ${cfg.color} bg-card`
                }`}>
                  {!notif.read && <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />}
                </div>

                <button
                  onClick={() => markRead(notif.id)}
                  className={`w-full text-left ml-6 p-3.5 rounded-xl border transition-all group ${
                    notif.read
                      ? "bg-card/40 border-border/40 hover:border-border"
                      : "bg-card border-border hover:border-primary/20 shadow-sm"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <LevelIcon className={`w-4 h-4 mt-0.5 shrink-0 ${notif.read ? "text-muted-foreground/40" : cfg.color}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={`text-[12px] font-semibold truncate ${notif.read ? "text-muted-foreground" : "text-foreground"}`}>
                          {notif.title}
                        </h4>
                        <button
                          onClick={e => { e.stopPropagation(); deleteNotif(notif.id); }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3 text-muted-foreground/40 hover:text-red-400" />
                        </button>
                      </div>
                      <p className={`text-[11px] leading-relaxed mt-0.5 ${notif.read ? "text-muted-foreground/50" : "text-muted-foreground/70"}`}>
                        {notif.message}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${notif.read ? "bg-muted/50 text-muted-foreground/40" : cfg.bg + " " + cfg.color}`}>
                          {notif.source}
                        </span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5 text-muted-foreground/30" />
                          <span className="text-[10px] text-muted-foreground/40">{notif.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MCNotifications;

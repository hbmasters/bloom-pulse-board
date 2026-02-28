import { useState } from "react";
import {
  Bell, CheckCircle2, AlertTriangle, Info, XCircle,
  Clock, ChevronDown, Trash2
} from "lucide-react";

type NotifLevel = "info" | "success" | "warning" | "error";

interface Notification {
  id: string;
  title: string;
  message: string;
  level: NotifLevel;
  time: string;
  read: boolean;
  source: string;
}

const levelConfig: Record<NotifLevel, { icon: typeof Info; color: string; bg: string; dot: string }> = {
  info:    { icon: Info,          color: "text-blue-400",   bg: "bg-blue-500/10 border-blue-500/20",   dot: "bg-blue-400" },
  success: { icon: CheckCircle2,  color: "text-accent",     bg: "bg-accent/10 border-accent/20",       dot: "bg-accent" },
  warning: { icon: AlertTriangle, color: "text-bloom-warm",  bg: "bg-bloom-warm/10 border-bloom-warm/20", dot: "bg-bloom-warm" },
  error:   { icon: XCircle,       color: "text-red-400",    bg: "bg-red-500/10 border-red-500/20",     dot: "bg-red-400" },
};

const mockNotifications: Notification[] = [
  { id: "1", title: "Productie target bereikt", message: "Lijn 2 heeft het dagdoel van 380 boeketten behaald. Uitstekend werk!", level: "success", time: "2 min geleden", read: false, source: "Productie" },
  { id: "2", title: "Temperatuurwaarschuwing koelcel 3", message: "Temperatuur is gestegen naar 4.8°C. Grens is 5°C. Controleer de koeling.", level: "warning", time: "12 min geleden", read: false, source: "Koelcel" },
  { id: "3", title: "Nieuwe planning beschikbaar", message: "De weekplanning voor week 10 is klaargezet door HBMaster.", level: "info", time: "45 min geleden", read: false, source: "Planning" },
  { id: "4", title: "Kwaliteitscontrole afgekeurd", message: "Batch 47 van BQ Trend heeft een afkeurpercentage van 4.2%. Actie vereist.", level: "error", time: "1 uur geleden", read: true, source: "QC" },
  { id: "5", title: "Bezetting bijgewerkt", message: "Middag-shift bezetting is bevestigd: 14 medewerkers op 3 lijnen.", level: "success", time: "2 uur geleden", read: true, source: "HR" },
  { id: "6", title: "Leverancier update", message: "Levering rozen Ecuador is onderweg, verwachte aankomst 14:30.", level: "info", time: "3 uur geleden", read: true, source: "Logistiek" },
  { id: "7", title: "KPI update", message: "Productiebeheersing KPI is gestegen naar 94.2%. Boven target!", level: "success", time: "4 uur geleden", read: true, source: "KPI" },
  { id: "8", title: "Storing lijn 1 verholpen", message: "De storing op lijn 1 is verholpen. Productie hervat om 10:15.", level: "info", time: "Gisteren 16:30", read: true, source: "Productie" },
  { id: "9", title: "Voorraad waarschuwing", message: "Verpakkingsmateriaal voor BQ Elegance bijna op. Bestel binnen 2 dagen.", level: "warning", time: "Gisteren 11:00", read: true, source: "Logistiek" },
  { id: "10", title: "Dagrapport verzonden", message: "Het automatische dagrapport is verstuurd naar het management team.", level: "info", time: "Gisteren 17:00", read: true, source: "Systeem" },
];

const MCNotifications = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<NotifLevel | "all">("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const filtered = notifications.filter(n => {
    if (filter !== "all" && n.level !== filter) return false;
    if (showUnreadOnly && n.read) return false;
    return true;
  });

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotif = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 pt-4 pb-2">
        <div className="relative">
          <Bell className="w-4 h-4 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 flex items-center justify-center">
              <span className="text-[7px] font-bold text-white">{unreadCount}</span>
            </span>
          )}
        </div>
        <h2 className="text-xs font-black text-foreground uppercase tracking-wider">Notificaties</h2>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="ml-auto text-[9px] font-mono text-primary hover:underline"
          >
            Alles gelezen
          </button>
        )}
      </div>

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
              className={`text-[9px] font-mono font-bold px-2 py-1 rounded-full border transition-all ${
                filter === level
                  ? isAll
                    ? "bg-primary/15 text-primary border-primary/30"
                    : levelConfig[level].bg + " " + levelConfig[level].color
                  : "bg-card text-muted-foreground border-border hover:border-primary/20"
              }`}
            >
              {isAll ? "Alles" : level === "error" ? "Fout" : level === "warning" ? "Waarschuwing" : level === "success" ? "Succes" : "Info"}
              <span className="ml-1 opacity-60">{count}</span>
            </button>
          );
        })}
        <button
          onClick={() => setShowUnreadOnly(!showUnreadOnly)}
          className={`text-[9px] font-mono font-bold px-2 py-1 rounded-full border transition-all ml-auto ${
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
          {/* Timeline line */}
          <div className="absolute left-[7px] top-2 bottom-0 w-px bg-border" />

          {filtered.length === 0 && (
            <div className="flex items-center justify-center py-12 text-[10px] font-mono text-muted-foreground/40">
              Geen notificaties
            </div>
          )}

          {filtered.map(notif => {
            const cfg = levelConfig[notif.level];
            const LevelIcon = cfg.icon;

            return (
              <div key={notif.id} className="relative mb-1.5">
                {/* Timeline dot */}
                <div className={`absolute left-0 top-4 w-[15px] h-[15px] rounded-full border-2 z-10 flex items-center justify-center ${
                  notif.read
                    ? "border-border bg-card"
                    : `border-current ${cfg.color} bg-card`
                }`}>
                  {!notif.read && <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />}
                </div>

                {/* Card */}
                <button
                  onClick={() => markRead(notif.id)}
                  className={`w-full text-left ml-6 p-3 rounded-lg border transition-all group ${
                    notif.read
                      ? "bg-card/40 border-border/40 hover:border-border"
                      : `bg-card border-border hover:border-primary/20 shadow-sm`
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <LevelIcon className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${notif.read ? "text-muted-foreground/40" : cfg.color}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={`text-[11px] font-bold truncate ${notif.read ? "text-muted-foreground" : "text-foreground"}`}>
                          {notif.title}
                        </h4>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={e => { e.stopPropagation(); deleteNotif(notif.id); }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-2.5 h-2.5 text-muted-foreground/40 hover:text-red-400" />
                          </button>
                        </div>
                      </div>
                      <p className={`text-[10px] leading-relaxed mt-0.5 ${notif.read ? "text-muted-foreground/50" : "text-muted-foreground/70"}`}>
                        {notif.message}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-full ${notif.read ? "bg-muted/50 text-muted-foreground/40" : cfg.bg + " " + cfg.color}`}>
                          {notif.source}
                        </span>
                        <div className="flex items-center gap-0.5">
                          <Clock className="w-2 h-2 text-muted-foreground/30" />
                          <span className="text-[8px] font-mono text-muted-foreground/40">{notif.time}</span>
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

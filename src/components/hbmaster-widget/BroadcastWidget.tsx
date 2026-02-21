import { useState, useEffect, useRef } from "react";
import { X, Radio } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { WidgetTheme, WidgetStatus } from "./types";
import { themeAccents } from "./types";
import MiniHologram from "./MiniHologram";

interface BroadcastMessage {
  id: string;
  text: string;
  source: string;
  timestamp: Date;
  severity: "info" | "success" | "warning";
}

interface BroadcastWidgetProps {
  theme: WidgetTheme;
  status?: WidgetStatus;
  position?: "bottom-right" | "bottom-left";
}

// Simulated analysis broadcasts from various systems
const MOCK_BROADCASTS: Omit<BroadcastMessage, "id" | "timestamp">[] = [
  { text: "Cold Store: 1.247 boeketten verwerkt. Tempo +12% vs gisteren.", source: "Productie", severity: "success" },
  { text: "Lijn 3 draait onder capaciteit — 2 posities onbezet.", source: "Lijnbezetting", severity: "warning" },
  { text: "Kwaliteitsindex orchideeën: 94.2% — stabiel.", source: "Quality", severity: "info" },
  { text: "Order forecast morgen: 3.800 boeketten. Hoge druk verwacht.", source: "Planning", severity: "warning" },
  { text: "Kenya farm: 12.000 stems geoogst vandaag. Grade A: 96%.", source: "Kenya Ops", severity: "success" },
  { text: "APU lijn 1: gemiddeld 142 boeketten/uur. Top performance.", source: "Analytics", severity: "success" },
  { text: "Watervoorraad koelcel 2 laag — bijvullen aanbevolen.", source: "Facilities", severity: "warning" },
  { text: "Nieuwe klantorder binnenkomst: Bloemenveiling 480 stuks.", source: "Orders", severity: "info" },
];

const BroadcastWidget = ({ theme, status = "online", position = "bottom-left" }: BroadcastWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<BroadcastMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentSpeaking, setCurrentSpeaking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const accent = themeAccents[theme];

  // Add a new broadcast every 8-15 seconds
  useEffect(() => {
    // Initial messages
    const initial = MOCK_BROADCASTS.slice(0, 3).map((m, i) => ({
      ...m,
      id: `init-${i}`,
      timestamp: new Date(Date.now() - (3 - i) * 60000),
    }));
    setMessages(initial);

    let msgIndex = 3;
    intervalRef.current = setInterval(() => {
      const broadcast = MOCK_BROADCASTS[msgIndex % MOCK_BROADCASTS.length];
      const newMsg: BroadcastMessage = {
        ...broadcast,
        id: `bc-${Date.now()}`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev.slice(-20), newMsg]);
      setCurrentSpeaking(true);
      setTimeout(() => setCurrentSpeaking(false), 3000);
      if (!isOpen) setUnreadCount(prev => prev + 1);
      msgIndex++;
    }, 8000 + Math.random() * 7000);

    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) setUnreadCount(0);
  }, [isOpen]);

  const severityColor = (s: BroadcastMessage["severity"]) =>
    s === "success" ? "155 55% 42%" : s === "warning" ? "40 90% 50%" : accent.hsl;

  return (
    <div className={cn("fixed z-40", position === "bottom-left" ? "bottom-6 left-6" : "bottom-6 right-6")}>
      {/* Panel */}
      {isOpen && (
        <div className="mb-4 animate-scale-in origin-bottom-left">
          <div
            className="w-[360px] h-[480px] flex flex-col bg-background/95 backdrop-blur-xl border border-border/60 rounded-2xl overflow-hidden shadow-2xl"
            style={{ boxShadow: `0 24px 80px -16px hsl(${accent.hsl} / 0.12), 0 8px 32px -8px hsl(0 0% 0% / 0.12)` }}
          >
            {/* Header */}
            <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-border/40" style={{ background: `hsl(${accent.hsl} / 0.04)` }}>
              <div className="flex items-center gap-3">
                <MiniHologram state={currentSpeaking ? "speaking" : "idle"} accentHsl={accent.hsl} size={36} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold tracking-wide">HBMaster</span>
                    <Radio className="w-3 h-3 text-accent animate-pulse" style={{ animationDuration: "2s" }} />
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono">Live Analyse Feed</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted/60 transition-colors" aria-label="Sluit">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Broadcast messages */}
            <div className="flex-1 min-h-0 overflow-y-auto px-3 py-3 space-y-2 scrollbar-thin">
              {messages.map(msg => {
                const sColor = severityColor(msg.severity);
                return (
                  <div
                    key={msg.id}
                    className="rounded-xl border px-3 py-2.5 animate-fade-in"
                    style={{ borderColor: `hsl(${sColor} / 0.15)`, background: `hsl(${sColor} / 0.04)` }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: `hsl(${sColor})` }} />
                      <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider">{msg.source}</span>
                      <span className="text-[9px] text-muted-foreground/50 ml-auto font-mono">{format(msg.timestamp, "HH:mm:ss")}</span>
                    </div>
                    <p className="text-[12px] text-foreground/85 leading-relaxed">{msg.text}</p>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {/* Footer — no input, read-only */}
            <div className="shrink-0 px-4 py-2.5 border-t border-border/40 flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground/50 font-mono">Alleen lezen — automatische analyses</span>
              <span className="text-[10px] font-mono" style={{ color: `hsl(${accent.hsl} / 0.6)` }}>{messages.length} updates</span>
            </div>
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-250",
          "shadow-lg hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isOpen && "rotate-45"
        )}
        style={{
          background: `hsl(${accent.hsl} / 0.15)`,
          border: `1px solid hsl(${accent.hsl} / 0.25)`,
        }}
        aria-label={isOpen ? "Sluit broadcast" : "Open broadcast"}
      >
        {currentSpeaking && !isOpen && (
          <span className="absolute inset-0 rounded-full animate-ping opacity-15" style={{ background: `hsl(${accent.hsl})`, animationDuration: "2s" }} />
        )}
        {isOpen ? (
          <X className="w-4 h-4" style={{ color: `hsl(${accent.hsl})` }} />
        ) : (
          <Radio className="w-4 h-4" style={{ color: `hsl(${accent.hsl})` }} />
        )}
        {/* Unread badge */}
        {!isOpen && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center text-primary-foreground" style={{ background: `hsl(${accent.hsl})` }}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default BroadcastWidget;

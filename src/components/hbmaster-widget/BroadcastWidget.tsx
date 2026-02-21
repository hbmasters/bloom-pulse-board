import { useState, useEffect, useRef } from "react";
import { Radio } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WidgetTheme, WidgetStatus } from "./types";
import { themeAccents } from "./types";

interface BroadcastWidgetProps {
  theme: WidgetTheme;
  status?: WidgetStatus;
  position?: "bottom-right" | "bottom-left";
}

const BROADCASTS: Record<string, { text: string; source: string; severity: "success" | "warning" | "info" }[]> = {
  default: [
    { text: "Cold Store: 1.247 boeketten verwerkt. Tempo +12% vs gisteren.", source: "Productie", severity: "success" },
    { text: "Lijn 3 draait onder capaciteit — 2 posities onbezet.", source: "Lijnbezetting", severity: "warning" },
    { text: "Kwaliteitsindex orchideeën: 94.2% — stabiel.", source: "Quality", severity: "info" },
    { text: "Order forecast morgen: 3.800 boeketten. Hoge druk verwacht.", source: "Planning", severity: "warning" },
    { text: "Kenya farm: 12.000 stems geoogst vandaag. Grade A: 96%.", source: "Kenya Ops", severity: "success" },
    { text: "APU lijn 1: gemiddeld 142 boeketten/uur. Top performance.", source: "Analytics", severity: "success" },
    { text: "Watervoorraad koelcel 2 laag — bijvullen aanbevolen.", source: "Facilities", severity: "warning" },
    { text: "Nieuwe klantorder binnenkomst: Bloemenveiling 480 stuks.", source: "Orders", severity: "info" },
  ],
  realestate: [
    { text: "10 nieuwe veranderingen van personen afgelopen maand.", source: "Huisvesting", severity: "info" },
    { text: "Controle brandveiligheid gehaald op de Legmeerdijk afgelopen maand.", source: "Veiligheid", severity: "success" },
    { text: "513 personen in onze huisvesting.", source: "Bezetting", severity: "success" },
  ],
};

const BroadcastWidget = ({ theme, position = "bottom-left" }: BroadcastWidgetProps) => {
  const [current, setCurrent] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const accent = themeAccents[theme];

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % (BROADCASTS[theme] || BROADCASTS.default).length);
        setFadeIn(true);
      }, 400);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const msgs = BROADCASTS[theme] || BROADCASTS.default;
  const msg = msgs[current % msgs.length];
  const sevColor = msg.severity === "success" ? "155 55% 42%" : msg.severity === "warning" ? "40 90% 50%" : accent.hsl;

  return (
    <div className={cn("fixed z-40", position === "bottom-left" ? "bottom-6 left-6" : "bottom-6 right-6")}>
      <div
        className="w-[360px] rounded-xl border border-border/50 bg-background/90 backdrop-blur-xl px-4 py-3 shadow-lg"
        style={{ boxShadow: `0 8px 32px -8px hsl(${accent.hsl} / 0.1)` }}
      >
        <div className="flex items-center gap-2 mb-1.5">
          <Radio className="w-3 h-3 animate-pulse" style={{ color: `hsl(${accent.hsl})`, animationDuration: "2s" }} />
          <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider">{msg.source}</span>
          <span className="w-1.5 h-1.5 rounded-full ml-auto" style={{ background: `hsl(${sevColor})` }} />
        </div>
        <p
          className={cn(
            "text-[12px] text-foreground/85 leading-relaxed transition-opacity duration-300",
            fadeIn ? "opacity-100" : "opacity-0"
          )}
        >
          {msg.text}
        </p>
      </div>
    </div>
  );
};

export default BroadcastWidget;

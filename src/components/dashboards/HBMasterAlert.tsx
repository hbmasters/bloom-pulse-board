import { useState, useEffect } from "react";
import { X, Sparkles } from "lucide-react";
import HBMasterLogo from "@/components/mission-control/HBMasterLogo";

const insights = [
  "Inkoop tip: Rozen uit Kenya zijn 12% goedkoper dan Ecuador deze week. Overweeg om het inkoopvolume te verschuiven.",
  "Verkoop alert: Moederdag is over 3 weken. Historisch stijgt de vraag met 45% — zorg dat productie voorloopt.",
  "Productie: Lijn 1 draait 8% boven target. Complimenten aan Team Ingrida!",
  "Kwaliteit: De klachtenindex is gedaald naar 0.8% — het laagste punt dit kwartaal.",
  "Transport: 3 ritten naar regio Zuid kunnen worden gecombineerd — besparing van €420 per week.",
  "Inkoop: Chrysanten-contract bespaart naar verwachting €18k op jaarbasis.",
];

const HBMasterAlert = () => {
  const [visible, setVisible] = useState(false);
  const [currentInsight, setCurrentInsight] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (dismissed) return;
    const interval = setInterval(() => {
      setCurrentInsight((prev) => (prev + 1) % insights.length);
      setVisible(true);
    }, 30000);
    return () => clearInterval(interval);
  }, [dismissed]);

  if (!visible || dismissed) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-4 fade-in duration-500 max-w-sm">
      <div className="rounded-xl border border-primary/20 bg-card shadow-xl shadow-primary/5 overflow-hidden">
        {/* Accent bar */}
        <div className="h-1 bg-gradient-to-r from-primary via-bloom-sky to-accent" />

        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Logo */}
            <div className="shrink-0 mt-0.5">
              <HBMasterLogo size={28} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-foreground">HBMaster</span>
                  <Sparkles className="w-3 h-3 text-primary" />
                </div>
                <button
                  onClick={() => setDismissed(true)}
                  className="w-5 h-5 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              <p className="text-[13px] text-foreground/80 leading-relaxed">
                {insights[currentInsight]}
              </p>
              <div className="flex items-center gap-2 mt-2.5">
                <button
                  onClick={() => {
                    setCurrentInsight((prev) => (prev + 1) % insights.length);
                  }}
                  className="text-[10px] font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  Volgend inzicht →
                </button>
                <span className="text-[9px] text-muted-foreground">
                  {currentInsight + 1}/{insights.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HBMasterAlert;

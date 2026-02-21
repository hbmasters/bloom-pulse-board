import { useState, useEffect } from "react";
import { hbMasterMessages } from "@/data/mockData";

const modeColors = {
  flow: "border-accent/30 bg-accent/6",
  stabilisatie: "border-primary/25 bg-primary/5",
  correctie: "border-bloom-warm/25 bg-bloom-warm/5",
};

const HBMasterPanel = () => {
  const [msgIndex, setMsgIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setMsgIndex((p) => (p + 1) % hbMasterMessages.length);
        setVisible(true);
      }, 400);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const currentMsg = hbMasterMessages[msgIndex];

  return (
    <div className={`rounded-xl border overflow-hidden ${modeColors[currentMsg.mode]}`}>
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-brand flex items-center justify-center shrink-0 shadow-sm">
          <span className="text-[10px] font-black text-primary-foreground">HB</span>
        </div>
        <div className="overflow-hidden flex-1 min-w-0">
          <div className="text-[9px] font-black text-primary uppercase tracking-wider mb-0.5">HBMASTER</div>
          <p className={`text-sm font-semibold text-foreground transition-all duration-300 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
          }`}>
            {currentMsg.text}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HBMasterPanel;

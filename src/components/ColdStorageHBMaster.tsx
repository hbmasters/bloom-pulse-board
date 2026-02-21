import { useState, useEffect } from "react";
import { coldStorageHBMessages } from "@/data/coldStorageData";

const modeColors = {
  flow: "border-accent/30 bg-accent/6",
  stabilisatie: "border-primary/25 bg-primary/5",
  correctie: "border-bloom-warm/25 bg-bloom-warm/5",
};

const ColdStorageHBMaster = () => {
  const [msgIndex, setMsgIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setMsgIndex((p) => (p + 1) % coldStorageHBMessages.length);
        setVisible(true);
      }, 400);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const currentMsg = coldStorageHBMessages[msgIndex];

  return (
    <div className={`rounded-lg border overflow-hidden ${modeColors[currentMsg.mode]} max-w-2xl`}>
      <div className="flex items-center gap-2 px-3 py-1.5">
        <div className="w-6 h-6 rounded-md bg-gradient-brand flex items-center justify-center shrink-0 shadow-sm">
          <span className="text-[8px] font-black text-primary-foreground">HB</span>
        </div>
        <div className="overflow-hidden flex-1 min-w-0">
          <p className={`text-xs font-semibold text-foreground transition-all duration-300 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
          }`}>
            <span className="text-[8px] font-black text-primary uppercase tracking-wider mr-2">HBMASTER</span>
            {currentMsg.text}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ColdStorageHBMaster;

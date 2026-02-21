import { useState, useEffect } from "react";
import { Trophy } from "lucide-react";
import { crossLineAlerts } from "@/data/mockData";

const CrossLinePopup = () => {
  const [currentAlert, setCurrentAlert] = useState<number | null>(null);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    let alertIndex = 0;

    const showAlert = () => {
      setCurrentAlert(alertIndex);
      setIsExiting(false);

      setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          setCurrentAlert(null);
          alertIndex = (alertIndex + 1) % crossLineAlerts.length;
        }, 500);
      }, 12000);
    };

    const initialTimer = setTimeout(() => {
      showAlert();
      const interval = setInterval(showAlert, 45000);
      return () => clearInterval(interval);
    }, 25000);

    return () => clearTimeout(initialTimer);
  }, []);

  if (currentAlert === null) return null;

  const alert = crossLineAlerts[currentAlert];

  return (
    <div className={`fixed top-20 right-5 z-50 ${isExiting ? "animate-slide-out" : "animate-slide-in"}`}>
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-card border border-primary/20 shadow-lg glow-primary">
        <Trophy className="w-5 h-5 text-primary shrink-0" />
        <div>
          <div className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">Cross-line</div>
          <p className="text-sm font-semibold text-foreground">
            <span className="text-primary">{alert.line}</span> — {alert.message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CrossLinePopup;

import { useState, useEffect } from "react";
import { Flower2 } from "lucide-react";

const LiveClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  const formatDate = (d: Date) =>
    d.toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="text-right">
      <div className="text-3xl font-mono font-bold text-foreground tracking-tight">
        {formatTime(time)}
      </div>
      <div className="text-sm text-muted-foreground capitalize">{formatDate(time)}</div>
    </div>
  );
};

const ProductionHeader = () => {
  return (
    <header className="flex items-center justify-between px-8 py-5 border-b border-border">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-bloom flex items-center justify-center">
          <Flower2 className="w-7 h-7 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Hoorn Bloom<span className="text-primary">masters</span>
          </h1>
          <p className="text-sm text-muted-foreground">Productiescherm — Dagploeg</p>
        </div>
      </div>
      <LiveClock />
    </header>
  );
};

export default ProductionHeader;

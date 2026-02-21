import { useState, useEffect } from "react";
import { Users, Snowflake, Trophy, Zap, Thermometer, Droplets } from "lucide-react";
import { coldStorageStats, fastestPicker } from "@/data/coldStorageData";

const LiveClock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-end leading-none">
      <div className="text-3xl font-mono font-black text-primary tracking-tight tabular-nums">
        {time.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
      </div>
      <div className="text-[10px] text-muted-foreground capitalize mt-0.5">
        {time.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}
      </div>
    </div>
  );
};

const ColdStorageHeader = () => {
  return (
    <header className="shrink-0 px-5 py-2.5 border-b border-border bg-card shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-bloom-sky to-primary flex items-center justify-center shadow-md">
            <Snowflake className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="leading-tight">
            <h1 className="text-xl font-black text-foreground tracking-tight">{coldStorageStats.lineName}</h1>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Hoorn Bloommasters</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card">
          <Users className="w-4 h-4 text-primary" />
          <div className="leading-none">
            <div className="text-[8px] text-muted-foreground uppercase tracking-wider">Pickers</div>
            <div className="text-lg font-mono font-black text-foreground">{coldStorageStats.totalPickers}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-bloom-warm/30 bg-bloom-warm/5">
          <Trophy className="w-4 h-4 text-bloom-warm" />
          <div className="leading-none">
            <div className="text-[8px] text-muted-foreground uppercase tracking-wider">Most Orders Today</div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black text-foreground">{fastestPicker.name}</span>
              <span className="flex items-center gap-0.5 text-[9px] text-muted-foreground">
                <Zap className="w-2.5 h-2.5 text-bloom-warm" />
                {fastestPicker.ordersCompleted}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-bloom-sky/30 bg-bloom-sky/5">
          <Thermometer className="w-4 h-4 text-bloom-sky" />
          <div className="leading-none">
            <div className="text-[8px] text-muted-foreground uppercase tracking-wider">Temperatuur</div>
            <div className="text-lg font-mono font-black text-foreground">4.2°C</div>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-primary/25 bg-primary/5">
          <Droplets className="w-4 h-4 text-primary" />
          <div className="leading-none">
            <div className="text-[8px] text-muted-foreground uppercase tracking-wider">Luchtvochtigheid</div>
            <div className="text-lg font-mono font-black text-foreground">82%</div>
          </div>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right leading-none">
            <div className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">Today</div>
            <div className="text-2xl font-mono font-black text-foreground">{coldStorageStats.totalPiecesToday.toLocaleString("en-GB")}</div>
            <div className="text-[9px] text-muted-foreground">pieces</div>
          </div>
          <div className="w-px h-10 bg-border" />
          <LiveClock />
        </div>
      </div>
    </header>
  );
};

export default ColdStorageHeader;

import { useState, useEffect } from "react";
import { Users, Snowflake, Trophy, Zap, Thermometer, Droplets, X, TrendingDown, TrendingUp } from "lucide-react";
import { coldStorageStats, fastestPicker } from "@/data/coldStorageData";

const temperatureHistory = [
  { time: "06:00", temp: 3.8, humidity: 85 },
  { time: "07:00", temp: 4.0, humidity: 84 },
  { time: "08:00", temp: 4.1, humidity: 83 },
  { time: "09:00", temp: 4.3, humidity: 82 },
  { time: "10:00", temp: 4.2, humidity: 82 },
  { time: "11:00", temp: 4.4, humidity: 81 },
  { time: "12:00", temp: 4.2, humidity: 82 },
];

const ClimateHistoryPopup = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
    <div
      className="bg-card rounded-2xl border border-border shadow-2xl p-6 max-w-lg w-full mx-4 animate-slide-in"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-foreground">Klimaat Historie</h2>
        <button onClick={onClose} className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-muted transition-colors">
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-xl border border-bloom-sky/30 bg-bloom-sky/5 p-3 text-center">
          <Thermometer className="w-5 h-5 text-bloom-sky mx-auto mb-1" />
          <div className="text-2xl font-mono font-black text-foreground">4.2°C</div>
          <div className="text-[9px] text-muted-foreground uppercase tracking-wider">Huidige temp</div>
        </div>
        <div className="rounded-xl border border-primary/25 bg-primary/5 p-3 text-center">
          <Droplets className="w-5 h-5 text-primary mx-auto mb-1" />
          <div className="text-2xl font-mono font-black text-foreground">82%</div>
          <div className="text-[9px] text-muted-foreground uppercase tracking-wider">Luchtvochtigheid</div>
        </div>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <div className="bg-secondary px-3 py-2 flex items-center gap-4">
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider flex-1">Tijd</span>
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider w-20 text-right">Temp</span>
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider w-20 text-right">Vocht</span>
        </div>
        {temperatureHistory.map((entry, i) => {
          const prevTemp = i > 0 ? temperatureHistory[i - 1].temp : entry.temp;
          const tempUp = entry.temp > prevTemp;
          const tempDown = entry.temp < prevTemp;
          return (
            <div key={entry.time} className="px-3 py-1.5 flex items-center gap-4 border-t border-border">
              <span className="text-xs font-mono font-bold text-foreground flex-1">{entry.time}</span>
              <div className="w-20 flex items-center justify-end gap-1">
                {tempUp && <TrendingUp className="w-2.5 h-2.5 text-destructive" />}
                {tempDown && <TrendingDown className="w-2.5 h-2.5 text-accent" />}
                <span className="text-xs font-mono font-bold text-foreground">{entry.temp}°C</span>
              </div>
              <span className="text-xs font-mono font-bold text-foreground w-20 text-right">{entry.humidity}%</span>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

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
  const [climateOpen, setClimateOpen] = useState(false);

  return (
    <>
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

          <div className="flex-1" />

          <div className="flex items-center gap-4 shrink-0">
            {/* Climate icons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setClimateOpen(true)}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg border border-bloom-sky/30 bg-bloom-sky/5 hover:bg-bloom-sky/15 transition-colors cursor-pointer"
                title="Temperatuur: 4.2°C"
              >
                <Thermometer className="w-4 h-4 text-bloom-sky" />
                <span className="text-xs font-mono font-black text-foreground">4.2°</span>
              </button>
              <button
                onClick={() => setClimateOpen(true)}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg border border-primary/25 bg-primary/5 hover:bg-primary/15 transition-colors cursor-pointer"
                title="Luchtvochtigheid: 82%"
              >
                <Droplets className="w-4 h-4 text-primary" />
                <span className="text-xs font-mono font-black text-foreground">82%</span>
              </button>
            </div>

            <div className="w-px h-10 bg-border" />

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

      {climateOpen && <ClimateHistoryPopup onClose={() => setClimateOpen(false)} />}
    </>
  );
};

export default ColdStorageHeader;

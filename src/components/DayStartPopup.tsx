import { useState, useEffect } from "react";
import { Package, Zap, Trophy, Users, TrendingUp } from "lucide-react";
import { yesterdayStats } from "@/data/mockData";

const DayStartPopup = () => {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setVisible(false), 800);
    }, 15000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  const stats = yesterdayStats;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-700 ${
      fadeOut ? "opacity-0" : "opacity-100"
    }`}>
      <div className="absolute inset-0 bg-gradient-brand opacity-95" />
      
      <div className="relative z-10 w-full max-w-3xl mx-auto px-8 text-center">
        <div className="mb-8">
          <p className="text-primary-foreground/50 text-sm uppercase tracking-[0.3em] font-medium mb-2">Hoorn Bloommasters</p>
          <h1 className="text-5xl font-black text-primary-foreground tracking-tight mb-1">HAND LINE 1</h1>
          <p className="text-xl text-primary-foreground/70 font-medium">— YESTERDAY —</p>
        </div>

        <div className="grid grid-cols-5 gap-4 mb-8">
          <div className="bg-primary-foreground/10 rounded-xl p-4 backdrop-blur-sm border border-primary-foreground/10">
            <Package className="w-6 h-6 text-primary-foreground/60 mx-auto mb-2" />
            <div className="text-3xl font-mono font-black text-primary-foreground">{stats.totalProduced.toLocaleString("en-GB")}</div>
            <div className="text-[10px] text-primary-foreground/50 uppercase tracking-wider mt-1">Total Pieces</div>
          </div>
          <div className="bg-primary-foreground/10 rounded-xl p-4 backdrop-blur-sm border border-primary-foreground/10">
            <Zap className="w-6 h-6 text-primary-foreground/60 mx-auto mb-2" />
            <div className="text-3xl font-mono font-black text-primary-foreground">{stats.avgPcsPerHour}</div>
            <div className="text-[10px] text-primary-foreground/50 uppercase tracking-wider mt-1">Avg PCS/H</div>
          </div>
          <div className="bg-primary-foreground/10 rounded-xl p-4 backdrop-blur-sm border border-primary-foreground/10">
            <Trophy className="w-6 h-6 text-primary-foreground/60 mx-auto mb-2" />
            <div className="text-3xl font-mono font-black text-primary-foreground">{stats.peakHourPcsPerHour.toLocaleString("en-GB")}</div>
            <div className="text-[10px] text-primary-foreground/50 uppercase tracking-wider mt-1">Peak Hour</div>
          </div>
          <div className="bg-primary-foreground/10 rounded-xl p-4 backdrop-blur-sm border border-primary-foreground/10">
            <Users className="w-6 h-6 text-primary-foreground/60 mx-auto mb-2" />
            <div className="text-3xl font-mono font-black text-primary-foreground">{stats.avgPeople}</div>
            <div className="text-[10px] text-primary-foreground/50 uppercase tracking-wider mt-1">Avg People</div>
          </div>
          <div className="bg-primary-foreground/10 rounded-xl p-4 backdrop-blur-sm border border-primary-foreground/10">
            <TrendingUp className="w-6 h-6 text-primary-foreground/60 mx-auto mb-2" />
            <div className="text-3xl font-mono font-black text-primary-foreground">+{stats.performanceVsPlanned - 100}%</div>
            <div className="text-[10px] text-primary-foreground/50 uppercase tracking-wider mt-1">vs Planned</div>
          </div>
        </div>

        <div className="bg-primary-foreground/8 rounded-xl px-6 py-3 inline-block mb-8 border border-primary-foreground/10">
          <span className="text-sm text-primary-foreground/50">📈 Best order: </span>
          <span className="text-sm font-bold text-primary-foreground">{stats.bestOrder}</span>
          <span className="text-sm text-primary-foreground/50"> — {stats.bestOrderPcs} pieces</span>
        </div>

        <div className="bg-primary-foreground/10 rounded-xl px-8 py-5 border border-primary-foreground/15 backdrop-blur-sm">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-primary-foreground/15 flex items-center justify-center">
              <span className="text-[10px] font-black text-primary-foreground">HB</span>
            </div>
            <span className="text-[10px] font-bold text-primary-foreground/60 uppercase tracking-wider">HBMASTER</span>
          </div>
          <p className="text-lg font-semibold text-primary-foreground leading-relaxed">
            "Yesterday +{stats.performanceVsPlanned - 100}% above planned. Strong line."
          </p>
          <p className="text-base text-primary-foreground/70 mt-1">
            "New day, new opportunities. Build strong tempo."
          </p>
        </div>
      </div>
    </div>
  );
};

export default DayStartPopup;

import { useState, useEffect } from "react";
import { Flower2, Users, Package, Zap, Sparkles } from "lucide-react";
import { dashboardStats } from "@/data/mockData";

const motivationMessages = [
  "💐 Sterk tempo vandaag!",
  "🌷 Topprestatie van het hele team!",
  "🌻 We liggen voor op schema — geweldig!",
  "🌸 Kwaliteit en snelheid — top combinatie!",
  "🌺 Samen maken we het verschil!",
];

const LiveClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-end">
      <div className="text-4xl font-mono font-bold text-foreground tracking-tight tabular-nums">
        {time.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
      </div>
      <div className="text-sm text-muted-foreground capitalize">
        {time.toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long" })}
      </div>
    </div>
  );
};

const StatPill = ({ icon, label, value, highlight }: { icon: React.ReactNode; label: string; value: string; highlight?: boolean }) => (
  <div className={`flex items-center gap-3 px-5 py-3 rounded-xl border ${highlight ? "border-accent/30 bg-accent/5" : "border-border bg-card"}`}>
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${highlight ? "bg-accent/15 text-accent" : "bg-secondary text-muted-foreground"}`}>
      {icon}
    </div>
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`text-xl font-mono font-bold ${highlight ? "text-accent text-glow-success" : "text-foreground"}`}>{value}</div>
    </div>
  </div>
);

const ProductionHeader = () => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setMsgIndex((p) => (p + 1) % motivationMessages.length), 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="flex items-center justify-between px-8 py-4">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-bloom flex items-center justify-center shadow-lg">
            <Flower2 className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Hoorn Bloom<span className="text-primary">masters</span>
            </h1>
            <p className="text-sm text-muted-foreground">Productiescherm — Dagploeg</p>
          </div>
        </div>

        {/* Stats */}
        <div className="hidden lg:flex items-center gap-3">
          <StatPill icon={<Users className="w-5 h-5" />} label="Actief" value={`${dashboardStats.totalPeople}`} />
          <StatPill icon={<Package className="w-5 h-5" />} label="Geproduceerd" value={dashboardStats.totalProduced.toLocaleString("nl-NL")} highlight />
          <StatPill icon={<Zap className="w-5 h-5" />} label="Gem. snelheid" value={`${dashboardStats.avgSpeed}/u`} />
        </div>

        {/* Motivation + Clock */}
        <div className="flex items-center gap-6">
          <div className="hidden xl:flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-bloom">
            <Sparkles className="w-4 h-4 text-primary-foreground/80" />
            <span className="text-sm font-semibold text-primary-foreground">{motivationMessages[msgIndex]}</span>
          </div>
          <LiveClock />
        </div>
      </div>

      {/* Mobile stats row */}
      <div className="flex lg:hidden items-center gap-3 px-8 pb-4 overflow-x-auto">
        <StatPill icon={<Users className="w-5 h-5" />} label="Actief" value={`${dashboardStats.totalPeople}`} />
        <StatPill icon={<Package className="w-5 h-5" />} label="Geproduceerd" value={dashboardStats.totalProduced.toLocaleString("nl-NL")} highlight />
        <StatPill icon={<Zap className="w-5 h-5" />} label="Gem. snelheid" value={`${dashboardStats.avgSpeed}/u`} />
      </div>
    </header>
  );
};

export default ProductionHeader;

import { TrendingUp, Package, Flower2, Trophy } from "lucide-react";

interface StatCard {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  highlight?: boolean;
}

const stats: StatCard[] = [
  {
    label: "Totaal geproduceerd",
    value: "1.053",
    sub: "van 1.500 doel",
    icon: <Package className="w-5 h-5" />,
    highlight: true,
  },
  {
    label: "Productiesnelheid",
    value: "545",
    sub: "stuks per uur (gem.)",
    icon: <TrendingUp className="w-5 h-5" />,
  },
  {
    label: "Productsoorten",
    value: "4",
    sub: "actieve producten",
    icon: <Flower2 className="w-5 h-5" />,
  },
  {
    label: "Best presterende",
    value: "Lijn 3",
    sub: "82% van doel bereikt",
    icon: <Trophy className="w-5 h-5" />,
  },
];

const DailyStats = () => {
  return (
    <section>
      <h2 className="text-lg font-semibold text-foreground mb-4">Vandaag in cijfers</h2>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`rounded-xl border p-5 transition-shadow duration-500 ${
              stat.highlight
                ? "border-accent/30 bg-accent/5 glow-success"
                : "border-border bg-gradient-card"
            }`}
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${
              stat.highlight ? "bg-accent/15 text-accent" : "bg-secondary text-muted-foreground"
            }`}>
              {stat.icon}
            </div>
            <div className="text-xs text-muted-foreground mb-1">{stat.label}</div>
            <div className={`text-2xl font-mono font-bold mb-0.5 animate-count-up ${
              stat.highlight ? "text-accent text-glow-success" : "text-foreground"
            }`}>
              {stat.value}
            </div>
            <div className="text-xs text-muted-foreground">{stat.sub}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DailyStats;

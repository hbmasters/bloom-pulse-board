import { Activity } from "lucide-react";
import IHSectionShell from "./IHSectionShell";
import IHMetricCard, { IHMetric } from "./IHMetricCard";

const metrics: IHMetric[] = [
  { label: "Omzet vandaag", value: "€42.8K", target: "€45K", change: "+3.2%", changeDir: "up", status: "healthy", sparkline: [38, 41, 39, 43, 40, 42, 44, 43] },
  { label: "Omzet deze week", value: "€186K", target: "€200K", change: "+5.1%", changeDir: "up", status: "warning", sparkline: [170, 175, 180, 178, 183, 186] },
  { label: "Gerealiseerde marge", value: "32.4", unit: "%", target: "35%", change: "−2.6pp", changeDir: "down", status: "warning", sparkline: [34, 33, 35, 32, 33, 31, 32, 32] },
  { label: "Marge vs target", value: "−2.6", unit: "pp", status: "warning", change: "Gap groeit", changeDir: "down" },
  { label: "Productie efficiëntie", value: "218", unit: "st/p/u", target: "220", change: "+1.4%", changeDir: "up", status: "healthy", sparkline: [210, 215, 212, 219, 216, 218] },
  { label: "Forecast betrouwbaarheid", value: "87", unit: "%", target: "90%", change: "−1.2pp", changeDir: "down", status: "healthy", sparkline: [85, 88, 86, 89, 87, 87] },
  { label: "Supply risico", value: "Laag", status: "healthy", change: "2 items", changeDir: "neutral" },
];

const IHBusinessHealth = () => (
  <IHSectionShell icon={Activity} title="Business Health" subtitle="Executive overview • Vandaag & deze week" badge="LIVE" badgeVariant="success">
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
      {metrics.map((m) => (
        <IHMetricCard key={m.label} metric={m} />
      ))}
    </div>
  </IHSectionShell>
);

export default IHBusinessHealth;

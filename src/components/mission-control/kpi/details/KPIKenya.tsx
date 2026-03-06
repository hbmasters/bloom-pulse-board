import { Globe, Factory, Truck, DollarSign } from "lucide-react";
import KPIDetailLayout from "../KPIDetailLayout";
import KPIMetricCard, { MetricData } from "../KPIMetricCard";
import { PeriodFilterState } from "../KPIPeriodFilter";

const metrics: MetricData[] = [
  { id: "revenue", title: "Omzet Kenya", value: "€420K", change: "+18.5%", changeDir: "up", status: "healthy", sparkline: [320, 340, 360, 390, 420] },
  { id: "production", title: "Productie", value: "2.8M", unit: "stelen", change: "+12.3%", changeDir: "up", status: "healthy" },
  { id: "margin", title: "Marge bijdrage", value: "€145K", change: "+22.1%", changeDir: "up", status: "healthy" },
  { id: "cost-stem", title: "Kosten/steel", value: "€0.098", target: "€0.10", change: "-2.0%", changeDir: "down", status: "healthy" },
];

const sections = [
  { icon: DollarSign, title: "Omzet", items: [
    { label: "Totaal", value: "€420K", sub: "+18.5% vs vorige periode" },
    { label: "vs Vorig jaar", value: "+24.2%", sub: "€338K → €420K" },
    { label: "Forecast realisatie", value: "108%", sub: "Boven verwachting" },
  ]},
  { icon: Factory, title: "Productie", items: [
    { label: "Stelen geproduceerd", value: "2.8M", sub: "+12.3% vs vorige periode" },
    { label: "Efficiëntie", value: "94.2%", sub: "Boven norm" },
    { label: "Uitval", value: "1.8%", sub: "Onder norm 3%" },
  ]},
  { icon: Truck, title: "Inkoop & Logistiek", items: [
    { label: "Inkoopwaarde", value: "€274K", sub: "65% van omzet" },
    { label: "Transportkosten", value: "€38K", sub: "9% van omzet" },
    { label: "Doorlooptijd", value: "3.2 dagen", sub: "Stabiel" },
  ]},
];

const KPIKenya = ({ onBack }: { onBack: () => void }) => (
  <KPIDetailLayout title="HBM Kenya Performance" subtitle="Strategische prestatiemonitor Kenya operatie" icon={Globe} onBack={onBack}>
    {(filter: PeriodFilterState) => (
      <>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map(m => <KPIMetricCard key={m.id} metric={m} />)}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {sections.map(sec => {
            const SIcon = sec.icon;
            return (
              <div key={sec.title} className="rounded-2xl border border-border/50 bg-card/50 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <SIcon className="w-4 h-4 text-primary/70" />
                  <h3 className="text-[13px] font-semibold text-foreground tracking-tight">{sec.title}</h3>
                </div>
                <div className="space-y-4">
                  {sec.items.map(item => (
                    <div key={item.label}>
                      <div className="flex justify-between text-[13px]">
                        <span className="text-muted-foreground/60">{item.label}</span>
                        <span className="font-semibold text-foreground">{item.value}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground/35 mt-0.5">{item.sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-2xl border border-border/50 bg-card/50 p-5">
          <h3 className="text-[13px] font-semibold text-foreground tracking-tight mb-4">Omzet trend per periode</h3>
          <div className="flex items-end gap-1.5 h-24">
            {[320, 330, 340, 355, 360, 375, 380, 390, 405, 420, 0, 0, 0].map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`w-full rounded-t ${i < 10 ? "bg-accent/50" : "bg-border/15"}`}
                  style={{ height: v > 0 ? `${((v - 300) / 150) * 100}%` : "4px" }}
                />
                <span className="text-[10px] text-muted-foreground/40">P{i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </>
    )}
  </KPIDetailLayout>
);

export default KPIKenya;

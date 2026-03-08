import { Brain, AlertTriangle, ArrowRight } from "lucide-react";
import IHSectionShell from "./IHSectionShell";

interface ActionItem {
  product: string;
  marginGap: string;
  rootCauses: { area: string; impact: string }[];
  actions: string[];
  priority: "high" | "medium" | "low";
}

const actionItems: ActionItem[] = [
  {
    product: "Vomar Boeket Fleur",
    marginGap: "−4.4%",
    rootCauses: [
      { area: "Inkoop", impact: "−1.6pp" },
      { area: "Productie", impact: "−1.8pp" },
      { area: "Sales", impact: "−1.0pp" },
    ],
    actions: [
      "Reserveer 40.000 stelen bij leverancier Van der Berg",
      "Verschuif productie naar lijn B2 (hogere efficiëntie)",
      "Verhoog verkoopprijs met €0.05 richting Vomar",
    ],
    priority: "high",
  },
  {
    product: "AH Boeketje Zomer",
    marginGap: "−2.1%",
    rootCauses: [
      { area: "Inkoop", impact: "−0.8pp" },
      { area: "Productie", impact: "−1.3pp" },
    ],
    actions: [
      "Wissel chrysant leverancier (Kenya Direct → Flora Holland Pool)",
      "Plan H3 onderhoud in – lijn presteert 13% onder norm",
    ],
    priority: "high",
  },
  {
    product: "Jumbo Tulpenboeket",
    marginGap: "−0.8%",
    rootCauses: [
      { area: "Productie", impact: "−0.5pp" },
      { area: "Verpakking", impact: "−0.3pp" },
    ],
    actions: [
      "Optimaliseer inpakproces – wachttijd 8 min boven norm",
      "Onderhandel verpakkingsprijs met leverancier",
    ],
    priority: "medium",
  },
];

const priorityStyles = {
  high: "border-red-500/30 bg-red-500/5",
  medium: "border-yellow-500/30 bg-yellow-500/5",
  low: "border-border bg-muted/10",
};

const priorityLabel = {
  high: { text: "URGENT", cls: "text-red-500 bg-red-500/10 border-red-500/20" },
  medium: { text: "AANDACHT", cls: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20" },
  low: { text: "MONITOR", cls: "text-muted-foreground bg-muted/20 border-border" },
};

const IHActionCenter = () => (
  <IHSectionShell icon={Brain} title="AI Action Center" subtitle="Data → Validatie → Root Cause → Aanbeveling" badge="AI POWERED" badgeVariant="default">
    <div className="space-y-4">
      {actionItems.map((item) => {
        const p = priorityLabel[item.priority];
        return (
          <div key={item.product} className={`rounded-xl border ${priorityStyles[item.priority]} p-4`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                  <span className="text-sm font-bold text-foreground">{item.product}</span>
                  <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${p.cls}`}>{p.text}</span>
                </div>
                <span className="text-[11px] font-mono text-muted-foreground">Margin gap: <span className="text-red-500 font-bold">{item.marginGap}</span></span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Root causes */}
              <div>
                <h4 className="text-[10px] font-bold text-foreground/60 uppercase tracking-wider mb-2">Root Causes</h4>
                <div className="space-y-1.5">
                  {item.rootCauses.map((rc) => (
                    <div key={rc.area} className="flex items-center gap-2 text-[11px]">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                      <span className="text-foreground/70">{rc.area}</span>
                      <span className="text-red-500 font-mono font-semibold">{rc.impact}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended actions */}
              <div>
                <h4 className="text-[10px] font-bold text-foreground/60 uppercase tracking-wider mb-2">Aanbevolen acties</h4>
                <div className="space-y-1.5">
                  {item.actions.map((a, i) => (
                    <div key={i} className="flex items-start gap-2 text-[11px]">
                      <ArrowRight className="w-3 h-3 mt-0.5 text-primary shrink-0" />
                      <span className="text-foreground/80">{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </IHSectionShell>
);

export default IHActionCenter;

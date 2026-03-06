import { ArrowLeft, LucideIcon } from "lucide-react";
import { ReactNode, useState } from "react";
import KPIPeriodFilter, { PeriodFilterState } from "./KPIPeriodFilter";

interface Props {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  onBack: () => void;
  children: (filter: PeriodFilterState) => ReactNode;
}

const KPIDetailLayout = ({ title, subtitle, icon: Icon, onBack, children }: Props) => {
  const [filter, setFilter] = useState<PeriodFilterState>({
    year: new Date().getFullYear(),
    period: Math.ceil((new Date().getMonth() + 1) / (12 / 13)),
    comparison: "previous",
  });

  return (
    <div className="flex flex-col h-full p-3 md:p-4 overflow-hidden">
      <div className="flex items-center gap-3 mb-3">
        <button onClick={onBack} className="p-1.5 rounded-lg border border-border hover:bg-card transition-colors">
          <ArrowLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <Icon className="w-4 h-4 text-primary" />
        <div>
          <h2 className="text-xs font-black text-foreground uppercase tracking-wider">{title}</h2>
          <p className="text-[9px] font-mono text-muted-foreground">{subtitle}</p>
        </div>
      </div>

      <KPIPeriodFilter value={filter} onChange={setFilter} />

      <div className="flex-1 min-h-0 overflow-y-auto mt-3 space-y-4">
        {children(filter)}
      </div>
    </div>
  );
};

export default KPIDetailLayout;

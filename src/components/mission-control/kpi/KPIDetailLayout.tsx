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
    <div className="flex flex-col h-full p-4 md:p-6 overflow-hidden">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="p-2 rounded-xl border border-border hover:bg-card transition-colors">
          <ArrowLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <Icon className="w-5 h-5 text-primary/70" />
        <div>
          <h2 className="text-base font-bold text-foreground tracking-tight">{title}</h2>
          <p className="text-[12px] text-muted-foreground/60">{subtitle}</p>
        </div>
      </div>

      <KPIPeriodFilter value={filter} onChange={setFilter} />

      <div className="flex-1 min-h-0 overflow-y-auto mt-4 space-y-5">
        {children(filter)}
      </div>
    </div>
  );
};

export default KPIDetailLayout;

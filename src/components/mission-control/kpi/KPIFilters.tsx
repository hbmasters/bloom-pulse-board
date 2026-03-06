import { useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";

export type TimeFilter = "day" | "week" | "month" | "custom";

interface KPIFiltersProps {
  selected: TimeFilter;
  onSelect: (f: TimeFilter) => void;
  comparison: boolean;
  onComparisonToggle: () => void;
}

const filters: { key: TimeFilter; label: string }[] = [
  { key: "day", label: "Dag" },
  { key: "week", label: "Week" },
  { key: "month", label: "Maand" },
  { key: "custom", label: "Aangepast" },
];

const KPIFilters = ({ selected, onSelect, comparison, onComparisonToggle }: KPIFiltersProps) => {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {filters.map(f => (
        <button
          key={f.key}
          onClick={() => onSelect(f.key)}
          className={`text-[10px] font-mono font-bold px-3 py-1.5 rounded-lg border transition-all ${
            selected === f.key
              ? "bg-primary/15 text-primary border-primary/30"
              : "bg-card text-muted-foreground border-border hover:border-primary/20"
          }`}
        >
          {f.key === "custom" && <Calendar className="w-3 h-3 inline mr-1" />}
          {f.label}
        </button>
      ))}
      <div className="h-4 w-px bg-border mx-1" />
      <button
        onClick={onComparisonToggle}
        className={`text-[10px] font-mono font-bold px-3 py-1.5 rounded-lg border transition-all ${
          comparison
            ? "bg-accent/15 text-accent border-accent/30"
            : "bg-card text-muted-foreground border-border hover:border-accent/20"
        }`}
      >
        📊 Vergelijking
      </button>
    </div>
  );
};

export default KPIFilters;

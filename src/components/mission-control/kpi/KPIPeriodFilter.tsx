import { useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";

export type TimeFilter = "day" | "week" | "month" | "custom";

export interface PeriodFilterState {
  year: number;
  period: number;
  comparison: "previous" | "lastYear" | "forecast" | null;
}

interface KPIPeriodFilterProps {
  value: PeriodFilterState;
  onChange: (v: PeriodFilterState) => void;
}

const currentYear = new Date().getFullYear();
const years = [currentYear - 1, currentYear, currentYear + 1];
const periods = Array.from({ length: 13 }, (_, i) => i + 1);

const comparisons = [
  { key: "previous" as const, label: "vs Vorige periode" },
  { key: "lastYear" as const, label: "vs Vorig jaar" },
  { key: "forecast" as const, label: "vs Forecast" },
];

const KPIPeriodFilter = ({ value, onChange }: KPIPeriodFilterProps) => {
  return (
    <div className="flex items-center gap-2.5 flex-wrap">
      {/* Year */}
      <div className="relative">
        <select
          value={value.year}
          onChange={e => onChange({ ...value, year: Number(e.target.value) })}
          className="appearance-none text-[12px] font-medium px-3 py-2 pr-7 rounded-xl border border-border bg-card text-foreground cursor-pointer hover:border-primary/30 transition-colors"
        >
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
      </div>

      {/* Period */}
      <div className="flex items-center gap-1">
        <Calendar className="w-3.5 h-3.5 text-muted-foreground/50 mr-1" />
        {periods.map(p => (
          <button
            key={p}
            onClick={() => onChange({ ...value, period: p })}
            className={`text-[11px] font-medium w-7 h-7 rounded-lg border transition-all ${
              value.period === p
                ? "bg-primary/15 text-primary border-primary/30 font-semibold"
                : "bg-transparent text-muted-foreground/60 border-transparent hover:border-border hover:text-foreground"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="h-5 w-px bg-border/50 mx-1" />

      {/* Comparison */}
      {comparisons.map(c => (
        <button
          key={c.key}
          onClick={() => onChange({ ...value, comparison: value.comparison === c.key ? null : c.key })}
          className={`text-[11px] font-medium px-3 py-1.5 rounded-xl border transition-all ${
            value.comparison === c.key
              ? "bg-accent/10 text-accent border-accent/25 font-semibold"
              : "bg-transparent text-muted-foreground/50 border-border hover:border-accent/20 hover:text-foreground"
          }`}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
};

export default KPIPeriodFilter;

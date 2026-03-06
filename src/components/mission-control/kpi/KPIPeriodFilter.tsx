import { useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";

export interface PeriodFilterState {
  year: number;
  period: number;
  comparison: "previous" | "lastYear" | "forecast" | null;
}

interface Props {
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

const KPIPeriodFilter = ({ value, onChange }: Props) => {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Year */}
      <div className="relative">
        <select
          value={value.year}
          onChange={e => onChange({ ...value, year: Number(e.target.value) })}
          className="appearance-none text-[10px] font-mono font-bold px-3 py-1.5 pr-7 rounded-lg border border-border bg-card text-foreground cursor-pointer hover:border-primary/30 transition-colors"
        >
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
      </div>

      {/* Period */}
      <div className="flex items-center gap-0.5">
        <Calendar className="w-3 h-3 text-muted-foreground mr-1" />
        {periods.map(p => (
          <button
            key={p}
            onClick={() => onChange({ ...value, period: p })}
            className={`text-[9px] font-mono font-bold w-6 h-6 rounded-md border transition-all ${
              value.period === p
                ? "bg-primary/15 text-primary border-primary/30"
                : "bg-card text-muted-foreground border-transparent hover:border-border"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="h-4 w-px bg-border mx-1" />

      {/* Comparison */}
      {comparisons.map(c => (
        <button
          key={c.key}
          onClick={() => onChange({ ...value, comparison: value.comparison === c.key ? null : c.key })}
          className={`text-[9px] font-mono font-bold px-2.5 py-1.5 rounded-lg border transition-all ${
            value.comparison === c.key
              ? "bg-accent/15 text-accent border-accent/30"
              : "bg-card text-muted-foreground border-border hover:border-accent/20"
          }`}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
};

export default KPIPeriodFilter;

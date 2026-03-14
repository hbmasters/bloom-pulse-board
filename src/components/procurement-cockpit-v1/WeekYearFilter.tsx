import { Calendar, ChevronDown } from "lucide-react";

export interface WeekYearFilterState {
  year: number;
  week: number | null;
}

interface WeekYearFilterProps {
  value: WeekYearFilterState;
  onChange: (v: WeekYearFilterState) => void;
  maxWeeks?: number;
}

const currentYear = new Date().getFullYear();
const years = [currentYear - 1, currentYear, currentYear + 1];

const WeekYearFilter = ({ value, onChange, maxWeeks = 52 }: WeekYearFilterProps) => {
  // Show weeks in groups of 13 (quarters)
  const quarters = [
    { label: "Q1", weeks: Array.from({ length: 13 }, (_, i) => i + 1) },
    { label: "Q2", weeks: Array.from({ length: 13 }, (_, i) => i + 14) },
    { label: "Q3", weeks: Array.from({ length: 13 }, (_, i) => i + 27) },
    { label: "Q4", weeks: Array.from({ length: 13 }, (_, i) => i + 40) },
  ];

  return (
    <div className="flex items-center gap-2.5 flex-wrap">
      {/* Year selector */}
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

      <div className="h-5 w-px bg-border/50" />

      {/* Quarter quick-select */}
      <Calendar className="w-3.5 h-3.5 text-muted-foreground/50" />
      {quarters.map(q => {
        const firstWeek = q.weeks[0];
        const lastWeek = q.weeks[q.weeks.length - 1];
        const isActive = value.week !== null && value.week >= firstWeek && value.week <= lastWeek;
        return (
          <button
            key={q.label}
            onClick={() => onChange({ ...value, week: isActive ? null : firstWeek })}
            className={`text-[11px] font-medium px-3 py-1.5 rounded-xl border transition-all ${
              isActive
                ? "bg-primary/15 text-primary border-primary/30 font-semibold"
                : "bg-transparent text-muted-foreground/50 border-border hover:border-primary/20 hover:text-foreground"
            }`}
          >
            {q.label}
          </button>
        );
      })}

      <div className="h-5 w-px bg-border/50" />

      {/* Specific week */}
      <div className="relative">
        <select
          value={value.week ?? ""}
          onChange={e => onChange({ ...value, week: e.target.value ? Number(e.target.value) : null })}
          className="appearance-none text-[12px] font-medium px-3 py-2 pr-7 rounded-xl border border-border bg-card text-foreground cursor-pointer hover:border-primary/30 transition-colors"
        >
          <option value="">Alle weken</option>
          {Array.from({ length: maxWeeks }, (_, i) => i + 1).map(w => (
            <option key={w} value={w}>Week {w}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
      </div>
    </div>
  );
};

export default WeekYearFilter;
export type { WeekYearFilterState };

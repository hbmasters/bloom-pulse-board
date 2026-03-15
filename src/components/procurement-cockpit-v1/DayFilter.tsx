import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DayFilterProps {
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
  onDateFromChange: (d: Date | undefined) => void;
  onDateToChange: (d: Date | undefined) => void;
}

const DayFilter = ({ dateFrom, dateTo, onDateFromChange, onDateToChange }: DayFilterProps) => {
  const DateBtn = ({ value, onChange, label }: { value: Date | undefined; onChange: (d: Date | undefined) => void; label: string }) => (
    <Popover>
      <PopoverTrigger asChild>
        <button className={cn(
          "flex items-center gap-1.5 text-[11px] font-medium px-3 py-2 rounded-xl border transition-colors",
          value
            ? "bg-primary/15 text-primary border-primary/30 font-semibold"
            : "bg-transparent text-muted-foreground/50 border-border hover:border-primary/20 hover:text-foreground"
        )}>
          <CalendarIcon className="w-3.5 h-3.5" />
          {value ? format(value, "d MMM yyyy", { locale: nl }) : label}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={value} onSelect={onChange} initialFocus className="p-3 pointer-events-auto" />
      </PopoverContent>
    </Popover>
  );

  return (
    <div className="flex items-center gap-2.5 flex-wrap justify-end ml-auto">
      <CalendarIcon className="w-3.5 h-3.5 text-muted-foreground/50" />
      <DateBtn value={dateFrom} onChange={onDateFromChange} label="Van" />
      <span className="text-[11px] text-muted-foreground/50">t/m</span>
      <DateBtn value={dateTo} onChange={onDateToChange} label="Tot" />
    </div>
  );
};

export default DayFilter;

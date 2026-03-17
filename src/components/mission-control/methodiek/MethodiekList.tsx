import { cn } from "@/lib/utils";
import { FlaskConical, CheckCircle2, PauseCircle, Hash, Target, Search } from "lucide-react";
import type { Methodiek, AnalysisKind } from "./methodiek-types";

const kindLabels: Record<AnalysisKind, string> = {
  mapping: "Mapping", margin: "Marge", procurement: "Inkoop",
  production: "Productie", logistics: "Logistiek", quality: "Kwaliteit", general: "Algemeen",
};

const kindColors: Record<AnalysisKind, string> = {
  mapping: "text-blue-400", margin: "text-amber-400", procurement: "text-rose-400",
  production: "text-primary", logistics: "text-cyan-400", quality: "text-emerald-400", general: "text-muted-foreground",
};

interface Props {
  methodieken: Methodiek[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const MethodiekList = ({ methodieken, selectedId, onSelect, searchQuery, onSearchChange }: Props) => {
  return (
    <div className="flex flex-col h-full border-r border-border bg-card/30">
      {/* Search */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/40" />
          <input
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Zoek methodiek..."
            className="w-full pl-8 pr-3 py-2 text-xs bg-muted/20 border border-border rounded-lg text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/40"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {methodieken.map(m => (
          <button
            key={m.id}
            onClick={() => onSelect(m.id)}
            className={cn(
              "w-full text-left px-3 py-3 border-b border-border/40 transition-colors",
              selectedId === m.id ? "bg-primary/8 border-l-2 border-l-primary" : "hover:bg-muted/10 border-l-2 border-l-transparent"
            )}
          >
            <div className="flex items-center gap-2 mb-1">
              <FlaskConical className={cn("w-3.5 h-3.5", kindColors[m.analysis_kind])} />
              <span className="text-xs font-semibold text-foreground truncate">{m.name}</span>
            </div>
            <div className="flex items-center gap-2 pl-5.5">
              <span className={cn("text-[9px] font-mono px-1.5 py-0.5 rounded-full border", kindColors[m.analysis_kind], "border-current/20 bg-current/5")}>
                {kindLabels[m.analysis_kind]}
              </span>
              <span className="text-[9px] font-mono text-muted-foreground/50">{m.version}</span>
              {m.status === "active" ? (
                <CheckCircle2 className="w-3 h-3 text-emerald-400 ml-auto" />
              ) : (
                <PauseCircle className="w-3 h-3 text-muted-foreground/40 ml-auto" />
              )}
            </div>
            <div className="flex items-center gap-3 mt-1.5 pl-5.5">
              <span className="text-[9px] font-mono text-muted-foreground/40 flex items-center gap-1">
                <Hash className="w-2.5 h-2.5" />{m.total_runs.toLocaleString("nl-NL")}x
              </span>
              {m.accuracy && (
                <span className="text-[9px] font-mono text-muted-foreground/40 flex items-center gap-1">
                  <Target className="w-2.5 h-2.5" />{Math.round(m.accuracy * 100)}%
                </span>
              )}
              <span className="text-[9px] font-mono text-muted-foreground/30 ml-auto">{m.updated_at}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MethodiekList;

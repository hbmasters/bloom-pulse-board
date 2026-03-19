/**
 * HBM FuzzyMatchCard
 *
 * Shown when no exact source match is found.
 * Displays up to 3 suggestions and requires user to confirm.
 */

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FuzzyMatchSuggestion } from "./verified-response-types";

interface Props {
  suggestions: FuzzyMatchSuggestion[];
  refineHints?: string[];
}

const FuzzyMatchCard = ({ suggestions, refineHints }: Props) => {
  const limited = suggestions.slice(0, 3);

  return (
    <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 px-3 py-2.5 space-y-2">
      <div className="flex items-center gap-1.5">
        <Search className="w-3 h-3 text-yellow-500" />
        <span className="text-[10px] font-semibold text-yellow-600">Mogelijke matches, nog niet bevestigd</span>
      </div>

      <div className="space-y-1">
        {limited.map((s, i) => (
          <div key={i} className="flex items-center gap-2 rounded-md border border-border bg-card px-2.5 py-1.5 text-[10px]">
            <span className="w-4 h-4 rounded-full bg-muted text-muted-foreground text-[9px] flex items-center justify-center font-mono shrink-0">
              {i + 1}
            </span>
            <span className="font-medium text-foreground">{s.label}</span>
            {s.source && (
              <span className="text-[8px] text-muted-foreground font-mono ml-auto">{s.source}</span>
            )}
            {s.record_id && (
              <span className="text-[8px] text-muted-foreground/60 font-mono">{s.record_id}</span>
            )}
          </div>
        ))}
      </div>

      <p className="text-[9px] text-muted-foreground leading-relaxed">
        Geen exacte bronmatch gevonden. Kies een match of gebruik artikelcode/ordernummer.
      </p>

      {refineHints && refineHints.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {refineHints.map((h, i) => (
            <span key={i} className="text-[9px] font-medium px-2 py-0.5 rounded border border-border bg-card text-muted-foreground">
              {h}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default FuzzyMatchCard;

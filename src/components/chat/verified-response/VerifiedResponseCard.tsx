/**
 * HBM VerifiedResponseCard
 *
 * Fixed-structure response card enforcing source-based transparency.
 * Structure: [Status] → [Answer] → [Sources] → [Missing] → [DataQuality]
 */

import { useState } from "react";
import { ChevronDown, ChevronUp, Database, AlertCircle, Shield, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  type VerifiedResponseData,
  VERIFICATION_CONFIG,
  MATCH_LABELS,
  TIMELINESS_LABELS,
  RELIABILITY_LABELS,
} from "./verified-response-types";
import SourceVerifiedTable from "./SourceVerifiedTable";
import FuzzyMatchCard from "./FuzzyMatchCard";

interface Props {
  data: VerifiedResponseData;
}

const VerifiedResponseCard = ({ data }: Props) => {
  const [showQuality, setShowQuality] = useState(false);
  const status = VERIFICATION_CONFIG[data.status];
  const hasMissing = data.missing && data.missing.length > 0;
  const hasSources = data.sources && data.sources.length > 0;
  const hasTable = data.table && data.table.rows.length > 0;
  const hasFuzzy = data.fuzzy_matches && data.fuzzy_matches.length > 0;
  const isUnconfirmed = data.status === "unconfirmed";

  return (
    <div className="space-y-2">
      {/* ── Status badge ── */}
      <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-lg border", status.bg, status.border)}>
        <span className={cn("text-sm font-bold", status.color)}>{status.icon}</span>
        <div className="flex-1 min-w-0">
          <span className={cn("text-[11px] font-semibold", status.color)}>{status.label}</span>
          <span className="text-[9px] text-muted-foreground ml-2">{status.sublabel}</span>
        </div>
      </div>

      {/* ── Answer ── */}
      <div className="px-0.5">
        <div className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Antwoord</div>
        <p className="text-[12px] text-foreground leading-relaxed">{data.answer}</p>
      </div>

      {/* ── Fuzzy matches (if unconfirmed) ── */}
      {hasFuzzy && <FuzzyMatchCard suggestions={data.fuzzy_matches!} refineHints={data.refine_suggestions} />}

      {/* ── Table (only for confirmed/partial) ── */}
      {hasTable && !isUnconfirmed && (
        <SourceVerifiedTable columns={data.table!.columns} rows={data.table!.rows} />
      )}

      {/* ── Sources ── */}
      <div className="px-0.5">
        <div className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
          <Database className="w-3 h-3" />
          Bronnen
        </div>
        {hasSources ? (
          <div className="space-y-1.5">
            {data.sources.map((src, i) => (
              <div key={i} className="flex items-start gap-2 rounded-md border border-border bg-muted/20 px-2.5 py-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0 text-[10px]">
                  <span className="font-semibold text-foreground">{src.name}</span>
                  <div className="text-muted-foreground mt-0.5">
                    <span>Match op: <span className="font-mono text-foreground/80">{src.match_on}</span></span>
                  </div>
                  <div className="text-muted-foreground">
                    <span>Peildatum: <span className="font-mono text-foreground/60">{src.timestamp}</span></span>
                  </div>
                  {src.table && (
                    <div className="text-muted-foreground/60 mt-0.5">
                      Tabel: <span className="font-mono">{src.table}</span>
                      {src.record_id && <> · Record: <span className="font-mono">{src.record_id}</span></>}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-[10px] text-muted-foreground italic rounded-md border border-border bg-muted/10 px-2.5 py-2">
            Geen bevestigde bronmatch gevonden.
          </div>
        )}
      </div>

      {/* ── Missing data ── */}
      {hasMissing && (
        <div className="px-0.5">
          <div className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <AlertCircle className="w-3 h-3 text-yellow-500" />
            Ontbreekt nog
          </div>
          <div className="space-y-1">
            {data.missing!.map((m, i) => (
              <div key={i} className="flex items-start gap-2 text-[10px] rounded-md border border-yellow-500/15 bg-yellow-500/5 px-2.5 py-1.5">
                <span className="text-yellow-500 font-mono shrink-0">—</span>
                <div>
                  <span className="font-medium text-foreground">{m.field}</span>
                  {m.reason && <span className="text-muted-foreground ml-1.5">({m.reason})</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Refine suggestions (for unconfirmed) ── */}
      {isUnconfirmed && data.refine_suggestions && data.refine_suggestions.length > 0 && !hasFuzzy && (
        <div className="px-0.5">
          <div className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Search className="w-3 h-3" />
            Verfijn zoekopdracht
          </div>
          <div className="flex flex-wrap gap-1.5">
            {data.refine_suggestions.map((s, i) => (
              <span key={i} className="text-[10px] font-medium px-2 py-1 rounded-md border border-border bg-muted/30 text-muted-foreground">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Data quality (collapsible) ── */}
      {data.data_quality && (
        <div className="px-0.5">
          <button
            onClick={() => setShowQuality(!showQuality)}
            className="flex items-center gap-1.5 text-[9px] font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
          >
            <Shield className="w-3 h-3" />
            Datakwaliteit
            {showQuality ? <ChevronUp className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />}
          </button>
          {showQuality && (
            <div className="mt-1.5 grid grid-cols-3 gap-2 text-[10px] rounded-md border border-border bg-muted/10 px-2.5 py-2">
              <div>
                <span className="text-muted-foreground block">Bronmatch</span>
                <span className={cn("font-semibold", MATCH_LABELS[data.data_quality.match].color)}>
                  {MATCH_LABELS[data.data_quality.match].label}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block">Tijdigheid</span>
                <span className={cn("font-semibold", TIMELINESS_LABELS[data.data_quality.timeliness].color)}>
                  {TIMELINESS_LABELS[data.data_quality.timeliness].label}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block">Betrouwbaarheid</span>
                <span className={cn("font-semibold", RELIABILITY_LABELS[data.data_quality.reliability].color)}>
                  {RELIABILITY_LABELS[data.data_quality.reliability].label}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VerifiedResponseCard;

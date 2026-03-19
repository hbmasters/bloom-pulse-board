/**
 * HBM SourceVerifiedTable
 *
 * Operational data table where every row carries a source badge.
 * Only confirmed records are shown as factual.
 */

import { cn } from "@/lib/utils";
import type { VerifiedTableColumn, VerifiedTableRow } from "./verified-response-types";

interface Props {
  columns: VerifiedTableColumn[];
  rows: VerifiedTableRow[];
}

const SOURCE_COLORS: Record<string, string> = {
  "HBM Production": "text-primary bg-primary/8 border-primary/20",
  "Floritrack": "text-blue-500 bg-blue-500/8 border-blue-500/20",
  "Axerrio": "text-purple-500 bg-purple-500/8 border-purple-500/20",
  "Business Central": "text-orange-500 bg-orange-500/8 border-orange-500/20",
};

const SourceVerifiedTable = ({ columns, rows }: Props) => {
  const confirmedRows = rows.filter(r => r.confirmed);
  const unconfirmedCount = rows.length - confirmedRows.length;

  return (
    <div className="space-y-1.5">
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-[10px]">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {columns.map(col => (
                <th key={col.key} className={cn(
                  "px-2 py-2 font-medium text-muted-foreground whitespace-nowrap",
                  col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"
                )}>
                  {col.label}
                </th>
              ))}
              <th className="px-2 py-2 font-medium text-muted-foreground text-left whitespace-nowrap">Bron</th>
            </tr>
          </thead>
          <tbody>
            {confirmedRows.map((row, i) => {
              const srcColor = SOURCE_COLORS[row.source] || "text-muted-foreground bg-muted border-border";
              return (
                <tr key={i} className="border-b border-border/30 hover:bg-muted/10 transition-colors">
                  {columns.map(col => (
                    <td key={col.key} className={cn(
                      "px-2 py-1.5",
                      col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left",
                      col.mono ? "font-mono" : "",
                      row.data[col.key] == null ? "text-muted-foreground/30" : "text-foreground"
                    )}>
                      {row.data[col.key] != null ? String(row.data[col.key]) : "—"}
                    </td>
                  ))}
                  <td className="px-2 py-1.5">
                    <span className={cn("text-[8px] font-medium px-1.5 py-0.5 rounded border whitespace-nowrap", srcColor)}>
                      {row.source}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {unconfirmedCount > 0 && (
        <div className="text-[9px] text-muted-foreground italic px-1">
          {unconfirmedCount} record{unconfirmedCount > 1 ? "s" : ""} niet getoond — bron niet bevestigd.
        </div>
      )}
    </div>
  );
};

export default SourceVerifiedTable;

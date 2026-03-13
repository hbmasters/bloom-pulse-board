import { useState, useMemo, useCallback, Fragment } from "react";
import {
  Upload, FileText, CheckCircle2, AlertTriangle, XCircle,
  Package, Search, ChevronDown, ChevronRight, ArrowUpDown,
  RotateCcw, X, TrendingDown, Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import IHSectionShell from "@/components/intelligence-hub/IHSectionShell";
import {
  parseInkooplijst,
  parseVoorraadlijst,
  matchLists,
  type InkoopRow,
  type VoorraadRow,
  type MatchedLine,
} from "./csv-parsers";

const fmt = (n: number) => n.toLocaleString("nl-NL");
const fmtPrice = (n: number) => `€${n.toFixed(3).replace(".", ",")}`;

const statusConfig = {
  gedekt: { label: "Gedekt", icon: CheckCircle2, color: "text-accent", bg: "bg-accent/10 border-accent/20" },
  deels_gedekt: { label: "Deels gedekt", icon: AlertTriangle, color: "text-yellow-500", bg: "bg-yellow-500/10 border-yellow-500/20" },
  niet_gedekt: { label: "Niet gedekt", icon: XCircle, color: "text-destructive", bg: "bg-destructive/10 border-destructive/20" },
  overschot: { label: "Overschot", icon: Package, color: "text-muted-foreground", bg: "bg-muted/50 border-border" },
};

const kleurLabels: Record<string, string> = {
  PA: "Pastel", WI: "Wit", RZ: "Roze", LI: "Lila", DV: "Divers",
  ZA: "Zalm", GE: "Geel", RO: "Rood", OR: "Oranje", GR: "Groen",
  BL: "Blauw", CR: "Crème",
};

type SortKey = "soort" | "artikel" | "behoefte" | "voorraad" | "benodigd" | "status";
type StatusFilter = MatchedLine["status"] | null;

const BehoesteVsVoorraad = () => {
  const [inkoopFile, setInkoopFile] = useState<File | null>(null);
  const [voorraadFile, setVoorraadFile] = useState<File | null>(null);
  const [inkoopRows, setInkoopRows] = useState<InkoopRow[]>([]);
  const [voorraadRows, setVoorraadRows] = useState<VoorraadRow[]>([]);
  const [matched, setMatched] = useState<MatchedLine[]>([]);
  const [isProcessed, setIsProcessed] = useState(false);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [soortFilter, setSoortFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(null);
  const [sortKey, setSortKey] = useState<SortKey>("status");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const handleFileUpload = useCallback(async (file: File, type: "inkoop" | "voorraad") => {
    const text = await file.text();
    if (type === "inkoop") {
      setInkoopFile(file);
      const rows = parseInkooplijst(text);
      setInkoopRows(rows);
    } else {
      setVoorraadFile(file);
      const rows = parseVoorraadlijst(text);
      setVoorraadRows(rows);
    }
    setIsProcessed(false);
  }, []);

  const processMatch = useCallback(() => {
    if (inkoopRows.length === 0 || voorraadRows.length === 0) return;
    const results = matchLists(inkoopRows, voorraadRows);
    setMatched(results);
    setIsProcessed(true);
  }, [inkoopRows, voorraadRows]);

  const soorten = useMemo(() => [...new Set(matched.map(m => m.soort))].sort(), [matched]);

  const filtered = useMemo(() => {
    let list = matched;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(m => m.artikel.toLowerCase().includes(q) || m.soort.toLowerCase().includes(q));
    }
    if (soortFilter) list = list.filter(m => m.soort === soortFilter);
    if (statusFilter) list = list.filter(m => m.status === statusFilter);

    const statusOrder: Record<string, number> = { niet_gedekt: 0, deels_gedekt: 1, gedekt: 2, overschot: 3 };
    list = [...list].sort((a, b) => {
      if (sortKey === "status") {
        const diff = (statusOrder[a.status] ?? 9) - (statusOrder[b.status] ?? 9);
        return sortDir === "asc" ? diff : -diff;
      }
      const av = a[sortKey], bv = b[sortKey];
      if (typeof av === "number" && typeof bv === "number") return sortDir === "asc" ? av - bv : bv - av;
      return sortDir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
    return list;
  }, [matched, search, soortFilter, statusFilter, sortKey, sortDir]);

  const totals = useMemo(() => {
    if (!matched.length) return null;
    return {
      totalBehoefte: matched.reduce((s, m) => s + m.behoefte, 0),
      totalVoorraad: matched.reduce((s, m) => s + m.voorraad, 0),
      totalBenodigd: matched.reduce((s, m) => s + m.benodigd, 0),
      gedekt: matched.filter(m => m.status === "gedekt").length,
      deelsGedekt: matched.filter(m => m.status === "deels_gedekt").length,
      nietGedekt: matched.filter(m => m.status === "niet_gedekt").length,
      overschot: matched.filter(m => m.status === "overschot").length,
    };
  }, [matched]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir(key === "behoefte" || key === "voorraad" || key === "benodigd" ? "desc" : "asc"); }
  };

  const reset = () => {
    setInkoopFile(null);
    setVoorraadFile(null);
    setInkoopRows([]);
    setVoorraadRows([]);
    setMatched([]);
    setIsProcessed(false);
    setSearch("");
    setSoortFilter(null);
    setStatusFilter(null);
  };

  const DropZone = ({ label, file, type }: { label: string; file: File | null; type: "inkoop" | "voorraad" }) => (
    <label className={cn(
      "flex flex-col items-center justify-center gap-2 p-5 rounded-xl border-2 border-dashed cursor-pointer transition-all",
      file ? "border-accent/30 bg-accent/5" : "border-border hover:border-primary/30 hover:bg-muted/30"
    )}>
      <input
        type="file"
        accept=".csv"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFileUpload(f, type);
        }}
      />
      {file ? (
        <>
          <CheckCircle2 className="w-5 h-5 text-accent" />
          <span className="text-[11px] font-medium text-foreground">{file.name}</span>
          <span className="text-[9px] text-muted-foreground">{type === "inkoop" ? inkoopRows.length : voorraadRows.length} regels geladen</span>
        </>
      ) : (
        <>
          <Upload className="w-5 h-5 text-muted-foreground" />
          <span className="text-[11px] font-medium text-foreground">{label}</span>
          <span className="text-[9px] text-muted-foreground">Sleep CSV of klik om te uploaden</span>
        </>
      )}
    </label>
  );

  return (
    <div className="space-y-4">
      {/* Upload area */}
      <IHSectionShell icon={FileText} title="Behoefte vs Voorraad" subtitle="Upload inkooplijst en voorraadlijst om te matchen" badge={isProcessed ? `${matched.length} matches` : undefined}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <DropZone label="Inkooplijst (.csv)" file={inkoopFile} type="inkoop" />
          <DropZone label="Voorraadlijst (.csv)" file={voorraadFile} type="voorraad" />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={processMatch}
            disabled={inkoopRows.length === 0 || voorraadRows.length === 0}
            className={cn(
              "text-[11px] font-semibold px-4 py-2 rounded-lg border transition-all",
              inkoopRows.length > 0 && voorraadRows.length > 0
                ? "bg-primary/10 text-primary border-primary/25 hover:bg-primary/20"
                : "bg-muted text-muted-foreground border-border cursor-not-allowed"
            )}
          >
            Vergelijk & Afstrepen
          </button>
          {isProcessed && (
            <button onClick={reset} className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors">
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          )}
        </div>
      </IHSectionShell>

      {/* KPI summary */}
      {totals && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: "Totaal behoefte", value: fmt(totals.totalBehoefte), icon: Package },
            { label: "Totaal voorraad", value: fmt(totals.totalVoorraad), icon: CheckCircle2 },
            { label: "Nog nodig", value: fmt(totals.totalBenodigd), icon: AlertTriangle, highlight: totals.totalBenodigd > 0 },
            { label: "Gedekt", value: `${totals.gedekt}`, icon: CheckCircle2, variant: "success" as const },
            { label: "Deels gedekt", value: `${totals.deelsGedekt}`, icon: AlertTriangle, variant: "warning" as const },
            { label: "Niet gedekt", value: `${totals.nietGedekt}`, icon: XCircle, variant: "critical" as const },
          ].map(k => (
            <div key={k.label} className={cn("rounded-xl border border-border bg-card p-3 flex flex-col gap-1", k.highlight && "ring-1 ring-destructive/20")}>
              <div className="flex items-center gap-1.5">
                <k.icon className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-wide">{k.label}</span>
              </div>
              <span className={cn(
                "text-lg font-bold font-mono",
                k.variant === "critical" ? "text-destructive" : k.variant === "success" ? "text-accent" : k.variant === "warning" ? "text-yellow-500" : "text-foreground"
              )}>{k.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Results table */}
      {isProcessed && matched.length > 0 && (
        <IHSectionShell icon={TrendingDown} title="Afstreepoverzicht" subtitle="Behoefte vs beschikbare voorraad per artikel" badge={`${filtered.length}`}>
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <div className="relative flex-1 min-w-[140px] max-w-xs">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Zoek artikel..." className="w-full pl-8 pr-3 py-1.5 text-[11px] rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <select value={soortFilter || ""} onChange={e => setSoortFilter(e.target.value || null)} className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground cursor-pointer">
              <option value="">Alle soorten</option>
              {soorten.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <div className="flex gap-1">
              {(["niet_gedekt", "deels_gedekt", "gedekt", "overschot"] as const).map(s => {
                const cfg = statusConfig[s];
                return (
                  <button key={s} onClick={() => setStatusFilter(statusFilter === s ? null : s)} className={cn("text-[10px] px-2.5 py-1.5 rounded-lg border transition-colors font-medium", statusFilter === s ? cfg.bg : "border-border text-muted-foreground hover:bg-muted")}>
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto -mx-5">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-2 py-2.5 w-6"></th>
                  <th className="px-3 py-2.5 text-left font-medium text-muted-foreground cursor-pointer hover:text-foreground" onClick={() => toggleSort("status")}>
                    <span className="inline-flex items-center gap-0.5">Status {sortKey === "status" && <ArrowUpDown className="w-3 h-3" />}</span>
                  </th>
                  <th className="px-3 py-2.5 text-left font-medium text-muted-foreground cursor-pointer hover:text-foreground" onClick={() => toggleSort("soort")}>
                    <span className="inline-flex items-center gap-0.5">Soort {sortKey === "soort" && <ArrowUpDown className="w-3 h-3" />}</span>
                  </th>
                  <th className="px-3 py-2.5 text-left font-medium text-muted-foreground cursor-pointer hover:text-foreground" onClick={() => toggleSort("artikel")}>
                    <span className="inline-flex items-center gap-0.5">Artikel {sortKey === "artikel" && <ArrowUpDown className="w-3 h-3" />}</span>
                  </th>
                  <th className="px-3 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap">Lengte</th>
                  <th className="px-3 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap">Kleur</th>
                  <th className="px-3 py-2.5 text-right font-medium text-muted-foreground cursor-pointer hover:text-foreground" onClick={() => toggleSort("behoefte")}>
                    <span className="inline-flex items-center gap-0.5">Behoefte {sortKey === "behoefte" && <ArrowUpDown className="w-3 h-3" />}</span>
                  </th>
                  <th className="px-3 py-2.5 text-right font-medium text-muted-foreground cursor-pointer hover:text-foreground" onClick={() => toggleSort("voorraad")}>
                    <span className="inline-flex items-center gap-0.5">Voorraad {sortKey === "voorraad" && <ArrowUpDown className="w-3 h-3" />}</span>
                  </th>
                  <th className="px-3 py-2.5 text-right font-medium text-muted-foreground cursor-pointer hover:text-foreground font-bold" onClick={() => toggleSort("benodigd")}>
                    <span className="inline-flex items-center gap-0.5">Benodigd {sortKey === "benodigd" && <ArrowUpDown className="w-3 h-3" />}</span>
                  </th>
                  <th className="px-3 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap">Klanten</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(m => {
                  const isExpanded = expandedKey === m.key;
                  const cfg = statusConfig[m.status];
                  const uniqueKlanten = [...new Set(m.klanten.map(k => k.klant))];
                  const dekkingPct = m.behoefte > 0 ? Math.min(100, Math.round((m.voorraad / m.behoefte) * 100)) : (m.voorraad > 0 ? 100 : 0);

                  return (
                    <Fragment key={m.key}>
                      <tr
                        onClick={() => setExpandedKey(isExpanded ? null : m.key)}
                        className={cn("border-b border-border/40 cursor-pointer transition-colors", isExpanded ? "bg-muted/30" : "hover:bg-muted/10")}
                      >
                        <td className="px-2 py-3 text-muted-foreground">
                          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </td>
                        <td className="px-3 py-3">
                          <span className={cn("text-[9px] font-medium px-2 py-0.5 rounded-full border inline-flex items-center gap-1", cfg.bg)}>
                            <cfg.icon className={cn("w-2.5 h-2.5", cfg.color)} />
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-[10px] text-muted-foreground">{m.soort}</td>
                        <td className="px-3 py-3">
                          <span className="font-medium text-foreground text-[12px]">{m.artikel}</span>
                        </td>
                        <td className="px-3 py-3 font-mono text-[10px] text-muted-foreground">{m.lengte || "—"}</td>
                        <td className="px-3 py-3">
                          <div className="flex gap-1 flex-wrap">
                            {m.kleurCodes.length > 0
                              ? m.kleurCodes.map(c => (
                                <span key={c} className="text-[8px] font-mono font-semibold px-1.5 py-0.5 rounded bg-muted border border-border text-muted-foreground" title={kleurLabels[c] || c}>
                                  {c}
                                </span>
                              ))
                              : <span className="text-[10px] text-muted-foreground/50">—</span>
                            }
                          </div>
                        </td>
                        <td className="px-3 py-3 font-mono text-right text-foreground">{fmt(m.behoefte)}</td>
                        <td className="px-3 py-3 font-mono text-right text-foreground">{fmt(m.voorraad)}</td>
                        <td className={cn("px-3 py-3 font-mono text-right font-bold", m.benodigd > 0 ? "text-destructive" : "text-accent")}>
                          {m.benodigd > 0 ? fmt(m.benodigd) : <span className="flex items-center justify-end gap-0.5"><CheckCircle2 className="w-3 h-3" /> 0</span>}
                        </td>
                        <td className="px-3 py-3 text-[10px] text-muted-foreground max-w-[160px] truncate">
                          {uniqueKlanten.join(", ") || "—"}
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr className="border-b border-border/40 bg-muted/10">
                          <td colSpan={10} className="px-5 py-4">
                            <div className="space-y-4">
                              {/* Dekking bar */}
                              <div className="flex items-center gap-3">
                                <span className="text-[10px] font-medium text-muted-foreground w-16">Dekking</span>
                                <div className="flex-1 max-w-xs bg-muted rounded-full h-2.5 overflow-hidden">
                                  <div
                                    className={cn("h-full rounded-full transition-all", dekkingPct >= 100 ? "bg-accent" : dekkingPct >= 50 ? "bg-yellow-500" : "bg-destructive")}
                                    style={{ width: `${dekkingPct}%` }}
                                  />
                                </div>
                                <span className={cn("text-[11px] font-mono font-bold", dekkingPct >= 100 ? "text-accent" : dekkingPct >= 50 ? "text-yellow-500" : "text-destructive")}>
                                  {dekkingPct}%
                                </span>
                              </div>

                              {/* Klanten detail */}
                              {m.klanten.length > 0 && (
                                <div>
                                  <h4 className="text-[10px] font-semibold text-foreground uppercase tracking-wide mb-2">Klanten & Behoefte</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                                    {/* Group by klant */}
                                    {[...new Map(m.klanten.map(k => [k.klant, k])).keys()].map(klant => {
                                      const klantRows = m.klanten.filter(k => k.klant === klant);
                                      const klantTotal = klantRows.reduce((s, k) => s + k.aantal, 0);
                                      return (
                                        <div key={klant} className="flex items-center justify-between text-[10px] py-1.5 border-b border-border/30 last:border-0">
                                          <span className="font-semibold text-foreground">{klant}</span>
                                          <div className="flex items-center gap-3">
                                            <span className="text-muted-foreground">{klantRows.length} orders</span>
                                            <span className="font-mono font-bold text-foreground">{fmt(klantTotal)}</span>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              {/* Voorraad partijen */}
                              {m.voorraadDetails.length > 0 && (
                                <div>
                                  <h4 className="text-[10px] font-semibold text-foreground uppercase tracking-wide mb-2">Voorraadpartijen</h4>
                                  <div className="space-y-1">
                                    {m.voorraadDetails.map((d, i) => (
                                      <div key={i} className="flex items-center justify-between text-[10px] py-1 px-2 rounded bg-background border border-border/50">
                                        <span className="font-mono text-muted-foreground">{d.partij}</span>
                                        <div className="flex items-center gap-4">
                                          <span className="font-mono text-foreground">{fmt(d.aantal)}</span>
                                          <span className="font-mono text-muted-foreground">{fmtPrice(d.prijs)}</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </IHSectionShell>
      )}
    </div>
  );
};

export default BehoesteVsVoorraad;

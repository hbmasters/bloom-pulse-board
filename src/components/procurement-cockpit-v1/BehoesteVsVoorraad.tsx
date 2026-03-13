import { useState, useMemo, useCallback, Fragment } from "react";
import {
  Upload, CheckCircle2, AlertTriangle, XCircle,
  Package, Search, ChevronDown, ChevronRight, ArrowUpDown,
  RotateCcw, Link2, Unlink, Sparkles, ShoppingCart, Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getISOWeek } from "date-fns";
import {
  parseInkooplijst,
  parseVoorraadlijst,
  matchLists,
  findSuggestions,
  normalizeArtikel,
  loadManualLinks,
  saveManualLinks,
  type InkoopRow,
  type VoorraadRow,
  type MatchedLine,
  type ManualLink,
  type MatchSuggestion,
} from "./csv-parsers";

const fmt = (n: number) => n.toLocaleString("nl-NL");
const fmtPrice = (n: number) => `€${n.toFixed(3).replace(".", ",")}`;

/** Parse a datum string like "13/03" or "2025-03-13" to a Date (current year assumed for dd/mm) */
const parseDatumToDate = (raw: string): Date | null => {
  if (!raw) return null;
  const ddmm = raw.match(/^(\d{1,2})[\/\-](\d{1,2})$/);
  if (ddmm) {
    const day = parseInt(ddmm[1], 10);
    const month = parseInt(ddmm[2], 10) - 1;
    return new Date(new Date().getFullYear(), month, day);
  }
  const d = new Date(raw);
  return isNaN(d.getTime()) ? null : d;
};

/** Get the earliest datum + ISO week label from klanten */
const getEarliestDatum = (klanten: { datum: string }[]): { datum: string; week: number | null } => {
  const dates = klanten.map(k => ({ raw: k.datum, parsed: parseDatumToDate(k.datum) })).filter(d => d.parsed !== null);
  if (dates.length === 0) return { datum: "", week: null };
  dates.sort((a, b) => a.parsed!.getTime() - b.parsed!.getTime());
  const earliest = dates[0];
  return { datum: earliest.raw, week: getISOWeek(earliest.parsed!) };
};

/** Get average historical price from klanten */
const getAvgPrice = (klanten: { prijs: number }[]): number | null => {
  const prices = klanten.map(k => k.prijs).filter(p => p > 0);
  if (prices.length === 0) return null;
  return prices.reduce((s, p) => s + p, 0) / prices.length;
};

/** Extract artikelgroep = first 2 words of artikel name, e.g. "R GR Furiosa 35cm" → "R GR" */
const extractArtikelgroep = (artikel: string): string => {
  const parts = artikel.trim().split(/\s+/);
  return parts.length >= 2 ? `${parts[0]} ${parts[1]}` : parts[0] || "";
};

const statusConfig = {
  gedekt: { label: "Gedekt", icon: CheckCircle2, color: "text-accent", bg: "bg-accent/10 border-accent/20" },
  deels_gedekt: { label: "Deels", icon: AlertTriangle, color: "text-yellow-500", bg: "bg-yellow-500/10 border-yellow-500/20" },
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

/** Upload controls rendered in the page header area */
export const UploadControls = ({
  inkoopFile, voorraadFile, inkoopCount, voorraadCount, isProcessed,
  onUpload, onProcess, onReset, linkedCount,
}: {
  inkoopFile: File | null;
  voorraadFile: File | null;
  inkoopCount: number;
  voorraadCount: number;
  isProcessed: boolean;
  onUpload: (file: File, type: "inkoop" | "voorraad") => void;
  onProcess: () => void;
  onReset: () => void;
  linkedCount?: number;
}) => (
  <div className="flex items-center gap-2 flex-wrap">
    <label className={cn(
      "flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-lg border cursor-pointer transition-all",
      inkoopFile ? "border-accent/30 bg-accent/5 text-accent" : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/30"
    )}>
      <input type="file" accept=".csv" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) onUpload(f, "inkoop"); }} />
      <Upload className="w-3.5 h-3.5" />
      {inkoopFile ? `Inkoop (${inkoopCount})` : "Inkooplijst"}
    </label>
    <label className={cn(
      "flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-lg border cursor-pointer transition-all",
      voorraadFile ? "border-accent/30 bg-accent/5 text-accent" : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/30"
    )}>
      <input type="file" accept=".csv" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) onUpload(f, "voorraad"); }} />
      <Upload className="w-3.5 h-3.5" />
      {voorraadFile ? `Voorraad (${voorraadCount})` : "Voorraadlijst"}
    </label>
    {inkoopCount > 0 && voorraadCount > 0 && !isProcessed && (
      <button onClick={onProcess} className="text-[11px] font-semibold px-3 py-1.5 rounded-lg border bg-primary/10 text-primary border-primary/25 hover:bg-primary/20 transition-all">
        Vergelijk & Afstrepen
      </button>
    )}
    {isProcessed && (
      <>
        {(linkedCount ?? 0) > 0 && (
          <span className="text-[10px] font-medium px-2 py-1 rounded-lg border border-primary/20 bg-primary/5 text-primary flex items-center gap-1">
            <Link2 className="w-3 h-3" /> {linkedCount} gekoppeld
          </span>
        )}
        <button onClick={onReset} className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5">
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </>
    )}
  </div>
);

/** KPI summary cards for matched data */
export const MatchedKPIs = ({ matched }: { matched: MatchedLine[] }) => {
  const totals = useMemo(() => ({
    totalBehoefte: matched.reduce((s, m) => s + m.behoefte, 0),
    totalVoorraad: matched.reduce((s, m) => s + m.voorraad, 0),
    totalBenodigd: matched.reduce((s, m) => s + m.benodigd, 0),
    gedekt: matched.filter(m => m.status === "gedekt").length,
    deelsGedekt: matched.filter(m => m.status === "deels_gedekt").length,
    nietGedekt: matched.filter(m => m.status === "niet_gedekt").length,
  }), [matched]);

  return (
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
  );
};

/** Suggestion panel for linking voorraad to inkoop */
const LinkSuggestions = ({
  suggestions, manualLinks, inkoopKey, onLink, onUnlink,
}: {
  suggestions: MatchSuggestion[];
  manualLinks: ManualLink[];
  inkoopKey: string;
  onLink: (inkoopKey: string, voorraadKey: string) => void;
  onUnlink: (inkoopKey: string, voorraadKey: string) => void;
}) => {
  const linked = manualLinks.filter(l => l.inkoopKey === inkoopKey);

  return (
    <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
      <h4 className="text-[10px] font-semibold text-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
        <Sparkles className="w-3 h-3 text-primary" />
        Voorraad koppelen — suggesties
      </h4>

      {/* Already linked */}
      {linked.length > 0 && (
        <div className="mb-2 space-y-1">
          {linked.map(l => {
            const sug = suggestions.find(s => s.voorraadKey === l.voorraadKey);
            return (
              <div key={l.voorraadKey} className="flex items-center justify-between text-[10px] py-1.5 px-2 rounded-lg bg-accent/10 border border-accent/20">
                <div className="flex items-center gap-2">
                  <Link2 className="w-3 h-3 text-accent" />
                  <span className="font-medium text-foreground">{sug?.artikel || l.voorraadKey}</span>
                  <span className="text-muted-foreground">{sug?.soort}</span>
                  <span className="font-mono text-accent">{sug ? fmt(sug.aantal) : "—"}</span>
                </div>
                <button onClick={() => onUnlink(inkoopKey, l.voorraadKey)} className="text-destructive hover:text-destructive/80 transition-colors p-0.5" title="Ontkoppelen">
                  <Unlink className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Suggestions */}
      {suggestions.length === 0 ? (
        <p className="text-[10px] text-muted-foreground italic">Geen suggesties gevonden</p>
      ) : (
        <div className="space-y-1">
          {suggestions.filter(s => !linked.some(l => l.voorraadKey === s.voorraadKey)).map(s => (
            <div key={s.voorraadKey} className="flex items-center justify-between text-[10px] py-1.5 px-2 rounded-lg bg-background border border-border/50 hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-medium text-foreground truncate">{s.artikel}</span>
                <span className="text-muted-foreground flex-shrink-0">{s.soort}</span>
                <span className="font-mono text-foreground flex-shrink-0">{fmt(s.aantal)}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                <span className={cn(
                  "text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-full",
                  s.score >= 60 ? "bg-accent/10 text-accent" : s.score >= 35 ? "bg-yellow-500/10 text-yellow-500" : "bg-muted text-muted-foreground"
                )}>
                  {s.score}%
                </span>
                <button onClick={() => onLink(inkoopKey, s.voorraadKey)} className="text-[9px] font-medium text-primary hover:text-primary/80 border border-primary/30 rounded-lg px-2 py-0.5 transition-colors flex items-center gap-1">
                  <Link2 className="w-2.5 h-2.5" /> Koppel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/** Matched results table — split into Behoefte (top) and Voorraad (bottom) */
export const MatchedTable = ({
  matched, largeView, voorraadRows, manualLinks, onLink, onUnlink,
}: {
  matched: MatchedLine[];
  largeView?: boolean;
  voorraadRows: VoorraadRow[];
  manualLinks: ManualLink[];
  onLink: (inkoopKey: string, voorraadKey: string) => void;
  onUnlink: (inkoopKey: string, voorraadKey: string) => void;
}) => {
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [artikelgroepFilter, setArtikelgroepFilter] = useState<string | null>(null);
  const [lengteFilter, setLengteFilter] = useState<string | null>(null);
  const [kleurFilter, setKleurFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(null);
  const [sortKey, setSortKey] = useState<SortKey>("status");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const artikelgroepen = useMemo(() => [...new Set(matched.map(m => extractArtikelgroep(m.artikel)))].filter(Boolean).sort(), [matched]);
  const lengtes = useMemo(() => [...new Set(matched.map(m => m.lengte).concat(voorraadRows.map(r => r.lengte)))].filter(Boolean).sort(), [matched, voorraadRows]);
  const kleuren = useMemo(() => [...new Set(matched.flatMap(m => m.kleurCodes))].filter(Boolean).sort(), [matched]);

  // Keys already auto-matched
  const autoMatchedKeys = useMemo(() => {
    const keys = new Set<string>();
    for (const m of matched) {
      if (m.voorraad > 0 || m.behoefte > 0) keys.add(m.key);
    }
    return keys;
  }, [matched]);

  // Split into behoefte (demand) and voorraad-only (surplus/stock)
  const { behoefteItems, voorraadItems } = useMemo(() => {
    let list = matched;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(m => m.artikel.toLowerCase().includes(q) || m.soort.toLowerCase().includes(q));
    }
    if (artikelgroepFilter) list = list.filter(m => extractArtikelgroep(m.artikel) === artikelgroepFilter);
    if (lengteFilter) list = list.filter(m => m.lengte === lengteFilter);
    if (kleurFilter) list = list.filter(m => m.kleurCodes.includes(kleurFilter));
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

    return {
      behoefteItems: list.filter(m => m.behoefte > 0),
      voorraadItems: list.filter(m => m.behoefte === 0 && m.voorraad > 0),
    };
  }, [matched, search, artikelgroepFilter, lengteFilter, kleurFilter, statusFilter, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir(key === "behoefte" || key === "voorraad" || key === "benodigd" ? "desc" : "asc"); }
  };

  // Find matching voorraad: same artikelgroep + kleur, lengte >= current
  const findMatchingVoorraad = useCallback((m: MatchedLine) => {
    const groep = extractArtikelgroep(m.artikel).toUpperCase();
    const kleurSet = new Set(m.kleurCodes.map(c => c.toUpperCase()));
    const mLengte = parseInt(m.lengte) || 0;

    return voorraadRows.filter(vr => {
      const vGroep = extractArtikelgroep(vr.artikel).toUpperCase();
      if (vGroep !== groep) return false;
      // Kleur match if we have kleur info
      if (kleurSet.size > 0) {
        // Check if voorraad artikel contains any of the kleur codes
        const vArtikelUpper = vr.artikel.toUpperCase();
        const hasKleur = [...kleurSet].some(k => vArtikelUpper.includes(kleurLabels[k]?.toUpperCase() || k));
        const soortKleur = vr.soort?.toUpperCase() || "";
        const kleurInSoort = [...kleurSet].some(k => soortKleur.includes(k));
        if (!hasKleur && !kleurInSoort) return false;
      }
      // Lengte: accept same or larger
      if (mLengte > 0 && vr.lengte) {
        const vLengte = parseInt(vr.lengte) || 0;
        if (vLengte > 0 && vLengte < mLengte) return false;
      }
      return true;
    });
  }, [voorraadRows]);

  const SortHeader = ({ k, label, align }: { k: SortKey; label: string; align?: string }) => (
    <th className={cn("px-2 py-2 font-medium text-muted-foreground cursor-pointer hover:text-foreground whitespace-nowrap", align)} onClick={() => toggleSort(k)}>
      <span className="inline-flex items-center gap-0.5">{label} {sortKey === k && <ArrowUpDown className="w-3 h-3" />}</span>
    </th>
  );

  const totalFiltered = behoefteItems.length + voorraadItems.length;

  const renderBehoefteRow = (m: MatchedLine) => {
    const isExpanded = expandedKey === m.key;
    const cfg = statusConfig[m.status];
    const uniqueKlanten = [...new Set(m.klanten.map(k => k.klant))];
    const dekkingPct = m.behoefte > 0 ? Math.min(100, Math.round((m.voorraad / m.behoefte) * 100)) : 0;
    const hasLinks = manualLinks.some(l => l.inkoopKey === m.key);
    const matchingVoorraad = isExpanded ? findMatchingVoorraad(m) : [];
    const suggestions = isExpanded ? findSuggestions(m.key, m.soort, voorraadRows, autoMatchedKeys, manualLinks) : [];

    return (
      <Fragment key={m.key}>
        <tr
          onClick={() => setExpandedKey(isExpanded ? null : m.key)}
          className={cn(
            "border-b border-border/40 cursor-pointer transition-colors",
            isExpanded ? "bg-muted/30" : "hover:bg-muted/10",
            m.status === "niet_gedekt" && "bg-destructive/5",
            m.status === "deels_gedekt" && "bg-yellow-500/5",
          )}
        >
          <td className="px-1.5 py-2.5 text-muted-foreground">
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </td>
          <td className="px-2 py-2.5 text-[10px] font-mono font-semibold text-foreground">{extractArtikelgroep(m.artikel)}</td>
          <td className="px-2 py-2.5">
            <span className="font-medium text-foreground text-[11px]">{m.artikel}</span>
          </td>
          <td className="px-2 py-2.5 text-[10px] text-muted-foreground">{m.lengte || "—"}</td>
          <td className="px-2 py-2.5">
            <div className="flex gap-0.5 flex-wrap">
              {m.kleurCodes.length > 0
                ? m.kleurCodes.map(c => (
                  <span key={c} className="text-[8px] font-mono font-semibold px-1 py-0.5 rounded bg-muted border border-border text-muted-foreground" title={kleurLabels[c] || c}>
                    {c}
                  </span>
                ))
                : <span className="text-[10px] text-muted-foreground/50">—</span>
              }
            </div>
          </td>
          <td className="px-2 py-2.5 font-mono text-right text-foreground">{fmt(m.behoefte)}</td>
          <td className="px-2 py-2.5 font-mono text-right text-foreground">{fmt(m.voorraad)}</td>
          <td className={cn("px-2 py-2.5 font-mono text-right font-bold", m.benodigd > 0 ? "text-destructive" : "text-accent")}>
            {m.benodigd > 0 ? fmt(m.benodigd) : <span className="flex items-center justify-end gap-0.5"><CheckCircle2 className="w-3 h-3" /> 0</span>}
          </td>
          <td className="px-2 py-2.5 text-[10px] text-muted-foreground whitespace-nowrap">
            {(() => {
              const { datum, week } = getEarliestDatum(m.klanten);
              if (!datum) return "—";
              return (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-muted-foreground/60" />
                  <span>{datum}</span>
                  {week !== null && <span className="font-mono text-[8px] px-1 py-0.5 rounded bg-muted border border-border">W{week}</span>}
                </span>
              );
            })()}
          </td>
          <td className="px-2 py-2.5 font-mono text-right text-muted-foreground">
            {(() => {
              const avg = getAvgPrice(m.klanten);
              return avg !== null ? fmtPrice(avg) : "—";
            })()}
          </td>
          <td className="px-2 py-2.5 text-[10px] text-muted-foreground max-w-[120px] truncate">
            {uniqueKlanten.join(", ") || "—"}
          </td>
        </tr>

        {isExpanded && (
          <tr className="border-b border-border/40 bg-muted/10">
            <td colSpan={13} className="px-4 py-3">
              <div className="space-y-3">
                {/* Dekking bar */}
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-medium text-muted-foreground w-14">Dekking</span>
                  <div className="flex-1 max-w-xs bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all", dekkingPct >= 100 ? "bg-accent" : dekkingPct >= 50 ? "bg-yellow-500" : "bg-destructive")}
                      style={{ width: `${dekkingPct}%` }}
                    />
                  </div>
                  <span className={cn("text-[11px] font-mono font-bold", dekkingPct >= 100 ? "text-accent" : dekkingPct >= 50 ? "text-yellow-500" : "text-destructive")}>
                    {dekkingPct}%
                  </span>
                </div>

                {/* Matching voorraad partijen */}
                <div>
                  <h4 className="text-[10px] font-semibold text-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <Package className="w-3 h-3 text-primary" />
                    Beschikbare voorraad (artikel + kleur + lengte)
                  </h4>
                  {/* Direct matched voorraad details */}
                  {m.voorraadDetails.length > 0 && (
                    <div className="space-y-1 mb-2">
                      {m.voorraadDetails.map((d, i) => (
                        <div key={`direct-${i}`} className="flex items-center justify-between text-[10px] py-1.5 px-2 rounded-lg bg-accent/5 border border-accent/20">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-3 h-3 text-accent" />
                            <span className="font-medium text-foreground">{d.partij || "Direct match"}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-mono font-bold text-foreground">{fmt(d.aantal)}</span>
                            <span className="font-mono text-muted-foreground">{fmtPrice(d.prijs)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Broader matching voorraad (same soort/lengte) */}
                  {matchingVoorraad.length > 0 && (
                    <div className="space-y-1">
                      {matchingVoorraad
                        .filter(vr => {
                          // Don't show already-shown direct matches
                          const vKey = normalizeArtikel(vr.artikel);
                          return vKey !== m.key;
                        })
                        .map((vr, i) => (
                          <div key={`match-${i}`} className="flex items-center justify-between text-[10px] py-1.5 px-2 rounded-lg bg-background border border-border/50 hover:border-primary/30 transition-colors">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="font-medium text-foreground truncate">{vr.artikel}</span>
                              <span className="text-muted-foreground flex-shrink-0">{vr.soort}</span>
                              {vr.lengte && <span className="text-[8px] font-mono px-1 py-0.5 rounded bg-muted border border-border text-muted-foreground">{vr.lengte}</span>}
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0">
                              <span className="font-mono text-foreground">{fmt(vr.aantal)}</span>
                              <span className="font-mono text-muted-foreground">{fmtPrice(vr.inkoopprijs)}</span>
                              {!manualLinks.some(l => l.inkoopKey === m.key && l.voorraadKey === normalizeArtikel(vr.artikel)) && (
                                <button
                                  onClick={e => { e.stopPropagation(); onLink(m.key, normalizeArtikel(vr.artikel)); }}
                                  className="text-[9px] font-medium text-primary hover:text-primary/80 border border-primary/30 rounded-lg px-2 py-0.5 transition-colors flex items-center gap-1"
                                >
                                  <Link2 className="w-2.5 h-2.5" /> Koppel
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                  {m.voorraadDetails.length === 0 && matchingVoorraad.filter(vr => normalizeArtikel(vr.artikel) !== m.key).length === 0 && (
                    <p className="text-[10px] text-muted-foreground italic">Geen voorraad gevonden voor dit artikel</p>
                  )}
                </div>

                {/* AI Link suggestions */}
                {m.behoefte > 0 && suggestions.length > 0 && (
                  <LinkSuggestions
                    suggestions={suggestions}
                    manualLinks={manualLinks}
                    inkoopKey={m.key}
                    onLink={onLink}
                    onUnlink={onUnlink}
                  />
                )}

                {/* Klanten detail */}
                {m.klanten.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-semibold text-foreground uppercase tracking-wide mb-2">Klanten & Behoefte</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                      {[...new Map(m.klanten.map(k => [k.klant, k])).keys()].map(klant => {
                        const klantRows = m.klanten.filter(k => k.klant === klant);
                        const klantTotal = klantRows.reduce((s, k) => s + k.aantal, 0);
                        return (
                          <div key={klant} className="flex items-center justify-between text-[10px] py-1 border-b border-border/30 last:border-0">
                            <span className="font-semibold text-foreground">{klant}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">{klantRows.length}x</span>
                              <span className="font-mono font-bold text-foreground">{fmt(klantTotal)}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </td>
          </tr>
        )}
      </Fragment>
    );
  };

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <div className="relative flex-1 min-w-[120px] max-w-[200px]">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Zoek..." className="w-full pl-7 pr-2 py-1.5 text-[11px] rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
        <select value={artikelgroepFilter || ""} onChange={e => setArtikelgroepFilter(e.target.value || null)} className="text-[11px] font-medium px-2 py-1.5 rounded-lg border border-border bg-background text-foreground cursor-pointer">
          <option value="">Alle artikelgroepen</option>
          {artikelgroepen.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={lengteFilter || ""} onChange={e => setLengteFilter(e.target.value || null)} className="text-[11px] font-medium px-2 py-1.5 rounded-lg border border-border bg-background text-foreground cursor-pointer">
          <option value="">Alle lengtes</option>
          {lengtes.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <select value={kleurFilter || ""} onChange={e => setKleurFilter(e.target.value || null)} className="text-[11px] font-medium px-2 py-1.5 rounded-lg border border-border bg-background text-foreground cursor-pointer">
          <option value="">Alle kleuren</option>
          {kleuren.map(k => <option key={k} value={k}>{kleurLabels[k] || k}</option>)}
        </select>
        <div className="flex gap-1">
          {(["niet_gedekt", "deels_gedekt", "gedekt", "overschot"] as const).map(s => {
            const cfg = statusConfig[s];
            return (
              <button key={s} onClick={() => setStatusFilter(statusFilter === s ? null : s)} className={cn("text-[10px] px-2 py-1 rounded-lg border transition-colors font-medium", statusFilter === s ? cfg.bg : "border-border text-muted-foreground hover:bg-muted")}>
                {cfg.label}
              </button>
            );
          })}
        </div>
        <span className="text-[10px] font-mono text-muted-foreground ml-auto">{totalFiltered}/{matched.length}</span>
      </div>

      {/* ── Behoefte Section ── */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <ShoppingCart className="w-4 h-4 text-primary" />
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">Behoefte</h3>
          <span className="text-[9px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">{behoefteItems.length}</span>
        </div>
        <div className="overflow-x-auto -mx-5">
          <table className={cn("w-full", largeView ? "text-[13px]" : "text-[11px]")}>
            <thead>
              <tr className="border-b border-border">
                <th className="px-1.5 py-2 w-5"></th>
                <SortHeader k="status" label="Status" />
                <SortHeader k="soort" label="Groep" />
                <SortHeader k="artikel" label="Artikel" />
                <th className="px-2 py-2 font-medium text-muted-foreground whitespace-nowrap text-left">Lengte</th>
                <th className="px-2 py-2 font-medium text-muted-foreground whitespace-nowrap text-left">Kleur</th>
                <SortHeader k="behoefte" label="Behoefte" align="text-right" />
                <SortHeader k="voorraad" label="Voorraad" align="text-right" />
                <SortHeader k="benodigd" label="Benodigd" align="text-right" />
                <th className="px-2 py-2 font-medium text-muted-foreground whitespace-nowrap text-left">Datum / Week</th>
                <th className="px-2 py-2 font-medium text-muted-foreground whitespace-nowrap text-right">Hist. Prijs</th>
                <th className="px-2 py-2 font-medium text-muted-foreground whitespace-nowrap text-left">Klanten</th>
                <th className="px-2 py-2 font-medium text-muted-foreground whitespace-nowrap text-center w-8">
                  <Link2 className="w-3 h-3 inline" />
                </th>
              </tr>
            </thead>
            <tbody>
              {behoefteItems.length === 0 ? (
                <tr><td colSpan={13} className="px-4 py-6 text-center text-[11px] text-muted-foreground italic">Geen behoefte-regels gevonden</td></tr>
              ) : behoefteItems.map(renderBehoefteRow)}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Voorraad Section ── */}
      {voorraadItems.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">Voorraad (zonder behoefte)</h3>
            <span className="text-[9px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">{voorraadItems.length}</span>
          </div>
          <div className="overflow-x-auto -mx-5">
            <table className={cn("w-full", largeView ? "text-[13px]" : "text-[11px]")}>
              <thead>
                <tr className="border-b border-border">
                  <th className="px-2 py-2 font-medium text-muted-foreground whitespace-nowrap text-left">Groep</th>
                  <th className="px-2 py-2 font-medium text-muted-foreground whitespace-nowrap text-left">Artikel</th>
                  <th className="px-2 py-2 font-medium text-muted-foreground whitespace-nowrap text-left">Lengte</th>
                  <th className="px-2 py-2 font-medium text-muted-foreground whitespace-nowrap text-right">Voorraad</th>
                </tr>
              </thead>
              <tbody>
                {voorraadItems.map(m => (
                  <tr key={m.key} className="border-b border-border/40 hover:bg-muted/10">
                    <td className="px-2 py-2 text-[10px] text-muted-foreground font-mono">{extractArtikelgroep(m.artikel)}</td>
                    <td className="px-2 py-2 font-medium text-foreground text-[11px]">{m.artikel}</td>
                    <td className="px-2 py-2 text-[10px] text-muted-foreground">{m.lengte || "—"}</td>
                    <td className="px-2 py-2 font-mono text-right text-foreground">{fmt(m.voorraad)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

/** Hook to manage upload + matching state with manual linking */
export function useMatchState() {
  const [inkoopFile, setInkoopFile] = useState<File | null>(null);
  const [voorraadFile, setVoorraadFile] = useState<File | null>(null);
  const [inkoopRows, setInkoopRows] = useState<InkoopRow[]>([]);
  const [voorraadRows, setVoorraadRows] = useState<VoorraadRow[]>([]);
  const [matched, setMatched] = useState<MatchedLine[]>([]);
  const [isProcessed, setIsProcessed] = useState(false);
  const [manualLinks, setManualLinks] = useState<ManualLink[]>(() => loadManualLinks());

  const reMatch = useCallback((iRows: InkoopRow[], vRows: VoorraadRow[], links: ManualLink[]) => {
    if (iRows.length === 0 || vRows.length === 0) return;
    setMatched(matchLists(iRows, vRows, links));
  }, []);

  const handleUpload = useCallback(async (file: File, type: "inkoop" | "voorraad") => {
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
    setMatched(matchLists(inkoopRows, voorraadRows, manualLinks));
    setIsProcessed(true);
  }, [inkoopRows, voorraadRows, manualLinks]);

  const addLink = useCallback((inkoopKey: string, voorraadKey: string) => {
    setManualLinks(prev => {
      if (prev.some(l => l.inkoopKey === inkoopKey && l.voorraadKey === voorraadKey)) return prev;
      const next = [...prev, { inkoopKey, voorraadKey }];
      saveManualLinks(next);
      // Re-match with updated links
      if (inkoopRows.length > 0 && voorraadRows.length > 0) {
        setMatched(matchLists(inkoopRows, voorraadRows, next));
      }
      return next;
    });
  }, [inkoopRows, voorraadRows]);

  const removeLink = useCallback((inkoopKey: string, voorraadKey: string) => {
    setManualLinks(prev => {
      const next = prev.filter(l => !(l.inkoopKey === inkoopKey && l.voorraadKey === voorraadKey));
      saveManualLinks(next);
      if (inkoopRows.length > 0 && voorraadRows.length > 0) {
        setMatched(matchLists(inkoopRows, voorraadRows, next));
      }
      return next;
    });
  }, [inkoopRows, voorraadRows]);

  const reset = useCallback(() => {
    setInkoopFile(null);
    setVoorraadFile(null);
    setInkoopRows([]);
    setVoorraadRows([]);
    setMatched([]);
    setIsProcessed(false);
  }, []);

  return {
    inkoopFile, voorraadFile, inkoopCount: inkoopRows.length, voorraadCount: voorraadRows.length,
    matched, isProcessed, handleUpload, processMatch, reset,
    manualLinks, addLink, removeLink, voorraadRows,
  };
}

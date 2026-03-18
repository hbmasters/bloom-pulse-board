import { useState, useMemo } from "react";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import {
  Package, Truck, CheckCircle2, AlertTriangle, Clock, ChevronDown,
  Search, Filter, Building2, MapPin, Box, Hash, User, Timer,
  Flower2, RefreshCw, Calendar as CalendarIcon, XCircle, Eye
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarWidget } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { OPS_MOCK } from "@/components/operations-intelligence/operations-mock-data";
import type {
  OpsIntelligenceData, Shipment, OpsTransaction, TrackTraceEvent,
  DeviationLevel, ShipmentStatus, VehicleFlow, VehicleStatus
} from "@/components/operations-intelligence/operations-types";

/* ═══════════ HELPERS ═══════════ */

const SHIPMENT_STATUS: Record<string, { icon: typeof Package; color: string; bg: string; dot: string }> = {
  Gepland:    { icon: CalendarIcon,  color: "text-muted-foreground", bg: "bg-muted/40 border-border",             dot: "bg-muted-foreground" },
  Geladen:    { icon: Package,       color: "text-amber-500",       bg: "bg-amber-500/10 border-amber-500/20",   dot: "bg-amber-500" },
  Onderweg:   { icon: Truck,         color: "text-blue-500",        bg: "bg-blue-500/10 border-blue-500/20",     dot: "bg-blue-500" },
  Gelost:     { icon: Box,           color: "text-violet-500",      bg: "bg-violet-500/10 border-violet-500/20", dot: "bg-violet-500" },
  Afgeleverd: { icon: CheckCircle2,  color: "text-emerald-500",     bg: "bg-emerald-500/10 border-emerald-500/20", dot: "bg-emerald-500" },
  Afwijking:  { icon: AlertTriangle, color: "text-red-500",         bg: "bg-red-500/10 border-red-500/20",       dot: "bg-red-500" },
};

const TX_STATUS: Record<string, { color: string; bg: string; dot: string }> = {
  Aangekocht: { color: "text-amber-500",   bg: "bg-amber-500/10 border-amber-500/20", dot: "bg-amber-500" },
  Inslag:     { color: "text-violet-500",  bg: "bg-violet-500/10 border-violet-500/20", dot: "bg-violet-500" },
  Onderweg:   { color: "text-blue-500",    bg: "bg-blue-500/10 border-blue-500/20",   dot: "bg-blue-500" },
  Afgeleverd: { color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20", dot: "bg-emerald-500" },
};

const DEV_COLOR: Record<DeviationLevel, { text: string; bg: string; dot: string }> = {
  ok:       { text: "text-emerald-500", bg: "bg-emerald-500/10", dot: "bg-emerald-500" },
  warning:  { text: "text-amber-500",   bg: "bg-amber-500/10",   dot: "bg-amber-500" },
  critical: { text: "text-red-500",     bg: "bg-red-500/10",     dot: "bg-red-500" },
};

const VEH_COLOR: Record<VehicleStatus, { text: string; bg: string }> = {
  actief:     { text: "text-blue-500",    bg: "bg-blue-500/10 border-blue-500/20" },
  stilstaand: { text: "text-amber-500",   bg: "bg-amber-500/10 border-amber-500/20" },
  afgerond:   { text: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20" },
};

function sCfg(s: string) { return SHIPMENT_STATUS[s] ?? SHIPMENT_STATUS.Gepland; }
function tCfg(s: string) { return TX_STATUS[s] ?? TX_STATUS.Aangekocht; }

/* ═══════════ KPI BAR ═══════════ */

const KPIChip = ({ label, value, icon: Icon, accent }: { label: string; value: number; icon: typeof Package; accent: string }) => (
  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border min-w-[90px]">
    <Icon className={cn("w-4 h-4 shrink-0", accent)} />
    <div className="min-w-0">
      <div className="text-lg font-semibold leading-tight text-foreground">{value}</div>
      <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider truncate">{label}</div>
    </div>
  </div>
);

const KPIBar = ({ summary }: { summary: OpsIntelligenceData["summary"] }) => (
  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
    <KPIChip label="Zendingen" value={summary.totalShipments} icon={Package} accent="text-foreground" />
    <KPIChip label="Laadeenheden" value={summary.loadUnits} icon={Box} accent="text-violet-500" />
    <KPIChip label="Transacties" value={summary.totalTransactions} icon={Hash} accent="text-blue-500" />
    <KPIChip label="Fust" value={summary.packagingUnits} icon={Package} accent="text-muted-foreground" />
    <KPIChip label="Auto's actief" value={summary.activeVehicles} icon={Truck} accent="text-blue-500" />
    <KPIChip label="Vertraagd" value={summary.delayedShipments} icon={Timer} accent="text-amber-500" />
    <KPIChip label="Afwijkingen" value={summary.deviationCount} icon={AlertTriangle} accent="text-red-500" />
  </div>
);

/* ═══════════ TRACK & TRACE ═══════════ */

const TrackTrace = ({ events }: { events: TrackTraceEvent[] }) => {
  const sorted = [...events]
    .filter(e => e.date && e.time)
    .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());

  return (
    <div className="relative pl-4 space-y-3 border-l-2 border-border ml-1">
      {sorted.map((ev, i) => {
        const cfg = tCfg(ev.status);
        const plate = ev.vehicle?.split(" ").slice(1).join(" ") || null;
        return (
          <div key={i} className="relative">
            <div className={cn("absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-card", cfg.dot)} />
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className={cn("text-xs font-semibold", cfg.color)}>{ev.status}</span>
                <span className="text-[10px] text-muted-foreground">{ev.time.slice(0, 5)}</span>
                <span className="text-[10px] text-muted-foreground/50">{ev.date}</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-snug">{ev.location}</p>
              {(ev.unit || plate) && (
                <div className="flex items-center gap-3 mt-0.5">
                  {ev.unit && <span className="text-[10px] text-muted-foreground/70 flex items-center gap-1"><Box className="w-3 h-3" />{ev.unit}</span>}
                  {plate && (
                    <span className="text-[10px] font-mono font-semibold text-foreground/70 bg-muted/60 px-1.5 py-0.5 rounded border border-border/50 flex items-center gap-1">
                      <Truck className="w-3 h-3" />{plate}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ═══════════ TRANSACTION DETAIL ═══════════ */

const DetailField = ({ label, value }: { label: string; value: string | number }) => (
  <div className="flex justify-between items-baseline py-1.5 border-b border-border/50 last:border-0">
    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{label}</span>
    <span className="text-xs text-foreground font-medium text-right max-w-[60%] truncate">{value || "—"}</span>
  </div>
);

const TransactionDetail = ({ tx }: { tx: OpsTransaction }) => (
  <div className="animate-fade-in space-y-4 pt-3 border-t border-border/50">
    {tx.deviation && (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-red-500/5 border-red-500/20">
        <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
        <span className="text-xs text-red-500 font-medium">{tx.deviation.message}</span>
      </div>
    )}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
      <div>
        <DetailField label="Artikel" value={tx.article} />
        <DetailField label="Artikelcode" value={tx.articleCode} />
        <DetailField label="Aantal" value={`${tx.quantity.delivered} / ${tx.quantity.total}`} />
        <DetailField label="Inhoud" value={tx.content} />
      </div>
      <div>
        <DetailField label="Klok" value={tx.clock} />
        <DetailField label="Koper" value={tx.buyer} />
        <DetailField label="Aanvoerder" value={tx.supplier} />
        <DetailField label="Emballage" value={tx.packaging} />
        <DetailField label="Brief" value={tx.brief} />
      </div>
    </div>
    <div>
      <h4 className="text-[11px] font-semibold text-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
        <MapPin className="w-3.5 h-3.5 text-primary" />Track & Trace
      </h4>
      <TrackTrace events={tx.timeline} />
    </div>
  </div>
);

/* ═══════════ TRANSACTION ROW ═══════════ */

const TransactionRow = ({ tx, isOpen, onToggle }: { tx: OpsTransaction; isOpen: boolean; onToggle: () => void }) => {
  const cfg = tCfg(tx.status);
  return (
    <div className={cn(
      "rounded-lg border transition-all duration-200",
      isOpen ? "border-primary/20 bg-card shadow-sm" : "border-border bg-card/40 hover:bg-card/60"
    )}>
      <button onClick={onToggle} className="w-full text-left px-3 py-2.5 flex items-center gap-2.5">
        <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded border shrink-0", cfg.bg, cfg.color)}>{tx.status}</span>
        <Flower2 className="w-3.5 h-3.5 text-primary/60 shrink-0" />
        <span className="text-xs font-semibold text-foreground truncate flex-1">{tx.article}</span>
        <span className="text-[10px] text-muted-foreground shrink-0">{tx.quantity.delivered}/{tx.quantity.total}</span>
        <span className="text-[10px] text-muted-foreground shrink-0 hidden sm:inline">{tx.supplier.split(" (")[0]}</span>
        {tx.deviation && <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />}
        <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground shrink-0 transition-transform", isOpen && "rotate-180")} />
      </button>
      {isOpen && (
        <div className="px-3 pb-3">
          <TransactionDetail tx={tx} />
        </div>
      )}
    </div>
  );
};

/* ═══════════ SHIPMENT ROW ═══════════ */

const ShipmentRow = ({ shipment }: { shipment: Shipment }) => {
  const [expanded, setExpanded] = useState(false);
  const [openTxId, setOpenTxId] = useState<string | null>(null);
  const cfg = sCfg(shipment.status);
  const Icon = cfg.icon;
  const dev = DEV_COLOR[shipment.deviation];

  return (
    <div className={cn(
      "rounded-xl border transition-all duration-200",
      expanded ? "border-primary/20 bg-card shadow-sm" : "border-border bg-card/60 hover:bg-card"
    )}>
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left px-3 py-3 flex items-center gap-3">
        {/* Deviation dot */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center border", cfg.bg)}>
            <Icon className={cn("w-4 h-4", cfg.color)} />
          </div>
          <span className={cn("w-2 h-2 rounded-full", dev.dot)} />
        </div>

        {/* Main */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-foreground">{shipment.label}</span>
            <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded border shrink-0", cfg.bg, cfg.color)}>{shipment.status}</span>
            {shipment.deviation !== "ok" && (
              <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded shrink-0", dev.bg, dev.text)}>
                {shipment.deviation === "warning" ? "Vertraagd" : "Afwijking"}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-0.5 flex-wrap">
            <span className="text-[11px] text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3 shrink-0" />{shipment.time}</span>
            <span className="text-[11px] text-muted-foreground flex items-center gap-1 truncate"><Building2 className="w-3 h-3 shrink-0" />{shipment.client}</span>
            <span className="text-[11px] text-muted-foreground flex items-center gap-1 shrink-0"><MapPin className="w-3 h-3 shrink-0" />{shipment.location.replace("FloraHolland ", "FH ")}</span>
            <span className="text-[11px] text-muted-foreground flex items-center gap-1 shrink-0"><Box className="w-3 h-3" />{shipment.loadUnit}</span>
          </div>
        </div>

        {/* Right side */}
        <div className="hidden sm:flex flex-col items-end gap-0.5 shrink-0">
          {shipment.plate && (
            <span className="text-[10px] font-mono font-semibold text-foreground/80 bg-muted/60 px-1.5 py-0.5 rounded border border-border/50 flex items-center gap-1">
              <Truck className="w-3 h-3 text-blue-500" />{shipment.plate}
              {shipment.vehicleStatus && (
                <span className={cn("w-1.5 h-1.5 rounded-full ml-0.5", VEH_COLOR[shipment.vehicleStatus].bg.split(" ")[0].replace("/10", ""))} />
              )}
            </span>
          )}
          <span className="text-[10px] text-muted-foreground">{shipment.logisticsProvider}</span>
          <span className="text-[10px] text-muted-foreground">{shipment.transactions.length} transactie{shipment.transactions.length !== 1 ? "s" : ""}</span>
        </div>
        <ChevronDown className={cn("w-4 h-4 text-muted-foreground shrink-0 transition-transform", expanded && "rotate-180")} />
      </button>

      {expanded && (
        <div className="px-3 pb-3 space-y-3">
          {/* Deviation message */}
          {shipment.deviationMessage && (
            <div className={cn("flex items-center gap-2 px-3 py-2 rounded-lg border", dev.bg, `border-${shipment.deviation === "critical" ? "red" : "amber"}-500/20`)}>
              <AlertTriangle className={cn("w-4 h-4 shrink-0", dev.text)} />
              <span className={cn("text-xs font-medium", dev.text)}>{shipment.deviationMessage}</span>
            </div>
          )}

          {/* Transactions */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5 pt-1 border-t border-border/50">
              <Hash className="w-3.5 h-3.5 text-primary" />Transacties ({shipment.transactions.length})
            </h4>
            {shipment.transactions.map(tx => (
              <TransactionRow
                key={tx.id}
                tx={tx}
                isOpen={openTxId === tx.id}
                onToggle={() => setOpenTxId(openTxId === tx.id ? null : tx.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════ AUTO FLOW ═══════════ */

const AutoFlowSection = ({ flows }: { flows: VehicleFlow[] }) => (
  <div className="space-y-3">
    <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
      <Truck className="w-4 h-4 text-primary" />Auto Flow — Actieve voertuigen
    </h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {flows.map(flow => {
        const vCfg = VEH_COLOR[flow.status];
        return (
          <div key={flow.plate} className="rounded-xl border border-border bg-card p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-mono font-bold text-foreground flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-blue-500" />{flow.plate}
              </span>
              <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded border", vCfg.bg, vCfg.text)}>{flow.status}</span>
            </div>
            <div className="relative pl-4 space-y-2 border-l-2 border-border ml-1">
              {flow.events.map((ev, i) => {
                const isLast = i === flow.events.length - 1;
                const isDelay = ev.status.toLowerCase().includes("vertraagd");
                return (
                  <div key={i} className="relative">
                    <div className={cn(
                      "absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-card",
                      isDelay ? "bg-amber-500" : isLast ? "bg-blue-500" : "bg-emerald-500"
                    )} />
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-semibold text-muted-foreground w-10 shrink-0">{ev.time}</span>
                      <span className={cn("text-[11px] font-medium", isDelay ? "text-amber-500" : "text-foreground")}>{ev.status}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground ml-12">{ev.location}</p>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

/* ═══════════ FILTERS ═══════════ */

interface FiltersState {
  search: string;
  status: string;
  location: string;
  plate: string;
}

const FilterBar = ({ filters, onChange, data }: { filters: FiltersState; onChange: (f: FiltersState) => void; data: OpsIntelligenceData }) => {
  const locations = [...new Set(data.shipments.map(s => s.location))];
  const plates = [...new Set(data.shipments.filter(s => s.plate).map(s => s.plate!))];
  const statuses = Object.keys(SHIPMENT_STATUS);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="relative flex-1 min-w-[160px] max-w-[280px]">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Zoeken..."
          value={filters.search}
          onChange={e => onChange({ ...filters, search: e.target.value })}
          className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
        />
      </div>
      <select
        value={filters.status}
        onChange={e => onChange({ ...filters, status: e.target.value })}
        className="text-[11px] px-2 py-1.5 rounded-lg bg-card border border-border text-foreground focus:outline-none"
      >
        <option value="">Alle statussen</option>
        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
      <select
        value={filters.location}
        onChange={e => onChange({ ...filters, location: e.target.value })}
        className="text-[11px] px-2 py-1.5 rounded-lg bg-card border border-border text-foreground focus:outline-none hidden sm:block"
      >
        <option value="">Alle locaties</option>
        {locations.map(l => <option key={l} value={l}>{l}</option>)}
      </select>
      <select
        value={filters.plate}
        onChange={e => onChange({ ...filters, plate: e.target.value })}
        className="text-[11px] px-2 py-1.5 rounded-lg bg-card border border-border text-foreground focus:outline-none hidden sm:block"
      >
        <option value="">Alle kentekens</option>
        {plates.map(p => <option key={p} value={p}>{p}</option>)}
      </select>
      {(filters.search || filters.status || filters.location || filters.plate) && (
        <button
          onClick={() => onChange({ search: "", status: "", location: "", plate: "" })}
          className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          <XCircle className="w-3 h-3" />Wissen
        </button>
      )}
    </div>
  );
};

/* ═══════════ TAB VIEW ═══════════ */

type TabId = "zendingen" | "transacties";

const OperationsIntelligence = () => {
  const data = OPS_MOCK;
  const [filters, setFilters] = useState<FiltersState>({ search: "", status: "", location: "", plate: "" });
  const [showAutoFlow, setShowAutoFlow] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(data.date));
  const [activeTab, setActiveTab] = useState<TabId>("zendingen");

  const filtered = useMemo(() => {
    return data.shipments.filter(s => {
      if (filters.status && s.status !== filters.status) return false;
      if (filters.location && s.location !== filters.location) return false;
      if (filters.plate && s.plate !== filters.plate) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const haystack = [s.label, s.client, s.logisticsProvider, s.plate, ...s.transactions.map(t => t.article), ...s.transactions.map(t => t.supplier)].join(" ").toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [data.shipments, filters]);

  // Open transactions = not yet Afgeleverd
  const openTransactions = useMemo(() => {
    return data.shipments.flatMap(s =>
      s.transactions
        .filter(t => t.status !== "Afgeleverd")
        .map(t => ({ ...t, shipmentLabel: s.label, shipmentId: s.id, shipmentDeviation: s.deviation }))
    );
  }, [data.shipments]);

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold text-foreground">Transport Intelligence</h1>
            <p className="text-[11px] text-muted-foreground font-mono">{format(selectedDate, "EEEE d MMMM yyyy", { locale: nl })} · Unified Logistics View</p>
          </div>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="text-[11px] h-8 gap-1.5">
                  <CalendarIcon className="w-3.5 h-3.5" />
                  {format(selectedDate, "dd-MM-yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={d => d && setSelectedDate(d)}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            <button
              onClick={() => setShowAutoFlow(!showAutoFlow)}
              className={cn(
                "text-[11px] font-medium px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors h-8",
                showAutoFlow ? "bg-blue-500/10 border-blue-500/20 text-blue-500" : "bg-card border-border text-muted-foreground hover:text-foreground"
              )}
            >
              <Truck className="w-3.5 h-3.5" />Auto Flow
            </button>
          </div>
        </div>

        {/* KPI */}
        <KPIBar summary={data.summary} />

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-border">
          {([
            { id: "zendingen" as TabId, label: "Zendingen", count: filtered.length },
            { id: "transacties" as TabId, label: "Openstaande Transacties", count: openTransactions.length },
          ]).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-3 py-2 text-xs font-medium border-b-2 transition-colors -mb-px",
                activeTab === tab.id
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
              <span className={cn(
                "ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full",
                activeTab === tab.id ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
              )}>{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Filters */}
        <FilterBar filters={filters} onChange={setFilters} data={data} />

        {/* Auto Flow */}
        {showAutoFlow && <AutoFlowSection flows={data.vehicleFlows} />}

        {/* Tab content */}
        {activeTab === "zendingen" && (
          <div className="space-y-2">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Package className="w-8 h-8 text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">Geen zendingen gevonden voor de geselecteerde filters.</p>
              </div>
            ) : (
              filtered.map(s => <ShipmentRow key={s.id} shipment={s} />)
            )}
          </div>
        )}

        {activeTab === "transacties" && (
          <OpenTransactionsView transactions={openTransactions} />
        )}
      </div>
    </div>
  );
};

/* ═══════════ OPEN TRANSACTIONS VIEW ═══════════ */

interface OpenTx extends OpsTransaction {
  shipmentLabel: string;
  shipmentId: string;
  shipmentDeviation: DeviationLevel;
}

const OpenTransactionsView = ({ transactions }: { transactions: OpenTx[] }) => {
  const [openTxId, setOpenTxId] = useState<string | null>(null);

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <CheckCircle2 className="w-8 h-8 text-emerald-500/30 mb-2" />
        <p className="text-sm text-muted-foreground">Alle transacties zijn afgeleverd.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {transactions.map(tx => {
        const cfg = tCfg(tx.status);
        const isOpen = openTxId === tx.id;
        return (
          <div key={tx.id} className={cn(
            "rounded-xl border transition-all duration-200",
            isOpen ? "border-primary/20 bg-card shadow-sm" : "border-border bg-card/60 hover:bg-card"
          )}>
            <button onClick={() => setOpenTxId(isOpen ? null : tx.id)} className="w-full text-left px-3 py-2.5 flex items-center gap-2.5">
              <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded border shrink-0", cfg.bg, cfg.color)}>{tx.status}</span>
              <Flower2 className="w-3.5 h-3.5 text-primary/60 shrink-0" />
              <span className="text-xs font-semibold text-foreground truncate">{tx.article}</span>
              <span className="text-[10px] text-muted-foreground shrink-0">{tx.quantity.delivered}/{tx.quantity.total}</span>
              <span className="text-[10px] text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded border border-border/50 shrink-0 hidden sm:inline">{tx.shipmentLabel}</span>
              <span className="text-[10px] text-muted-foreground shrink-0 hidden sm:inline">{tx.supplier.split(" (")[0]}</span>
              {tx.deviation && <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />}
              <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground shrink-0 transition-transform ml-auto", isOpen && "rotate-180")} />
            </button>
            {isOpen && (
              <div className="px-3 pb-3">
                <TransactionDetail tx={tx} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OperationsIntelligence;

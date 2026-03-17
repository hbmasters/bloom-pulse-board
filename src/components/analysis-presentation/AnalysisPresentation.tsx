import { useState } from "react";
import {
  CheckCircle2, Clock, Loader2, AlertCircle, RefreshCw,
  FlaskConical, ChevronDown, ChevronUp, History,
  TrendingUp, TrendingDown, Minus, BarChart3, FileText, Database
} from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import type {
  AnalysisPresentationData, AnalysisStatus, AnalysisKPI,
  AnalysisTableData, AnalysisChart, AnalysisMethodiekMeta, AnalysisRunEntry
} from "./types";

/* ── Status config ── */

const statusConfig: Record<AnalysisStatus, { icon: typeof Clock; label: string; className: string; bg: string }> = {
  pending:   { icon: Clock,        label: "Pending",   className: "text-muted-foreground",  bg: "bg-muted/40" },
  running:   { icon: Loader2,      label: "Running",   className: "text-blue-400",          bg: "bg-blue-500/10" },
  completed: { icon: CheckCircle2, label: "Completed", className: "text-accent",            bg: "bg-accent/10" },
  blocked:   { icon: AlertCircle,  label: "Blocked",   className: "text-red-400",           bg: "bg-red-500/10" },
  stale:     { icon: RefreshCw,    label: "Stale",     className: "text-yellow-500",        bg: "bg-yellow-500/10" },
};

/* ── Section 1: Header ── */

const APHeader = ({ data }: { data: AnalysisPresentationData }) => {
  const status = data.status ? statusConfig[data.status] : null;
  const StatusIcon = status?.icon;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        {data.task_type === "analysis" && (
          <span className="inline-flex items-center gap-1 text-[9px] font-mono font-black px-2 py-0.5 rounded border bg-amber-500/10 text-amber-400 border-amber-500/20">
            <BarChart3 className="w-3 h-3" /> ANALYSIS
          </span>
        )}
        {data.methodiek?.methodiek_name && (
          <span className="text-[9px] font-mono font-bold text-amber-400/70 uppercase tracking-wider">
            {data.methodiek.methodiek_name}
          </span>
        )}
      </div>

      <h2 className="text-base font-bold text-foreground leading-tight">{data.title}</h2>

      <div className="flex items-center gap-3 flex-wrap">
        {status && StatusIcon && (
          <span className={`inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold px-2 py-1 rounded-md ${status.bg} ${status.className}`}>
            <StatusIcon className={`w-3 h-3 ${data.status === "running" ? "animate-spin" : ""}`} />
            {status.label}
          </span>
        )}
        {data.result_ready && (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-accent px-2 py-1 rounded-md bg-accent/10">
            <CheckCircle2 className="w-3 h-3" /> Result Ready
          </span>
        )}
        {data.updated_at && (
          <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1 ml-auto">
            <Clock className="w-3 h-3" /> {data.updated_at}
          </span>
        )}
      </div>
    </div>
  );
};

/* ── Section 2: Executive Summary ── */

const APSummary = ({ summary }: { summary: string }) => (
  <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
    <p className="text-sm text-foreground leading-relaxed">{summary}</p>
  </div>
);

/* ── Section 3: KPI Strip ── */

const TrendIcon = ({ trend }: { trend?: "up" | "down" | "neutral" }) => {
  if (trend === "up") return <TrendingUp className="w-3 h-3 text-accent" />;
  if (trend === "down") return <TrendingDown className="w-3 h-3 text-red-400" />;
  return <Minus className="w-3 h-3 text-muted-foreground" />;
};

const APKPIStrip = ({ kpis }: { kpis: AnalysisKPI[] }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
    {kpis.map((kpi, i) => (
      <div key={i} className="p-3 rounded-xl bg-card border border-border">
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block mb-1">
          {kpi.label}
        </span>
        <div className="flex items-end gap-1.5">
          <span className="text-lg font-black text-foreground tabular-nums leading-none">
            {kpi.value}
          </span>
          {kpi.unit && (
            <span className="text-[10px] font-mono text-muted-foreground mb-0.5">{kpi.unit}</span>
          )}
        </div>
        {(kpi.delta || kpi.trend) && (
          <div className="flex items-center gap-1 mt-1.5">
            <TrendIcon trend={kpi.trend} />
            {kpi.delta && (
              <span className={`text-[10px] font-mono ${
                kpi.trend === "up" ? "text-accent" : kpi.trend === "down" ? "text-red-400" : "text-muted-foreground"
              }`}>
                {kpi.delta}
              </span>
            )}
          </div>
        )}
      </div>
    ))}
  </div>
);

/* ── Section 4: Table ── */

const APTable = ({ table }: { table: AnalysisTableData }) => (
  <div className="rounded-xl border border-border overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            {table.columns.map(col => (
              <th
                key={col.key}
                className={`px-3 py-2.5 font-mono font-bold text-muted-foreground uppercase tracking-wider text-[10px] ${
                  col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"
                }`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, i) => (
            <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-muted/10 transition-colors">
              {table.columns.map(col => (
                <td
                  key={col.key}
                  className={`px-3 py-2.5 text-foreground/80 tabular-nums ${
                    col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"
                  }`}
                >
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

/* ── Section 5: Chart ── */

const APChart = ({ chart }: { chart: AnalysisChart }) => (
  <div className="p-4 rounded-xl bg-card border border-border">
    <h4 className="text-[11px] font-mono font-bold text-muted-foreground uppercase tracking-wider mb-3">
      {chart.title}
    </h4>
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        {chart.type === "line" ? (
          <LineChart data={chart.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                fontSize: 11,
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={chart.color || "hsl(var(--primary))"}
              strokeWidth={2}
              dot={{ r: 3, fill: chart.color || "hsl(var(--primary))" }}
              name={chart.valueLabel || "Waarde"}
            />
            {chart.value2Label && (
              <Line
                type="monotone"
                dataKey="value2"
                stroke={chart.color2 || "hsl(var(--accent))"}
                strokeWidth={2}
                dot={{ r: 3, fill: chart.color2 || "hsl(var(--accent))" }}
                name={chart.value2Label}
              />
            )}
          </LineChart>
        ) : (
          <BarChart data={chart.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                fontSize: 11,
              }}
            />
            <Bar
              dataKey="value"
              fill={chart.color || "hsl(var(--primary))"}
              radius={[4, 4, 0, 0]}
              name={chart.valueLabel || "Waarde"}
            />
            {chart.value2Label && (
              <Bar
                dataKey="value2"
                fill={chart.color2 || "hsl(var(--accent))"}
                radius={[4, 4, 0, 0]}
                name={chart.value2Label}
              />
            )}
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  </div>
);

/* ── Section 6: Methodiek Meta ── */

const APMethodiekMeta = ({ meta }: { meta: AnalysisMethodiekMeta }) => (
  <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
    <div className="flex items-center gap-2 mb-2">
      <FlaskConical className="w-3.5 h-3.5 text-amber-400" />
      <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">Methodiek</span>
    </div>
    <p className="text-sm font-bold text-foreground mb-1.5">{meta.methodiek_name}</p>
    <div className="flex items-center gap-3 flex-wrap text-[9px] font-mono text-muted-foreground">
      {meta.methodiek_id && <span>{meta.methodiek_id}</span>}
      {meta.methodiek_version && <span className="text-muted-foreground/50">{meta.methodiek_version}</span>}
      {meta.analysis_kind && (
        <span className="px-1.5 py-0.5 rounded bg-muted/30">{meta.analysis_kind}</span>
      )}
    </div>
    {meta.data_sources && meta.data_sources.length > 0 && (
      <div className="mt-2 flex items-start gap-1.5">
        <Database className="w-3 h-3 text-muted-foreground/40 mt-0.5 shrink-0" />
        <div className="flex flex-wrap gap-1">
          {meta.data_sources.map((src, i) => (
            <span key={i} className="text-[9px] font-mono text-muted-foreground/60 px-1.5 py-0.5 rounded bg-muted/20">
              {src}
            </span>
          ))}
        </div>
      </div>
    )}
    {meta.query_scope && (
      <p className="text-[10px] font-mono text-muted-foreground/50 mt-1.5">Scope: {meta.query_scope}</p>
    )}
  </div>
);

/* ── Section 7: Full Detail ── */

const APFullDetail = ({ payload }: { payload: string }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-muted-foreground hover:text-foreground transition-colors w-full mb-2"
      >
        <FileText className="w-3.5 h-3.5" />
        <span>Volledig Rapport</span>
        {expanded ? <ChevronUp className="w-3 h-3 ml-auto" /> : <ChevronDown className="w-3 h-3 ml-auto" />}
      </button>
      {expanded && (
        <div className="p-4 rounded-xl bg-muted/20 border border-border">
          <div className="text-xs text-foreground/80 leading-relaxed whitespace-pre-wrap font-mono">
            {payload}
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Run History ── */

const APRunHistory = ({ runs }: { runs: AnalysisRunEntry[] }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-muted-foreground hover:text-foreground transition-colors w-full"
      >
        <History className="w-3.5 h-3.5" />
        <span>Analyse Historie</span>
        <span className="text-[8px] text-muted-foreground/40 ml-1">({runs.length} runs)</span>
        {expanded ? <ChevronUp className="w-3 h-3 ml-auto" /> : <ChevronDown className="w-3 h-3 ml-auto" />}
      </button>
      {expanded && (
        <div className="mt-2 space-y-2">
          {runs.map((run, idx) => {
            const cfg = statusConfig[run.analysis_status];
            const Icon = cfg.icon;
            return (
              <div key={run.run_id} className="p-3 rounded-lg bg-muted/10 border border-border/40">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`inline-flex items-center gap-1 text-[9px] font-mono ${cfg.className}`}>
                    <Icon className="w-3 h-3" /> {cfg.label}
                  </span>
                  <span className="text-[9px] font-mono text-muted-foreground/40">{run.methodiek_version}</span>
                  {run.data_scope && (
                    <span className="text-[9px] font-mono text-muted-foreground/30">{run.data_scope}</span>
                  )}
                  <span className="text-[9px] font-mono text-muted-foreground/40 ml-auto">{run.created_at}</span>
                  {idx === 0 && (
                    <span className="text-[7px] font-mono font-bold text-primary px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20">
                      LATEST
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-foreground/70 leading-relaxed">{run.result_summary}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ── Main Presentation Component ── */

interface AnalysisPresentationProps {
  data: AnalysisPresentationData;
  compact?: boolean;
}

const AnalysisPresentation = ({ data, compact = false }: AnalysisPresentationProps) => {
  const gap = compact ? "space-y-3" : "space-y-5";

  return (
    <div className={gap}>
      {/* Section 1: Header */}
      <APHeader data={data} />

      {/* Section 2: Executive Summary */}
      {data.summary && <APSummary summary={data.summary} />}

      {/* Section 3: KPI Strip */}
      {data.kpis && data.kpis.length > 0 && <APKPIStrip kpis={data.kpis} />}

      {/* Section 4: Table */}
      {data.table && data.table.rows.length > 0 && <APTable table={data.table} />}

      {/* Section 5: Chart */}
      {data.chart && data.chart.data.length > 0 && <APChart chart={data.chart} />}

      {/* Section 6: Methodiek Meta */}
      {data.methodiek && <APMethodiekMeta meta={data.methodiek} />}

      {/* Section 7: Full Detail */}
      {data.detail_payload && <APFullDetail payload={data.detail_payload} />}

      {/* Run History */}
      {data.run_history && data.run_history.length > 0 && <APRunHistory runs={data.run_history} />}
    </div>
  );
};

export default AnalysisPresentation;
export { APHeader, APSummary, APKPIStrip, APTable, APChart, APMethodiekMeta, APFullDetail, APRunHistory };

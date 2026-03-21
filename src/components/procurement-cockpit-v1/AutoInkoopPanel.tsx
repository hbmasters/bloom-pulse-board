import { useState, useEffect, useMemo } from "react";
import {
  ShoppingBag, CheckCircle2, Clock, AlertTriangle,
  Loader2, FileText, ArrowRight, ShieldCheck, Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

type ProposalPhase = "voorstel" | "conceptorder" | "klaar_voor_goedkeuring" | "auto_buy_mogelijk";

interface OrderProposal {
  id: string;
  product_name: string;
  recommended_action: string;
  target_quantity: number | null;
  target_price: number | null;
  source_type: string;
  source_context: string | null;
  reasoning: string | null;
  priority: string;
  confidence: number;
  execution_status: string;
  execution_mode: string;
  risk_level: string;
  phase: ProposalPhase;
  eligible_auto_buy: boolean;
}

const phaseConfig: Record<ProposalPhase, { label: string; color: string; icon: typeof FileText }> = {
  voorstel: { label: "Voorstel", color: "text-primary bg-primary/10 border-primary/20", icon: FileText },
  conceptorder: { label: "Conceptorder", color: "text-cyan-500 bg-cyan-500/10 border-cyan-500/20", icon: Clock },
  klaar_voor_goedkeuring: { label: "Klaar voor goedkeuring", color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20", icon: AlertTriangle },
  auto_buy_mogelijk: { label: "Auto-buy mogelijk", color: "text-accent bg-accent/10 border-accent/20", icon: Zap },
};

const priorityColors: Record<string, string> = {
  critical: "text-destructive bg-destructive/10 border-destructive/20",
  high: "text-orange-500 bg-orange-500/10 border-orange-500/20",
  medium: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
  low: "text-muted-foreground bg-muted/50 border-border",
};

const fmt = (n: number) => n.toLocaleString("nl-NL");
const fmtPrice = (n: number) => `€${n.toFixed(3)}`;

const AutoInkoopPanel = () => {
  const [proposals, setProposals] = useState<OrderProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProposals = async () => {
      setLoading(true);
      setError(null);

      const { data, error: fetchErr } = await supabase
        .from("execution_intents")
        .select("*")
        .in("action_category", ["operations", "procurement"])
        .order("urgency_score", { ascending: false });

      if (fetchErr) {
        setError(fetchErr.message);
        setLoading(false);
        return;
      }

      const mapped: OrderProposal[] = (data || []).map((row) => {
        // Determine phase based on execution_status
        let phase: ProposalPhase = "voorstel";
        if (row.execution_status === "approved") phase = "klaar_voor_goedkeuring";
        else if (row.execution_status === "prepared") phase = "conceptorder";
        else if (row.execution_mode === "auto" && row.confidence >= 0.9) phase = "auto_buy_mogelijk";

        return {
          id: row.id,
          product_name: row.product_name || row.recommended_action,
          recommended_action: row.recommended_action,
          target_quantity: row.execution_payload && typeof row.execution_payload === "object" && !Array.isArray(row.execution_payload) ? (row.execution_payload as Record<string, unknown>).quantity as number | null ?? null : null,
          target_price: row.current_price as number | null,
          source_type: row.source_type,
          source_context: row.source_context,
          reasoning: row.reasoning,
          priority: row.priority,
          confidence: row.confidence as number,
          execution_status: row.execution_status,
          execution_mode: row.execution_mode,
          risk_level: row.risk_level,
          phase,
          eligible_auto_buy: row.execution_mode === "auto" && (row.confidence as number) >= 0.9 && row.risk_level === "low",
        };
      });

      setProposals(mapped);
      setLoading(false);
    };

    fetchProposals();
  }, []);

  const phaseGroups = useMemo(() => {
    const groups: Record<ProposalPhase, OrderProposal[]> = {
      voorstel: [],
      conceptorder: [],
      klaar_voor_goedkeuring: [],
      auto_buy_mogelijk: [],
    };
    proposals.forEach(p => groups[p.phase].push(p));
    return groups;
  }, [proposals]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 gap-2 text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-[11px] font-medium">Ordervoorstellen laden...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-[11px] text-destructive flex items-center gap-2">
        <AlertTriangle className="w-4 h-4" />
        Fout bij laden: {error}
      </div>
    );
  }

  if (proposals.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <ShoppingBag className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
        <h3 className="text-sm font-semibold text-foreground mb-1">Geen ordervoorstellen beschikbaar</h3>
        <p className="text-[11px] text-muted-foreground">
          Er zijn momenteel geen actieve execution intents met inkoopacties.
          Voorstellen worden gegenereerd wanneer het systeem tekorten of inkoopkansen detecteert.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(Object.entries(phaseConfig) as [ProposalPhase, typeof phaseConfig[ProposalPhase]][]).map(([key, cfg]) => {
          const count = phaseGroups[key].length;
          const PhaseIcon = cfg.icon;
          return (
            <div key={key} className="rounded-xl border border-border bg-card p-3 flex items-center gap-3">
              <PhaseIcon className={cn("w-4 h-4", cfg.color.split(" ")[0])} />
              <div>
                <span className="text-[9px] font-medium text-muted-foreground uppercase block">{cfg.label}</span>
                <span className="text-lg font-bold font-mono text-foreground">{count}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Phase pipeline */}
      <div className="flex items-center gap-2 text-[9px] text-muted-foreground font-medium">
        {(["voorstel", "conceptorder", "klaar_voor_goedkeuring", "auto_buy_mogelijk"] as ProposalPhase[]).map((phase, i) => (
          <div key={phase} className="flex items-center gap-2">
            {i > 0 && <ArrowRight className="w-3 h-3 text-border" />}
            <span className={cn(
              "px-2 py-0.5 rounded-full border",
              phaseGroups[phase].length > 0 ? phaseConfig[phase].color : "text-muted-foreground/40 bg-muted/20 border-border/30"
            )}>
              {phaseConfig[phase].label} ({phaseGroups[phase].length})
            </span>
          </div>
        ))}
      </div>

      {/* Proposals table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {["Fase", "Product / Actie", "Prioriteit", "Doel", "Bron", "Risico", "Confidence", "Status", "Auto-buy"].map(h => (
                <th key={h} className="px-3 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {proposals.map(p => {
              const pc = phaseConfig[p.phase];
              const PhaseIcon = pc.icon;
              return (
                <tr key={p.id} className="border-b border-border/30 hover:bg-muted/10 transition-colors">
                  <td className="px-3 py-2.5">
                    <span className={cn("text-[9px] font-medium px-2 py-0.5 rounded-full border inline-flex items-center gap-1", pc.color)}>
                      <PhaseIcon className="w-2.5 h-2.5" />
                      {pc.label}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="font-medium text-foreground">{p.product_name || "—"}</div>
                    <div className="text-[9px] text-muted-foreground mt-0.5 max-w-xs truncate">{p.recommended_action}</div>
                    {p.reasoning && (
                      <div className="text-[9px] text-muted-foreground/70 italic mt-0.5 max-w-xs truncate">{p.reasoning}</div>
                    )}
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase", priorityColors[p.priority] || "text-muted-foreground bg-muted border-border")}>
                      {p.priority}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 font-mono text-muted-foreground">
                    {p.target_quantity != null ? `${fmt(p.target_quantity)} st` : "—"}
                    {p.target_price != null && (
                      <span className="block text-foreground">{fmtPrice(p.target_price)}</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="text-[9px] text-muted-foreground">{p.source_type}</span>
                    {p.source_context && (
                      <span className="block text-[8px] text-muted-foreground/60 truncate max-w-[120px]">{p.source_context}</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={cn(
                      "text-[9px] font-bold uppercase",
                      p.risk_level === "critical" ? "text-destructive" : p.risk_level === "high" ? "text-orange-500" : p.risk_level === "medium" ? "text-yellow-500" : "text-accent"
                    )}>
                      {p.risk_level}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1">
                      <div className="w-10 h-1.5 rounded-full bg-muted/30 overflow-hidden">
                        <div
                          className={cn("h-full rounded-full", p.confidence >= 0.85 ? "bg-accent" : p.confidence >= 0.6 ? "bg-yellow-500" : "bg-destructive")}
                          style={{ width: `${p.confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-[9px] font-mono font-bold text-muted-foreground">{Math.round(p.confidence * 100)}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={cn(
                      "text-[8px] font-medium px-1.5 py-0.5 rounded-full border",
                      p.execution_status === "approved" || p.execution_status === "completed" ? "text-accent bg-accent/10 border-accent/20"
                      : p.execution_status === "in_progress" ? "text-primary bg-primary/10 border-primary/20"
                      : p.execution_status === "rejected" || p.execution_status === "failed" ? "text-destructive bg-destructive/10 border-destructive/20"
                      : "text-muted-foreground bg-muted border-border"
                    )}>
                      {p.execution_status}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    {p.eligible_auto_buy ? (
                      <span className="text-[9px] font-medium px-2 py-0.5 rounded-full border text-accent bg-accent/10 border-accent/20 flex items-center gap-1 w-fit">
                        <Zap className="w-2.5 h-2.5" /> Geschikt
                      </span>
                    ) : (
                      <span className="text-[9px] text-muted-foreground/50">Niet beschikbaar</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Auto-buy readiness notice */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-[11px] font-semibold text-foreground mb-1">Auto-Inkoop Status</h4>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Automatisch inkopen is nog niet actief. Het systeem toont ordervoorstellen op basis van execution intents.
              Acties doorlopen de fases: <strong>Voorstel → Conceptorder → Goedkeuring → Auto-buy</strong>.
              Volledige automatisering wordt ingeschakeld wanneer bronkoppelingen en goedkeuringsregels zijn ingericht.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoInkoopPanel;

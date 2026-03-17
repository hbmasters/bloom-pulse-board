import { cn } from "@/lib/utils";
import { Activity, Server, AlertTriangle, Clock, Loader2, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  currentBuild, phases, nodes, nodeStatusStyles, risks, riskStyles, timeline,
  type PhaseStatus,
} from "@/components/build-radar/build-radar-data";

const PhaseIcon = ({ status }: { status: PhaseStatus }) => {
  if (status === "done") return <CheckCircle2 className="w-2.5 h-2.5 text-accent" />;
  if (status === "active") return <Loader2 className="w-2.5 h-2.5 text-primary animate-spin" />;
  return <span className="w-2.5 h-2.5 rounded-full border border-muted-foreground/20" />;
};

const BuildRadarStrip = () => {
  const activePhase = phases.find(p => p.status === "active");
  const doneCount = phases.filter(p => p.status === "done").length;
  const highRisks = risks.filter(r => r.severity === "high").length;
  const medRisks = risks.filter(r => r.severity === "medium").length;
  const activeNode = nodes.find(n => n.status === "active");

  return (
    <div className="border-b border-border bg-card/50 backdrop-blur-sm px-3 py-2">
      <div className="flex items-center gap-4 overflow-x-auto scrollbar-thin">
        {/* Build status */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="text-[10px] font-mono font-bold text-foreground uppercase tracking-wider">Build Active</span>
        </div>

        <span className="w-px h-4 bg-border shrink-0" />

        {/* Current phase */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Activity className="w-3 h-3 text-primary" />
          <span className="text-[10px] font-mono text-muted-foreground">Phase:</span>
          <span className="text-[10px] font-mono font-bold text-foreground">{currentBuild.phase}</span>
          {activePhase && (
            <div className="flex items-center gap-1 ml-1">
              <Progress value={activePhase.progress} className="h-1 w-12" />
              <span className="text-[9px] font-mono text-muted-foreground">{activePhase.progress}%</span>
            </div>
          )}
        </div>

        <span className="w-px h-4 bg-border shrink-0" />

        {/* Pipeline progress */}
        <div className="flex items-center gap-1 shrink-0">
          {phases.map((p, i) => (
            <PhaseIcon key={i} status={p.status} />
          ))}
          <span className="text-[9px] font-mono text-muted-foreground ml-1">{doneCount}/{phases.length}</span>
        </div>

        <span className="w-px h-4 bg-border shrink-0" />

        {/* Node */}
        {activeNode && (
          <div className="flex items-center gap-1.5 shrink-0">
            <Server className="w-3 h-3 text-muted-foreground" />
            <span className="text-[10px] font-mono text-muted-foreground">{activeNode.name}</span>
            <span className="text-[9px] font-mono text-muted-foreground/50">{activeNode.load}%</span>
          </div>
        )}

        <span className="w-px h-4 bg-border shrink-0" />

        {/* Risks */}
        <div className="flex items-center gap-1.5 shrink-0">
          <AlertTriangle className="w-3 h-3 text-muted-foreground" />
          {highRisks > 0 && (
            <span className="text-[9px] font-mono font-bold text-red-400">{highRisks} high</span>
          )}
          {medRisks > 0 && (
            <span className="text-[9px] font-mono text-orange-400">{medRisks} med</span>
          )}
          {highRisks === 0 && medRisks === 0 && (
            <span className="text-[9px] font-mono text-accent">Clear</span>
          )}
        </div>

        <span className="w-px h-4 bg-border shrink-0" />

        {/* ETA */}
        <div className="flex items-center gap-1.5 shrink-0 ml-auto">
          <Clock className="w-3 h-3 text-muted-foreground" />
          <span className="text-[9px] font-mono text-muted-foreground">ETA:</span>
          <span className="text-[9px] font-mono font-bold text-primary">{timeline.etaNextResult}</span>
        </div>
      </div>
    </div>
  );
};

export default BuildRadarStrip;

import { cn } from "@/lib/utils";
import { Radar, Activity, Clock, Server, ListOrdered, Gauge, AlertTriangle, Milestone, CheckCircle2, Circle, Lock, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  currentBuild, phases, nodes, nodeStatusStyles, queue, priorityStyles,
  backgroundLoad, risks, riskStyles, timeline,
  type PhaseStatus,
} from "@/components/build-radar/build-radar-data";

/* ── Phase status icon ── */
const PhaseIcon = ({ status }: { status: PhaseStatus }) => {
  if (status === "done") return <CheckCircle2 className="w-3.5 h-3.5 text-accent" />;
  if (status === "active") return <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />;
  if (status === "blocked") return <Lock className="w-3.5 h-3.5 text-destructive" />;
  return <Circle className="w-3.5 h-3.5 text-muted-foreground/30" />;
};

/* ── Section wrapper (reuses IHSectionShell pattern) ── */
const Section = ({ icon: Icon, title, children }: { icon: typeof Activity; title: string; children: React.ReactNode }) => (
  <section className="rounded-2xl border border-border bg-card/70 backdrop-blur-sm overflow-hidden">
    <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <h2 className="text-sm font-bold text-foreground tracking-tight">{title}</h2>
    </div>
    <div className="p-5">{children}</div>
  </section>
);

/* ── SECTION 1: Current Build Status ── */
const BuildStatusCards = () => {
  const cards = [
    { label: "Current Phase", value: currentBuild.phase, accent: true },
    { label: "Current Task", value: currentBuild.task },
    { label: "Build Alive", value: currentBuild.alive ? "Active" : "Stopped", dot: currentBuild.alive },
    { label: "Time Running", value: currentBuild.timeRunning },
    { label: "Last Completed", value: currentBuild.lastCompleted },
    { label: "ETA Next Milestone", value: currentBuild.etaNextMilestone },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map(c => (
        <div key={c.label} className="rounded-xl border border-border bg-card/60 p-3 space-y-1">
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-muted-foreground/50">{c.label}</span>
          <div className="flex items-center gap-1.5">
            {c.dot !== undefined && (
              <span className={`w-2 h-2 rounded-full ${c.dot ? "bg-accent animate-pulse" : "bg-destructive"}`} />
            )}
            <span className={cn("text-xs font-bold truncate", c.accent ? "text-primary" : "text-foreground")}>{c.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

/* ── SECTION 2: Phase Pipeline ── */
const PhasePipeline = () => (
  <Section icon={Milestone} title="Phase Pipeline">
    <div className="space-y-1.5">
      {phases.map((p, i) => (
        <div key={p.name} className={cn(
          "flex items-center gap-3 rounded-lg border p-3 text-xs",
          p.status === "active" ? "border-primary/30 bg-primary/5" : "border-border bg-card/30"
        )}>
          <span className="text-muted-foreground/40 font-mono w-4 text-right">{i + 1}</span>
          <PhaseIcon status={p.status} />
          <span className="font-bold text-foreground flex-1 min-w-0 truncate">{p.name}</span>
          <div className="hidden sm:flex items-center gap-2 w-28">
            <Progress value={p.progress} className="h-1.5 flex-1" />
            <span className="text-[10px] font-mono text-muted-foreground w-8 text-right">{p.progress}%</span>
          </div>
          <span className="hidden md:inline text-[10px] font-mono text-muted-foreground/50 w-24 truncate">{p.dependency}</span>
          <span className="hidden lg:inline text-[10px] font-mono text-muted-foreground/50 w-20 truncate">{p.node}</span>
          {p.blocker && <span className="text-[9px] font-mono text-orange-400 truncate max-w-[120px]">{p.blocker}</span>}
        </div>
      ))}
    </div>
  </Section>
);

/* ── SECTION 3: Node / Agent Status ── */
const NodeStatus = () => (
  <Section icon={Server} title="Node / Agent Status">
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {nodes.map(n => {
        const s = nodeStatusStyles[n.status];
        return (
          <div key={n.name} className="rounded-xl border border-border bg-card/40 p-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${s.dot}`} />
              <span className="text-xs font-bold text-foreground">{n.name}</span>
              <span className={`ml-auto text-[9px] font-mono font-bold uppercase ${s.text}`}>{s.label}</span>
            </div>
            <div className="text-[10px] font-mono text-muted-foreground space-y-0.5">
              <div>Type: {n.type} · Role: {n.role}</div>
              {n.activeAgent && <div className="text-primary">Agent: {n.activeAgent}</div>}
            </div>
            {n.status === "active" && (
              <div className="flex items-center gap-2">
                <Progress value={n.load} className="h-1.5 flex-1" />
                <span className="text-[10px] font-mono text-muted-foreground">{n.load}%</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  </Section>
);

/* ── SECTION 4: Queue Overview ── */
const QueueOverview = () => (
  <Section icon={ListOrdered} title="Queue Overview">
    <div className="space-y-1.5">
      <div className="hidden sm:flex items-center gap-3 px-3 py-1 text-[9px] font-mono font-bold uppercase tracking-widest text-muted-foreground/40">
        <span className="flex-1">Task</span>
        <span className="w-16 text-center">Priority</span>
        <span className="w-28">Dependency</span>
        <span className="w-16 text-right">Runtime</span>
        <span className="w-16 text-right">Start</span>
      </div>
      {queue.map((q, i) => (
        <div key={i} className="flex items-center gap-3 rounded-lg border border-border bg-card/30 px-3 py-2.5 text-xs">
          <span className="flex-1 font-bold text-foreground truncate">{q.task}</span>
          <span className={cn("w-16 text-center text-[10px] font-mono font-bold uppercase", priorityStyles[q.priority].text)}>{q.priority}</span>
          <span className="hidden sm:inline w-28 text-[10px] font-mono text-muted-foreground/50 truncate">{q.dependency}</span>
          <span className="hidden sm:inline w-16 text-right text-[10px] font-mono text-muted-foreground">{q.runtime}</span>
          <span className="w-16 text-right text-[10px] font-mono text-muted-foreground">{q.estimatedStart}</span>
        </div>
      ))}
    </div>
  </Section>
);

/* ── SECTION 5: Background Load ── */
const BackgroundLoadSection = () => {
  const interferenceColor = { low: "text-accent", medium: "text-yellow-500", high: "text-destructive" }[backgroundLoad.interference];
  return (
    <Section icon={Gauge} title="Background Load">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-border bg-card/40 p-3 space-y-1">
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-muted-foreground/50">{backgroundLoad.cronLoad.label}</span>
          <div className="text-sm font-bold text-foreground">{backgroundLoad.cronLoad.active}<span className="text-muted-foreground font-normal">/{backgroundLoad.cronLoad.total}</span></div>
        </div>
        <div className="rounded-xl border border-border bg-card/40 p-3 space-y-1">
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-muted-foreground/50">{backgroundLoad.telemetry.label}</span>
          <div className="text-sm font-bold text-foreground">{backgroundLoad.telemetry.signals} <span className="text-[10px] font-mono text-muted-foreground font-normal">{backgroundLoad.telemetry.rate}</span></div>
        </div>
        <div className="rounded-xl border border-border bg-card/40 p-3 space-y-1">
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-muted-foreground/50">{backgroundLoad.maintenance.label}</span>
          <div className="text-sm font-bold text-foreground">{backgroundLoad.maintenance.pending} pending</div>
        </div>
        <div className="rounded-xl border border-border bg-card/40 p-3 space-y-1">
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-muted-foreground/50">Build Interference</span>
          <div className={cn("text-sm font-bold uppercase", interferenceColor)}>{backgroundLoad.interference}</div>
        </div>
      </div>
    </Section>
  );
};

/* ── SECTION 6: Risks / Bottlenecks ── */
const RisksSection = () => (
  <Section icon={AlertTriangle} title="Risks / Bottlenecks">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {risks.map((r, i) => {
        const s = riskStyles[r.severity];
        return (
          <div key={i} className={cn("rounded-lg border p-3 space-y-1", s.bg, s.border)}>
            <div className="flex items-center gap-2">
              <span className={cn("w-1.5 h-1.5 rounded-full", s.dot)} />
              <span className="text-xs font-bold text-foreground">{r.title}</span>
              <span className={cn("ml-auto text-[9px] font-mono font-bold uppercase", s.text)}>{r.severity}</span>
            </div>
            <p className="text-[11px] text-muted-foreground">{r.detail}</p>
            <span className="text-[9px] font-mono text-muted-foreground/40 uppercase">{r.category}</span>
          </div>
        );
      })}
    </div>
  </Section>
);

/* ── SECTION 7: Build Timeline ── */
const BuildTimeline = () => (
  <Section icon={Clock} title="Build Timeline">
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {[
        { label: "Current Milestone", value: timeline.currentMilestone },
        { label: "Next Milestone", value: timeline.nextMilestone },
        { label: "Next Phase", value: timeline.nextPhase },
        { label: "ETA Next Result", value: timeline.etaNextResult, accent: true },
      ].map(t => (
        <div key={t.label} className="rounded-xl border border-border bg-card/40 p-3 space-y-1">
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-muted-foreground/50">{t.label}</span>
          <span className={cn("text-xs font-bold block", t.accent ? "text-primary" : "text-foreground")}>{t.value}</span>
        </div>
      ))}
    </div>
  </Section>
);

/* ── Main Page ── */
const BuildRadar = () => (
  <div className="h-full overflow-y-auto">
    <div className="max-w-[1400px] mx-auto p-4 md:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Radar className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-black tracking-wide text-foreground uppercase">Build Radar</h1>
          <p className="text-[11px] text-muted-foreground font-mono">Pipeline · Nodes · Queue · Risks · Timeline</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full border bg-accent/10 text-accent border-accent/20">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Build Active
          </span>
          <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">LABS</span>
        </div>
      </div>

      {/* Section 1 */}
      <BuildStatusCards />

      {/* Sections 2-7 */}
      <PhasePipeline />
      <NodeStatus />
      <QueueOverview />
      <BackgroundLoadSection />
      <RisksSection />
      <BuildTimeline />
    </div>
  </div>
);

export default BuildRadar;

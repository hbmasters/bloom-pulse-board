import { CheckCircle, Clock, Circle, ArrowDown, Cpu, Database, Brain, Zap, BarChart3, ShoppingCart, FlaskConical, Factory, TrendingUp, LayoutGrid, Bot, Server, MonitorSpeaker, HardDrive } from "lucide-react";

type Status = "live" | "partial" | "planned";

const statusConfig: Record<Status, { label: string; class: string; icon: typeof CheckCircle }> = {
  live: { label: "Live", class: "bg-accent/10 text-accent border-accent/25", icon: CheckCircle },
  partial: { label: "Partial", class: "bg-yellow-500/10 text-yellow-500 border-yellow-500/25", icon: Clock },
  planned: { label: "Planned", class: "bg-muted-foreground/10 text-muted-foreground border-border", icon: Circle },
};

const StatusBadge = ({ status }: { status: Status }) => {
  const c = statusConfig[status];
  const Icon = c.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full border ${c.class}`}>
      <Icon className="w-2.5 h-2.5" />
      {c.label}
    </span>
  );
};

interface LayerCard {
  title: string;
  icon: typeof Database;
  purpose: string;
  sources: string[];
  status: Status;
}

interface EngineCard {
  title: string;
  icon: typeof Brain;
  purpose: string;
  outputs: string[];
  status: Status;
}

interface ExecCard {
  title: string;
  icon: typeof Bot;
  purpose: string;
  description: string;
  status: Status;
}

const coreTruthLayers: LayerCard[] = [
  {
    title: "Commercial Truth",
    icon: BarChart3,
    purpose: "Verkooporders, klantdata, omzet- en margecijfers als commerciële waarheid.",
    sources: ["Florisoft orderdata", "Klant-productmatrix", "Prijshistorie"],
    status: "live",
  },
  {
    title: "Lot / Procurement Truth",
    icon: ShoppingCart,
    purpose: "Inkooppartijen, aanbod, vrije voorraad en leveranciersprijzen als inkoopwaarheid.",
    sources: ["Florisoft inkoop", "Leveranciersaanbod", "Voorraadstatus"],
    status: "partial",
  },
  {
    title: "Production Truth",
    icon: Factory,
    purpose: "Productielijnen, capaciteit, stelen/uur en APU als productiewaarheid.",
    sources: ["Lijnregistratie", "Productietellingen", "Personeelsbezetting"],
    status: "partial",
  },
  {
    title: "Recipe / Product Structure Truth",
    icon: FlaskConical,
    purpose: "Recepturen, componentmix, stelenopbouw en complexiteitsstructuur per product.",
    sources: ["Receptdefinities", "Componentenlijst", "Lengte-/kwaliteitsmix"],
    status: "partial",
  },
];

const decisionEngines: EngineCard[] = [
  {
    title: "Profit Engine",
    icon: TrendingUp,
    purpose: "Berekent winstgevendheid per product, klant en kanaal. Stuurt marge-optimalisatie.",
    outputs: ["Marge per product", "Klant-winstgevendheid", "Pricing-advies"],
    status: "live",
  },
  {
    title: "Purchasing Decision Layer",
    icon: ShoppingCart,
    purpose: "Purchasing List en inkoopbeslissingen op basis van behoefte, voorraad en aanbod.",
    outputs: ["Inkoopadvies", "Leverancierselectie", "Volume-allocatie"],
    status: "partial",
  },
  {
    title: "Recipe & Allocation Intelligence",
    icon: FlaskConical,
    purpose: "Alternatieve recepturen en componentallocatie bij tekorten of prijsdruk.",
    outputs: ["Alternatieve recepten", "Substitutie-advies", "Kostenimpact"],
    status: "planned",
  },
  {
    title: "Production Complexity Engine",
    icon: Factory,
    purpose: "Complexiteitsindex, stelen/uur per recept en operationele druk per lijn.",
    outputs: ["Complexity index", "Stelen/uur/persoon", "Lijndruk-score"],
    status: "partial",
  },
  {
    title: "Forecast / Demand Intelligence",
    icon: Brain,
    purpose: "Vraagvoorspelling, seizoenspatronen en piekherkenning voor inkoop en productie.",
    outputs: ["Vraagforecast", "Piekwaarschuwingen", "Seizoensanalyse"],
    status: "planned",
  },
];

const executionLayer: ExecCard[] = [
  {
    title: "AI Kanban",
    icon: LayoutGrid,
    purpose: "Taakbeheer gestuurd door AI-prioritering en automatische toewijzing.",
    description: "Operationeel taakbord met AI-gestuurde prioritering",
    status: "live",
  },
  {
    title: "Kanban Prompt Layer",
    icon: Brain,
    purpose: "Prompt-gestuurde taakgeneratie vanuit engines en alerts.",
    description: "Vertaalt engine-output naar uitvoerbare taken",
    status: "partial",
  },
  {
    title: "AI Orchestrator",
    icon: Bot,
    purpose: "Centrale coördinatie van agents, taken en beslissingen.",
    description: "Routeert werk naar juiste agents en systemen",
    status: "partial",
  },
  {
    title: "Mac Studio",
    icon: MonitorSpeaker,
    purpose: "Primaire rekennode voor zware AI-taken en modelinference.",
    description: "Hoofdnode voor AI-processing en orchestratie",
    status: "live",
  },
  {
    title: "Mac mini nodes",
    icon: HardDrive,
    purpose: "Edge-nodes voor gedistribueerde taken en parallelle verwerking.",
    description: "Gedistribueerde verwerking en taakuitvoering",
    status: "planned",
  },
];

const FlowArrow = () => (
  <div className="flex justify-center py-3">
    <div className="flex flex-col items-center gap-1 text-muted-foreground/40">
      <div className="w-px h-6 bg-border" />
      <ArrowDown className="w-4 h-4" />
    </div>
  </div>
);

const allItems = [
  ...coreTruthLayers.map(i => ({ ...i, layer: "Truth" })),
  ...decisionEngines.map(i => ({ ...i, layer: "Engine" })),
  ...executionLayer.map(i => ({ ...i, layer: "Execution" })),
];

const AIArchitecture = () => {
  const liveCount = allItems.filter(i => i.status === "live").length;
  const partialCount = allItems.filter(i => i.status === "partial").length;
  const plannedCount = allItems.filter(i => i.status === "planned").length;
  const totalCount = allItems.length;
  const progressPct = Math.round(((liveCount + partialCount * 0.5) / totalCount) * 100);

  return (
    <div className="flex-1 overflow-y-auto flex">
      {/* Main content */}
      <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-5xl space-y-2">
      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10">
            <Cpu className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">HBMaster AI Architecture</h1>
            <p className="text-[11px] font-mono text-muted-foreground">Systeemoverzicht — Data → Beslissing → Uitvoering</p>
          </div>
        </div>
        <div className="flex gap-4 mt-3 text-[10px] font-mono text-muted-foreground/60">
          {(["live", "partial", "planned"] as Status[]).map(s => (
            <span key={s} className="flex items-center gap-1.5">
              <StatusBadge status={s} /> = {s === "live" ? "Operationeel" : s === "partial" ? "Gedeeltelijk actief" : "Gepland"}
            </span>
          ))}
        </div>
      </div>

      {/* LAYER 1 — Core Truth */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Database className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-bold text-foreground">1 — Core Truth Layers</h2>
          <span className="text-[9px] font-mono text-muted-foreground/50 ml-1">Databronnen & waarheid</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {coreTruthLayers.map(layer => (
            <div key={layer.title} className="rounded-xl border border-border bg-card/70 p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <layer.icon className="w-4 h-4 text-primary/70 shrink-0" />
                  <span className="text-[13px] font-bold text-foreground">{layer.title}</span>
                </div>
                <StatusBadge status={layer.status} />
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{layer.purpose}</p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {layer.sources.map(s => (
                  <span key={s} className="text-[9px] font-mono bg-muted/40 text-muted-foreground px-2 py-0.5 rounded-md border border-border/50">{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <FlowArrow />

      {/* LAYER 2 — Decision Engines */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-bold text-foreground">2 — Decision Engines</h2>
          <span className="text-[9px] font-mono text-muted-foreground/50 ml-1">Analyse & besluitvorming</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {decisionEngines.map(engine => (
            <div key={engine.title} className="rounded-xl border border-border bg-card/70 p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <engine.icon className="w-4 h-4 text-primary/70 shrink-0" />
                  <span className="text-[13px] font-bold text-foreground">{engine.title}</span>
                </div>
                <StatusBadge status={engine.status} />
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{engine.purpose}</p>
              <div className="space-y-0.5 pt-1">
                {engine.outputs.map(o => (
                  <div key={o} className="flex items-center gap-1.5 text-[10px] font-mono text-foreground/60">
                    <Zap className="w-2.5 h-2.5 text-primary/40" />
                    {o}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <FlowArrow />

      {/* LAYER 3 — Execution */}
      <section className="pb-8">
        <div className="flex items-center gap-2 mb-3">
          <Server className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-bold text-foreground">3 — Execution Layer</h2>
          <span className="text-[9px] font-mono text-muted-foreground/50 ml-1">Orchestratie & uitvoering</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {executionLayer.map(item => (
            <div key={item.title} className="rounded-xl border border-border bg-card/70 p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <item.icon className="w-4 h-4 text-primary/70 shrink-0" />
                  <span className="text-[13px] font-bold text-foreground">{item.title}</span>
                </div>
                <StatusBadge status={item.status} />
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{item.purpose}</p>
              <p className="text-[10px] font-mono text-foreground/40 pt-1">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AIArchitecture;

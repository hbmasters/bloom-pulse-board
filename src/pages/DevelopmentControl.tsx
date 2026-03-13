import { Shield, Lock, ListOrdered, GitBranch, LayoutGrid, Terminal, Cpu, Clock, HeartPulse, RotateCcw, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import IHSectionShell from "@/components/intelligence-hub/IHSectionShell";
import { Badge } from "@/components/ui/badge";

interface ProtocolSection {
  icon: typeof Shield;
  title: string;
  badge?: string;
  badgeVariant?: "default" | "success" | "warning" | "critical";
  explanation: string;
  rules: string[];
  whyItMatters: string;
}

const sections: ProtocolSection[] = [
  {
    icon: Lock,
    title: "1. Build Phase Locking",
    badge: "ACTIEF",
    badgeVariant: "success",
    explanation: "Elke build fase wordt vergrendeld zodra deze gestart is. Geen nieuwe taken of wijzigingen worden geaccepteerd totdat de huidige fase volledig is afgerond.",
    rules: [
      "Fase-lock wordt automatisch geactiveerd bij start van een build.",
      "Nieuwe verzoeken worden in de wachtrij geplaatst, niet direct uitgevoerd.",
      "Unlock pas na verificatie dat alle deliverables compleet zijn.",
    ],
    whyItMatters: "Voorkomt scope creep en halve implementaties. Zorgt ervoor dat elke build volledig en stabiel is voordat de volgende begint.",
  },
  {
    icon: ListOrdered,
    title: "2. Queue Discipline",
    badge: "FIFO",
    badgeVariant: "default",
    explanation: "Alle verzoeken worden in volgorde van binnenkomst verwerkt. Geen verzoek mag een ander verzoek inhalen tenzij expliciet geprioriteerd via Kanban.",
    rules: [
      "First In, First Out (FIFO) als standaard.",
      "Prioriteit wijzigen kan alleen via Kanban board.",
      "Elk verzoek krijgt een uniek volgnummer.",
    ],
    whyItMatters: "Transparante volgorde van uitvoering. Het team weet altijd wat er wanneer wordt opgepakt.",
  },
  {
    icon: GitBranch,
    title: "3. Side Request Policy",
    badge: "STRICT",
    badgeVariant: "warning",
    explanation: "Side requests (tussendoor-verzoeken) worden niet direct uitgevoerd. Ze worden geregistreerd en ingepland volgens queue discipline.",
    rules: [
      "Side requests worden altijd eerst gelogd in de queue.",
      "Geen directe uitvoering — ook niet als het 'klein' lijkt.",
      "Uitzondering: alleen bij kritieke productie-blokkades (P0).",
    ],
    whyItMatters: "Voorkomt onderbrekingen van lopende builds. Kleine verzoeken stapelen zich op en veroorzaken vertragingen als ze niet beheerst worden.",
  },
  {
    icon: LayoutGrid,
    title: "4. Kanban als Single Source of Truth",
    badge: "SSOT",
    badgeVariant: "success",
    explanation: "Het Kanban board is de enige waarheid over wat er gebouwd wordt, wat de status is, en wat de prioriteit heeft.",
    rules: [
      "Als het niet op Kanban staat, bestaat het niet.",
      "Status updates alleen via Kanban (niet via chat of mail).",
      "Elke taak heeft een eigenaar, status en deadline.",
    ],
    whyItMatters: "Eén bron van waarheid elimineert miscommunicatie. Iedereen kijkt naar dezelfde realiteit.",
  },
  {
    icon: Terminal,
    title: "5. Prompt Control Layer",
    explanation: "AI-prompts worden beheerd via een gecontroleerde laag. Geen vrije-tekst prompts naar productiesystemen zonder validatie.",
    rules: [
      "Alle system prompts zijn geversioned en gereviewed.",
      "Wijzigingen aan prompts doorlopen hetzelfde build process.",
      "Output wordt gevalideerd tegen verwachte structuren.",
    ],
    whyItMatters: "Ongecontroleerde prompts leiden tot onvoorspelbaar gedrag. De prompt control layer waarborgt consistentie en kwaliteit.",
  },
  {
    icon: Cpu,
    title: "6. Orchestrator Execution Rules",
    explanation: "De AI-orchestrator volgt strikte uitvoeringsregels. Geen autonome beslissingen buiten gedefinieerde grenzen.",
    rules: [
      "Orchestrator voert alleen taken uit die in de queue staan.",
      "Maximaal 1 actieve taak tegelijk per domein.",
      "Bij onzekerheid: pauzeer en vraag om bevestiging.",
    ],
    whyItMatters: "Gecontroleerde AI-uitvoering voorkomt onbedoelde wijzigingen en houdt de mens in de loop.",
  },
  {
    icon: Clock,
    title: "7. Runtime Limits",
    badge: "MAX 30 MIN",
    badgeVariant: "warning",
    explanation: "Elke AI-executietaak heeft een maximale runtime. Taken die de limiet overschrijden worden automatisch gepauzeerd.",
    rules: [
      "Standaard limiet: 30 minuten per taak.",
      "Bij timeout: status wordt opgeslagen, taak gaat naar review.",
      "Lange taken worden opgesplitst in subtaken.",
    ],
    whyItMatters: "Voorkomt runaway processen en onbegrensde resource-consumptie. Dwingt het opsplitsen van complexe taken af.",
  },
  {
    icon: HeartPulse,
    title: "8. Heartbeat / Health Checks",
    badge: "ELKE 5 MIN",
    badgeVariant: "default",
    explanation: "Actieve processen sturen regelmatig een heartbeat. Bij uitblijven wordt het proces als unhealthy gemarkeerd.",
    rules: [
      "Heartbeat interval: elke 5 minuten tijdens actieve uitvoering.",
      "3 gemiste heartbeats = automatische pauzering.",
      "Health status is zichtbaar in het Systeem Status panel.",
    ],
    whyItMatters: "Detecteert vastgelopen processen vroegtijdig. Voorkomt stille failures die onopgemerkt blijven.",
  },
  {
    icon: RotateCcw,
    title: "9. Safe Recovery Protocol",
    badge: "ROLLBACK",
    badgeVariant: "critical",
    explanation: "Bij falen wordt een gecontroleerd herstelproces gevolgd. Geen handmatige fixes zonder protocol.",
    rules: [
      "Elke build creëert een herstelmoment (checkpoint).",
      "Bij falen: automatische rollback naar laatste stabiele staat.",
      "Recovery wordt gelogd en gereviewed voordat werk hervat wordt.",
    ],
    whyItMatters: "Gecontroleerd herstel voorkomt dat een fix erger is dan het probleem. Checkpoints garanderen dat er altijd een veilige staat beschikbaar is.",
  },
];

const DevelopmentControl = () => {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-black text-foreground tracking-tight">Development Control Protocol</h1>
            <p className="text-xs font-mono text-muted-foreground">HBMaster AI-Driven Development Governance</p>
          </div>
        </div>
      </div>

      {/* Summary Block */}
      <div className="rounded-xl border border-border bg-card/70 backdrop-blur-sm p-4">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold text-foreground uppercase tracking-wider">Protocol Status</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatusItem icon={CheckCircle2} label="Build Phase Lock" value="Actief" variant="success" />
          <StatusItem icon={ListOrdered} label="Queue Status" value="Operationeel" variant="success" />
          <StatusItem icon={LayoutGrid} label="Kanban SSOT" value="Actief" variant="success" />
          <StatusItem icon={AlertTriangle} label="Active Phase" value="Development" variant="warning" />
        </div>
      </div>

      {/* Protocol Sections */}
      <div className="grid grid-cols-1 gap-4">
        {sections.map((section) => (
          <IHSectionShell
            key={section.title}
            icon={section.icon}
            title={section.title}
            badge={section.badge}
            badgeVariant={section.badgeVariant}
          >
            <div className="space-y-4">
              <p className="text-sm text-foreground/80 leading-relaxed">{section.explanation}</p>

              <div className="space-y-1.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">Regels</span>
                <ul className="space-y-1.5">
                  {section.rules.map((rule, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground/90">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg bg-muted/50 border border-border px-3 py-2.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground block mb-1">Waarom dit ertoe doet</span>
                <p className="text-xs text-foreground/70 leading-relaxed">{section.whyItMatters}</p>
              </div>
            </div>
          </IHSectionShell>
        ))}
      </div>
    </div>
  );
};

const StatusItem = ({ icon: Icon, label, value, variant }: { icon: typeof CheckCircle2; label: string; value: string; variant: "success" | "warning" }) => (
  <div className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2">
    <Icon className={`w-3.5 h-3.5 ${variant === "success" ? "text-accent" : "text-yellow-500"}`} />
    <div>
      <span className="text-[9px] font-mono text-muted-foreground block">{label}</span>
      <span className={`text-xs font-bold ${variant === "success" ? "text-accent" : "text-yellow-500"}`}>{value}</span>
    </div>
  </div>
);

export default DevelopmentControl;

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Save, FlaskConical, GitBranch, CheckCircle2, PauseCircle,
  Database, FileText, Layers, Settings2, BarChart3, Pencil, X, Plus, Trash2
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Methodiek, AnalysisKind, MethodiekDataSource, MethodiekOutputSection } from "./methodiek-types";

const kindOptions: { value: AnalysisKind; label: string }[] = [
  { value: "mapping", label: "Mapping" }, { value: "margin", label: "Marge" },
  { value: "procurement", label: "Inkoop" }, { value: "production", label: "Productie" },
  { value: "logistics", label: "Logistiek" }, { value: "quality", label: "Kwaliteit" },
  { value: "general", label: "Algemeen" },
];

const sourceTypeOptions = ["api", "database", "csv", "manual", "erp"] as const;
const sectionTypeOptions = ["text", "number", "boolean", "list", "json"] as const;

interface Props {
  methodiek: Methodiek;
  onSave: (updated: Methodiek) => void;
}

const MethodiekEditor = ({ methodiek, onSave }: Props) => {
  const [draft, setDraft] = useState<Methodiek>(methodiek);
  const [editingPrompt, setEditingPrompt] = useState(false);
  const [dirty, setDirty] = useState(false);

  const update = <K extends keyof Methodiek>(key: K, value: Methodiek[K]) => {
    setDraft(prev => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const updateOutputModel = (key: string, value: string) => {
    setDraft(prev => ({ ...prev, output_model: { ...prev.output_model, [key]: value } }));
    setDirty(true);
  };

  const handleSave = () => {
    onSave({ ...draft, updated_at: "zojuist" });
    setDirty(false);
  };

  // Reset draft when methodiek changes
  if (draft.id !== methodiek.id) {
    setDraft(methodiek);
    setDirty(false);
    setEditingPrompt(false);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Editor header */}
      <div className="flex-shrink-0 px-5 py-4 border-b border-border bg-card/40 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <FlaskConical className="w-4 h-4 text-primary flex-shrink-0" />
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-foreground truncate">{draft.name}</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[9px] font-mono text-muted-foreground/50">{draft.methodiek_id}</span>
              <span className="text-[9px] font-mono text-muted-foreground/30">·</span>
              <span className="text-[9px] font-mono text-muted-foreground/50 flex items-center gap-0.5">
                <GitBranch className="w-2.5 h-2.5" />{draft.version}
              </span>
            </div>
          </div>
        </div>
        <Button size="sm" onClick={handleSave} disabled={!dirty}
          className={cn("text-xs gap-1.5", dirty ? "bg-primary text-primary-foreground" : "bg-muted/30 text-muted-foreground")}>
          <Save className="w-3.5 h-3.5" />
          Opslaan
        </Button>
      </div>

      {/* Editor body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Section: Metadata */}
        <section>
          <SectionHeader icon={Settings2} label="Metadata & Identificatie" />
          <div className="grid grid-cols-2 gap-3 mt-3">
            <Field label="Naam">
              <Input value={draft.name} onChange={e => update("name", e.target.value)} className="text-xs h-8" />
            </Field>
            <Field label="Methodiek ID">
              <Input value={draft.methodiek_id} onChange={e => update("methodiek_id", e.target.value)} className="text-xs h-8 font-mono" />
            </Field>
            <Field label="Analysis Kind">
              <select value={draft.analysis_kind} onChange={e => update("analysis_kind", e.target.value as AnalysisKind)}
                className="w-full h-8 px-2 text-xs bg-background border border-input rounded-md text-foreground">
                {kindOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </Field>
            <Field label="Versie">
              <Input value={draft.version} onChange={e => update("version", e.target.value)} className="text-xs h-8 font-mono" />
            </Field>
            <Field label="Status" className="col-span-2">
              <div className="flex gap-2">
                {(["active", "inactive"] as const).map(s => (
                  <button key={s} onClick={() => update("status", s)}
                    className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors",
                      draft.status === s
                        ? s === "active" ? "bg-emerald-400/10 border-emerald-400/30 text-emerald-400" : "bg-muted/20 border-border text-muted-foreground"
                        : "border-border/40 text-muted-foreground/40 hover:border-border"
                    )}>
                    {s === "active" ? <CheckCircle2 className="w-3 h-3" /> : <PauseCircle className="w-3 h-3" />}
                    {s === "active" ? "Actief" : "Inactief"}
                  </button>
                ))}
              </div>
            </Field>
          </div>
        </section>

        {/* Section: Description */}
        <section>
          <SectionHeader icon={FileText} label="Beschrijving" />
          <Textarea value={draft.description} onChange={e => update("description", e.target.value)}
            rows={2} className="mt-3 text-xs resize-none" />
        </section>

        {/* Section: Base Prompt */}
        <section>
          <div className="flex items-center justify-between">
            <SectionHeader icon={FlaskConical} label="Base Prompt / Instructie" />
            <button onClick={() => setEditingPrompt(!editingPrompt)}
              className="flex items-center gap-1 text-[10px] text-primary hover:text-primary/80 transition-colors">
              {editingPrompt ? <X className="w-3 h-3" /> : <Pencil className="w-3 h-3" />}
              {editingPrompt ? "Sluiten" : "Bewerken"}
            </button>
          </div>
          {editingPrompt ? (
            <Textarea value={draft.base_prompt} onChange={e => update("base_prompt", e.target.value)}
              rows={12} className="mt-3 text-xs font-mono resize-none leading-relaxed" />
          ) : (
            <div className="mt-3 p-3 rounded-lg bg-muted/10 border border-border/40">
              <pre className="text-[11px] font-mono text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {draft.base_prompt}
              </pre>
            </div>
          )}
        </section>

        {/* Section: Data Sources */}
        <section>
          <div className="flex items-center justify-between">
            <SectionHeader icon={Database} label="Data Bronnen" />
            <button onClick={() => {
              const newSources = [...draft.data_sources, { name: "", type: "api" as const, required: false }];
              update("data_sources", newSources);
            }} className="flex items-center gap-1 text-[10px] text-primary hover:text-primary/80">
              <Plus className="w-3 h-3" /> Toevoegen
            </button>
          </div>
          <div className="mt-3 space-y-2">
            {draft.data_sources.map((ds, i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-muted/10 border border-border/40">
                <Input value={ds.name} placeholder="Bron naam..."
                  onChange={e => {
                    const updated = [...draft.data_sources];
                    updated[i] = { ...ds, name: e.target.value };
                    update("data_sources", updated);
                  }}
                  className="text-xs h-7 flex-1" />
                <select value={ds.type} onChange={e => {
                  const updated = [...draft.data_sources];
                  updated[i] = { ...ds, type: e.target.value as MethodiekDataSource["type"] };
                  update("data_sources", updated);
                }} className="h-7 px-2 text-[10px] bg-background border border-input rounded-md text-foreground font-mono">
                  {sourceTypeOptions.map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
                </select>
                <button onClick={() => {
                  const updated = [...draft.data_sources];
                  updated[i] = { ...ds, required: !ds.required };
                  update("data_sources", updated);
                }} className={cn("text-[9px] px-2 py-1 rounded border font-mono",
                  ds.required ? "border-primary/30 text-primary bg-primary/10" : "border-border text-muted-foreground/40"
                )}>
                  {ds.required ? "Vereist" : "Optioneel"}
                </button>
                <button onClick={() => {
                  update("data_sources", draft.data_sources.filter((_, j) => j !== i));
                }} className="text-muted-foreground/30 hover:text-destructive transition-colors">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Output Model */}
        <section>
          <SectionHeader icon={Layers} label="Output Model" />
          <div className="mt-3 space-y-3">
            <Field label="Result Summary Template">
              <Input value={draft.output_model.result_summary_template}
                onChange={e => updateOutputModel("result_summary_template", e.target.value)}
                className="text-xs h-8 font-mono" />
            </Field>
            <Field label="Result Payload Structuur">
              <Textarea value={draft.output_model.result_payload_structure}
                onChange={e => updateOutputModel("result_payload_structure", e.target.value)}
                rows={2} className="text-xs resize-none" />
            </Field>
            <Field label="Result Ready Gedrag">
              <Input value={draft.output_model.result_ready_behavior}
                onChange={e => updateOutputModel("result_ready_behavior", e.target.value)}
                className="text-xs h-8" />
            </Field>

            {/* Output Sections */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Resultaat Secties</span>
                <button onClick={() => {
                  const newSections = [...draft.output_model.sections, { key: "", label: "", type: "text" as const, required: false }];
                  setDraft(prev => ({ ...prev, output_model: { ...prev.output_model, sections: newSections } }));
                  setDirty(true);
                }} className="flex items-center gap-1 text-[10px] text-primary hover:text-primary/80">
                  <Plus className="w-3 h-3" /> Sectie
                </button>
              </div>
              <div className="space-y-2">
                {draft.output_model.sections.map((sec, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-muted/10 border border-border/40">
                    <Input value={sec.key} placeholder="key"
                      onChange={e => {
                        const updated = [...draft.output_model.sections];
                        updated[i] = { ...sec, key: e.target.value };
                        setDraft(prev => ({ ...prev, output_model: { ...prev.output_model, sections: updated } }));
                        setDirty(true);
                      }}
                      className="text-[10px] h-7 w-24 font-mono" />
                    <Input value={sec.label} placeholder="Label"
                      onChange={e => {
                        const updated = [...draft.output_model.sections];
                        updated[i] = { ...sec, label: e.target.value };
                        setDraft(prev => ({ ...prev, output_model: { ...prev.output_model, sections: updated } }));
                        setDirty(true);
                      }}
                      className="text-[10px] h-7 flex-1" />
                    <select value={sec.type} onChange={e => {
                      const updated = [...draft.output_model.sections];
                      updated[i] = { ...sec, type: e.target.value as MethodiekOutputSection["type"] };
                      setDraft(prev => ({ ...prev, output_model: { ...prev.output_model, sections: updated } }));
                      setDirty(true);
                    }} className="h-7 px-1.5 text-[10px] bg-background border border-input rounded-md text-foreground font-mono">
                      {sectionTypeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <button onClick={() => {
                      const updated = [...draft.output_model.sections];
                      updated[i] = { ...sec, required: !sec.required };
                      setDraft(prev => ({ ...prev, output_model: { ...prev.output_model, sections: updated } }));
                      setDirty(true);
                    }} className={cn("text-[9px] px-1.5 py-1 rounded border font-mono whitespace-nowrap",
                      sec.required ? "border-primary/30 text-primary bg-primary/10" : "border-border text-muted-foreground/40"
                    )}>
                      {sec.required ? "Req" : "Opt"}
                    </button>
                    <button onClick={() => {
                      const updated = draft.output_model.sections.filter((_, j) => j !== i);
                      setDraft(prev => ({ ...prev, output_model: { ...prev.output_model, sections: updated } }));
                      setDirty(true);
                    }} className="text-muted-foreground/30 hover:text-destructive transition-colors">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section: Kanban Linkage Preview */}
        <section>
          <SectionHeader icon={BarChart3} label="Kanban Ticket Preview" />
          <div className="mt-3 p-3 rounded-xl border border-amber-400/20 bg-amber-400/5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400/15 text-amber-400 border border-amber-400/20">ANALYSIS</span>
              <span className="text-[9px] font-mono text-muted-foreground/50">{draft.methodiek_id}</span>
            </div>
            <p className="text-xs font-medium text-foreground mb-1">{draft.name}</p>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[9px] font-mono text-amber-400/70">METHODIEK: {draft.name}</span>
            </div>
            <div className="text-[10px] text-muted-foreground/60 italic">
              {draft.output_model.result_summary_template}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

/* ── Helpers ── */

const SectionHeader = ({ icon: Icon, label }: { icon: typeof Settings2; label: string }) => (
  <div className="flex items-center gap-2">
    <Icon className="w-3.5 h-3.5 text-muted-foreground/50" />
    <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</h3>
  </div>
);

const Field = ({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) => (
  <div className={className}>
    <label className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wide mb-1 block">{label}</label>
    {children}
  </div>
);

export default MethodiekEditor;

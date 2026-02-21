import { useState } from "react";
import HBMasterWidget from "@/components/hbmaster-widget/HBMasterWidget";
import type { WidgetTheme, WidgetStatus, HBMasterWidgetConfig } from "@/components/hbmaster-widget/types";
import { themeAccents } from "@/components/hbmaster-widget/types";

const themes: { key: WidgetTheme; context: string; insight: string }[] = [
  { key: "productie", context: "Cold Store", insight: "Cold Store update: 1.000 boeketten verwerkt vandaag. Sterk tempo." },
  { key: "florist", context: "Klantenservice", insight: "3 nieuwe klantvragen vandaag. Gemiddelde responstijd: 4 min." },
  { key: "teams", context: "HR & Planning", insight: "12 medewerkers ingeroosterd voor morgen. 2 open shifts." },
  { key: "kenya", context: "Farm Operations", insight: "Harvest update: 8.500 stems cut today. Quality grade A: 94%." },
];

const HBMasterWidgetDemo = () => {
  const [activeTheme, setActiveTheme] = useState<WidgetTheme>("productie");
  const [status, setStatus] = useState<WidgetStatus>("online");

  const currentTheme = themes.find(t => t.key === activeTheme)!;
  const accent = themeAccents[activeTheme];

  const config: HBMasterWidgetConfig = {
    theme: activeTheme,
    contextLabel: currentTheme.context,
    insightText: currentTheme.insight,
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-lg bg-card/60">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `hsl(${accent.hsl} / 0.12)` }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" stroke={`hsl(${accent.hsl})`} strokeWidth="1.5" />
                <circle cx="12" cy="12" r="3" stroke={`hsl(${accent.hsl})`} strokeWidth="1.5" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">HBMaster Widget</h1>
              <p className="text-xs text-muted-foreground font-mono">Enterprise AI Assistant</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-10">
        {/* Theme Selector */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Systeem thema</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {themes.map(t => {
              const a = themeAccents[t.key];
              const active = activeTheme === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setActiveTheme(t.key)}
                  className={`relative rounded-xl border p-4 text-left transition-all duration-200 ${
                    active ? "border-border shadow-lg" : "border-border/40 hover:border-border/80"
                  }`}
                  style={active ? { boxShadow: `0 0 24px -8px hsl(${a.hsl} / 0.3)` } : undefined}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-3 h-3 rounded-full" style={{ background: a.accent }} />
                    <span className="text-sm font-semibold">{a.label}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{t.context}</p>
                  {active && (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ background: a.accent }} />
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Status Selector */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Widget status</h2>
          <div className="flex gap-2">
            {(["online", "busy", "offline"] as WidgetStatus[]).map(s => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                  status === s ? "border-border bg-card shadow-sm" : "border-border/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    s === "online" ? "bg-accent" : s === "busy" ? "bg-yellow-500" : "bg-red-500"
                  }`} />
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Component Breakdown */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Component architectuur</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { title: "WidgetFAB", desc: "Floating Action Button met halo-animatie, status indicator en hover glow" },
              { title: "ChatPanel", desc: "Chat interface met streaming, markdown rendering, error states en contextual header" },
              { title: "InsightPanel", desc: "Live productie-inzichten boven de chat, met accent kleuring per systeem" },
              { title: "MessageBubble", desc: "Berichten met tijdstempel, markdown support, error states en correlation ID" },
              { title: "TypingIndicator", desc: "Drie subtiel pulserende dots met accent kleur synchronisatie" },
              { title: "HBMasterWidget", desc: "Container component met responsive gedrag, fullscreen mobile en theming" },
            ].map(c => (
              <div key={c.title} className="rounded-xl border border-border/60 bg-card/50 p-4 space-y-1.5">
                <h3 className="text-sm font-bold font-mono" style={{ color: `hsl(${accent.hsl})` }}>{c.title}</h3>
                <p className="text-[12px] text-muted-foreground leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tokens */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Design tokens</h2>
          <div className="rounded-xl border border-border/60 bg-card/50 p-5 font-mono text-[12px] space-y-2 text-muted-foreground">
            <div className="flex justify-between"><span>Accent (Productie)</span><span>hsl(228 50% 55%)</span></div>
            <div className="flex justify-between"><span>Accent (Florist)</span><span>hsl(155 55% 42%)</span></div>
            <div className="flex justify-between"><span>Accent (Teams)</span><span>hsl(220 15% 45%)</span></div>
            <div className="flex justify-between"><span>Accent (Kenya)</span><span>hsl(25 70% 50%)</span></div>
            <div className="border-t border-border/30 my-2" />
            <div className="flex justify-between"><span>Panel width</span><span>400px</span></div>
            <div className="flex justify-between"><span>Panel height</span><span>600px</span></div>
            <div className="flex justify-between"><span>Border radius</span><span>1rem (16px)</span></div>
            <div className="flex justify-between"><span>FAB size</span><span>56px</span></div>
            <div className="flex justify-between"><span>Font body</span><span>Inter, 14px</span></div>
            <div className="flex justify-between"><span>Font mono</span><span>JetBrains Mono</span></div>
            <div className="flex justify-between"><span>Animation</span><span>250ms ease-out</span></div>
          </div>
        </section>
      </main>

      {/* The actual widget */}
      <HBMasterWidget config={config} status={status} />
    </div>
  );
};

export default HBMasterWidgetDemo;

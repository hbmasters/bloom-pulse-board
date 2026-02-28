import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Settings, User, Bell, Palette, Shield, Database, Globe, Zap, Monitor,
  Moon, Sun, Volume2, VolumeX, Mail, Smartphone, Clock, Eye, EyeOff,
  Save, RotateCcw, ChevronRight, Lock, Key, Languages, LogOut, Bot
} from "lucide-react";

/* ── Types ── */
type SettingsTab = "profiel" | "notificaties" | "weergave" | "beveiliging" | "integraties" | "ai" | "systeem";

const tabs: { id: SettingsTab; icon: typeof User; label: string }[] = [
  { id: "profiel", icon: User, label: "Profiel" },
  { id: "notificaties", icon: Bell, label: "Notificaties" },
  { id: "weergave", icon: Palette, label: "Weergave" },
  { id: "beveiliging", icon: Shield, label: "Beveiliging" },
  { id: "integraties", icon: Database, label: "Integraties" },
  { id: "ai", icon: Bot, label: "AI & Agents" },
  { id: "systeem", icon: Settings, label: "Systeem" },
];

/* ── Reusable atoms ── */
const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) => (
  <button
    onClick={() => onChange(!enabled)}
    className={cn(
      "relative w-10 h-5 rounded-full transition-colors duration-200 shrink-0",
      enabled ? "bg-primary" : "bg-muted"
    )}
  >
    <div className={cn(
      "absolute top-0.5 w-4 h-4 rounded-full bg-primary-foreground shadow transition-transform duration-200",
      enabled ? "translate-x-5" : "translate-x-0.5"
    )} />
  </button>
);

const SettingRow = ({ icon: Icon, label, description, children }: {
  icon: typeof User; label: string; description?: string; children: React.ReactNode;
}) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 py-3 border-b border-border/40 last:border-0">
    <div className="flex items-start gap-3 min-w-0">
      <Icon className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description && <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{description}</p>}
      </div>
    </div>
    <div className="shrink-0 pl-7 sm:pl-0">{children}</div>
  </div>
);

const SectionHeader = ({ title }: { title: string }) => (
  <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 mb-2 mt-4 first:mt-0">{title}</h3>
);

const SelectInput = ({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) => (
  <select
    value={value}
    onChange={e => onChange(e.target.value)}
    className="text-xs bg-muted border border-border rounded-lg px-2.5 py-1.5 text-foreground outline-none focus:border-primary/40 transition-colors"
  >
    {options.map(o => <option key={o} value={o}>{o}</option>)}
  </select>
);

/* ── Main Component ── */
const MCSettings = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profiel");
  const [saved, setSaved] = useState(false);

  // Profile
  const [displayName, setDisplayName] = useState("Jan de Vries");
  const [email, setEmail] = useState("jan@hbmaster.nl");
  const [role, setRole] = useState("Bandleider");
  const [language, setLanguage] = useState("Nederlands");
  const [timezone, setTimezone] = useState("Europe/Amsterdam");

  // Notifications
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [criticalAlerts, setCriticalAlerts] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(false);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [agentNotifs, setAgentNotifs] = useState(true);
  const [productionAlerts, setProductionAlerts] = useState(true);
  const [qualityAlerts, setQualityAlerts] = useState(true);

  // Display
  const [theme, setTheme] = useState("Donker");
  const [compactMode, setCompactMode] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [hologramEnabled, setHologramEnabled] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [fontSize, setFontSize] = useState("Normaal");
  const [accentColor, setAccentColor] = useState("Blauw");

  // Security
  const [twoFactor, setTwoFactor] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("30 minuten");
  const [showApiKeys, setShowApiKeys] = useState(false);
  const [auditLog, setAuditLog] = useState(true);

  // Integrations
  const [hbmSync, setHbmSync] = useState(true);
  const [erpSync, setErpSync] = useState(true);
  const [webhooksEnabled, setWebhooksEnabled] = useState(false);
  const [apiAccess, setApiAccess] = useState(true);
  const [realtimeUpdates, setRealtimeUpdates] = useState(true);

  // AI
  const [aiModel, setAiModel] = useState("GPT-5");
  const [aiTemperature, setAiTemperature] = useState("Gebalanceerd");
  const [autoAnalyse, setAutoAnalyse] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState(true);
  const [workflowTransparency, setWorkflowTransparency] = useState(true);
  const [maxTokens, setMaxTokens] = useState("4096");

  // System
  const [dataRetention, setDataRetention] = useState("90 dagen");
  const [logLevel, setLogLevel] = useState("Info");
  const [cacheEnabled, setCacheEnabled] = useState(true);
  const [debugMode, setDebugMode] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profiel":
        return (
          <>
            <SectionHeader title="Persoonlijke gegevens" />
            <SettingRow icon={User} label="Weergavenaam" description="Hoe je naam wordt weergegeven in het systeem">
              <input value={displayName} onChange={e => setDisplayName(e.target.value)}
                className="text-xs bg-muted border border-border rounded-lg px-2.5 py-1.5 w-full sm:w-40 text-foreground outline-none focus:border-primary/40 transition-colors" />
            </SettingRow>
            <SettingRow icon={Mail} label="E-mailadres" description="Gebruikt voor notificaties en login">
              <input value={email} onChange={e => setEmail(e.target.value)}
                className="text-xs bg-muted border border-border rounded-lg px-2.5 py-1.5 w-full sm:w-48 text-foreground outline-none focus:border-primary/40 transition-colors" />
            </SettingRow>
            <SettingRow icon={Shield} label="Rol" description="Je systeemrol bepaalt je toegangsrechten">
              <span className="text-xs font-mono text-muted-foreground bg-muted border border-border rounded-lg px-2.5 py-1.5">{role}</span>
            </SettingRow>

            <SectionHeader title="Localisatie" />
            <SettingRow icon={Languages} label="Taal" description="Interface taal">
              <SelectInput value={language} options={["Nederlands", "English", "Deutsch", "Français"]} onChange={setLanguage} />
            </SettingRow>
            <SettingRow icon={Globe} label="Tijdzone" description="Wordt gebruikt voor planningen en logs">
              <SelectInput value={timezone} options={["Europe/Amsterdam", "Europe/London", "Africa/Nairobi", "America/New_York"]} onChange={setTimezone} />
            </SettingRow>
          </>
        );

      case "notificaties":
        return (
          <>
            <SectionHeader title="Kanalen" />
            <SettingRow icon={Mail} label="E-mail notificaties" description="Ontvang meldingen via e-mail">
              <Toggle enabled={emailNotifs} onChange={setEmailNotifs} />
            </SettingRow>
            <SettingRow icon={Smartphone} label="Push notificaties" description="Meldingen in je browser">
              <Toggle enabled={pushNotifs} onChange={setPushNotifs} />
            </SettingRow>
            <SettingRow icon={soundEnabled ? Volume2 : VolumeX} label="Geluidseffecten" description="Geluid bij nieuwe meldingen">
              <Toggle enabled={soundEnabled} onChange={setSoundEnabled} />
            </SettingRow>

            <SectionHeader title="Type meldingen" />
            <SettingRow icon={Zap} label="Kritieke alerts" description="Altijd melden bij kritieke productiestoringen">
              <Toggle enabled={criticalAlerts} onChange={setCriticalAlerts} />
            </SettingRow>
            <SettingRow icon={Bot} label="Agent meldingen" description="Meldingen wanneer agents taken voltooien">
              <Toggle enabled={agentNotifs} onChange={setAgentNotifs} />
            </SettingRow>
            <SettingRow icon={Monitor} label="Productie alerts" description="Afwijkingen in lijnproductie">
              <Toggle enabled={productionAlerts} onChange={setProductionAlerts} />
            </SettingRow>
            <SettingRow icon={Shield} label="Kwaliteitsalerts" description="Dervingsdrempels en kwaliteitsafwijkingen">
              <Toggle enabled={qualityAlerts} onChange={setQualityAlerts} />
            </SettingRow>

            <SectionHeader title="Samenvattingen" />
            <SettingRow icon={Clock} label="Dagelijkse samenvatting" description="Elke ochtend een overzicht per e-mail">
              <Toggle enabled={dailyDigest} onChange={setDailyDigest} />
            </SettingRow>
            <SettingRow icon={Clock} label="Wekelijks rapport" description="Elke maandag een weekanalyse">
              <Toggle enabled={weeklyReport} onChange={setWeeklyReport} />
            </SettingRow>
          </>
        );

      case "weergave":
        return (
          <>
            <SectionHeader title="Thema" />
            <SettingRow icon={theme === "Donker" ? Moon : Sun} label="Kleurthema" description="Donker, licht of systeem">
              <SelectInput value={theme} options={["Donker", "Licht", "Systeem"]} onChange={setTheme} />
            </SettingRow>
            <SettingRow icon={Palette} label="Accentkleur" description="Primaire kleur voor knoppen en accenten">
              <SelectInput value={accentColor} options={["Blauw", "Groen", "Paars", "Oranje", "Rood"]} onChange={setAccentColor} />
            </SettingRow>
            <SettingRow icon={Eye} label="Lettergrootte" description="Tekst grootte in de interface">
              <SelectInput value={fontSize} options={["Klein", "Normaal", "Groot"]} onChange={setFontSize} />
            </SettingRow>

            <SectionHeader title="Interface" />
            <SettingRow icon={Monitor} label="Compact modus" description="Minder witruimte, meer content zichtbaar">
              <Toggle enabled={compactMode} onChange={setCompactMode} />
            </SettingRow>
            <SettingRow icon={Zap} label="Animaties" description="Overgangseffecten en micro-animaties">
              <Toggle enabled={animationsEnabled} onChange={setAnimationsEnabled} />
            </SettingRow>
            <SettingRow icon={Globe} label="Hologram achtergrond" description="Visuele hologram-deeltjes op pagina's">
              <Toggle enabled={hologramEnabled} onChange={setHologramEnabled} />
            </SettingRow>
            <SettingRow icon={Monitor} label="Zijbalk ingeklapt" description="Standaard smalle zijbalk">
              <Toggle enabled={sidebarCollapsed} onChange={setSidebarCollapsed} />
            </SettingRow>
          </>
        );

      case "beveiliging":
        return (
          <>
            <SectionHeader title="Authenticatie" />
            <SettingRow icon={Lock} label="Twee-factor authenticatie" description="Extra beveiligingslaag bij inloggen">
              <Toggle enabled={twoFactor} onChange={setTwoFactor} />
            </SettingRow>
            <SettingRow icon={Clock} label="Sessie timeout" description="Automatisch uitloggen na inactiviteit">
              <SelectInput value={sessionTimeout} options={["15 minuten", "30 minuten", "1 uur", "4 uur", "Nooit"]} onChange={setSessionTimeout} />
            </SettingRow>

            <SectionHeader title="Toegang" />
            <SettingRow icon={showApiKeys ? Eye : EyeOff} label="API sleutels tonen" description="Zichtbaarheid van gevoelige tokens">
              <Toggle enabled={showApiKeys} onChange={setShowApiKeys} />
            </SettingRow>
            <SettingRow icon={Key} label="API sleutel" description="Jouw persoonlijke API key">
              <span className="text-xs font-mono text-muted-foreground bg-muted border border-border rounded-lg px-2.5 py-1.5">
                {showApiKeys ? "hbm_sk_7f3a...x9b2" : "••••••••••••"}
              </span>
            </SettingRow>
            <SettingRow icon={Shield} label="Audit logging" description="Log alle gebruikersacties voor compliance">
              <Toggle enabled={auditLog} onChange={setAuditLog} />
            </SettingRow>

            <SectionHeader title="Wachtwoord" />
            <SettingRow icon={Lock} label="Wachtwoord wijzigen" description="Laatste wijziging: 14 dagen geleden">
              <button className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">Wijzigen</button>
            </SettingRow>
          </>
        );

      case "integraties":
        return (
          <>
            <SectionHeader title="Databronnen" />
            <SettingRow icon={Database} label="HBM Data sync" description="Realtime synchronisatie met HBM datawarehouse">
              <Toggle enabled={hbmSync} onChange={setHbmSync} />
            </SettingRow>
            <SettingRow icon={Database} label="ERP koppeling" description="Connectie met het ERP-systeem">
              <Toggle enabled={erpSync} onChange={setErpSync} />
            </SettingRow>

            <SectionHeader title="API & Webhooks" />
            <SettingRow icon={Globe} label="API toegang" description="Externe systemen kunnen data opvragen">
              <Toggle enabled={apiAccess} onChange={setApiAccess} />
            </SettingRow>
            <SettingRow icon={Zap} label="Webhooks" description="Automatisch events doorsturen naar externe URLs">
              <Toggle enabled={webhooksEnabled} onChange={setWebhooksEnabled} />
            </SettingRow>
            <SettingRow icon={Zap} label="Realtime updates" description="WebSocket verbinding voor live data">
              <Toggle enabled={realtimeUpdates} onChange={setRealtimeUpdates} />
            </SettingRow>

            <SectionHeader title="Verbonden diensten" />
            <SettingRow icon={Database} label="HBM Logistics" description="Status: Verbonden · Laatst gesync: 2 min geleden">
              <span className="text-[10px] font-mono px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">Actief</span>
            </SettingRow>
            <SettingRow icon={Database} label="Kenya Farm Data" description="Status: Verbonden · Laatst gesync: 6 uur geleden">
              <span className="text-[10px] font-mono px-2 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20">Standby</span>
            </SettingRow>
            <SettingRow icon={Mail} label="E-mail service" description="SMTP verbinding voor notificaties">
              <span className="text-[10px] font-mono px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">Actief</span>
            </SettingRow>
          </>
        );

      case "ai":
        return (
          <>
            <SectionHeader title="Model configuratie" />
            <SettingRow icon={Bot} label="Standaard AI model" description="Het primaire model voor HBMaster chat">
              <SelectInput value={aiModel} options={["GPT-5", "GPT-5 Mini", "Gemini 2.5 Pro", "Gemini 2.5 Flash"]} onChange={setAiModel} />
            </SettingRow>
            <SettingRow icon={Zap} label="Creativiteit" description="Balans tussen precisie en creativiteit">
              <SelectInput value={aiTemperature} options={["Precies", "Gebalanceerd", "Creatief"]} onChange={setAiTemperature} />
            </SettingRow>
            <SettingRow icon={Database} label="Max tokens" description="Maximum lengte van AI-antwoorden">
              <SelectInput value={maxTokens} options={["2048", "4096", "8192", "16384"]} onChange={setMaxTokens} />
            </SettingRow>

            <SectionHeader title="Gedrag" />
            <SettingRow icon={Zap} label="Automatische analyse" description="Agents analyseren continu inkomende data">
              <Toggle enabled={autoAnalyse} onChange={setAutoAnalyse} />
            </SettingRow>
            <SettingRow icon={Bot} label="AI suggesties" description="Proactieve tips en aanbevelingen tonen">
              <Toggle enabled={aiSuggestions} onChange={setAiSuggestions} />
            </SettingRow>
            <SettingRow icon={Eye} label="Werkwijze transparantie" description="Toon 'AI Werkwijze' paneel bij antwoorden">
              <Toggle enabled={workflowTransparency} onChange={setWorkflowTransparency} />
            </SettingRow>

            <SectionHeader title="Gebruik" />
            <SettingRow icon={Database} label="Verbruik deze maand" description="Tokens gebruikt door alle agents">
              <span className="text-xs font-mono text-muted-foreground">1.2M / 5M tokens</span>
            </SettingRow>
            <SettingRow icon={Clock} label="Gemiddelde responstijd" description="Over de afgelopen 7 dagen">
              <span className="text-xs font-mono text-muted-foreground">245ms</span>
            </SettingRow>
          </>
        );

      case "systeem":
        return (
          <>
            <SectionHeader title="Data" />
            <SettingRow icon={Database} label="Data retentie" description="Hoelang historische data wordt bewaard">
              <SelectInput value={dataRetention} options={["30 dagen", "90 dagen", "180 dagen", "1 jaar", "Onbeperkt"]} onChange={setDataRetention} />
            </SettingRow>
            <SettingRow icon={Save} label="Automatische backup" description="Dagelijkse backup van alle systeemdata">
              <Toggle enabled={autoBackup} onChange={setAutoBackup} />
            </SettingRow>
            <SettingRow icon={Database} label="Cache" description="Lokale cache voor snellere laadtijden">
              <Toggle enabled={cacheEnabled} onChange={setCacheEnabled} />
            </SettingRow>

            <SectionHeader title="Diagnostiek" />
            <SettingRow icon={Monitor} label="Log niveau" description="Detail van systeemlogging">
              <SelectInput value={logLevel} options={["Error", "Warn", "Info", "Debug", "Verbose"]} onChange={setLogLevel} />
            </SettingRow>
            <SettingRow icon={Settings} label="Debug modus" description="Extra diagnostische informatie tonen">
              <Toggle enabled={debugMode} onChange={setDebugMode} />
            </SettingRow>

            <SectionHeader title="Systeem info" />
            <SettingRow icon={Globe} label="Versie" description="HBMaster Mission Control">
              <span className="text-xs font-mono text-muted-foreground">v2.4.1</span>
            </SettingRow>
            <SettingRow icon={Clock} label="Uptime" description="Sinds laatste herstart">
              <span className="text-xs font-mono text-muted-foreground">14d 7u 32m</span>
            </SettingRow>
            <SettingRow icon={Database} label="Database" description="Opslag en gezondheid">
              <span className="text-[10px] font-mono px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">Gezond · 2.4 GB</span>
            </SettingRow>

            <SectionHeader title="Gevaarlijke zone" />
            <SettingRow icon={RotateCcw} label="Cache wissen" description="Alle lokaal opgeslagen data verwijderen">
              <button className="text-xs font-medium text-destructive hover:text-destructive/80 transition-colors">Wissen</button>
            </SettingRow>
            <SettingRow icon={LogOut} label="Uitloggen" description="Sessie beëindigen op dit apparaat">
              <button className="text-xs font-medium text-destructive hover:text-destructive/80 transition-colors">Uitloggen</button>
            </SettingRow>
          </>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-4 md:px-6 py-4 border-b border-border bg-card/40 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">Instellingen</h2>
          </div>
          <button
            onClick={handleSave}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              saved
                ? "bg-primary/15 text-primary border border-primary/30"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            <Save className="w-3 h-3" />
            {saved ? "Opgeslagen ✓" : "Opslaan"}
          </button>
        </div>
      </div>

      {/* Mobile tab bar */}
      <div className="flex-shrink-0 md:hidden overflow-x-auto border-b border-border bg-card/20 px-2 py-1.5 scrollbar-none">
        <div className="flex gap-1 min-w-max">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors",
                  active
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                )}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content: tabs + panel */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Tab sidebar (desktop) */}
        <div className="hidden md:block w-44 lg:w-52 shrink-0 border-r border-border bg-card/20 overflow-y-auto py-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition-colors",
                  active
                    ? "bg-primary/10 text-primary border-r-2 border-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="text-xs font-medium">{tab.label}</span>
                <ChevronRight className={cn("w-3 h-3 ml-auto shrink-0 transition-opacity", active ? "opacity-100" : "opacity-0")} />
              </button>
            );
          })}
        </div>

        {/* Settings panel */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 py-4">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default MCSettings;

import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { Send, ChevronDown, ChevronUp, Loader2, CheckCircle2, Circle, Sparkles, BarChart3, CreditCard, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import AnalysisPresentation from "@/components/analysis-presentation/AnalysisPresentation";
import type { AnalysisPresentationData } from "@/components/analysis-presentation/types";
import ProductCard from "@/components/analysis-presentation/ProductCard";
import type { ProductCardData } from "@/components/analysis-presentation/ProductCard";
import FloritrackTransactions from "@/components/chat/floritrack/FloritrackTransactions";
import type { FloritrackData } from "@/components/chat/floritrack/floritrack-types";

type Msg = { role: "user" | "assistant"; content: string };

interface AIWorkflowData {
  plan?: string[];
  input_used?: string[];
  actions?: string[];
  confidence?: number;
  assumptions?: string[];
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/hbmaster-chat`;

function parseWorkflow(content: string): { text: string; workflow: AIWorkflowData | null } {
  const match = content.match(/```hbmaster-workflow\n([\s\S]*?)```/);
  if (!match) return { text: content, workflow: null };
  try {
    const workflow = JSON.parse(match[1]);
    const text = content.replace(/```hbmaster-workflow\n[\s\S]*?```/, "").trim();
    return { text, workflow };
  } catch {
    return { text: content, workflow: null };
  }
}

function parseAnalysis(content: string): { text: string; analysis: AnalysisPresentationData | null } {
  const match = content.match(/```hbmaster-analysis\n([\s\S]*?)```/);
  if (!match) return { text: content, analysis: null };
  try {
    const raw = JSON.parse(match[1]);
    const analysis: AnalysisPresentationData = {
      title: raw.title || "Analyse Resultaat",
      task_type: "analysis",
      status: raw.status || "completed",
      result_ready: raw.result_ready ?? true,
      updated_at: raw.updated_at,
      summary: raw.summary,
      kpis: raw.kpis,
      table: raw.table,
      chart: raw.chart,
      methodiek: raw.methodiek,
      detail_payload: raw.detail_payload,
    };
    const text = content.replace(/```hbmaster-analysis\n[\s\S]*?```/, "").trim();
    return { text, analysis };
  } catch {
    return { text: content, analysis: null };
  }
}

function parseProductCard(content: string): { text: string; productCard: ProductCardData | null } {
  const match = content.match(/```hbmaster-product-card\n([\s\S]*?)```/);
  if (!match) return { text: content, productCard: null };
  try {
    const productCard = JSON.parse(match[1]) as ProductCardData;
    const text = content.replace(/```hbmaster-product-card\n[\s\S]*?```/, "").trim();
    return { text, productCard };
  } catch {
    return { text: content, productCard: null };
  }
}

function parseFloritrack(content: string): { text: string; floritrack: FloritrackData | null } {
  const match = content.match(/```hbmaster-floritrack\n([\s\S]*?)```/);
  if (!match) return { text: content, floritrack: null };
  try {
    const floritrack = JSON.parse(match[1]) as FloritrackData;
    const text = content.replace(/```hbmaster-floritrack\n[\s\S]*?```/, "").trim();
    return { text, floritrack };
  } catch {
    return { text: content, floritrack: null };
  }
}

function parseAllBlocks(content: string): {
  text: string;
  workflow: AIWorkflowData | null;
  analysis: AnalysisPresentationData | null;
  productCard: ProductCardData | null;
  floritrack: FloritrackData | null;
} {
  const { text: t1, workflow } = parseWorkflow(content);
  const { text: t2, analysis } = parseAnalysis(t1);
  const { text: t3, productCard } = parseProductCard(t2);
  const { text: t4, floritrack } = parseFloritrack(t3);
  return { text: t4, workflow, analysis, productCard, floritrack };
}

const WorkflowPanel = ({ workflow, defaultOpen = false }: { workflow: AIWorkflowData; defaultOpen?: boolean }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mt-2 border border-border rounded-lg overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-mono text-muted-foreground hover:text-foreground transition-colors">
        <span>🧠 AI Werkwijze</span>
        {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>
      {open && (
        <div className="px-3 pb-3 space-y-2 text-[11px] text-muted-foreground font-mono animate-fade-in">
          {workflow.plan && (
            <div>
              <div className="text-muted-foreground/60 uppercase text-[9px] tracking-wider mb-1">Plan</div>
              {workflow.plan.map((p, i) => <div key={i}>• {p}</div>)}
            </div>
          )}
          {workflow.input_used && (
            <div>
              <div className="text-muted-foreground/60 uppercase text-[9px] tracking-wider mb-1">Input</div>
              {workflow.input_used.map((p, i) => <div key={i}>• {p}</div>)}
            </div>
          )}
          {workflow.confidence !== undefined && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground/60 uppercase text-[9px] tracking-wider">Confidence</span>
              <div className="flex-1 h-1 rounded-full bg-border overflow-hidden">
                <div className="h-full rounded-full bg-accent/60" style={{ width: `${workflow.confidence * 100}%` }} />
              </div>
              <span>{Math.round(workflow.confidence * 100)}%</span>
            </div>
          )}
          {workflow.assumptions && workflow.assumptions.length > 0 && (
            <div>
              <div className="text-muted-foreground/60 uppercase text-[9px] tracking-wider mb-1">Aannames</div>
              {workflow.assumptions.map((a, i) => <div key={i}>⚠ {a}</div>)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const AnalysisTogglePanel = ({ analysis }: { analysis: AnalysisPresentationData }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-2 border border-border rounded-lg overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-mono text-muted-foreground hover:text-foreground transition-colors">
        <span className="flex items-center gap-1.5">
          <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
          Toon analytisch
        </span>
        {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>
      {open && (
        <div className="px-3 pb-3 animate-fade-in">
          <AnalysisPresentation data={analysis} compact />
        </div>
      )}
    </div>
  );
};


const standardSteps = [
  "Context analyseren…",
  "Data ophalen…",
  "Antwoord formuleren…",
];

const analysisSteps = [
  "Context analyseren…",
  "Data ophalen…",
  "Analyse uitvoeren…",
  "Resultaten verwerken…",
  "Rapport samenstellen…",
];

const ANALYSIS_KEYWORDS = ["analyseer", "analyse", "benchmark", "vergelijk", "rapport", "overzicht", "marge", "apu", "inkoop", "productie status", "trend"];

function isAnalysisQuery(text: string): boolean {
  const lower = text.toLowerCase();
  return ANALYSIS_KEYWORDS.some(k => lower.includes(k));
}

const ThinkingBubble = ({ isAnalysis = false }: { isAnalysis?: boolean }) => {
  const steps = isAnalysis ? analysisSteps : standardSteps;
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setActiveStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
    }, isAnalysis ? 800 : 600);
    return () => clearInterval(stepInterval);
  }, [steps.length, isAnalysis]);

  // Smooth progress bar for analysis
  useEffect(() => {
    if (!isAnalysis) return;
    const timer = setInterval(() => {
      setProgress(prev => {
        const target = ((activeStep + 1) / steps.length) * 100;
        const diff = target - prev;
        return prev + diff * 0.08;
      });
    }, 50);
    return () => clearInterval(timer);
  }, [activeStep, steps.length, isAnalysis]);

  const barWidth = isAnalysis ? progress : ((activeStep + 1) / steps.length) * 100;

  return (
    <div className="flex justify-start">
      <div className="bg-card border border-border rounded-2xl px-4 py-3 min-w-[220px] space-y-2">
        {/* Header */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <div className="absolute inset-0 w-4 h-4 rounded-full bg-primary/20 animate-ping" />
          </div>
          <span className="text-xs font-semibold text-foreground">
            {isAnalysis ? "HBMaster analyseert" : "HBMaster is bezig"}
          </span>
          {isAnalysis && (
            <span className="text-[9px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
              ANALYSE
            </span>
          )}
        </div>

        {/* Steps */}
        <div className="space-y-1.5">
          {steps.map((step, i) => {
            const done = i < activeStep;
            const active = i === activeStep;
            return (
              <div key={i} className={cn(
                "flex items-center gap-2 transition-all duration-500",
                i > activeStep && "opacity-30"
              )}>
                {done ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                ) : active ? (
                  <Loader2 className="w-3.5 h-3.5 text-primary animate-spin shrink-0" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-muted-foreground/30 shrink-0" />
                )}
                <span className={cn(
                  "text-[11px] font-mono transition-colors duration-300",
                  done ? "text-muted-foreground" : active ? "text-foreground" : "text-muted-foreground/40"
                )}>{step}</span>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="h-1 w-full rounded-full bg-border overflow-hidden mt-1">
          <div
            className={cn(
              "h-full rounded-full transition-all ease-out",
              isAnalysis ? "bg-amber-400/70 duration-100" : "bg-primary/60 duration-1000"
            )}
            style={{ width: `${barWidth}%` }}
          />
        </div>
      </div>
    </div>
  );
};

interface ChatThreadProps {
  onStateChange: (state: "idle" | "thinking" | "responding") => void;
  onMessageCount?: (count: number) => void;
}

const ChatThread = ({ onStateChange, onMessageCount }: ChatThreadProps) => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [visibleCardIdx, setVisibleCardIdx] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    onMessageCount?.(messages.length);
  }, [messages.length, onMessageCount]);

  const streamChat = useCallback(async (msgs: Msg[], onDelta: (t: string) => void, onDone: () => void) => {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages: msgs }),
    });

    if (!resp.ok || !resp.body) {
      if (resp.status === 429) throw new Error("Rate limit bereikt. Probeer later opnieuw.");
      if (resp.status === 402) throw new Error("Tegoed op. Voeg credits toe.");
      throw new Error("Verbinding mislukt");
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buf = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });

      let nl: number;
      while ((nl = buf.indexOf("\n")) !== -1) {
        let line = buf.slice(0, nl);
        buf = buf.slice(nl + 1);
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (!line.startsWith("data: ")) continue;
        const json = line.slice(6).trim();
        if (json === "[DONE]") { onDone(); return; }
        try {
          const parsed = JSON.parse(json);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) onDelta(content);
        } catch { buf = line + "\n" + buf; break; }
      }
    }
    onDone();
  }, []);

  const send = async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    const userMsg: Msg = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    onStateChange("thinking");

    let assistantSoFar = "";
    let firstToken = true;

    try {
      await streamChat(
        [...messages, userMsg],
        (chunk) => {
          if (firstToken) { onStateChange("responding"); firstToken = false; }
          assistantSoFar += chunk;
          setMessages(prev => {
            const last = prev[prev.length - 1];
            if (last?.role === "assistant") {
              return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
            }
            return [...prev, { role: "assistant", content: assistantSoFar }];
          });
        },
        () => { setIsLoading(false); onStateChange("idle"); }
      );
    } catch (e) {
      setIsLoading(false);
      onStateChange("idle");
      setMessages(prev => [...prev, { role: "assistant", content: `⚠️ ${e instanceof Error ? e.message : "Onbekende fout"}` }]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-3">
            
            <p className="text-sm font-mono">Start een gesprek met HBMaster</p>
            <div className="flex flex-wrap gap-2 mt-2 max-w-md justify-center">
              {[
                "Wat is de huidige productie status?",
                "Analyseer de marge per productlijn",
                "Geef een overzicht van de APU per lijn",
                "Benchmark inkoopprijzen rozen",
              ].map(q => (
                <button key={q} onClick={() => { setInput(q); inputRef.current?.focus(); }}
                  className="text-[11px] px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all">
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => {
          const isUser = msg.role === "user";
          const { text, workflow, analysis, productCard } = isUser
            ? { text: msg.content, workflow: null, analysis: null, productCard: null }
            : parseAllBlocks(msg.content);

          return (
            <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
              <div className={`${isUser ? "max-w-[85%]" : "max-w-[92%] w-full"} space-y-3`}>
                {/* Text bubble + inline product card */}
                <div className="flex items-start gap-2">
                  {/* Text content */}
                  <div className="flex-1 min-w-0 flex items-start gap-0 overflow-hidden">
                    {text && (
                      <div className={cn(
                        "rounded-2xl px-4 py-3 min-w-0 transition-all duration-300",
                        isUser
                          ? "bg-gradient-brand text-primary-foreground"
                          : "bg-card border border-border text-foreground",
                        productCard && visibleCardIdx === i ? "flex-shrink" : "flex-1"
                      )}>
                        {isUser ? (
                          <p className="text-sm">{text}</p>
                        ) : (
                          <div className="prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                            <ReactMarkdown>{text}</ReactMarkdown>
                          </div>
                        )}
                        {workflow && <WorkflowPanel workflow={workflow} />}
                        {analysis && <AnalysisTogglePanel analysis={analysis} />}
                      </div>
                    )}

                    {/* Product card — slides in from right within the row */}
                    {productCard && visibleCardIdx === i && (
                      <div className="animate-slide-in-right shrink-0 ml-2" style={{ maxWidth: "320px" }}>
                        <ProductCard data={productCard} />
                      </div>
                    )}
                  </div>

                  {/* Product card toggle icon — right side */}
                  {productCard && (
                    <button
                      onClick={() => setVisibleCardIdx(visibleCardIdx === i ? null : i)}
                      className={cn(
                        "shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all mt-1",
                        visibleCardIdx === i
                          ? "bg-primary/15 text-primary"
                          : "bg-muted/30 text-muted-foreground hover:bg-primary/10 hover:text-primary"
                      )}
                      title="Productkaart"
                    >
                      <CreditCard className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <ThinkingBubble isAnalysis={isAnalysisQuery(messages[messages.length - 1]?.content || "")} />
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 p-4 border-t border-border">
        <div className="flex items-end gap-2 bg-card rounded-xl border border-border px-3 py-2 focus-within:border-primary/40 transition-colors shadow-sm">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Stel een vraag aan HBMaster..."
            rows={1}
            className="flex-1 bg-transparent text-sm text-foreground placeholder-muted-foreground resize-none outline-none max-h-32 min-h-[36px]"
            style={{ height: "auto" }}
            onInput={(e) => { const t = e.currentTarget; t.style.height = "auto"; t.style.height = t.scrollHeight + "px"; }}
          />
          <button onClick={send} disabled={isLoading || !input.trim()}
            className="w-8 h-8 rounded-lg bg-gradient-brand hover:opacity-90 disabled:opacity-30 flex items-center justify-center transition-all shrink-0">
            <Send className="w-4 h-4 text-primary-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatThread;
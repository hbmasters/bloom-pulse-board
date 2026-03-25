import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { Send, ChevronDown, ChevronUp, Loader2, CheckCircle2, Circle, Sparkles, BarChart3, CreditCard, Truck, AlertTriangle, Blocks, Euro, ListOrdered, Check, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import AnalysisPresentation from "@/components/analysis-presentation/AnalysisPresentation";
import type { AnalysisPresentationData } from "@/components/analysis-presentation/types";
import ProductCard from "@/components/analysis-presentation/ProductCard";
import type { ProductCardData } from "@/components/analysis-presentation/ProductCard";
import FloritrackTransactions from "@/components/chat/floritrack/FloritrackTransactions";
import type { FloritrackData } from "@/components/chat/floritrack/floritrack-types";
import TransportRiskPanel from "@/components/chat/transport-risk/TransportRiskPanel";
import type { TransportRiskData } from "@/components/chat/transport-risk/transport-risk-types";
import { AnalyticalBlock, parseAnalyticalBlock } from "@/components/chat/analytical-blocks/BlockRegistry";
import type { AnalyticalBlockData } from "@/components/chat/analytical-blocks/block-types";
import { BLOCK_LABELS, BLOCK_DOMAIN_MAP } from "@/components/chat/analytical-blocks/block-types";
import { DOMAIN_COLORS } from "@/components/chat/analytical-blocks/block-domain-colors";
import VerifiedResponseCard from "@/components/chat/verified-response/VerifiedResponseCard";
import type { VerifiedResponseData } from "@/components/chat/verified-response/verified-response-types";
import { CommercialProductBlock } from "@/components/chat/analytical-blocks/variants/CommercialProductBlock";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/hbmaster-chat`;

/* ── Parsers ── */

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

function parseTransportRisk(content: string): { text: string; transportRisk: TransportRiskData | null } {
  const match = content.match(/```hbmaster-transport-risk\n([\s\S]*?)```/);
  if (!match) return { text: content, transportRisk: null };
  try {
    const transportRisk = JSON.parse(match[1]) as TransportRiskData;
    const text = content.replace(/```hbmaster-transport-risk\n[\s\S]*?```/, "").trim();
    return { text, transportRisk };
  } catch {
    return { text: content, transportRisk: null };
  }
}

function parseVerifiedResponse(content: string): { text: string; verified: VerifiedResponseData | null } {
  const match = content.match(/```hbmaster-verified\n([\s\S]*?)```/);
  if (!match) return { text: content, verified: null };
  try {
    const verified = JSON.parse(match[1]) as VerifiedResponseData;
    const text = content.replace(/```hbmaster-verified\n[\s\S]*?```/, "").trim();
    return { text, verified };
  } catch {
    return { text: content, verified: null };
  }
}

function parseCommercialProduct(content: string): { text: string; hasCommercial: boolean } {
  const match = content.match(/```hbmaster-commercial\n[\s\S]*?```/);
  if (!match) return { text: content, hasCommercial: false };
  const text = content.replace(/```hbmaster-commercial\n[\s\S]*?```/, "").trim();
  return { text, hasCommercial: true };
}

function parseAllBlocks(content: string): {
  text: string;
  analysis: AnalysisPresentationData | null;
  productCard: ProductCardData | null;
  floritrack: FloritrackData | null;
  transportRisk: TransportRiskData | null;
  analyticalBlock: AnalyticalBlockData | null;
  verified: VerifiedResponseData | null;
  hasCommercial: boolean;
} {
  // Strip old workflow blocks silently (no longer rendered)
  let cleaned = content.replace(/```hbmaster-workflow\n[\s\S]*?```/g, "").trim();
  const { text: t1, analysis } = parseAnalysis(cleaned);
  const { text: t2, productCard } = parseProductCard(t1);
  const { text: t3, floritrack } = parseFloritrack(t2);
  const { text: t4, transportRisk } = parseTransportRisk(t3);
  const { text: t5, block: analyticalBlock } = parseAnalyticalBlock(t4);
  const { text: t6, verified } = parseVerifiedResponse(t5);
  const { text: t7, hasCommercial } = parseCommercialProduct(t6);
  return { text: t7, analysis, productCard, floritrack, transportRisk, analyticalBlock, verified, hasCommercial };
}

/* ── Toggle panels ── */

const AnalysisTogglePanel = ({ analysis }: { analysis: AnalysisPresentationData }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-2 border border-border rounded-lg overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-mono text-muted-foreground hover:text-foreground transition-colors">
        <span className="flex items-center gap-1.5">
          <BarChart3 className="w-3.5 h-3.5 text-yellow-500" />
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

const FloritrackTogglePanel = ({ data }: { data: FloritrackData }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-2 border border-border rounded-lg overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-mono text-muted-foreground hover:text-foreground transition-colors">
        <span className="flex items-center gap-1.5">
          <Truck className="w-3.5 h-3.5 text-blue-500" />
          Toon transactie flow
          <span className="text-[9px] bg-blue-500/10 text-blue-500 border border-blue-500/20 px-1.5 py-0.5 rounded font-semibold">{data.summary.total}</span>
        </span>
        {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>
      {open && (
        <div className="px-3 pb-3 animate-fade-in">
          <FloritrackTransactions data={data} />
        </div>
      )}
    </div>
  );
};

const TransportRiskTogglePanel = ({ data }: { data: TransportRiskData }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-2 border border-border rounded-lg overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-mono text-muted-foreground hover:text-foreground transition-colors">
        <span className="flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
          Toon productie risico's
          <span className="text-[9px] bg-destructive/10 text-destructive border border-destructive/20 px-1.5 py-0.5 rounded font-semibold">{data.summary.total_at_risk}</span>
        </span>
        {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>
      {open && (
        <div className="px-3 pb-3 animate-fade-in">
          <TransportRiskPanel data={data} />
        </div>
      )}
    </div>
  );
};

const CommercialProductTogglePanel = () => {
  const [open, setOpen] = useState(true);
  return (
    <div className="mt-2 border border-border rounded-lg overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-mono text-muted-foreground hover:text-foreground transition-colors">
        <span className="flex items-center gap-1.5">
          <Euro className="w-3.5 h-3.5 text-purple-500" />
          Commerciële Productanalyse
        </span>
        {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>
      {open && (
        <div className="px-1 pb-3 animate-fade-in">
          <CommercialProductBlock />
        </div>
      )}
    </div>
  );
};

/* ── Thinking bubble ── */

const standardSteps = [
  "Data ophalen…",
  "Bronnen verifiëren…",
  "Antwoord samenstellen…",
];

const analysisSteps = [
  "Data ophalen…",
  "Bronnen verifiëren…",
  "Analyse uitvoeren…",
  "Resultaten valideren…",
  "Rapport samenstellen…",
];

const ANALYSIS_KEYWORDS = ["analyseer", "analyse", "benchmark", "vergelijk", "rapport", "overzicht", "marge", "apu", "inkoop", "productie status", "trend", "risico", "vertraging", "transport", "commerci"];

const COMMERCIAL_KEYWORDS = ["commerciële productanalyse", "commerciele productanalyse", "productanalyse", "commercieel"];

function isCommercialQuery(text: string): boolean {
  return COMMERCIAL_KEYWORDS.some(k => text.toLowerCase().includes(k));
}

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
        <div className="flex items-center gap-2">
          <div className="relative">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <div className="absolute inset-0 w-4 h-4 rounded-full bg-primary/20 animate-ping" />
          </div>
          <span className="text-xs font-semibold text-foreground">
            {isAnalysis ? "HBMaster verifieert" : "HBMaster zoekt bronnen"}
          </span>
          {isAnalysis && (
            <span className="text-[9px] font-mono text-yellow-500 bg-yellow-500/10 px-1.5 py-0.5 rounded border border-yellow-500/20">
              ANALYSE
            </span>
          )}
        </div>

        <div className="space-y-1.5">
          {steps.map((step, i) => {
            const done = i < activeStep;
            const active = i === activeStep;
            return (
              <div key={i} className={cn("flex items-center gap-2 transition-all duration-500", i > activeStep && "opacity-30")}>
                {done ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
                ) : active ? (
                  <Loader2 className="w-3.5 h-3.5 text-primary animate-spin shrink-0" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-muted-foreground/30 shrink-0" />
                )}
                <span className={cn("text-[11px] font-mono transition-colors duration-300",
                  done ? "text-muted-foreground" : active ? "text-foreground" : "text-muted-foreground/40"
                )}>{step}</span>
              </div>
            );
          })}
        </div>

        <div className="h-1 w-full rounded-full bg-border overflow-hidden mt-1">
          <div
            className={cn("h-full rounded-full transition-all ease-out",
              isAnalysis ? "bg-yellow-500/70 duration-100" : "bg-primary/60 duration-1000"
            )}
            style={{ width: `${barWidth}%` }}
          />
        </div>
      </div>
    </div>
  );
};

/* ── Main component ── */

interface ChatThreadProps {
  onStateChange: (state: "idle" | "thinking" | "responding") => void;
  onMessageCount?: (count: number) => void;
}

const ChatThread = ({ onStateChange, onMessageCount }: ChatThreadProps) => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [visibleCardIdx, setVisibleCardIdx] = useState<number | null>(null);
  const [queue, setQueue] = useState<string[]>([]);
  const processingRef = useRef(false);
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

  /* ── Validate message before sending ── */
  const validateMessage = useCallback((text: string): { valid: boolean; reason?: string } => {
    if (!text.trim()) return { valid: false, reason: "Leeg bericht" };
    if (text.trim().length < 2) return { valid: false, reason: "Bericht te kort" };
    if (text.trim().length > 2000) return { valid: false, reason: "Bericht te lang (max 2000 tekens)" };
    return { valid: true };
  }, []);

  /* ── Process a single message (internal) ── */
  const processMessage = useCallback(async (text: string, currentMessages: Msg[]): Promise<Msg[]> => {
    const userMsg: Msg = { role: "user", content: text };
    const updatedMsgs = [...currentMessages, userMsg];
    setMessages(updatedMsgs);

    // Local intercept for commercial product analysis
    if (isCommercialQuery(text)) {
      setIsLoading(true);
      onStateChange("thinking");
      await new Promise(r => setTimeout(r, 1200));
      onStateChange("responding");
      const response = `Hier is de commerciële productanalyse op basis van de beschikbare data:\n\n\`\`\`hbmaster-commercial\n{}\n\`\`\``;
      const finalMsgs = [...updatedMsgs, { role: "assistant" as const, content: response }];
      setMessages(finalMsgs);
      setIsLoading(false);
      onStateChange("idle");
      return finalMsgs;
    }

    setIsLoading(true);
    onStateChange("thinking");

    let assistantSoFar = "";
    let firstToken = true;
    let finalMsgs = updatedMsgs;

    try {
      await new Promise<void>((resolve, reject) => {
        streamChat(
          updatedMsgs,
          (chunk) => {
            if (firstToken) { onStateChange("responding"); firstToken = false; }
            assistantSoFar += chunk;
            setMessages(prev => {
              const last = prev[prev.length - 1];
              if (last?.role === "assistant") {
                const result = prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
                finalMsgs = result;
                return result;
              }
              const result = [...prev, { role: "assistant" as const, content: assistantSoFar }];
              finalMsgs = result;
              return result;
            });
          },
          () => { setIsLoading(false); onStateChange("idle"); resolve(); }
        ).catch(reject);
      });
    } catch (e) {
      setIsLoading(false);
      onStateChange("idle");
      const errMsg: Msg = { role: "assistant", content: `⚠️ ${e instanceof Error ? e.message : "Onbekende fout"}` };
      finalMsgs = [...updatedMsgs, errMsg];
      setMessages(finalMsgs);
    }

    return finalMsgs;
  }, [streamChat, onStateChange]);

  /* ── Process queue sequentially ── */
  const processQueue = useCallback(async () => {
    if (processingRef.current) return;
    processingRef.current = true;

    let currentMessages: Msg[] = [];
    setMessages(prev => { currentMessages = prev; return prev; });

    while (true) {
      let nextText: string | undefined;
      setQueue(prev => {
        if (prev.length === 0) { nextText = undefined; return prev; }
        nextText = prev[0];
        return prev.slice(1);
      });

      // Small delay to let state settle
      await new Promise(r => setTimeout(r, 50));

      // Re-read queue length
      let queueEmpty = false;
      setQueue(prev => { queueEmpty = prev.length === 0 && !nextText; return prev; });

      if (!nextText) break;

      currentMessages = await processMessage(nextText, currentMessages);
    }

    processingRef.current = false;
  }, [processMessage]);

  /* ── Send: validate immediately, queue if busy ── */
  const send = useCallback(async () => {
    const text = input.trim();
    if (!text) return;

    const check = validateMessage(text);
    if (!check.valid) {
      // Show inline validation feedback
      setMessages(prev => [...prev, { role: "assistant", content: `⚠️ ${check.reason}` }]);
      return;
    }

    setInput("");

    if (isLoading || processingRef.current) {
      // Queue the message
      setQueue(prev => [...prev, text]);
      return;
    }

    // Process directly
    processingRef.current = true;
    let currentMessages: Msg[] = [];
    setMessages(prev => { currentMessages = prev; return prev; });

    currentMessages = await processMessage(text, currentMessages);

    // Drain any messages that were queued during processing
    while (true) {
      let nextText: string | undefined;
      setQueue(prev => {
        if (prev.length === 0) return prev;
        nextText = prev[0];
        return prev.slice(1);
      });
      await new Promise(r => setTimeout(r, 50));
      if (!nextText) break;
      currentMessages = await processMessage(nextText, currentMessages);
    }

    processingRef.current = false;
  }, [input, isLoading, validateMessage, processMessage]);

  /* ── Remove item from queue ── */
  const removeFromQueue = useCallback((idx: number) => {
    setQueue(prev => prev.filter((_, i) => i !== idx));
  }, []);

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
                "Zijn er productie risico's door transport?",
                "Toon transactie flow",
                "Commerciële productanalyse",
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
          const isStreaming = isLoading && !isUser && i === messages.length - 1;

          let text: string;
          let analysis: AnalysisPresentationData | null = null;
          let productCard: ProductCardData | null = null;
          let floritrack: FloritrackData | null = null;
          let transportRisk: TransportRiskData | null = null;
          let analyticalBlock: AnalyticalBlockData | null = null;
          let verified: VerifiedResponseData | null = null;
          let hasCommercial = false;

          if (isUser) {
            text = msg.content;
          } else if (isStreaming) {
            // Strip block markers while streaming
            text = msg.content
              .replace(/```hbmaster-(?:workflow|analysis|product-card|floritrack|transport-risk|block|verified|commercial)\n[\s\S]*?```/g, "")
              .replace(/```hbmaster-(?:workflow|analysis|product-card|floritrack|transport-risk|block|verified|commercial)[\s\S]*$/g, "")
              .trim();
          } else {
            const parsed = parseAllBlocks(msg.content);
            text = parsed.text;
            analysis = parsed.analysis;
            productCard = parsed.productCard;
            floritrack = parsed.floritrack;
            transportRisk = parsed.transportRisk;
            analyticalBlock = parsed.analyticalBlock;
            verified = parsed.verified;
            hasCommercial = parsed.hasCommercial;
          }

          const hasPartialBlock = isStreaming && /```hbmaster-\w+/.test(msg.content) && !/```hbmaster-\w+\n[\s\S]*?```/.test(msg.content.slice(msg.content.lastIndexOf("```hbmaster-")));

          return (
            <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
              <div className={`${isUser ? "max-w-[85%]" : "max-w-[92%] w-full"} space-y-3`}>
                <div className="flex items-start gap-2">
                  <div className="flex-1 min-w-0 flex items-start gap-0 overflow-hidden">
                    {(text || hasPartialBlock || analysis || floritrack || transportRisk || analyticalBlock || verified || hasCommercial) && (
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
                          <>
                            {/* Verified response card (replaces old workflow) */}
                            {verified && <VerifiedResponseCard data={verified} />}

                            {/* Plain text (only if no verified card, or as supplement) */}
                            {text && !verified && (
                              <div className="prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                                <ReactMarkdown>{text}</ReactMarkdown>
                              </div>
                            )}

                            {/* Supplementary text below verified card */}
                            {text && verified && (
                              <div className="mt-2 pt-2 border-t border-border prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                                <ReactMarkdown>{text}</ReactMarkdown>
                              </div>
                            )}

                            {hasPartialBlock && (
                              <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground font-mono">
                                <Loader2 className="w-3 h-3 animate-spin text-primary" />
                                <span>Bronnen worden geverifieerd…</span>
                              </div>
                            )}
                          </>
                        )}
                        {analysis && <AnalysisTogglePanel analysis={analysis} />}
                        {floritrack && <FloritrackTogglePanel data={floritrack} />}
                        {transportRisk && <TransportRiskTogglePanel data={transportRisk} />}
                        {analyticalBlock && <AnalyticalBlock data={analyticalBlock} />}
                        {hasCommercial && <CommercialProductTogglePanel />}
                      </div>
                    )}

                    {productCard && visibleCardIdx === i && (
                      <div className="animate-slide-in-right shrink-0 ml-2" style={{ maxWidth: "320px" }}>
                        <ProductCard data={productCard} />
                      </div>
                    )}
                  </div>

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

      {/* Queue indicator */}
      {queue.length > 0 && (
        <div className="shrink-0 px-4 pt-2">
          <div className="bg-muted/50 border border-border rounded-lg px-3 py-2 space-y-1.5">
            <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground">
              <ListOrdered className="w-3.5 h-3.5 text-primary" />
              <span className="font-semibold text-foreground">{queue.length} bericht{queue.length > 1 ? "en" : ""} in wachtrij</span>
            </div>
            {queue.map((q, idx) => (
              <div key={idx} className="flex items-center gap-2 text-[11px] text-muted-foreground pl-5">
                <Clock className="w-3 h-3 shrink-0" />
                <span className="truncate flex-1">{q}</span>
                <button
                  onClick={() => removeFromQueue(idx)}
                  className="text-[10px] text-destructive/60 hover:text-destructive transition-colors shrink-0"
                  title="Verwijder uit wachtrij"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="shrink-0 p-4 border-t border-border">
        <div className="flex items-end gap-2 bg-card rounded-xl border border-border px-3 py-2 focus-within:border-primary/40 transition-colors shadow-sm">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isLoading ? "Typ alvast — wordt in wachtrij geplaatst…" : "Stel een vraag aan HBMaster..."}
            rows={1}
            className="flex-1 bg-transparent text-sm text-foreground placeholder-muted-foreground resize-none outline-none max-h-32 min-h-[36px]"
            style={{ height: "auto" }}
            onInput={(e) => { const t = e.currentTarget; t.style.height = "auto"; t.style.height = t.scrollHeight + "px"; }}
          />
          <button onClick={send} disabled={!input.trim()}
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center transition-all shrink-0",
              isLoading && input.trim()
                ? "bg-muted border border-primary/30 hover:bg-primary/10"
                : "bg-gradient-brand hover:opacity-90 disabled:opacity-30"
            )}>
            {isLoading && input.trim() ? (
              <ListOrdered className="w-4 h-4 text-primary" />
            ) : (
              <Send className="w-4 h-4 text-primary-foreground" />
            )}
          </button>
        </div>
        {/* Validation check indicator */}
        {input.trim().length > 0 && (
          <div className="flex items-center gap-1.5 mt-1.5 px-1">
            {validateMessage(input.trim()).valid ? (
              <><Check className="w-3 h-3 text-accent" /><span className="text-[10px] text-accent font-mono">Klaar om te verzenden</span></>
            ) : (
              <><AlertTriangle className="w-3 h-3 text-destructive" /><span className="text-[10px] text-destructive font-mono">{validateMessage(input.trim()).reason}</span></>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatThread;

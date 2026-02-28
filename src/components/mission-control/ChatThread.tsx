import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { Send, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import bouquetIcon from "@/assets/bouquet-neon-icon.png";

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

const WorkflowPanel = ({ workflow }: { workflow: AIWorkflowData }) => {
  const [open, setOpen] = useState(false);
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

interface ChatThreadProps {
  onStateChange: (state: "idle" | "thinking" | "responding") => void;
  onMessageCount?: (count: number) => void;
}

const ChatThread = ({ onStateChange, onMessageCount }: ChatThreadProps) => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
              {["Wat is de huidige productie status?", "Analyseer de APU trends", "Hoeveel orders staan er vandaag?"].map(q => (
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
          const { text, workflow } = isUser ? { text: msg.content, workflow: null } : parseWorkflow(msg.content);
          return (
            <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                isUser
                  ? "bg-gradient-brand text-primary-foreground"
                  : "bg-card border border-border text-foreground"
              }`}>
                {isUser ? (
                  <p className="text-sm">{text}</p>
                ) : (
                  <div className="prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                    <ReactMarkdown>{text}</ReactMarkdown>
                  </div>
                )}
                {workflow && <WorkflowPanel workflow={workflow} />}
              </div>
            </div>
          );
        })}

        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex justify-start">
            <div className="bg-card border border-border rounded-2xl px-4 py-3 flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
              <span className="text-xs text-muted-foreground font-mono">HBMaster denkt na...</span>
            </div>
          </div>
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

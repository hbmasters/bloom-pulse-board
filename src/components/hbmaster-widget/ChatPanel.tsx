import { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMsg, WidgetStatus, HBMasterWidgetConfig } from "./types";
import { themeAccents } from "./types";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import InsightPanel from "./InsightPanel";
import MiniHologram from "./MiniHologram";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/hbmaster-chat`;

interface ChatPanelProps {
  config: HBMasterWidgetConfig;
  status: WidgetStatus;
  onClose: () => void;
  isOpen: boolean;
  fullscreen?: boolean;
  userName?: string;
}

const ChatPanel = ({ config, status, onClose, isOpen, fullscreen, userName }: ChatPanelProps) => {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const accent = themeAccents[config.theme];
  const accentHsl = config.accentColor || accent.hsl;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const streamChat = useCallback(async (msgs: ChatMsg[], onDelta: (t: string) => void, onDone: () => void) => {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages: msgs.map(m => ({ role: m.role, content: m.content })) }),
    });

    if (!resp.ok || !resp.body) {
      throw new Error(resp.status === 429 ? "Rate limit bereikt." : resp.status === 402 ? "Tegoed op." : "Verbinding mislukt");
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
    const userMsg: ChatMsg = { role: "user", content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setIsStreaming(false);

    let assistantSoFar = "";
    try {
      await streamChat(
        [...messages, userMsg],
        (chunk) => {
          if (!assistantSoFar) setIsStreaming(true);
          assistantSoFar += chunk;
          setMessages(prev => {
            const last = prev[prev.length - 1];
            if (last?.role === "assistant" && !last.error) {
              return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
            }
            return [...prev, { role: "assistant", content: assistantSoFar, timestamp: new Date() }];
          });
        },
        () => { setIsLoading(false); setIsStreaming(false); },
      );
    } catch (e) {
      setIsLoading(false);
      setIsStreaming(false);
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: `⚠️ ${e instanceof Error ? e.message : "Onbekende fout"}`,
          timestamp: new Date(),
          error: true,
          correlationId: crypto.randomUUID().slice(0, 8),
        },
      ]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const statusColor = status === "online" ? "hsl(155 55% 42%)" : status === "busy" ? "hsl(40 90% 50%)" : "hsl(0 60% 50%)";

  return (
    <div
      className={cn(
        "flex flex-col bg-background/95 backdrop-blur-xl border border-border/60 text-foreground overflow-hidden",
        "transition-all duration-250 ease-out",
        fullscreen
          ? "fixed inset-0 z-50 rounded-none"
          : "w-[400px] h-[600px] rounded-2xl shadow-2xl",
      )}
      style={{
        boxShadow: fullscreen ? undefined : `0 24px 80px -16px hsl(${accentHsl} / 0.15), 0 8px 32px -8px hsl(0 0% 0% / 0.15)`,
      }}
    >
      {/* Header with Jarvis hologram */}
      <div
        className="shrink-0 flex items-center justify-between px-4 py-2.5 border-b border-border/40"
        style={{ background: `hsl(${accentHsl} / 0.04)` }}
      >
        <div className="flex items-center gap-2.5">
          <MiniHologram state={isStreaming ? "speaking" : "idle"} accentHsl={accentHsl} size={40} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-wide">HBMaster</span>
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: statusColor, animationDuration: "2s" }}
              />
            </div>
            <span className="text-[11px] text-muted-foreground font-mono">
              {accent.label}{config.contextLabel ? ` • ${config.contextLabel}` : ""}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* User badge */}
          {userName && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/40 border border-border/40">
              <User className="w-3 h-3 text-muted-foreground" />
              <span className="text-[11px] font-medium text-foreground/80">{userName}</span>
            </div>
          )}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Sluit chat"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Insight */}
      {config.insightText && <InsightPanel text={config.insightText} accentHsl={accentHsl} />}

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-3 py-8">
            <MiniHologram state="idle" accentHsl={accentHsl} size={80} />
            <p className="text-xs font-mono">Stel een vraag aan HBMaster</p>
            <div className="flex flex-wrap gap-1.5 mt-1 max-w-xs justify-center">
              {["Wat is de status?", "Toon vandaag's cijfers", "Analyseer trends"].map(q => (
                <button
                  key={q}
                  onClick={() => { setInput(q); inputRef.current?.focus(); }}
                  className="text-[11px] px-2.5 py-1 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-border/80 transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} accentHsl={accentHsl} />
        ))}

        {isLoading && !isStreaming && messages[messages.length - 1]?.role === "user" && (
          <TypingIndicator accentHsl={accentHsl} />
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 p-3 border-t border-border/40">
        <div className="flex items-end gap-2 bg-card rounded-xl border border-border px-3 py-2 focus-within:border-primary/30 transition-colors shadow-sm">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Stel een vraag..."
            rows={1}
            className="flex-1 bg-transparent text-sm text-foreground placeholder-muted-foreground resize-none outline-none max-h-28 min-h-[36px]"
            style={{ height: "auto" }}
            onInput={(e) => { const t = e.currentTarget; t.style.height = "auto"; t.style.height = t.scrollHeight + "px"; }}
          />
          <button
            onClick={send}
            disabled={isLoading || !input.trim()}
            className="w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-25 transition-all shrink-0 hover:opacity-90"
            style={{ background: `hsl(${accentHsl})` }}
            aria-label="Verstuur"
          >
            <Send className="w-4 h-4 text-primary-foreground" />
          </button>
        </div>
        <p className="text-[9px] text-muted-foreground/40 text-center mt-1.5 font-mono">
          Enter = verstuur · Shift+Enter = nieuwe regel
        </p>
      </div>
    </div>
  );
};

export default ChatPanel;

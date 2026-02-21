import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { ChatMsg } from "./types";
import ReactMarkdown from "react-markdown";
import HexAvatar from "./HexAvatar";

interface MessageBubbleProps {
  msg: ChatMsg;
  accentHsl: string;
}

const MessageBubble = ({ msg, accentHsl }: MessageBubbleProps) => {
  const isUser = msg.role === "user";

  return (
    <div className={cn("flex gap-2", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="shrink-0 mt-1">
          <HexAvatar accentHsl={accentHsl} size={24} animate={false} />
        </div>
      )}
      <div
        className={cn(
          "max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
          isUser
            ? "text-primary-foreground"
            : "bg-card border border-border text-foreground",
          msg.error && "border-destructive/30 bg-destructive/5"
        )}
        style={isUser ? { background: `hsl(${accentHsl})` } : undefined}
      >
        {isUser ? (
          <p>{msg.content}</p>
        ) : (
          <div className="prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          </div>
        )}

        {msg.error && msg.correlationId && (
          <p className="text-[10px] font-mono text-muted-foreground/50 mt-1.5">ID: {msg.correlationId}</p>
        )}

        <p className={cn("text-[10px] mt-1.5", isUser ? "text-primary-foreground/60" : "text-muted-foreground/50")}>
          {format(msg.timestamp, "HH:mm")}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;

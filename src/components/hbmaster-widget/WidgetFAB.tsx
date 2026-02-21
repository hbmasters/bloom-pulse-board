import { useState } from "react";
import { cn } from "@/lib/utils";
import type { WidgetStatus } from "./types";

interface WidgetFABProps {
  onClick: () => void;
  isOpen: boolean;
  status: WidgetStatus;
  accentHsl: string;
}

const WidgetFAB = ({ onClick, isOpen, status, accentHsl }: WidgetFABProps) => {
  const [hovered, setHovered] = useState(false);

  const statusColor = status === "online" ? "hsl(155 55% 42%)" : status === "busy" ? "hsl(40 90% 50%)" : "hsl(0 60% 50%)";

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={isOpen ? "Sluit HBMaster" : "Open HBMaster"}
      className={cn(
        "relative w-14 h-14 rounded-full flex items-center justify-center",
        "transition-all duration-250 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "shadow-lg hover:shadow-xl",
        isOpen && "rotate-45"
      )}
      style={{
        background: `hsl(${accentHsl})`,
        boxShadow: hovered
          ? `0 0 32px -4px hsl(${accentHsl} / 0.5), 0 8px 24px -8px hsl(${accentHsl} / 0.3)`
          : `0 4px 16px -4px hsl(${accentHsl} / 0.3)`,
      }}
    >
      {/* Halo pulse */}
      {status === "online" && !isOpen && (
        <span
          className="absolute inset-0 rounded-full animate-ping opacity-20"
          style={{ background: `hsl(${accentHsl})`, animationDuration: "3s" }}
        />
      )}

      {/* Icon — minimal AI hexagon */}
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-primary-foreground transition-transform duration-250">
        {isOpen ? (
          <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        ) : (
          <>
            <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12 9V6M12 18V15M15 12H18M6 12H9" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
          </>
        )}
      </svg>

      {/* Status dot */}
      <span
        className={cn("absolute top-0.5 right-0.5 w-3 h-3 rounded-full border-2 border-background", status === "online" && "animate-pulse")}
        style={{ background: statusColor, animationDuration: "2s" }}
      />
    </button>
  );
};

export default WidgetFAB;

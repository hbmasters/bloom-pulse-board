import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, Loader2, Sparkles } from "lucide-react";

const steps = [
  "Context analyseren…",
  "Data ophalen…",
  "Antwoord formuleren…",
];

const TypingIndicator = ({ accentHsl }: { accentHsl: string }) => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-start">
      <div className="bg-card border border-border rounded-2xl px-3.5 py-2.5 min-w-[200px] space-y-1.5">
        {/* Header */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" style={{ color: `hsl(${accentHsl})` }} />
            <div className="absolute inset-0 w-3.5 h-3.5 rounded-full animate-ping" style={{ background: `hsl(${accentHsl} / 0.2)` }} />
          </div>
          <span className="text-[11px] font-semibold text-foreground">HBMaster is bezig</span>
        </div>

        {/* Steps */}
        <div className="space-y-1">
          {steps.map((step, i) => {
            const done = i < activeStep;
            const active = i === activeStep;
            return (
              <div key={i} className={cn(
                "flex items-center gap-1.5 transition-all duration-500",
                i > activeStep && "opacity-30"
              )}>
                {done ? (
                  <CheckCircle2 className="w-3 h-3 shrink-0" style={{ color: `hsl(${accentHsl})` }} />
                ) : active ? (
                  <Loader2 className="w-3 h-3 animate-spin shrink-0" style={{ color: `hsl(${accentHsl})` }} />
                ) : (
                  <Circle className="w-3 h-3 text-muted-foreground/30 shrink-0" />
                )}
                <span className={cn(
                  "text-[10px] font-mono transition-colors duration-300",
                  done ? "text-muted-foreground" : active ? "text-foreground" : "text-muted-foreground/40"
                )}>{step}</span>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="h-0.5 w-full rounded-full bg-border overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${((activeStep + 1) / steps.length) * 100}%`,
              background: `hsl(${accentHsl} / 0.6)`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;

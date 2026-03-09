import { useState, useEffect } from "react";
import { Activity } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";

type SystemHealth = "online" | "degraded" | "offline" | "checking";

export function LoginSystemStatus() {
  const [status, setStatus] = useState<SystemHealth>("checking");

  useEffect(() => {
    const check = async () => {
      try {
        // Simple health check: can we reach the backend?
        const start = Date.now();
        const { error } = await supabase.from("profiles").select("id").limit(1);
        const latency = Date.now() - start;

        if (error) {
          setStatus("degraded");
        } else if (latency > 3000) {
          setStatus("degraded");
        } else {
          setStatus("online");
        }
      } catch {
        setStatus("offline");
      }
    };

    check();
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, []);

  const config: Record<SystemHealth, { label: string; color: string; pulse: boolean }> = {
    checking: { label: "Systeem controleren…", color: "text-muted-foreground", pulse: true },
    online: { label: "Alle systemen operationeel", color: "text-accent", pulse: true },
    degraded: { label: "Systeem vertraagd", color: "text-bloom-warm", pulse: true },
    offline: { label: "Systeem offline", color: "text-destructive", pulse: false },
  };

  const { label, color, pulse } = config[status];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 cursor-default">
            <span className="relative flex h-2.5 w-2.5">
              {pulse && (
                <span className={`absolute inline-flex h-full w-full rounded-full opacity-50 animate-ping ${
                  status === "online" ? "bg-accent" : status === "degraded" ? "bg-bloom-warm" : "bg-muted-foreground"
                }`} />
              )}
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                status === "online" ? "bg-accent" : status === "degraded" ? "bg-bloom-warm" : status === "offline" ? "bg-destructive" : "bg-muted-foreground"
              }`} />
            </span>
            <Activity className={`w-3.5 h-3.5 ${color}`} />
            <span className={`text-[11px] font-mono ${color}`}>{label}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

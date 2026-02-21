import { useState } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import type { HBMasterWidgetConfig, WidgetStatus } from "./types";
import { themeAccents } from "./types";
import WidgetFAB from "./WidgetFAB";
import ChatPanel from "./ChatPanel";

interface HBMasterWidgetProps {
  config: HBMasterWidgetConfig;
  status?: WidgetStatus;
  userName?: string;
}

const HBMasterWidget = ({ config, status = "online", userName }: HBMasterWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const accent = themeAccents[config.theme];
  const accentHsl = config.accentColor || accent.hsl;

  return (
    <div
      className={cn(
        "fixed z-50",
        config.position === "bottom-left" ? "bottom-6 left-6" : "bottom-6 right-6"
      )}
    >
      {isOpen && (
        <div
          className={cn(
            "mb-4 animate-scale-in origin-bottom-right",
            isMobile && "fixed inset-0 mb-0"
          )}
        >
          <ChatPanel
            config={config}
            status={status}
            onClose={() => setIsOpen(false)}
            isOpen={isOpen}
            fullscreen={isMobile}
            userName={userName}
          />
        </div>
      )}

      {!(isMobile && isOpen) && (
        <WidgetFAB
          onClick={() => setIsOpen(!isOpen)}
          isOpen={isOpen}
          status={status}
          accentHsl={accentHsl}
        />
      )}
    </div>
  );
};

export default HBMasterWidget;

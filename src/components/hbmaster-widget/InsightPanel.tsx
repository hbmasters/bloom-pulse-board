import { Activity } from "lucide-react";

interface InsightPanelProps {
  text: string;
  accentHsl: string;
}

const InsightPanel = ({ text, accentHsl }: InsightPanelProps) => (
  <div
    className="mx-4 mt-3 mb-1 rounded-xl border px-3 py-2.5 flex items-start gap-2.5 text-[12px] leading-relaxed"
    style={{
      borderColor: `hsl(${accentHsl} / 0.2)`,
      background: `hsl(${accentHsl} / 0.06)`,
    }}
  >
    <Activity className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: `hsl(${accentHsl})` }} />
    <span className="text-foreground/80">{text}</span>
  </div>
);

export default InsightPanel;

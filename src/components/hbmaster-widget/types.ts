export type WidgetTheme = "productie" | "florist" | "teams" | "kenya" | "realestate";

export interface HBMasterWidgetConfig {
  theme: WidgetTheme;
  contextLabel?: string;
  accentColor?: string;
  insightText?: string;
  position?: "bottom-right" | "bottom-left";
}

export type WidgetStatus = "online" | "busy" | "offline";

export type ChatMsg = { role: "user" | "assistant"; content: string; timestamp: Date; error?: boolean; correlationId?: string };

export const themeAccents: Record<WidgetTheme, { accent: string; label: string; hsl: string }> = {
  productie:   { accent: "hsl(228 50% 55%)", label: "HBM Productie",   hsl: "228 50% 55%" },
  florist:     { accent: "hsl(155 55% 42%)", label: "HBM Florist",     hsl: "155 55% 42%" },
  teams:       { accent: "hsl(220 15% 45%)", label: "HBM Teams",       hsl: "220 15% 45%" },
  kenya:       { accent: "hsl(25 70% 50%)",  label: "HBM Kenya",       hsl: "25 70% 50%" },
  realestate:  { accent: "hsl(190 45% 42%)", label: "HBM Real Estate", hsl: "190 45% 42%" },
};

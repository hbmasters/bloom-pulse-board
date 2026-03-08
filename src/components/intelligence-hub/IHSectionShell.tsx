import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface IHSectionShellProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  badge?: string;
  badgeVariant?: "default" | "success" | "warning" | "critical";
  children: ReactNode;
}

const badgeStyles = {
  default: "bg-primary/10 text-primary border-primary/20",
  success: "bg-accent/10 text-accent border-accent/20",
  warning: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  critical: "bg-red-500/10 text-red-500 border-red-500/20",
};

const IHSectionShell = ({ icon: Icon, title, subtitle, badge, badgeVariant = "default", children }: IHSectionShellProps) => {
  return (
    <section className="rounded-2xl border border-border bg-card/70 backdrop-blur-sm overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-foreground tracking-tight">{title}</h2>
            {badge && (
              <span className={`text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full border ${badgeStyles[badgeVariant]}`}>
                {badge}
              </span>
            )}
          </div>
          {subtitle && <p className="text-[10px] font-mono text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
};

export default IHSectionShell;

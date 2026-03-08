import { cn } from "@/lib/utils";
import {
  ShoppingCart,
  Truck,
  Factory,
  ClipboardList,
  Banknote,
  ArrowDownToLine,
  Thermometer,
  Hand,
  Cog,
  Flower2,
  Package,
  GitFork,
  ArrowUpFromLine,
  type LucideIcon,
} from "lucide-react";

/* ── Department types ── */

export type Department = "Verkoop" | "Inkoop" | "Productie" | "Administratie" | "Financieel";

export type ProductionSub =
  | "Ingang" | "Koelcel" | "Hand" | "Band"
  | "Arrangement" | "Inpak" | "Verdelen" | "Uitgaande";

/* ── Color map using CSS variables ── */

const deptConfig: Record<Department, { cssVar: string; icon: LucideIcon }> = {
  Verkoop:        { cssVar: "--dept-verkoop",        icon: ShoppingCart },
  Inkoop:         { cssVar: "--dept-inkoop",         icon: Truck },
  Productie:      { cssVar: "--dept-productie",      icon: Factory },
  Administratie:  { cssVar: "--dept-administratie",  icon: ClipboardList },
  Financieel:     { cssVar: "--dept-financieel",     icon: Banknote },
};

const subConfig: Record<ProductionSub, { cssVar: string; icon: LucideIcon }> = {
  Ingang:      { cssVar: "--dept-ingang",      icon: ArrowDownToLine },
  Koelcel:     { cssVar: "--dept-koelcel",     icon: Thermometer },
  Hand:        { cssVar: "--dept-hand",        icon: Hand },
  Band:        { cssVar: "--dept-band",        icon: Cog },
  Arrangement: { cssVar: "--dept-arrangement", icon: Flower2 },
  Inpak:       { cssVar: "--dept-inpak",       icon: Package },
  Verdelen:    { cssVar: "--dept-verdelen",    icon: GitFork },
  Uitgaande:   { cssVar: "--dept-uitgaande",   icon: ArrowUpFromLine },
};

/* ── Helper to build inline HSL styles ── */

function deptStyles(cssVar: string) {
  return {
    color: `hsl(var(${cssVar}))`,
    backgroundColor: `hsl(var(${cssVar}) / 0.1)`,
    borderColor: `hsl(var(${cssVar}) / 0.25)`,
  };
}

/* ── Department Badge ── */

interface DepartmentBadgeProps {
  department: Department;
  showIcon?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export const DepartmentBadge = ({ department, showIcon = true, size = "sm", className }: DepartmentBadgeProps) => {
  const cfg = deptConfig[department];
  const Icon = cfg.icon;
  const s = deptStyles(cfg.cssVar);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-mono font-semibold whitespace-nowrap",
        size === "sm" ? "text-[9px] px-2 py-0.5" : "text-[11px] px-2.5 py-1",
        className,
      )}
      style={s}
    >
      {showIcon && <Icon className={size === "sm" ? "w-2.5 h-2.5" : "w-3.5 h-3.5"} />}
      {department}
    </span>
  );
};

/* ── Subdepartment Chip ── */

interface SubdepartmentChipProps {
  sub: ProductionSub;
  showIcon?: boolean;
  className?: string;
}

export const SubdepartmentChip = ({ sub, showIcon = true, className }: SubdepartmentChipProps) => {
  const cfg = subConfig[sub];
  const Icon = cfg.icon;
  const s = deptStyles(cfg.cssVar);

  return (
    <span
      className={cn("inline-flex items-center gap-1 rounded-md border text-[8px] font-mono font-medium px-1.5 py-0.5 whitespace-nowrap", className)}
      style={s}
    >
      {showIcon && <Icon className="w-2.5 h-2.5" />}
      {sub}
    </span>
  );
};

/* ── Department Accent Border ── */

interface DeptAccentBorderProps {
  department: Department;
  children: React.ReactNode;
  className?: string;
}

export const DeptAccentBorder = ({ department, children, className }: DeptAccentBorderProps) => {
  const cssVar = deptConfig[department].cssVar;
  return (
    <div
      className={cn("rounded-xl border-l-[3px] pl-3", className)}
      style={{ borderLeftColor: `hsl(var(${cssVar}))` }}
    >
      {children}
    </div>
  );
};

/* ── Department Filter ── */

interface DepartmentFilterProps {
  departments: (Department | "All")[];
  active: string;
  onChange: (val: string) => void;
  className?: string;
}

export const DepartmentFilter = ({ departments, active, onChange, className }: DepartmentFilterProps) => (
  <div className={cn("flex flex-wrap gap-1.5", className)}>
    {departments.map((d) => {
      const isActive = active === d;
      const style = d !== "All" ? deptStyles(deptConfig[d as Department].cssVar) : undefined;

      return (
        <button
          key={d}
          onClick={() => onChange(d)}
          className={cn(
            "text-[10px] font-mono font-semibold px-3 py-1 rounded-full border transition-colors",
            isActive
              ? d === "All"
                ? "bg-primary text-primary-foreground border-primary"
                : ""
              : "bg-muted/20 text-muted-foreground border-border hover:border-primary/40",
          )}
          style={isActive && d !== "All" ? { ...style, backgroundColor: `hsl(var(${deptConfig[d as Department].cssVar}) / 0.15)` } : undefined}
        >
          {d === "All" ? "Alle afdelingen" : d}
        </button>
      );
    })}
  </div>
);

/* ── Department Icon (standalone) ── */

export const DepartmentIcon = ({ department, className }: { department: Department; className?: string }) => {
  const cfg = deptConfig[department];
  const Icon = cfg.icon;
  return <Icon className={cn("w-4 h-4", className)} style={{ color: `hsl(var(${cfg.cssVar}))` }} />;
};

/* ── Export all departments for filters ── */

export const ALL_DEPARTMENTS: Department[] = ["Verkoop", "Inkoop", "Productie", "Administratie", "Financieel"];
export const ALL_PRODUCTION_SUBS: ProductionSub[] = ["Ingang", "Koelcel", "Hand", "Band", "Arrangement", "Inpak", "Verdelen", "Uitgaande"];

/* ── Mapping helpers for legacy data ── */

const legacyToDept: Record<string, Department> = {
  Sales: "Verkoop",
  Procurement: "Inkoop",
  Production: "Productie",
  Design: "Productie",
  Planning: "Productie",
};

export const mapLegacyDept = (legacy: string): Department => legacyToDept[legacy] || "Productie";

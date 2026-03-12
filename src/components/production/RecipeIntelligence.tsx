import { cn } from "@/lib/utils";
import { FlaskConical, CheckCircle2, AlertTriangle, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  bouquetRecipes,
  complexityColor,
  stabilityLabel,
  stabilityColor,
  type BouquetRecipe,
} from "./production-complexity-data";

const RecipeIntelligence = () => {
  const sorted = [...bouquetRecipes].sort((a, b) => b.complexityIndex - a.complexityIndex);

  return (
    <div className="space-y-3">
      {sorted.map(recipe => {
        const cx = complexityColor(recipe.complexityLevel);
        const stab = stabilityColor(recipe.recipeStability);
        return (
          <div key={recipe.id} className={cn("rounded-xl border p-4", cx.border, cx.bg)}>
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-bold text-foreground">{recipe.name}</span>
                <span className={cn("text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full border", cx.bg, cx.border, cx.text)}>
                  {cx.label} ({recipe.complexityIndex.toFixed(1)})
                </span>
              </div>
              <span className={cn("text-[10px] font-mono font-semibold", stab)}>
                {stabilityLabel(recipe.recipeStability)}
              </span>
            </div>

            {/* Key metrics row */}
            <div className="grid grid-cols-4 gap-3 mb-3 text-[10px]">
              <div>
                <span className="text-muted-foreground/50 font-mono block">Stelen/BQ</span>
                <span className="font-mono font-bold text-foreground text-[14px]">{recipe.stemsPerBouquet}</span>
              </div>
              <div>
                <span className="text-muted-foreground/50 font-mono block">Bloem types</span>
                <span className="font-mono font-bold text-foreground text-[14px]">{recipe.flowerTypeCount}</span>
              </div>
              <div>
                <span className="text-muted-foreground/50 font-mono block">Variatie-index</span>
                <span className={cn("font-mono font-bold text-[14px]", recipe.recipeVariationIndex >= 4 ? "text-destructive" : recipe.recipeVariationIndex >= 2.5 ? "text-yellow-500" : "text-accent")}>
                  {recipe.recipeVariationIndex.toFixed(1)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground/50 font-mono block">Handling</span>
                <span className={cn("font-mono font-bold text-[14px]", recipe.handlingIntensity >= 8 ? "text-destructive" : recipe.handlingIntensity >= 5 ? "text-yellow-500" : "text-accent")}>
                  {recipe.handlingIntensity}/10
                </span>
              </div>
            </div>

            {/* Component mix bars */}
            <div className="space-y-1">
              <span className="text-[9px] font-mono text-muted-foreground/40">Component mix</span>
              <div className="flex h-4 rounded-full overflow-hidden border border-border/30">
                {recipe.components.map((c, i) => {
                  const colors = [
                    "bg-primary/70", "bg-accent/70", "bg-yellow-500/70", "bg-destructive/50",
                    "bg-primary/40", "bg-accent/40", "bg-yellow-500/40", "bg-destructive/30",
                    "bg-primary/25", "bg-accent/25",
                  ];
                  return (
                    <div
                      key={c.flower}
                      className={cn("h-full transition-all", colors[i % colors.length])}
                      style={{ width: `${c.percentage}%` }}
                      title={`${c.flower}: ${c.percentage}%${c.stemLength ? ` (${c.stemLength}cm)` : ""}`}
                    />
                  );
                })}
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
                {recipe.components.map((c, i) => {
                  const dotColors = [
                    "bg-primary/70", "bg-accent/70", "bg-yellow-500/70", "bg-destructive/50",
                    "bg-primary/40", "bg-accent/40", "bg-yellow-500/40", "bg-destructive/30",
                    "bg-primary/25", "bg-accent/25",
                  ];
                  return (
                    <span key={c.flower} className="text-[9px] text-foreground/60 flex items-center gap-1">
                      <span className={cn("w-1.5 h-1.5 rounded-full", dotColors[i % dotColors.length])} />
                      {c.flower} {c.percentage}%
                      {c.stemLength && <span className="text-muted-foreground/30">({c.stemLength}cm)</span>}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RecipeIntelligence;

import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle2, Package } from "lucide-react";

// Product images mapped by key
import imgCharmeXl from "@/assets/product-charme-xl.jpg";
import imgChique from "@/assets/product-chique.jpg";
import imgDeLuxe from "@/assets/product-de-luxe.jpg";
import imgElegance from "@/assets/product-elegance.jpg";
import imgFieldL from "@/assets/product-field-l.jpg";
import imgFieldM from "@/assets/product-field-m.jpg";
import imgLovely from "@/assets/product-lovely.jpg";
import imgMoederdag from "@/assets/product-moederdag.jpg";
import imgOrchidee from "@/assets/product-orchidee.jpg";
import imgPastel from "@/assets/product-pastel.jpg";
import imgRoos from "@/assets/product-roos.jpg";
import imgSpringBouquet from "@/assets/product-spring-bouquet.jpg";
import imgTrend from "@/assets/product-trend.jpg";
import imgTulpen from "@/assets/product-tulpen.jpg";
import imgZomermix from "@/assets/product-zomermix.jpg";
import imgZonnebloem from "@/assets/product-zonnebloem.jpg";

const productImageMap: Record<string, string> = {
  "charme-xl": imgCharmeXl,
  "chique": imgChique,
  "de-luxe": imgDeLuxe,
  "elegance": imgElegance,
  "field-l": imgFieldL,
  "field-m": imgFieldM,
  "lovely": imgLovely,
  "moederdag": imgMoederdag,
  "orchidee": imgOrchidee,
  "pastel": imgPastel,
  "roos": imgRoos,
  "spring-bouquet": imgSpringBouquet,
  "trend": imgTrend,
  "tulpen": imgTulpen,
  "zomermix": imgZomermix,
  "zonnebloem": imgZonnebloem,
};

export function resolveProductImage(key?: string): string | null {
  if (!key) return null;
  const normalized = key.toLowerCase().replace(/\s+/g, "-");
  return productImageMap[normalized] || null;
}

export interface ProductCardData {
  product_name: string;
  product_image_key?: string;
  w_apu: number;
  o_apu: number;
  p_apu?: number;
  line?: string;
  period?: string;
  verdict?: string;
  quantity?: number;
  avg_stems?: number;
}

const ProductCard = ({ data }: { data: ProductCardData }) => {
  const image = resolveProductImage(data.product_image_key);
  const diff = data.w_apu - data.o_apu;
  const diffPct = data.o_apu ? ((diff / data.o_apu) * 100).toFixed(1) : "0";
  const isPositive = diff >= 0;
  const isClose = Math.abs(diff) < 5;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden max-w-sm">
      {/* Image */}
      {image && (
        <div className="h-32 w-full overflow-hidden bg-muted/20">
          <img src={image} alt={data.product_name} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title row */}
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-foreground">{data.product_name}</h3>
          {data.line && (
            <span className="text-[9px] font-mono text-muted-foreground px-1.5 py-0.5 rounded bg-muted/30 shrink-0">
              {data.line}
            </span>
          )}
        </div>

        {/* APU comparison + Avg Stems */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2.5 rounded-lg bg-muted/20 border border-border/50">
            <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider block mb-0.5">W-APU</span>
            <span className="text-lg font-black text-foreground tabular-nums leading-none">{data.w_apu}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-muted/20 border border-border/50">
            <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider block mb-0.5">O-APU</span>
            <span className="text-lg font-black text-foreground tabular-nums leading-none">{data.o_apu}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-muted/20 border border-border/50">
            <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider block mb-0.5">Gem. stelen</span>
            <span className="text-lg font-black text-foreground tabular-nums leading-none">{data.avg_stems ?? "—"}</span>
          </div>
        </div>

        {/* Quantity */}
        {data.quantity !== undefined && (
          <div className="p-2.5 rounded-lg bg-muted/10 border border-border/30 flex items-center gap-2">
            <Package className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
            <div>
              <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider block mb-0.5">Stuks</span>
              <span className="text-sm font-bold text-foreground tabular-nums">{data.quantity.toLocaleString("nl-NL")}</span>
            </div>
          </div>
        )}

        {/* Delta badge */}
        <div className={`flex items-center gap-2 p-2.5 rounded-lg border ${
          isPositive
            ? "bg-accent/5 border-accent/20"
            : "bg-red-500/5 border-red-500/20"
        }`}>
          {isPositive ? (
            isClose ? <Minus className="w-3.5 h-3.5 text-muted-foreground" /> : <TrendingUp className="w-3.5 h-3.5 text-accent" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 text-red-400" />
          )}
          <div className="flex-1">
            <span className={`text-xs font-bold tabular-nums ${
              isPositive ? "text-accent" : "text-red-400"
            }`}>
              {isPositive ? "+" : ""}{diff} ({isPositive ? "+" : ""}{diffPct}%)
            </span>
            <span className="text-[9px] font-mono text-muted-foreground ml-1.5">
              W-APU vs O-APU
            </span>
          </div>
          {isPositive ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-accent/60" />
          ) : (
            <AlertTriangle className="w-3.5 h-3.5 text-red-400/60" />
          )}
        </div>

        {/* Verdict */}
        {data.verdict && (
          <p className="text-[11px] text-muted-foreground leading-relaxed">{data.verdict}</p>
        )}

        {/* Period */}
        {data.period && (
          <span className="text-[9px] font-mono text-muted-foreground/50 block">{data.period}</span>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
export type { ProductCardData as ProductCardDataType };

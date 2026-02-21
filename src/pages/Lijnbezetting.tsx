import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { LogOut, Users, Minus, Plus, Check, ChevronDown, Clock, TrendingUp, Package, Zap, CalendarDays, Target } from "lucide-react";

// Product image map
import productFieldL from "@/assets/product-field-l.jpg";
import productDeLuxe from "@/assets/product-de-luxe.jpg";
import productFieldM from "@/assets/product-field-m.jpg";
import productElegance from "@/assets/product-elegance.jpg";
import productCharmeXL from "@/assets/product-charme-xl.jpg";
import productLovely from "@/assets/product-lovely.jpg";
import productChique from "@/assets/product-chique.jpg";
import productTrend from "@/assets/product-trend.jpg";

const productImages: Record<string, string> = {
  "BQ Field L": productFieldL,
  "BQ de Luxe": productDeLuxe,
  "BQ Field M": productFieldM,
  "BQ Elegance": productElegance,
  "BQ Charme XL": productCharmeXL,
  "BQ Lovely": productLovely,
  "BQ Chique": productChique,
  "BQ Trend": productTrend,
};

// Mock production stats per product
const productStats: Record<string, { produced: number; target: number; apu: number; plannedApu: number; departureDate: string; expectedEnd: string; status: "in-production" | "completed" }> = {
  "BQ Field L":    { produced: 287, target: 400, apu: 88, plannedApu: 80, departureDate: "21 feb", expectedEnd: "11:30", status: "in-production" },
  "BQ de Luxe":    { produced: 250, target: 250, apu: 95, plannedApu: 85, departureDate: "21 feb", expectedEnd: "—", status: "completed" },
  "BQ Elegance":   { produced: 356, target: 400, apu: 119, plannedApu: 100, departureDate: "22 feb", expectedEnd: "12:00", status: "in-production" },
  "BQ Charme XL":  { produced: 198, target: 350, apu: 88, plannedApu: 85, departureDate: "21 feb", expectedEnd: "13:00", status: "in-production" },
  "BQ Lovely":     { produced: 200, target: 200, apu: 78, plannedApu: 75, departureDate: "22 feb", expectedEnd: "—", status: "completed" },
  "BQ Chique":     { produced: 150, target: 150, apu: 92, plannedApu: 90, departureDate: "21 feb", expectedEnd: "—", status: "completed" },
  "BQ Trend":      { produced: 95, target: 300, apu: 95, plannedApu: 90, departureDate: "23 feb", expectedEnd: "14:00", status: "in-production" },
  "BQ Field M":    { produced: 120, target: 280, apu: 82, plannedApu: 80, departureDate: "21 feb", expectedEnd: "13:30", status: "in-production" },
};

interface Line {
  id: string;
  name: string;
}

interface LineProduct {
  id: string;
  line_id: string;
  name: string;
  persons_count: number;
  updated_by: string | null;
  updated_at: string;
}

// Mock daily history
const dailyHistory = [
  { time: "07:00", product: "BQ Field L", persons: 3, duration: "2h30m", pieces: 400 },
  { time: "09:30", product: "BQ de Luxe", persons: 2, duration: "1h45m", pieces: 250 },
  { time: "11:15", product: "BQ Elegance", persons: 3, duration: "2h00m", pieces: 300 },
];

const hbMessages = [
  { text: "Goed tempo — bezetting is optimaal verdeeld.", mode: "flow" as const },
  { text: "Lijn draait stabiel. Output per persoon is hoog.", mode: "flow" as const },
  { text: "Overweeg 1 extra persoon op BQ Charme XL.", mode: "correctie" as const },
  { text: "Alle lijnen bezet. Sterke dagstart.", mode: "stabilisatie" as const },
];

const modeColors = {
  flow: "border-accent/30 bg-accent/5",
  stabilisatie: "border-primary/25 bg-primary/5",
  correctie: "border-bloom-warm/25 bg-bloom-warm/5",
};

const PersonsModal = ({
  product,
  onClose,
  onSave,
}: {
  product: LineProduct;
  onClose: () => void;
  onSave: (id: string, count: number) => void;
}) => {
  const [count, setCount] = useState(product.persons_count);
  const image = productImages[product.name];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-card w-full sm:max-w-sm sm:rounded-2xl rounded-t-3xl border-t sm:border border-border shadow-2xl p-6 pb-8 animate-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 rounded-full bg-muted mx-auto mb-5 sm:hidden" />

        {image && (
          <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto mb-4 shadow-md border border-border">
            <img src={image} alt={product.name} className="w-full h-full object-cover" />
          </div>
        )}

        <h3 className="text-xl font-black text-foreground text-center mb-1">{product.name}</h3>
        <p className="text-sm text-muted-foreground text-center mb-6">Aantal personen instellen</p>

        <div className="flex items-center justify-center gap-6 mb-8">
          <button
            onClick={() => setCount(Math.max(0, count - 1))}
            className="w-20 h-20 rounded-2xl border-2 border-border bg-secondary flex items-center justify-center active:scale-90 transition-transform touch-manipulation"
          >
            <Minus className="w-8 h-8 text-foreground" />
          </button>

          <div className="text-center">
            <div className="text-6xl font-mono font-black text-foreground leading-none">{count}</div>
            <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider font-bold">personen</div>
          </div>

          <button
            onClick={() => setCount(Math.min(10, count + 1))}
            className="w-20 h-20 rounded-2xl border-2 border-border bg-secondary flex items-center justify-center active:scale-90 transition-transform touch-manipulation"
          >
            <Plus className="w-8 h-8 text-foreground" />
          </button>
        </div>

        {/* Quick select grid */}
        <div className="grid grid-cols-6 gap-2 mb-6">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <button
              key={n}
              onClick={() => setCount(n)}
              className={`py-3 rounded-xl text-lg font-bold transition-all active:scale-90 touch-manipulation ${
                count === n
                  ? "bg-gradient-brand text-primary-foreground shadow-md"
                  : "bg-secondary text-foreground border border-border"
              } ${n === 10 ? "col-span-1" : ""}`}
            >
              {n}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            onSave(product.id, count);
            onClose();
          }}
          className="w-full py-4 rounded-xl bg-gradient-brand text-primary-foreground text-lg font-bold shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2 touch-manipulation"
        >
          <Check className="w-5 h-5" />
          Opslaan
        </button>
      </div>
    </div>
  );
};

const ProductCard = ({
  product,
  onTap,
}: {
  product: LineProduct;
  onTap: () => void;
}) => {
  const image = productImages[product.name];
  const stats = productStats[product.name];
  const pct = stats ? Math.round((stats.produced / stats.target) * 100) : 0;
  const apuDiff = stats ? Math.round(((stats.apu - stats.plannedApu) / stats.plannedApu) * 100) : 0;
  const isInProduction = stats?.status === "in-production";

  return (
    <button
      onClick={onTap}
      className="w-full bg-card rounded-2xl border border-border text-left active:scale-[0.97] transition-transform touch-manipulation shadow-sm overflow-hidden"
    >
      {/* Top: image + name + persons */}
      <div className="flex gap-3 p-3 pb-2">
        {image ? (
          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-border shadow-sm">
            <img src={image} alt={product.name} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center shrink-0 border border-border">
            <Package className="w-7 h-7 text-muted-foreground" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-base font-black text-foreground truncate">{product.name}</h3>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 shrink-0 ml-2">
              <Users className="w-3.5 h-3.5 text-primary" />
              <span className="text-lg font-mono font-black text-primary">{product.persons_count}</span>
            </div>
          </div>
          {/* Status badge */}
          <div className="flex items-center gap-2">
            {isInProduction ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/25">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-slow" />
                In productie
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                <Check className="w-3 h-3" />
                Klaar
              </span>
            )}
            {stats && (
              <span className="text-[10px] font-semibold text-muted-foreground flex items-center gap-1">
                <CalendarDays className="w-3 h-3" /> {stats.departureDate}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats row */}
      {stats && (
        <div className="px-3 pb-2">
          <div className="flex items-center gap-4 text-[11px] mb-1.5">
            <span className="flex items-center gap-1 font-semibold text-foreground/80">
              <Target className="w-3 h-3 text-primary" />
              <span className="font-mono font-bold">{stats.produced}</span>
              <span className="text-muted-foreground">/ {stats.target}</span>
            </span>
            <span className="flex items-center gap-1 font-semibold text-accent">
              <Zap className="w-3 h-3" />
              {stats.apu} APU
              {apuDiff > 0 && <span className="text-[9px] font-bold">+{apuDiff}%</span>}
            </span>
            {isInProduction && stats.expectedEnd !== "—" && (
              <span className="flex items-center gap-1 font-semibold text-foreground/70 ml-auto">
                <Clock className="w-3 h-3 text-primary" />
                Klaar {stats.expectedEnd}
              </span>
            )}
          </div>
          {/* Progress bar */}
          <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${pct >= 100 ? "bg-accent" : "bg-primary"}`}
              style={{ width: `${Math.min(pct, 100)}%` }}
            />
          </div>
        </div>
      )}
    </button>
  );
};

const HBMasterMobile = () => {
  const [msgIndex, setMsgIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setMsgIndex((p) => (p + 1) % hbMessages.length);
        setVisible(true);
      }, 400);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const currentMsg = hbMessages[msgIndex];

  return (
    <div className={`rounded-xl border overflow-hidden ${modeColors[currentMsg.mode]}`}>
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center shrink-0 shadow-sm">
          <span className="text-[9px] font-black text-primary-foreground">HB</span>
        </div>
        <div className="overflow-hidden flex-1 min-w-0">
          <div className="text-[8px] font-black text-primary uppercase tracking-wider mb-0.5">HBMASTER</div>
          <p className={`text-sm font-semibold text-foreground transition-all duration-300 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
          }`}>
            {currentMsg.text}
          </p>
        </div>
      </div>
    </div>
  );
};

const DayHistory = () => {
  const totalPieces = dailyHistory.reduce((s, h) => s + h.pieces, 0);
  const totalPersons = dailyHistory.reduce((s, h) => s + h.persons, 0);

  return (
    <div className="bg-card rounded-2xl border border-border p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-primary" />
        <h3 className="text-xs font-black text-foreground uppercase tracking-wider">Vandaag</h3>
        <div className="ml-auto flex items-center gap-3 text-[11px]">
          <span className="font-mono font-bold text-accent">{totalPieces} stuks</span>
          <span className="font-mono font-bold text-primary">{totalPersons} pers. gem.</span>
        </div>
      </div>
      <div className="space-y-2">
        {dailyHistory.map((entry, i) => {
          const img = productImages[entry.product];
          return (
            <div key={i} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
              {img ? (
                <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-border">
                  <img src={img} alt={entry.product} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-lg bg-secondary shrink-0 flex items-center justify-center">
                  <Package className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-foreground truncate">{entry.product}</div>
                <div className="text-[10px] text-muted-foreground">
                  {entry.time} · {entry.duration} · {entry.persons} pers.
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm font-mono font-bold text-foreground">{entry.pieces}</div>
                <div className="text-[9px] text-muted-foreground">stuks</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Lijnbezetting = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [userName, setUserName] = useState("");
  const [lines, setLines] = useState<Line[]>([]);
  const [selectedLine, setSelectedLine] = useState<string | null>(null);
  const [products, setProducts] = useState<LineProduct[]>([]);
  const [editProduct, setEditProduct] = useState<LineProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [linePickerOpen, setLinePickerOpen] = useState(false);

  // Auth check
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      setUserName(session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "");
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      setUserName(session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  // Load lines
  useEffect(() => {
    if (!user) return;
    const loadLines = async () => {
      const { data, error } = await supabase.from("lines").select("*").order("name");
      if (error) {
        toast({ title: "Geen toegang", description: "Je hebt de rol 'bandleider' nodig.", variant: "destructive" });
        return;
      }
      setLines(data || []);
      if (data && data.length > 0 && !selectedLine) {
        setSelectedLine(data[0].id);
      }
      setLoading(false);
    };
    loadLines();
  }, [user]);

  // Load products for selected line
  const loadProducts = useCallback(async () => {
    if (!selectedLine) return;
    const { data } = await supabase
      .from("line_products")
      .select("*")
      .eq("line_id", selectedLine)
      .order("name");
    if (data) setProducts(data);
  }, [selectedLine]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Realtime subscription
  useEffect(() => {
    if (!selectedLine) return;
    const channel = supabase
      .channel(`line-products-${selectedLine}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "line_products",
          filter: `line_id=eq.${selectedLine}`,
        },
        (payload) => {
          const updated = payload.new as LineProduct;
          setProducts((prev) =>
            prev.map((p) => (p.id === updated.id ? updated : p))
          );
          if (updated.updated_by && updated.updated_by !== userName) {
            toast({
              title: "Bijgewerkt",
              description: `${updated.name}: ${updated.persons_count} personen — door ${updated.updated_by}`,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedLine, userName]);

  const handleSave = async (productId: string, count: number) => {
    const { error } = await supabase
      .from("line_products")
      .update({
        persons_count: count,
        updated_by: userName,
        updated_at: new Date().toISOString(),
      })
      .eq("id", productId);

    if (error) {
      toast({ title: "Fout", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Bijgewerkt ✓", description: `${count} personen ingesteld` });
      loadProducts();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const selectedLineName = lines.find((l) => l.id === selectedLine)?.name || "";
  const totalPersons = products.reduce((sum, p) => sum + p.persons_count, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="shrink-0 px-4 py-3 border-b border-border bg-card shadow-sm safe-area-top">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center shadow-sm shrink-0">
              <span className="text-sm font-black text-primary-foreground">HB</span>
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-black text-foreground uppercase tracking-wider truncate">Lijnbezetting</h1>
              <p className="text-[10px] text-muted-foreground truncate">{userName}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center active:scale-90 transition-transform touch-manipulation">
            <LogOut className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </header>

      {/* Line selector */}
      <div className="px-4 py-3 bg-card border-b border-border">
        <button
          onClick={() => setLinePickerOpen(!linePickerOpen)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 border-primary/30 bg-primary/5 active:scale-[0.98] transition-transform touch-manipulation"
        >
          <div>
            <div className="text-[10px] text-primary uppercase tracking-wider font-bold">Actieve lijn</div>
            <div className="text-xl font-black text-foreground">{selectedLineName}</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-2xl font-mono font-black text-primary">{totalPersons}</div>
              <div className="text-[9px] text-muted-foreground uppercase">totaal</div>
            </div>
            <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${linePickerOpen ? "rotate-180" : ""}`} />
          </div>
        </button>

        {linePickerOpen && (
          <div className="mt-2 grid grid-cols-2 gap-2">
            {lines.map((line) => (
              <button
                key={line.id}
                onClick={() => {
                  setSelectedLine(line.id);
                  setLinePickerOpen(false);
                }}
                className={`px-4 py-3 rounded-xl text-left font-bold text-sm active:scale-95 transition-all touch-manipulation ${
                  selectedLine === line.id
                    ? "bg-gradient-brand text-primary-foreground shadow-md"
                    : "bg-secondary text-foreground border border-border"
                }`}
              >
                {line.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product cards */}
      <main className="flex-1 p-4 space-y-3 pb-4">
        {products.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-bold">Geen producten op deze lijn</p>
          </div>
        ) : (
          products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onTap={() => setEditProduct(product)}
            />
          ))
        )}

        {/* Day history */}
        <div className="pt-2">
          <DayHistory />
        </div>
      </main>

      {/* HBMaster sticky bottom */}
      <div className="shrink-0 px-4 pb-4 pt-1 safe-area-bottom">
        <HBMasterMobile />
      </div>

      {/* Bottom sheet modal */}
      {editProduct && (
        <PersonsModal
          product={editProduct}
          onClose={() => setEditProduct(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default Lijnbezetting;

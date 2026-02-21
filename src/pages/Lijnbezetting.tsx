import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { LogOut, Users, Minus, Plus, Check, ChevronDown } from "lucide-react";

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

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-card w-full sm:max-w-sm sm:rounded-2xl rounded-t-3xl border-t sm:border border-border shadow-2xl p-6 pb-8 animate-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 rounded-full bg-muted mx-auto mb-5 sm:hidden" />

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
  const updatedAgo = product.updated_at
    ? (() => {
        const diff = Math.floor((Date.now() - new Date(product.updated_at).getTime()) / 60000);
        if (diff < 1) return "Zojuist";
        if (diff < 60) return `${diff} min geleden`;
        return `${Math.floor(diff / 60)}u geleden`;
      })()
    : "";

  return (
    <button
      onClick={onTap}
      className="w-full bg-card rounded-2xl border border-border p-5 text-left active:scale-[0.97] transition-transform touch-manipulation shadow-sm"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-black text-foreground">{product.name}</h3>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
          <Users className="w-4 h-4 text-primary" />
          <span className="text-xl font-mono font-black text-primary">{product.persons_count}</span>
        </div>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        {product.updated_by && (
          <span>Bijgewerkt door <span className="font-semibold text-foreground/70">{product.updated_by}</span></span>
        )}
        <span className="ml-auto">{updatedAgo}</span>
      </div>
    </button>
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
      <main className="flex-1 p-4 space-y-3 pb-8">
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
      </main>

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

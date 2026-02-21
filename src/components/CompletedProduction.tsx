import { completedProducts, type CompletedProduct } from "@/data/mockData";

const getBadge = (planned: number, actual: number) => {
  const diff = planned - actual;
  if (diff > 10) return { label: "⚡ Sneller dan verwacht", className: "bg-accent/15 text-accent border-accent/20" };
  return { label: "👍 Volgens planning", className: "bg-bloom-sky/15 text-bloom-sky border-bloom-sky/20" };
};

const formatMinutes = (m: number) => {
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${h}u ${min}m`;
};

const CompletedProductCard = ({ product }: { product: CompletedProduct }) => {
  const badge = getBadge(product.plannedMinutes, product.actualMinutes);

  return (
    <div className="bg-gradient-card rounded-xl border border-border p-4 flex gap-4 items-center hover:border-accent/20 transition-colors duration-300">
      <img
        src={product.image}
        alt={product.name}
        className="w-20 h-20 rounded-xl object-cover shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-sm font-bold text-foreground truncate">{product.name}</h4>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${badge.className}`}>
            {badge.label}
          </span>
        </div>
        <div className="text-xs text-muted-foreground mb-2">{product.line} · Klaar om {product.completedAt}</div>
        <div className="flex items-center gap-4">
          <div>
            <div className="text-[10px] text-muted-foreground">Aantal</div>
            <div className="text-lg font-mono font-bold text-foreground">{product.quantity.toLocaleString("nl-NL")}</div>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground">Gepland</div>
            <div className="text-xs font-mono text-muted-foreground">{formatMinutes(product.plannedMinutes)}</div>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground">Werkelijk</div>
            <div className={`text-xs font-mono font-semibold ${product.actualMinutes <= product.plannedMinutes ? "text-accent" : "text-foreground"}`}>
              {formatMinutes(product.actualMinutes)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CompletedProduction = () => {
  return (
    <section>
      <h2 className="text-xl font-bold text-foreground mb-5">Vandaag geproduceerd</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {completedProducts.map((product) => (
          <CompletedProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default CompletedProduction;

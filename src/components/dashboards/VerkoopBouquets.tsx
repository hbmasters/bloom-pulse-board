import productCharmeXl from "@/assets/product-charme-xl.jpg";
import productChique from "@/assets/product-chique.jpg";
import productDeLuxe from "@/assets/product-de-luxe.jpg";
import productElegance from "@/assets/product-elegance.jpg";
import productFieldL from "@/assets/product-field-l.jpg";
import productFieldM from "@/assets/product-field-m.jpg";
import productLovely from "@/assets/product-lovely.jpg";
import productMoederdag from "@/assets/product-moederdag.jpg";
import productTrend from "@/assets/product-trend.jpg";
import productSpringBouquet from "@/assets/product-spring-bouquet.jpg";
import productZomermix from "@/assets/product-zomermix.jpg";
import productTulpen from "@/assets/product-tulpen.jpg";

interface Bouquet {
  name: string;
  image: string;
  sold: number;
  price: string;
}

const bouquets: Bouquet[] = [
  { name: "Charme XL", image: productCharmeXl, sold: 1240, price: "€12.95" },
  { name: "Chique", image: productChique, sold: 980, price: "€9.95" },
  { name: "De Luxe", image: productDeLuxe, sold: 860, price: "€14.95" },
  { name: "Elegance", image: productElegance, sold: 1120, price: "€11.50" },
  { name: "Field L", image: productFieldL, sold: 750, price: "€8.95" },
  { name: "Field M", image: productFieldM, sold: 690, price: "€6.95" },
  { name: "Lovely", image: productLovely, sold: 1340, price: "€10.50" },
  { name: "Moederdag", image: productMoederdag, sold: 2100, price: "€13.95" },
  { name: "Trend", image: productTrend, sold: 920, price: "€9.50" },
  { name: "Spring Bouquet", image: productSpringBouquet, sold: 580, price: "€7.95" },
  { name: "Zomermix", image: productZomermix, sold: 440, price: "€8.50" },
  { name: "Tulpen", image: productTulpen, sold: 1560, price: "€7.50" },
];

const VerkoopBouquets = () => (
  <div className="rounded-xl border-2 border-bloom-sky/20 bg-gradient-to-br from-bloom-sky/5 to-transparent p-5">
    <h3 className="text-sm font-bold text-foreground mb-1">Boeketten Assortiment</h3>
    <p className="text-[10px] text-muted-foreground mb-4">Weekverkopen per product</p>

    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
      {bouquets.map((b) => (
        <div
          key={b.name}
          className="group rounded-lg border border-border bg-card overflow-hidden hover:shadow-md hover:border-bloom-sky/25 transition-all"
        >
          <div className="aspect-square overflow-hidden bg-muted">
            <img
              src={b.image}
              alt={b.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-2.5">
            <div className="text-xs font-semibold text-foreground truncate">{b.name}</div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[10px] text-muted-foreground">{b.sold.toLocaleString("nl-NL")} st</span>
              <span className="text-[10px] font-semibold text-bloom-sky">{b.price}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default VerkoopBouquets;

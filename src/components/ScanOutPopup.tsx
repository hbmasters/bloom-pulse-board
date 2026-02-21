import { useState, useEffect } from "react";
import { X, PartyPopper, Trophy, Star } from "lucide-react";
import { teamLeaders } from "@/data/mockData";

interface ScanOutPopupProps {
  product: {
    name: string;
    image?: string;
    customer?: string;
    produced: number;
    target: number;
    piecesPerHour: number;
    plannedPiecesPerHour: number;
  };
  onClose: () => void;
}

const ScanOutPopup = ({ product, onClose }: ScanOutPopupProps) => {
  const [visible, setVisible] = useState(false);
  const isFaster = product.piecesPerHour > product.plannedPiecesPerHour;
  const speedDiff = Math.round(
    ((product.piecesPerHour - product.plannedPiecesPerHour) / product.plannedPiecesPerHour) * 100
  );
  const leaders = teamLeaders;

  useEffect(() => {
    setTimeout(() => setVisible(true), 50);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 400);
  };

  useEffect(() => {
    const timer = setTimeout(handleClose, 8000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={handleClose}>
      <div
        className={`relative bg-card rounded-2xl border shadow-2xl max-w-lg w-full mx-4 overflow-hidden transition-all duration-400 ${
          visible ? "opacity-100 scale-100" : "opacity-0 scale-90"
        } ${isFaster ? "border-accent/40" : "border-primary/30"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={handleClose} className="absolute top-4 right-4 z-10 w-8 h-8 rounded-lg bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-muted transition-colors">
          <X className="w-4 h-4 text-muted-foreground" />
        </button>

        {/* Product image hero */}
        <div className="relative h-72 bg-secondary overflow-hidden">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover scale-105" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-foreground/40">{product.customer || product.name}</span>
              {product.customer && <span className="text-sm text-muted-foreground mt-1">{product.name}</span>}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
          <div className="absolute bottom-3 left-0 right-0 text-center">
            <h3 className="text-xl font-black text-foreground drop-shadow-sm">{product.name}</h3>
          </div>
        </div>

        <div className="p-6 text-center">
          {/* Greeting with team leaders */}
          <div className="flex items-center justify-center gap-2 mb-3">
            {leaders.map((leader) => (
              <div key={leader.name} className="w-10 h-10 rounded-full bg-gradient-brand flex items-center justify-center shadow-md border-2 border-card">
                <span className="text-xs font-black text-primary-foreground">{leader.initials}</span>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-black text-foreground mb-1">
            {isFaster ? "Gefeliciteerd! 🎉" : "Goed gedaan! 👍"}
          </h2>
          <p className="text-sm text-muted-foreground mb-1">
            Hey {leaders.map(l => l.name).join(" & ")}!
          </p>
          <p className="text-sm font-semibold text-foreground mb-4">
            {isFaster
              ? `${product.name} is klaar — dit was de snelste order van vandaag!`
              : `${product.name} is klaar — netjes op schema afgerond.`}
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className={`rounded-xl border px-4 py-3 text-center ${isFaster ? "border-accent/30 bg-accent/5" : "border-primary/20 bg-primary/5"}`}>
              <div className={`text-[9px] uppercase tracking-wider font-bold ${isFaster ? "text-accent" : "text-primary"}`}>Geproduceerd</div>
              <div className="text-2xl font-mono font-black text-foreground">{product.produced}</div>
              <div className="text-[9px] text-muted-foreground">stuks</div>
            </div>
            <div className={`rounded-xl border px-4 py-3 text-center ${isFaster ? "border-accent/30 bg-accent/5" : "border-primary/20 bg-primary/5"}`}>
              <div className={`text-[9px] uppercase tracking-wider font-bold ${isFaster ? "text-accent" : "text-primary"}`}>Snelheid</div>
              <div className={`text-2xl font-mono font-black ${isFaster ? "text-accent text-glow-success" : "text-foreground"}`}>{product.piecesPerHour}</div>
              <div className="text-[9px] text-muted-foreground">APU</div>
            </div>
            {isFaster && (
              <div className="rounded-xl border border-accent/30 bg-accent/5 px-4 py-3 text-center">
                <div className="text-[9px] text-accent uppercase tracking-wider font-bold">vs Plan</div>
                <div className="text-2xl font-mono font-black text-accent text-glow-success">+{speedDiff}%</div>
                <div className="text-[9px] text-muted-foreground">sneller</div>
              </div>
            )}
          </div>

          {/* HBMASTER feedback */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-primary/20 bg-primary/5 text-left">
            <div className="w-9 h-9 rounded-lg bg-gradient-brand flex items-center justify-center shrink-0 shadow-sm">
              <span className="text-[9px] font-black text-primary-foreground">HB</span>
            </div>
            <div>
              <div className="text-[9px] font-black text-primary uppercase tracking-wider mb-0.5">HBMASTER</div>
              <p className="text-xs font-semibold text-foreground">
                {isFaster
                  ? `Fantastisch ${leaders[0].name} & ${leaders[1].name}! ${speedDiff}% sneller dan gepland met ${product.produced} stuks. Dit is jullie beste tempo vandaag — blijf zo doorgaan! 🔥`
                  : `Goed werk ${leaders[0].name} & ${leaders[1].name}! ${product.produced} stuks netjes op schema. Solide productie, door naar de volgende! 💪`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanOutPopup;

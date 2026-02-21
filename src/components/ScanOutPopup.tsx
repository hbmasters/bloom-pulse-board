import { useState, useEffect } from "react";
import { X, PartyPopper, Zap, Trophy } from "lucide-react";

interface ScanOutPopupProps {
  product: {
    name: string;
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

  useEffect(() => {
    setTimeout(() => setVisible(true), 50);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 400);
  };

  // Auto-close after 6 seconds
  useEffect(() => {
    const timer = setTimeout(handleClose, 6000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={handleClose}>
      <div
        className={`bg-card rounded-2xl border shadow-2xl p-8 max-w-md w-full mx-4 text-center transition-all duration-400 ${
          visible ? "opacity-100 scale-100" : "opacity-0 scale-90"
        } ${isFaster ? "border-accent/40" : "border-primary/30"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={handleClose} className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-muted transition-colors">
          <X className="w-4 h-4 text-muted-foreground" />
        </button>

        {isFaster ? (
          <>
            <div className="w-16 h-16 rounded-2xl bg-accent/15 flex items-center justify-center mx-auto mb-4 glow-success">
              <PartyPopper className="w-8 h-8 text-accent" />
            </div>
            <h2 className="text-2xl font-black text-foreground mb-1">Gefeliciteerd! 🎉</h2>
            <p className="text-sm text-muted-foreground mb-4">
              {product.name} is afgerond met een fantastisch tempo!
            </p>
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="rounded-xl border border-accent/30 bg-accent/5 px-4 py-3 text-center">
                <div className="text-[9px] text-accent uppercase tracking-wider font-bold">Snelheid</div>
                <div className="text-3xl font-mono font-black text-accent text-glow-success">{product.piecesPerHour}</div>
                <div className="text-[9px] text-muted-foreground">APU</div>
              </div>
              <div className="rounded-xl border border-accent/30 bg-accent/5 px-4 py-3 text-center">
                <div className="text-[9px] text-accent uppercase tracking-wider font-bold">vs Plan</div>
                <div className="text-3xl font-mono font-black text-accent text-glow-success">+{speedDiff}%</div>
                <div className="text-[9px] text-muted-foreground">sneller</div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-black text-foreground mb-1">Goed gedaan! 👍</h2>
            <p className="text-sm text-muted-foreground mb-4">
              {product.name} is afgerond volgens planning.
            </p>
            <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-center inline-block">
              <div className="text-[9px] text-primary uppercase tracking-wider font-bold">Geproduceerd</div>
              <div className="text-3xl font-mono font-black text-foreground">{product.produced}</div>
              <div className="text-[9px] text-muted-foreground">stuks</div>
            </div>
          </>
        )}

        <div className="mt-5 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-primary/20 bg-primary/5">
          <div className="w-7 h-7 rounded-lg bg-gradient-brand flex items-center justify-center shrink-0">
            <span className="text-[8px] font-black text-primary-foreground">HB</span>
          </div>
          <p className="text-xs font-semibold text-foreground">
            {isFaster
              ? `Uitstekend werk! ${speedDiff}% boven het geplande tempo. Blijf zo doorgaan!`
              : "Solide productie. Mooi op schema gebleven."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScanOutPopup;

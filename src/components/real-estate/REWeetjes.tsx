import { useState, useEffect, useCallback } from "react";
import { Lightbulb, ChevronLeft, ChevronRight, X } from "lucide-react";

const weetjes = [
  "Alle woningen van HBM Real Estate zijn SNF-gecertificeerd, het hoogste keurmerk voor flexibele huisvesting.",
  "Onze woningen worden minimaal 2x per jaar onafhankelijk geïnspecteerd op veiligheid en kwaliteit.",
  "HBM Real Estate werkt samen met 4 gemeenten om aan alle lokale vergunningseisen te voldoen.",
  "ABU-conformiteit garandeert eerlijke en transparante huisvestingsvoorwaarden voor alle bewoners.",
  "Elk onderhoudsmeldingen wordt binnen 24 uur in behandeling genomen door ons professionele team.",
  "Brandveiligheid wordt gewaarborgd door halfjaarlijkse controles en gecertificeerde installaties.",
  "Alle woningen beschikken over individuele huurcontracten die voldoen aan Nederlandse wet- en regelgeving.",
  "HBM Real Estate investeert continu in verduurzaming van het vastgoedportfolio.",
];

const REWeetjes = () => {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  const next = useCallback(() => setIndex((i) => (i + 1) % weetjes.length), []);
  const prev = useCallback(() => setIndex((i) => (i - 1 + weetjes.length) % weetjes.length), []);

  // Auto-rotate
  useEffect(() => {
    if (!open) return;
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [open, next]);

  if (dismissed) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40" style={{ maxWidth: 340 }}>
      {open ? (
        <div className="bg-[#111d33]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl shadow-black/30 animate-scale-in">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#3d8b9c] uppercase">
              <Lightbulb size={14} /> Weetje {index + 1}/{weetjes.length}
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-slate-300 p-1">
                <X size={14} />
              </button>
            </div>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed mb-4 min-h-[60px]">
            {weetjes[index]}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {weetjes.map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    i === index ? "bg-[#3d8b9c]" : "bg-white/10"
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-1">
              <button onClick={prev} className="p-1.5 text-slate-500 hover:text-white rounded-lg hover:bg-white/5">
                <ChevronLeft size={14} />
              </button>
              <button onClick={next} className="p-1.5 text-slate-500 hover:text-white rounded-lg hover:bg-white/5">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#111d33]/90 backdrop-blur-lg border border-white/10 rounded-full text-sm font-medium text-[#3d8b9c] hover:border-[#3d8b9c]/30 hover:text-[#4ea8bc] transition-all shadow-lg shadow-black/20 group"
        >
          <Lightbulb size={16} className="group-hover:rotate-12 transition-transform" />
          Weetjes
        </button>
      )}
    </div>
  );
};

export default REWeetjes;

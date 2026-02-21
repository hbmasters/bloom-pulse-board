import { useState, useCallback } from "react";
import { ShieldCheck, Award, FileCheck, ChevronDown } from "lucide-react";
import REHeroAnimation from "./REHeroAnimation";

const REHero = () => {
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

  const handleTooltip = useCallback((text: string | null, x: number, y: number) => {
    setTooltip(text ? { text, x, y } : null);
  }, []);

  return (
    <section id="re-home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Canvas animation */}
      <REHeroAnimation onTooltip={handleTooltip} />

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute z-30 px-3 py-1.5 text-xs font-medium text-[#3d8b9c] bg-[#0d1b2e]/90 border border-[#3d8b9c]/30 rounded-lg backdrop-blur-sm pointer-events-none transition-all"
          style={{ left: tooltip.x, top: tooltip.y, transform: "translate(-50%, -100%)" }}
        >
          {tooltip.text}
        </div>
      )}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0d1b2e]/90 via-[#0d1b2e]/50 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d1b2e] via-transparent to-transparent z-10" />

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-5 pt-28 pb-20 w-full">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-medium tracking-wider text-[#3d8b9c] border border-[#3d8b9c]/20 rounded-full bg-[#3d8b9c]/5 uppercase">
            <ShieldCheck size={14} />
            Professioneel beheerd vastgoed
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6">
            Gecertificeerde woningen,{" "}
            <span className="text-[#3d8b9c]">professioneel beheerd.</span>
          </h1>

          <p className="text-base text-slate-400 leading-relaxed mb-8 max-w-lg">
            Veilige huisvesting voor bewoners verbonden aan Hoorn Bloommasters.
          </p>

          <div className="flex flex-wrap gap-3 mb-12">
            <button
              onClick={() => document.querySelector("#re-places")?.scrollIntoView({ behavior: "smooth" })}
              className="px-6 py-3 text-sm font-semibold text-white bg-[#3d8b9c] rounded-lg hover:bg-[#357f8e] transition-all shadow-lg shadow-[#3d8b9c]/20"
            >
              Bekijk locaties
            </button>
            <button
              onClick={() => document.querySelector("#re-certificates")?.scrollIntoView({ behavior: "smooth" })}
              className="px-6 py-3 text-sm font-semibold text-slate-300 border border-slate-600 rounded-lg hover:bg-white/5 hover:border-slate-400 transition-all"
            >
              Certificeringen
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-4">
            {[
              { icon: ShieldCheck, label: "SNF gecertificeerd" },
              { icon: Award, label: "ABU conform" },
              { icon: FileCheck, label: "Gemeentelijke vergunningen" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-400 bg-white/5 border border-white/10 rounded-lg"
              >
                <Icon size={14} className="text-[#3d8b9c]" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <ChevronDown size={24} className="text-slate-500" />
      </div>
    </section>
  );
};

export default REHero;

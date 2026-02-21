import { useState } from "react";
import { MapPin, Building2, CheckCircle2, X } from "lucide-react";

const locations = [
  {
    region: "Regio Aalsmeer",
    desc: "Kwalitatieve woningen in de directe omgeving van Aalsmeer, centraal gelegen nabij werklocaties.",
    status: "Actief",
    details: "Meerdere wooneenheden beschikbaar met SNF-certificering. Periodieke inspecties en professioneel onderhoud gegarandeerd.",
  },
  {
    region: "Regio Amstelveen",
    desc: "Goed onderhouden vastgoed in een rustige woonwijk met goede bereikbaarheid.",
    status: "Actief",
    details: "Alle woningen voldoen aan gemeentelijke vergunningseisen en worden regelmatig geïnspecteerd.",
  },
  {
    region: "Regio Haarlemmermeer",
    desc: "Strategisch gelegen woningen met uitstekende verbindingen naar Schiphol en omgeving.",
    status: "Actief",
    details: "Volledig vergund vastgoed met professioneel beheer. Shuttle- en fietsverbindingen beschikbaar.",
  },
  {
    region: "Regio Kaag en Braassem",
    desc: "Rustig gelegen woningen in een groene omgeving met alle noodzakelijke voorzieningen.",
    status: "Actief",
    details: "Gecertificeerde huisvesting met directe toegang tot werklocaties van Hoorn Bloommasters.",
  },
];

const REPlaces = () => {
  const [modal, setModal] = useState<number | null>(null);

  return (
    <section id="re-places" className="relative py-24 bg-[#0a1628]">
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold tracking-[0.2em] text-[#3d8b9c] uppercase mb-3">Locaties</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Onze regio's</h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            HBM Real Estate beheert vastgoed in meerdere regio's, allemaal volledig vergund en gecertificeerd.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {locations.map((loc, i) => (
            <div
              key={i}
              className="group relative bg-[#111d33] border border-white/5 rounded-2xl p-6 hover:border-[#3d8b9c]/30 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[#3d8b9c]/5"
            >
              <div className="w-10 h-10 rounded-xl bg-[#3d8b9c]/10 flex items-center justify-center mb-4">
                <MapPin size={20} className="text-[#3d8b9c]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{loc.region}</h3>
              <p className="text-sm text-slate-400 mb-4 leading-relaxed">{loc.desc}</p>
              <div className="flex items-center gap-1.5 mb-4">
                <CheckCircle2 size={13} className="text-emerald-400" />
                <span className="text-xs font-medium text-emerald-400">{loc.status}</span>
              </div>
              <button
                onClick={() => setModal(i)}
                className="text-sm font-medium text-[#3d8b9c] hover:text-[#4ea8bc] transition-colors"
              >
                Meer info →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modal !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setModal(null)}>
          <div
            className="bg-[#111d33] border border-white/10 rounded-2xl p-8 max-w-md mx-4 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#3d8b9c]/10 flex items-center justify-center">
                  <Building2 size={20} className="text-[#3d8b9c]" />
                </div>
                <h3 className="text-lg font-semibold text-white">{locations[modal].region}</h3>
              </div>
              <button onClick={() => setModal(null)} className="text-slate-500 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">{locations[modal].details}</p>
            <div className="flex flex-wrap gap-2">
              {["SNF gecertificeerd", "Vergund", "Periodiek geïnspecteerd"].map((badge) => (
                <span key={badge} className="px-2.5 py-1 text-xs font-medium text-[#3d8b9c] bg-[#3d8b9c]/10 rounded-full">
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default REPlaces;

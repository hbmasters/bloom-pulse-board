import { useState } from "react";
import { ShieldCheck, Award, FileCheck, Download, ChevronDown } from "lucide-react";

const certs = [
  {
    icon: ShieldCheck,
    title: "SNF Certificering",
    desc: "Stichting Normering Flexwonen — Al onze woningen voldoen aan de strenge SNF-normen voor huisvesting van arbeidsmigranten.",
  },
  {
    icon: Award,
    title: "ABU Conform",
    desc: "Wij opereren volledig conform ABU-richtlijnen en waarborgen eerlijke en veilige huisvestingsomstandigheden.",
  },
  {
    icon: FileCheck,
    title: "Gemeentelijke Vergunningen",
    desc: "Alle panden beschikken over geldige gemeentelijke vergunningen en worden periodiek gecontroleerd door lokale autoriteiten.",
  },
];

const faqs = [
  { q: "Wat houdt SNF-certificering in?", a: "SNF staat voor Stichting Normering Flexwonen. Het is een keurmerk dat garandeert dat de huisvesting voldoet aan strikte normen op het gebied van veiligheid, hygiëne, ruimte en privacy." },
  { q: "Hoe vaak worden woningen geïnspecteerd?", a: "Onze woningen worden minimaal twee keer per jaar geïnspecteerd door onafhankelijke inspecteurs, aanvullend op onze eigen maandelijkse controles." },
  { q: "Wat als een vergunning verloopt?", a: "Wij monitoren actief alle vergunningsdata en starten het verlengingsproces ruim voor de vervaldatum om continuïteit te waarborgen." },
  { q: "Voldoen alle locaties aan dezelfde standaard?", a: "Ja, alle locaties van HBM Real Estate BV voldoen aan dezelfde hoge kwaliteitsstandaard en beschikken over volledige certificering." },
  { q: "Waar kan ik certificaten inzien?", a: "Certificaten zijn beschikbaar op verzoek. Neem contact met ons op via het contactformulier voor meer informatie." },
];

const RECertificates = () => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="re-certificates" className="relative py-24 bg-[#0a1628]">
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold tracking-[0.2em] text-[#3d8b9c] uppercase mb-3">Certificeringen</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Compliance & kwaliteit</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            SNF, ABU en gemeentelijke vergunningen.
          </p>
        </div>

        {/* Cert cards */}
        <div className="grid md:grid-cols-3 gap-5 mb-16">
          {certs.map(({ icon: Icon, title, desc }, i) => (
            <div key={i} className="bg-[#111d33] border border-white/5 rounded-2xl p-8 hover:border-[#3d8b9c]/20 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#3d8b9c]/10 flex items-center justify-center mb-5">
                <Icon size={24} className="text-[#3d8b9c]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">{title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-5">{desc}</p>
              <button className="flex items-center gap-2 text-sm font-medium text-[#3d8b9c] hover:text-[#4ea8bc] transition-colors">
                <Download size={14} /> Download PDF
              </button>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold text-white text-center mb-8">Veelgestelde vragen</h3>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-white/5 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  {faq.q}
                  <ChevronDown
                    size={16}
                    className={`text-slate-500 transition-transform ${open === i ? "rotate-180" : ""}`}
                  />
                </button>
                {open === i && (
                  <div className="px-5 pb-4 text-sm text-slate-400 leading-relaxed animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RECertificates;

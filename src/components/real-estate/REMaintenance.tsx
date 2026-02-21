import { ClipboardList, Wrench, CheckSquare } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    step: "01",
    title: "Melding & Registratie",
    desc: "Dien eenvoudig een onderhoudsmelding in via het formulier. Uw melding wordt direct geregistreerd en toegewezen.",
  },
  {
    icon: Wrench,
    step: "02",
    title: "Planning & Uitvoering",
    desc: "Ons team plant het onderhoud in en voert de werkzaamheden vakkundig uit binnen de afgesproken termijn.",
  },
  {
    icon: CheckSquare,
    step: "03",
    title: "Controle & Afronding",
    desc: "Na afronding volgt een kwaliteitscontrole. U ontvangt een bevestiging wanneer alles naar behoren is afgehandeld.",
  },
];

const REMaintenance = () => (
  <section id="re-maintenance" className="relative py-24 bg-[#0d1b2e]">
    <div className="max-w-7xl mx-auto px-5">
      <div className="text-center mb-16">
        <p className="text-xs font-semibold tracking-[0.2em] text-[#3d8b9c] uppercase mb-3">Onderhoud</p>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ons onderhoudsproces</h2>
        <p className="text-slate-400 max-w-xl mx-auto">
          Transparant en professioneel — van melding tot afronding.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {steps.map(({ icon: Icon, step, title, desc }, i) => (
          <div key={i} className="relative">
            {i < 2 && (
              <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-[#3d8b9c]/30 to-transparent" />
            )}
            <div className="relative bg-[#111d33] border border-white/5 rounded-2xl p-8 text-center hover:border-[#3d8b9c]/20 transition-all">
              <div className="text-xs font-bold text-[#3d8b9c]/40 tracking-widest mb-4">{step}</div>
              <div className="w-14 h-14 rounded-2xl bg-[#3d8b9c]/10 flex items-center justify-center mx-auto mb-5">
                <Icon size={26} className="text-[#3d8b9c]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">{title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <button className="px-6 py-3 text-sm font-semibold text-white bg-[#3d8b9c] rounded-lg hover:bg-[#357f8e] transition-all shadow-lg shadow-[#3d8b9c]/20">
          Melding maken
        </button>
      </div>
    </div>
  </section>
);

export default REMaintenance;

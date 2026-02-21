const partners = [
  "Gemeente Aalsmeer",
  "Gemeente Amstelveen",
  "Gemeente Haarlemmermeer",
  "Gemeente Kaag en Braassem",
  "Hoorn Bloommasters",
  "Antenna Groep",
];

const REPartners = () => (
  <section className="relative py-20 bg-[#0d1b2e]">
    <div className="max-w-7xl mx-auto px-5">
      <div className="text-center mb-12">
        <p className="text-xs font-semibold tracking-[0.2em] text-[#3d8b9c] uppercase mb-3">Partners</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Samenwerkingen</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {partners.map((name) => (
          <div
            key={name}
            className="flex items-center justify-center h-24 bg-[#111d33] border border-white/5 rounded-xl hover:border-[#3d8b9c]/20 transition-all group"
          >
            <span className="text-sm font-medium text-slate-400 group-hover:text-slate-200 text-center px-3 transition-colors">
              {name}
            </span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default REPartners;

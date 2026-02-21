import { useState } from "react";
import { Send, Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";

const subjects = ["Algemeen", "Verhuur", "Onderhoud", "Certificering", "Partners"];

const REContact = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "Algemeen", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Bericht verzonden. Wij nemen zo snel mogelijk contact met u op.");
    setForm({ name: "", email: "", phone: "", subject: "Algemeen", message: "" });
  };

  return (
    <section id="re-contact" className="relative py-24 bg-[#0a1628]">
      <div className="max-w-7xl mx-auto px-5">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Info */}
          <div className="lg:col-span-2">
            <p className="text-xs font-semibold tracking-[0.2em] text-[#3d8b9c] uppercase mb-3">Contact</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Neem contact op</h2>
            <p className="text-sm text-slate-400 mb-8">
              Vragen? Wij staan voor u klaar.
            </p>

            <div className="space-y-4">
              {[
                { icon: Mail, label: "info@hbmrealestate.nl" },
                { icon: Phone, label: "+31 (0)297 123 456" },
                { icon: MapPin, label: "Aalsmeer, Nederland" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 text-sm text-slate-400">
                  <div className="w-9 h-9 rounded-lg bg-[#3d8b9c]/10 flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-[#3d8b9c]" />
                  </div>
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 bg-[#111d33] border border-white/5 rounded-2xl p-8 space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Naam</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm text-white bg-[#0d1b2e] border border-white/10 rounded-lg focus:border-[#3d8b9c]/50 focus:outline-none transition-colors"
                  placeholder="Uw naam"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">E-mail</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm text-white bg-[#0d1b2e] border border-white/10 rounded-lg focus:border-[#3d8b9c]/50 focus:outline-none transition-colors"
                  placeholder="uw@email.nl"
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Telefoon</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm text-white bg-[#0d1b2e] border border-white/10 rounded-lg focus:border-[#3d8b9c]/50 focus:outline-none transition-colors"
                  placeholder="+31 6 1234 5678"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Onderwerp</label>
                <select
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm text-white bg-[#0d1b2e] border border-white/10 rounded-lg focus:border-[#3d8b9c]/50 focus:outline-none transition-colors"
                >
                  {subjects.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Bericht</label>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-2.5 text-sm text-white bg-[#0d1b2e] border border-white/10 rounded-lg focus:border-[#3d8b9c]/50 focus:outline-none transition-colors resize-none"
                placeholder="Uw bericht..."
              />
            </div>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#3d8b9c] rounded-lg hover:bg-[#357f8e] transition-all shadow-lg shadow-[#3d8b9c]/20"
            >
              <Send size={16} /> Verstuur bericht
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default REContact;

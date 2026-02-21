import { useState, useEffect } from "react";
import { Phone, Headphones, LogIn, Menu, X } from "lucide-react";
import RELogo from "./RELogo";

const navItems = [
  { label: "Home", href: "#re-home" },
  { label: "Places", href: "#re-places" },
  { label: "Maintenance", href: "#re-maintenance" },
  { label: "Certificates", href: "#re-certificates" },
  { label: "Contact", href: "#re-contact" },
];

const REHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (href: string) => {
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0d1b2e]/95 backdrop-blur-lg shadow-lg shadow-black/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-5 py-3">
        <button onClick={() => handleNav("#re-home")} className="shrink-0">
          <RELogo className="h-9 w-auto" dark />
        </button>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((n) => (
            <button
              key={n.href}
              onClick={() => handleNav(n.href)}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
              {n.label}
            </button>
          ))}
        </nav>

        {/* Right actions */}
        <div className="hidden lg:flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 hover:text-white border border-slate-600 rounded-lg hover:border-slate-400 transition-all">
            <LogIn size={16} />
            Login
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#3d8b9c] hover:text-white border border-[#3d8b9c]/50 rounded-lg hover:bg-[#3d8b9c]/10 transition-all">
            <Headphones size={16} />
            Support
          </button>
          <button
            onClick={() => handleNav("#re-contact")}
            className="px-5 py-2 text-sm font-semibold text-white bg-[#3d8b9c] rounded-lg hover:bg-[#357f8e] transition-all shadow-lg shadow-[#3d8b9c]/20"
          >
            Contact opnemen
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden text-white p-2"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#0d1b2e]/98 backdrop-blur-xl border-t border-white/5 animate-fade-in">
          <div className="px-5 py-4 flex flex-col gap-1">
            {navItems.map((n) => (
              <button
                key={n.href}
                onClick={() => handleNav(n.href)}
                className="px-4 py-3 text-left text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                {n.label}
              </button>
            ))}
            <hr className="border-white/10 my-2" />
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm text-slate-300 border border-slate-600 rounded-lg">
                <LogIn size={16} /> Login
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm text-[#3d8b9c] border border-[#3d8b9c]/50 rounded-lg">
                <Headphones size={16} /> Support
              </button>
            </div>
            <button
              onClick={() => handleNav("#re-contact")}
              className="mt-1 py-2.5 text-sm font-semibold text-white bg-[#3d8b9c] rounded-lg"
            >
              Contact opnemen
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default REHeader;

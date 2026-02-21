import RELogo from "./RELogo";

const REFooter = () => (
  <footer className="bg-[#080f1e] border-t border-white/5 py-10">
    <div className="max-w-7xl mx-auto px-5">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <RELogo className="h-7 w-auto opacity-50" dark />
        <p className="text-xs text-slate-500">
          © 2026 HBM Real Estate BV. Alle rechten voorbehouden.
        </p>
        <div className="flex gap-4">
          <button className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Privacy</button>
          <button className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Cookies</button>
        </div>
      </div>
    </div>
  </footer>
);

export default REFooter;

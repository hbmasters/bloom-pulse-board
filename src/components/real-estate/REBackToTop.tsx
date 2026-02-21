import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

const REBackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-40 w-10 h-10 flex items-center justify-center bg-[#3d8b9c] text-white rounded-full shadow-lg shadow-[#3d8b9c]/30 hover:bg-[#357f8e] transition-all animate-fade-in"
      aria-label="Terug naar boven"
    >
      <ArrowUp size={18} />
    </button>
  );
};

export default REBackToTop;

import { Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

const messages = [
  "💐 Geweldig teamwork vandaag!",
  "🌷 Al meer dan 1.000 stuks geproduceerd!",
  "🌻 Lijn 3 loopt als een trein!",
  "🌸 Kwaliteit en snelheid — top combinatie!",
  "🌺 Samen maken we het verschil!",
];

const MotivationBanner = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-bloom rounded-xl px-6 py-4 flex items-center gap-3 animate-shimmer">
      <Sparkles className="w-5 h-5 text-primary-foreground/80 shrink-0" />
      <p className="text-base font-semibold text-primary-foreground tracking-tight transition-all duration-500">
        {messages[index]}
      </p>
    </div>
  );
};

export default MotivationBanner;

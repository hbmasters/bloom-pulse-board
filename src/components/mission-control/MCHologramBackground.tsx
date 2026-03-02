import { useEffect, useState } from "react";

function MiniHologram({ size, accentHsl }: { size: number; accentHsl: string; state?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
      <circle cx="100" cy="100" r="80" stroke={`hsl(${accentHsl})`} strokeWidth="0.5" opacity="0.4">
        <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="20s" repeatCount="indefinite" />
      </circle>
      <circle cx="100" cy="100" r="55" stroke={`hsl(${accentHsl})`} strokeWidth="0.3" opacity="0.3">
        <animateTransform attributeName="transform" type="rotate" from="360 100 100" to="0 100 100" dur="15s" repeatCount="indefinite" />
      </circle>
      <circle cx="100" cy="100" r="30" stroke={`hsl(${accentHsl})`} strokeWidth="0.4" opacity="0.5">
        <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="10s" repeatCount="indefinite" />
      </circle>
      <circle cx="100" cy="100" r="4" fill={`hsl(${accentHsl})`} opacity="0.6" />
    </svg>
  );
}

export function MCHologramBackground() {
  const [size, setSize] = useState(480);

  useEffect(() => {
    const update = () => setSize(Math.min(window.innerWidth, window.innerHeight) * 0.85);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden opacity-[0.3]">
      <div className="drop-shadow-[0_0_60px_hsl(228_50%_55%/0.25)]">
        <MiniHologram state="idle" accentHsl="228 50% 55%" size={size} />
      </div>
    </div>
  );
}

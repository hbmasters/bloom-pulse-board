const RELogo = ({ className = "", dark = false }: { className?: string; dark?: boolean }) => {
  const primary = dark ? "#e2e8f0" : "#1a2744";
  const accent = "#3d8b9c";

  return (
    <svg viewBox="0 0 180 60" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer frame - top bar */}
      <rect x="2" y="2" width="120" height="4" fill={accent} />
      {/* Left vertical */}
      <rect x="2" y="2" width="4" height="44" fill={accent} />
      {/* Right vertical */}
      <rect x="118" y="2" width="4" height="44" fill={accent} />
      {/* Bottom bar - split with gap for text */}
      <rect x="2" y="42" width="50" height="4" fill={primary} />
      <rect x="72" y="42" width="50" height="4" fill={primary} />

      {/* HBM large text centered in frame */}
      <text
        x="62"
        y="36"
        fontFamily="'Georgia', 'Times New Roman', serif"
        fontWeight="700"
        fontSize="32"
        letterSpacing="6"
        fill={primary}
        textAnchor="middle"
      >
        HBM
      </text>

      {/* REAL ESTATE subtitle below frame */}
      <text
        x="62"
        y="56"
        fontFamily="Inter, sans-serif"
        fontWeight="500"
        fontSize="10"
        letterSpacing="4"
        fill={accent}
        textAnchor="middle"
      >
        REAL ESTATE
      </text>
    </svg>
  );
};

export default RELogo;

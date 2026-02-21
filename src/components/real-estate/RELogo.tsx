const RELogo = ({ className = "", dark = false }: { className?: string; dark?: boolean }) => {
  const primary = dark ? "#e2e8f0" : "#1a2744";
  const accent = "#3d8b9c";

  return (
    <svg viewBox="0 0 260 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Abstract building icon */}
      <rect x="2" y="12" width="8" height="34" rx="1" fill={accent} opacity="0.9" />
      <rect x="13" y="6" width="8" height="40" rx="1" fill={primary} />
      <rect x="24" y="18" width="8" height="28" rx="1" fill={accent} opacity="0.7" />
      <rect x="13" y="2" width="8" height="2" rx="1" fill={accent} />
      {/* Grid lines */}
      <line x1="4" y1="20" x2="8" y2="20" stroke={dark ? "#1a2744" : "#e2e8f0"} strokeWidth="1" />
      <line x1="4" y1="28" x2="8" y2="28" stroke={dark ? "#1a2744" : "#e2e8f0"} strokeWidth="1" />
      <line x1="4" y1="36" x2="8" y2="36" stroke={dark ? "#1a2744" : "#e2e8f0"} strokeWidth="1" />
      <line x1="15" y1="14" x2="19" y2="14" stroke={dark ? "#1a2744" : "#e2e8f0"} strokeWidth="1" />
      <line x1="15" y1="22" x2="19" y2="22" stroke={dark ? "#1a2744" : "#e2e8f0"} strokeWidth="1" />
      <line x1="15" y1="30" x2="19" y2="30" stroke={dark ? "#1a2744" : "#e2e8f0"} strokeWidth="1" />
      <line x1="15" y1="38" x2="19" y2="38" stroke={dark ? "#1a2744" : "#e2e8f0"} strokeWidth="1" />
      {/* HBM text */}
      <text x="42" y="32" fontFamily="Inter, sans-serif" fontWeight="900" fontSize="30" letterSpacing="2" fill={primary}>
        HBM
      </text>
      {/* Real Estate subtitle */}
      <text x="138" y="22" fontFamily="Inter, sans-serif" fontWeight="500" fontSize="11" letterSpacing="3" fill={accent}>
        REAL ESTATE
      </text>
      <line x1="138" y1="28" x2="220" y2="28" stroke={accent} strokeWidth="0.5" opacity="0.5" />
      <text x="138" y="38" fontFamily="Inter, sans-serif" fontWeight="400" fontSize="8" letterSpacing="1.5" fill={primary} opacity="0.5">
        B.V.
      </text>
    </svg>
  );
};

export default RELogo;

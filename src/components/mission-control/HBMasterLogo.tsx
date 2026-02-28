const HBMasterLogo = ({ size = 32, className = "" }: { size?: number; className?: string }) => {
  const r = size / 2;
  const cx = r;
  const cy = r;
  // Generate hexagon points
  const points = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    return `${cx + r * 0.92 * Math.cos(angle)},${cy + r * 0.92 * Math.sin(angle)}`;
  }).join(" ");

  const innerPoints = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i;
    return `${cx + r * 0.55 * Math.cos(angle)},${cy + r * 0.55 * Math.sin(angle)}`;
  }).join(" ");

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="hex-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(228, 55%, 55%)" />
          <stop offset="100%" stopColor="hsl(228, 45%, 72%)" />
        </linearGradient>
        <filter id="hex-glow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Outer hex */}
      <polygon
        points={points}
        fill="none"
        stroke="url(#hex-grad)"
        strokeWidth={size * 0.05}
        filter="url(#hex-glow)"
      />
      {/* Inner hex - counter rotated */}
      <polygon
        points={innerPoints}
        fill="none"
        stroke="hsl(228, 50%, 60%)"
        strokeWidth={size * 0.03}
        opacity={0.5}
      />
      {/* Center dot */}
      <circle cx={cx} cy={cy} r={size * 0.06} fill="hsl(228, 55%, 65%)" opacity={0.8} />
      {/* HB text */}
      <text
        x={cx}
        y={cy + size * 0.04}
        textAnchor="middle"
        fill="hsl(228, 50%, 80%)"
        fontSize={size * 0.22}
        fontWeight={900}
        fontFamily="Inter, sans-serif"
        letterSpacing={size * 0.02}
      >
        HB
      </text>
    </svg>
  );
};

export default HBMasterLogo;

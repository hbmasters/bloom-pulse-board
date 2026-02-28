const HBMasterLogo = ({ size = 32, className = "" }: { size?: number; className?: string }) => {
  const r = size / 2;
  const cx = r;
  const cy = r;

  const points = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    return `${cx + r * 0.92 * Math.cos(angle)},${cy + r * 0.92 * Math.sin(angle)}`;
  }).join(" ");

  const innerPoints = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i;
    return `${cx + r * 0.55 * Math.cos(angle)},${cy + r * 0.55 * Math.sin(angle)}`;
  }).join(" ");

  // Small botanical accents — subtle, not overkill
  // A tiny rose bud, a lavender sprig, and a eucalyptus leaf
  const flowerScale = size / 32; // normalize to base size

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
        <linearGradient id="flower-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(340, 50%, 65%)" />
          <stop offset="100%" stopColor="hsl(340, 40%, 55%)" />
        </linearGradient>
        <filter id="hex-glow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="bloom-soft">
          <feGaussianBlur stdDeviation="0.8" result="blur" />
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
      {/* Inner hex */}
      <polygon
        points={innerPoints}
        fill="none"
        stroke="hsl(228, 50%, 60%)"
        strokeWidth={size * 0.03}
        opacity={0.5}
      />

      {/* ── Botanical accents ── */}
      {/* Small rose bud — top right of hex */}
      <g
        transform={`translate(${cx + r * 0.52}, ${cy - r * 0.55}) scale(${flowerScale})`}
        opacity={0.6}
        filter="url(#bloom-soft)"
      >
        {/* Petals */}
        <ellipse cx={0} cy={0} rx={2.8} ry={2.2} fill="hsl(340, 50%, 62%)" transform="rotate(-20)" />
        <ellipse cx={0.8} cy={-0.5} rx={2.5} ry={2} fill="hsl(340, 45%, 58%)" transform="rotate(25)" />
        <ellipse cx={-0.5} cy={0.3} rx={2.2} ry={1.8} fill="hsl(340, 55%, 66%)" transform="rotate(-50)" />
        <circle cx={0.2} cy={0} r={1.2} fill="hsl(340, 40%, 52%)" />
      </g>

      {/* Lavender sprig — bottom left */}
      <g
        transform={`translate(${cx - r * 0.62}, ${cy + r * 0.45}) scale(${flowerScale}) rotate(-30)`}
        opacity={0.5}
        filter="url(#bloom-soft)"
      >
        {/* Stem */}
        <line x1={0} y1={0} x2={0} y2={-7} stroke="hsl(150, 30%, 45%)" strokeWidth={0.6} />
        {/* Buds along stem */}
        <ellipse cx={-0.8} cy={-2} rx={1.2} ry={0.7} fill="hsl(270, 40%, 60%)" transform="rotate(-15)" />
        <ellipse cx={0.7} cy={-3.2} rx={1.1} ry={0.65} fill="hsl(270, 45%, 65%)" transform="rotate(10)" />
        <ellipse cx={-0.5} cy={-4.5} rx={1} ry={0.6} fill="hsl(270, 40%, 62%)" transform="rotate(-8)" />
        <ellipse cx={0.3} cy={-5.8} rx={0.8} ry={0.5} fill="hsl(270, 50%, 68%)" />
      </g>

      {/* Eucalyptus leaf — top left, subtle */}
      <g
        transform={`translate(${cx - r * 0.55}, ${cy - r * 0.48}) scale(${flowerScale}) rotate(40)`}
        opacity={0.45}
        filter="url(#bloom-soft)"
      >
        <ellipse cx={0} cy={0} rx={1.5} ry={3.5} fill="hsl(160, 35%, 50%)" />
        <line x1={0} y1={-3.5} x2={0} y2={3.5} stroke="hsl(160, 25%, 40%)" strokeWidth={0.4} />
      </g>

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

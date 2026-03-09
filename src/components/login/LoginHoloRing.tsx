/**
 * Floral hologram ring for login background.
 * Uses semantic HSL tokens from the design system.
 */
export function LoginHoloRing({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" className="opacity-30">
      {/* Outer orbit */}
      <circle cx="100" cy="100" r="90" stroke="hsl(var(--primary))" strokeWidth="0.6" opacity="0.2">
        <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="40s" repeatCount="indefinite" />
      </circle>

      {/* Middle orbit */}
      <circle cx="100" cy="100" r="70" stroke="hsl(var(--primary))" strokeWidth="0.4" opacity="0.15">
        <animateTransform attributeName="transform" type="rotate" from="360 100 100" to="0 100 100" dur="28s" repeatCount="indefinite" />
      </circle>

      {/* Inner orbit */}
      <circle cx="100" cy="100" r="50" stroke="hsl(var(--accent))" strokeWidth="0.5" opacity="0.18">
        <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="18s" repeatCount="indefinite" />
      </circle>

      {/* Hex shape */}
      <polygon
        points="100,20 169,55 169,125 100,160 31,125 31,55"
        stroke="hsl(var(--primary))"
        strokeWidth="0.5"
        fill="none"
        opacity="0.1"
      >
        <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="50s" repeatCount="indefinite" />
      </polygon>

      {/* ── Flower petals (5-petal tulip shapes) on outer orbit ── */}
      {[0, 72, 144, 216, 288].map((angle, i) => (
        <g key={`flower-outer-${i}`} opacity="0.25">
          <animateTransform attributeName="transform" type="rotate" from={`${angle} 100 100`} to={`${angle + 360} 100 100`} dur="40s" repeatCount="indefinite" />
          <FlowerPetal cx={100} cy={12} size={6} fill="hsl(var(--primary))" />
        </g>
      ))}

      {/* ── Small blooms on middle orbit ── */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => (
        <g key={`flower-mid-${i}`} opacity="0.2">
          <animateTransform attributeName="transform" type="rotate" from={`${angle} 100 100`} to={`${angle - 360} 100 100`} dur="28s" repeatCount="indefinite" />
          <SmallBloom cx={100} cy={32} size={4} fill="hsl(var(--accent))" />
        </g>
      ))}

      {/* ── Tiny leaf/petal shapes on inner orbit ── */}
      {[0, 90, 180, 270].map((angle, i) => (
        <g key={`leaf-inner-${i}`} opacity="0.22">
          <animateTransform attributeName="transform" type="rotate" from={`${angle} 100 100`} to={`${angle + 360} 100 100`} dur="18s" repeatCount="indefinite" />
          <LeafShape cx={100} cy={52} size={5} fill="hsl(var(--primary))" />
        </g>
      ))}

      {/* ── Scattered single petals floating free ── */}
      {[15, 95, 175, 255, 335].map((angle, i) => (
        <g key={`petal-free-${i}`} opacity="0.15">
          <animateTransform attributeName="transform" type="rotate" from={`${angle} 100 100`} to={`${angle + 360} 100 100`} dur={`${25 + i * 5}s`} repeatCount="indefinite" />
          <ellipse cx={100} cy={22 + i * 8} rx={2} ry={4} fill={i % 2 === 0 ? "hsl(var(--accent))" : "hsl(var(--primary))"} />
        </g>
      ))}

      {/* Centre dot */}
      <circle cx="100" cy="100" r="3" fill="hsl(var(--primary))" opacity="0.3" />
    </svg>
  );
}

/** 5-petal tulip flower */
function FlowerPetal({ cx, cy, size, fill }: { cx: number; cy: number; size: number; fill: string }) {
  const petals = [0, 72, 144, 216, 288];
  return (
    <g>
      {petals.map((r) => (
        <ellipse
          key={r}
          cx={cx}
          cy={cy - size * 0.8}
          rx={size * 0.35}
          ry={size * 0.7}
          fill={fill}
          transform={`rotate(${r} ${cx} ${cy})`}
        />
      ))}
      <circle cx={cx} cy={cy} r={size * 0.2} fill={fill} opacity="0.6" />
    </g>
  );
}

/** Simple 4-petal bloom */
function SmallBloom({ cx, cy, size, fill }: { cx: number; cy: number; size: number; fill: string }) {
  return (
    <g>
      {[0, 90, 180, 270].map((r) => (
        <ellipse
          key={r}
          cx={cx}
          cy={cy - size * 0.6}
          rx={size * 0.25}
          ry={size * 0.5}
          fill={fill}
          transform={`rotate(${r} ${cx} ${cy})`}
        />
      ))}
    </g>
  );
}

/** Simple leaf shape */
function LeafShape({ cx, cy, size, fill }: { cx: number; cy: number; size: number; fill: string }) {
  return (
    <ellipse
      cx={cx}
      cy={cy}
      rx={size * 0.3}
      ry={size * 0.8}
      fill={fill}
      transform={`rotate(25 ${cx} ${cy})`}
    />
  );
}

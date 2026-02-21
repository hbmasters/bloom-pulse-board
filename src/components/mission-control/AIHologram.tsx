import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
  saturation: number;
  life: number;
  maxLife: number;
  type: "petal" | "leaf" | "sparkle";
  rotation: number;
  rotSpeed: number;
}

interface AIHologramProps {
  state: "idle" | "thinking" | "responding";
  compact?: boolean;
}

const AIHologram = ({ state, compact = false }: AIHologramProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const timeRef = useRef(0);

  const createParticle = useCallback((cx: number, cy: number): Particle => {
    const angle = Math.random() * Math.PI * 2;
    const dist = 30 + Math.random() * 90;
    const type = Math.random() < 0.4 ? "petal" : Math.random() < 0.7 ? "leaf" : "sparkle";
    return {
      x: cx + Math.cos(angle) * dist,
      y: cy + Math.sin(angle) * dist,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2 - 0.15,
      size: type === "petal" ? 3 + Math.random() * 5 : type === "leaf" ? 2 + Math.random() * 3 : 1 + Math.random() * 1.5,
      opacity: 0.3 + Math.random() * 0.5,
      hue: type === "petal" ? 330 + Math.random() * 40 : type === "leaf" ? 140 + Math.random() * 30 : 228,
      saturation: type === "petal" ? 50 + Math.random() * 20 : type === "leaf" ? 40 + Math.random() * 20 : 50,
      life: 0,
      maxLife: 150 + Math.random() * 200,
      type,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.03,
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = compact ? 160 : 260;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);
    const cx = size / 2;
    const cy = size / 2;

    particlesRef.current = Array.from({ length: compact ? 18 : 35 }, () => createParticle(cx, cy));

    let animId: number;
    const draw = () => {
      timeRef.current += 0.016;
      ctx.clearRect(0, 0, size, size);
      const t = timeRef.current;
      const pulseBase = state === "thinking" ? 0.6 + Math.sin(t * 4) * 0.4 : state === "responding" ? 0.8 + Math.sin(t * 2) * 0.2 : 0.4 + Math.sin(t * 0.8) * 0.15;

      // Soft outer rings using brand blue
      const ringCount = compact ? 2 : 3;
      for (let i = 0; i < ringCount; i++) {
        const r = 30 + i * 20 + Math.sin(t * (0.8 + i * 0.2)) * 3;
        const rot = t * (0.2 + i * 0.1) * (i % 2 === 0 ? 1 : -1);
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rot);
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 1.4);
        ctx.strokeStyle = `hsla(228, 50%, 55%, ${0.1 + pulseBase * 0.12})`;
        ctx.lineWidth = 1.2;
        ctx.setLineDash([6, 10]);
        ctx.stroke();
        ctx.restore();
      }

      // Core glow — brand primary
      const coreRadius = compact ? 20 : 30;
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreRadius + 12);
      gradient.addColorStop(0, `hsla(228, 50%, 55%, ${0.2 * pulseBase})`);
      gradient.addColorStop(0.6, `hsla(228, 45%, 72%, ${0.08 * pulseBase})`);
      gradient.addColorStop(1, "transparent");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(cx, cy, coreRadius + 12, 0, Math.PI * 2);
      ctx.fill();

      // Inner hexagon
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 0.15);
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i - Math.PI / 6;
        const r = coreRadius + Math.sin(t * 1.5 + i) * 2;
        if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
        else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      ctx.closePath();
      ctx.strokeStyle = `hsla(228, 50%, 55%, ${0.3 + pulseBase * 0.25})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = `hsla(228, 50%, 55%, ${0.03 + pulseBase * 0.03})`;
      ctx.fill();
      ctx.restore();

      // "HBMaster" text
      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      // HB letters
      ctx.font = `900 ${compact ? 14 : 20}px 'Inter', sans-serif`;
      ctx.fillStyle = `hsla(228, 50%, 45%, ${0.7 + pulseBase * 0.3})`;
      ctx.shadowColor = `hsla(228, 50%, 55%, ${pulseBase * 0.3})`;
      ctx.shadowBlur = 8;
      ctx.fillText("HBMaster", cx, cy - (compact ? 2 : 4));
      ctx.shadowBlur = 0;
      // Subtitle
      ctx.font = `500 ${compact ? 7 : 9}px 'Inter', sans-serif`;
      ctx.fillStyle = `hsla(228, 30%, 55%, ${0.4 + pulseBase * 0.2})`;
      ctx.fillText("Mission Control", cx, cy + (compact ? 10 : 14));
      ctx.restore();

      // Bloom energy on responding
      if (state === "responding") {
        const flareR = 45 + Math.sin(t * 3) * 15;
        const flareGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, flareR);
        flareGrad.addColorStop(0, `hsla(155, 55%, 42%, ${0.06 + Math.sin(t * 5) * 0.03})`);
        flareGrad.addColorStop(1, "transparent");
        ctx.fillStyle = flareGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, flareR, 0, Math.PI * 2);
        ctx.fill();
      }

      // Particles — petals, leaves, sparkles
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;

        if (state === "responding" && p.type === "petal") {
          p.vx += (cx - p.x) * 0.0015;
          p.vy += (cy - p.y) * 0.0015;
        }

        const lifeRatio = p.life / p.maxLife;
        const fadeIn = Math.min(lifeRatio * 5, 1);
        const fadeOut = Math.max(1 - (lifeRatio - 0.7) / 0.3, 0);
        const alpha = p.opacity * fadeIn * (lifeRatio > 0.7 ? fadeOut : 1);

        if (p.type === "petal") {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          for (let j = 0; j < 5; j++) {
            const pa = (Math.PI * 2 / 5) * j;
            ctx.beginPath();
            ctx.ellipse(Math.cos(pa) * p.size * 0.4, Math.sin(pa) * p.size * 0.4, p.size * 0.35, p.size * 0.15, pa, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${p.hue}, ${p.saturation}%, 70%, ${alpha * 0.5})`;
            ctx.fill();
          }
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.15, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(45, 70%, 65%, ${alpha * 0.7})`;
          ctx.fill();
          ctx.restore();
        } else if (p.type === "leaf") {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 0.6, p.size * 0.2, 0, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, ${p.saturation}%, 55%, ${alpha * 0.4})`;
          ctx.fill();
          ctx.restore();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.6, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(228, 50%, 65%, ${alpha * 0.35})`;
          ctx.fill();
        }

        if (p.life >= p.maxLife) {
          particles[i] = createParticle(cx, cy);
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, [state, compact, createParticle]);

  const canvasSize = compact ? 160 : 260;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <canvas
        ref={canvasRef}
        className="pointer-events-none"
        style={{ width: canvasSize, height: canvasSize }}
      />
      {/* Status indicator */}
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card border border-border shadow-sm -mt-2">
        <div className={`w-1.5 h-1.5 rounded-full ${
          state === "responding" ? "bg-accent animate-pulse" :
          state === "thinking" ? "bg-bloom-warm animate-pulse" :
          "bg-primary/50"
        }`} />
        <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">
          {state === "responding" ? "Responding" : state === "thinking" ? "Thinking" : "Online"}
        </span>
      </div>
    </div>
  );
};

export default AIHologram;

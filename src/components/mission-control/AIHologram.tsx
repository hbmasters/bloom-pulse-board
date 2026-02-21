import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
  type: "lily" | "tulip" | "cosmos" | "craspedia" | "calla" | "darkleaf" | "whitebranch";
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
    const dist = 50 + Math.random() * 140;
    const types: Particle["type"][] = ["lily", "tulip", "cosmos", "craspedia", "calla", "darkleaf", "whitebranch"];
    const weights = [0.15, 0.15, 0.12, 0.15, 0.12, 0.16, 0.15];
    let r = Math.random(), cumul = 0, type: Particle["type"] = "lily";
    for (let i = 0; i < weights.length; i++) {
      cumul += weights[i];
      if (r < cumul) { type = types[i]; break; }
    }
    return {
      x: cx + Math.cos(angle) * dist,
      y: cy + Math.sin(angle) * dist,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15 - 0.1,
      size: type === "craspedia" ? 2 + Math.random() * 2 : type === "whitebranch" ? 3 + Math.random() * 4 : 4 + Math.random() * 5,
      opacity: 0.35 + Math.random() * 0.45,
      life: 0,
      maxLife: 180 + Math.random() * 220,
      type,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02,
    };
  }, []);

  const drawLily = useCallback((ctx: CanvasRenderingContext2D, s: number, alpha: number) => {
    // Pink lily — 5 wide petals
    for (let i = 0; i < 5; i++) {
      const a = (Math.PI * 2 / 5) * i;
      ctx.beginPath();
      ctx.ellipse(Math.cos(a) * s * 0.5, Math.sin(a) * s * 0.5, s * 0.45, s * 0.18, a, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(340, 65%, 68%, ${alpha * 0.7})`;
      ctx.fill();
      // Petal highlight
      ctx.beginPath();
      ctx.ellipse(Math.cos(a) * s * 0.35, Math.sin(a) * s * 0.35, s * 0.2, s * 0.08, a, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(345, 70%, 78%, ${alpha * 0.5})`;
      ctx.fill();
    }
    // Center stamens
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.12, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(45, 80%, 60%, ${alpha * 0.8})`;
    ctx.fill();
  }, []);

  const drawTulip = useCallback((ctx: CanvasRenderingContext2D, s: number, alpha: number) => {
    // Purple tulip — cup shape with 3 overlapping petals
    const petalH = s * 0.9;
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.ellipse(i * s * 0.15, -petalH * 0.25, s * 0.25, petalH * 0.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(280, 55%, ${50 + i * 5}%, ${alpha * 0.65})`;
      ctx.fill();
    }
    // Stem
    ctx.beginPath();
    ctx.moveTo(0, petalH * 0.15);
    ctx.lineTo(0, petalH * 0.55);
    ctx.strokeStyle = `hsla(140, 40%, 45%, ${alpha * 0.4})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }, []);

  const drawCosmos = useCallback((ctx: CanvasRenderingContext2D, s: number, alpha: number) => {
    // Purple cosmos with yellow center — 8 petals
    for (let i = 0; i < 8; i++) {
      const a = (Math.PI * 2 / 8) * i;
      ctx.beginPath();
      ctx.ellipse(Math.cos(a) * s * 0.35, Math.sin(a) * s * 0.35, s * 0.3, s * 0.12, a, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(285, 50%, 55%, ${alpha * 0.6})`;
      ctx.fill();
    }
    // Yellow center with dots
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.18, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(50, 75%, 55%, ${alpha * 0.85})`;
    ctx.fill();
    for (let i = 0; i < 5; i++) {
      const da = (Math.PI * 2 / 5) * i;
      ctx.beginPath();
      ctx.arc(Math.cos(da) * s * 0.1, Math.sin(da) * s * 0.1, s * 0.03, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(40, 70%, 40%, ${alpha * 0.6})`;
      ctx.fill();
    }
  }, []);

  const drawCraspedia = useCallback((ctx: CanvasRenderingContext2D, s: number, alpha: number) => {
    // Yellow billy button on thin stem
    ctx.beginPath();
    ctx.moveTo(0, s * 0.3);
    ctx.lineTo(0, s * 1.2);
    ctx.strokeStyle = `hsla(140, 35%, 50%, ${alpha * 0.4})`;
    ctx.lineWidth = 0.8;
    ctx.stroke();
    // Ball
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.4, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(50, 80%, 55%, ${alpha * 0.8})`;
    ctx.fill();
    // Texture dots
    for (let i = 0; i < 4; i++) {
      const da = (Math.PI * 2 / 4) * i + 0.3;
      ctx.beginPath();
      ctx.arc(Math.cos(da) * s * 0.2, Math.sin(da) * s * 0.2, s * 0.06, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(45, 70%, 45%, ${alpha * 0.5})`;
      ctx.fill();
    }
  }, []);

  const drawCalla = useCallback((ctx: CanvasRenderingContext2D, s: number, alpha: number) => {
    // White calla lily — trumpet shape
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.6);
    ctx.bezierCurveTo(-s * 0.5, -s * 0.2, -s * 0.4, s * 0.4, 0, s * 0.5);
    ctx.bezierCurveTo(s * 0.4, s * 0.4, s * 0.5, -s * 0.2, 0, -s * 0.6);
    ctx.fillStyle = `hsla(0, 0%, 95%, ${alpha * 0.65})`;
    ctx.fill();
    ctx.strokeStyle = `hsla(0, 0%, 85%, ${alpha * 0.3})`;
    ctx.lineWidth = 0.6;
    ctx.stroke();
    // Spadix
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.35);
    ctx.lineTo(0, s * 0.15);
    ctx.strokeStyle = `hsla(50, 70%, 60%, ${alpha * 0.6})`;
    ctx.lineWidth = 1.5;
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.lineCap = "butt";
  }, []);

  const drawDarkLeaf = useCallback((ctx: CanvasRenderingContext2D, s: number, alpha: number) => {
    // Dark brown/maroon leaf
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.7);
    ctx.bezierCurveTo(-s * 0.5, -s * 0.3, -s * 0.4, s * 0.3, 0, s * 0.7);
    ctx.bezierCurveTo(s * 0.4, s * 0.3, s * 0.5, -s * 0.3, 0, -s * 0.7);
    ctx.fillStyle = `hsla(350, 25%, 22%, ${alpha * 0.5})`;
    ctx.fill();
    // Vein
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.55);
    ctx.lineTo(0, s * 0.55);
    ctx.strokeStyle = `hsla(350, 20%, 30%, ${alpha * 0.3})`;
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }, []);

  const drawWhiteBranch = useCallback((ctx: CanvasRenderingContext2D, s: number, alpha: number) => {
    // Thin white decorative branch with small leaves
    ctx.beginPath();
    ctx.moveTo(0, s * 0.8);
    ctx.lineTo(0, -s * 0.8);
    ctx.strokeStyle = `hsla(0, 0%, 90%, ${alpha * 0.45})`;
    ctx.lineWidth = 0.7;
    ctx.stroke();
    for (let i = 0; i < 3; i++) {
      const y = -s * 0.5 + i * s * 0.35;
      const dir = i % 2 === 0 ? 1 : -1;
      ctx.beginPath();
      ctx.ellipse(dir * s * 0.2, y, s * 0.18, s * 0.06, dir * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(0, 0%, 92%, ${alpha * 0.35})`;
      ctx.fill();
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = compact ? 200 : 380;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);
    const cx = size / 2;
    const cy = size / 2;

    particlesRef.current = Array.from({ length: compact ? 30 : 65 }, () => createParticle(cx, cy));

    let animId: number;
    const draw = () => {
      timeRef.current += 0.016;
      ctx.clearRect(0, 0, size, size);
      const t = timeRef.current;
      const pulseBase = state === "thinking" ? 0.6 + Math.sin(t * 4) * 0.4 : state === "responding" ? 0.8 + Math.sin(t * 2) * 0.2 : 0.4 + Math.sin(t * 0.8) * 0.15;

      // Soft outer rings
      const ringCount = compact ? 2 : 3;
      for (let i = 0; i < ringCount; i++) {
        const r = 45 + i * 28 + Math.sin(t * (0.8 + i * 0.2)) * 5;
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

      // Core glow
      const coreRadius = compact ? 25 : 45;
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
        const hr = coreRadius + Math.sin(t * 1.5 + i) * 2;
        if (i === 0) ctx.moveTo(Math.cos(a) * hr, Math.sin(a) * hr);
        else ctx.lineTo(Math.cos(a) * hr, Math.sin(a) * hr);
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
      ctx.font = `900 ${compact ? 16 : 28}px 'Inter', sans-serif`;
      ctx.fillStyle = `hsla(228, 50%, 45%, ${0.7 + pulseBase * 0.3})`;
      ctx.shadowColor = `hsla(228, 50%, 55%, ${pulseBase * 0.3})`;
      ctx.shadowBlur = 12;
      ctx.fillText("HBMaster", cx, cy - (compact ? 2 : 6));
      ctx.shadowBlur = 0;
      ctx.font = `500 ${compact ? 8 : 11}px 'Inter', sans-serif`;
      ctx.fillStyle = `hsla(228, 30%, 55%, ${0.4 + pulseBase * 0.2})`;
      ctx.fillText("Mission Control", cx, cy + (compact ? 12 : 20));
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

      // Flower particles
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;

        if (state === "responding") {
          p.vx += (cx - p.x) * 0.001;
          p.vy += (cy - p.y) * 0.001;
        }

        const lifeRatio = p.life / p.maxLife;
        const fadeIn = Math.min(lifeRatio * 5, 1);
        const fadeOut = Math.max(1 - (lifeRatio - 0.7) / 0.3, 0);
        const alpha = p.opacity * fadeIn * (lifeRatio > 0.7 ? fadeOut : 1);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        switch (p.type) {
          case "lily": drawLily(ctx, p.size, alpha); break;
          case "tulip": drawTulip(ctx, p.size, alpha); break;
          case "cosmos": drawCosmos(ctx, p.size, alpha); break;
          case "craspedia": drawCraspedia(ctx, p.size, alpha); break;
          case "calla": drawCalla(ctx, p.size, alpha); break;
          case "darkleaf": drawDarkLeaf(ctx, p.size, alpha); break;
          case "whitebranch": drawWhiteBranch(ctx, p.size, alpha); break;
        }

        ctx.restore();

        if (p.life >= p.maxLife) {
          particles[i] = createParticle(cx, cy);
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, [state, compact, createParticle, drawLily, drawTulip, drawCosmos, drawCraspedia, drawCalla, drawDarkLeaf, drawWhiteBranch]);

  const canvasSize = compact ? 200 : 380;

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

import { useEffect, useRef, useCallback, useState } from "react";

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
  orbitAngle: number;
  orbitSpeed: number;
  orbitRadius: number;
}

interface AIHologramProps {
  state: "idle" | "thinking" | "responding";
  compact?: boolean;
}

const AIHologram = ({ state, compact = false }: AIHologramProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const timeRef = useRef(0);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });
  const [hovered, setHovered] = useState(false);

  const createParticle = useCallback((cx: number, cy: number): Particle => {
    const angle = Math.random() * Math.PI * 2;
    const dist = 40 + Math.random() * 150;
    const types: Particle["type"][] = ["lily", "tulip", "cosmos", "craspedia", "calla", "darkleaf", "whitebranch"];
    const weights = [0.16, 0.14, 0.13, 0.14, 0.13, 0.15, 0.15];
    let r = Math.random(), cumul = 0, type: Particle["type"] = "lily";
    for (let i = 0; i < weights.length; i++) {
      cumul += weights[i];
      if (r < cumul) { type = types[i]; break; }
    }
    return {
      x: cx + Math.cos(angle) * dist,
      y: cy + Math.sin(angle) * dist,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12 - 0.08,
      size: type === "craspedia" ? 2.5 + Math.random() * 2.5 : type === "whitebranch" ? 3.5 + Math.random() * 4.5 : 4.5 + Math.random() * 6,
      opacity: 0.4 + Math.random() * 0.45,
      life: Math.random() * 100, // stagger start
      maxLife: 200 + Math.random() * 250,
      type,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.015,
      orbitAngle: angle,
      orbitSpeed: (0.002 + Math.random() * 0.004) * (Math.random() < 0.5 ? 1 : -1),
      orbitRadius: dist,
    };
  }, []);

  // --- Draw helpers ---
  const drawLily = useCallback((ctx: CanvasRenderingContext2D, s: number, alpha: number) => {
    for (let i = 0; i < 5; i++) {
      const a = (Math.PI * 2 / 5) * i;
      ctx.beginPath();
      ctx.ellipse(Math.cos(a) * s * 0.5, Math.sin(a) * s * 0.5, s * 0.48, s * 0.2, a, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(340, 65%, 68%, ${alpha * 0.75})`;
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(Math.cos(a) * s * 0.38, Math.sin(a) * s * 0.38, s * 0.22, s * 0.08, a, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(345, 72%, 80%, ${alpha * 0.5})`;
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.13, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(45, 80%, 60%, ${alpha * 0.85})`;
    ctx.fill();
    // Stamen dots
    for (let i = 0; i < 3; i++) {
      const sa = (Math.PI * 2 / 3) * i;
      ctx.beginPath();
      ctx.arc(Math.cos(sa) * s * 0.08, Math.sin(sa) * s * 0.08, s * 0.03, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(35, 70%, 45%, ${alpha * 0.6})`;
      ctx.fill();
    }
  }, []);

  const drawTulip = useCallback((ctx: CanvasRenderingContext2D, s: number, alpha: number) => {
    const h = s * 0.95;
    // 3 overlapping petals
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.ellipse(i * s * 0.16, -h * 0.2, s * 0.28, h * 0.5, i * 0.1, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(280, 55%, ${48 + i * 6}%, ${alpha * 0.7})`;
      ctx.fill();
    }
    // Highlight
    ctx.beginPath();
    ctx.ellipse(0, -h * 0.3, s * 0.12, h * 0.2, 0, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(285, 60%, 65%, ${alpha * 0.3})`;
    ctx.fill();
    // Stem
    ctx.beginPath();
    ctx.moveTo(0, h * 0.2);
    ctx.lineTo(0, h * 0.6);
    ctx.strokeStyle = `hsla(140, 40%, 45%, ${alpha * 0.45})`;
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }, []);

  const drawCosmos = useCallback((ctx: CanvasRenderingContext2D, s: number, alpha: number) => {
    for (let i = 0; i < 8; i++) {
      const a = (Math.PI * 2 / 8) * i;
      ctx.beginPath();
      ctx.ellipse(Math.cos(a) * s * 0.38, Math.sin(a) * s * 0.38, s * 0.32, s * 0.13, a, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(285, 50%, 55%, ${alpha * 0.65})`;
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.2, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(50, 75%, 55%, ${alpha * 0.9})`;
    ctx.fill();
    for (let i = 0; i < 6; i++) {
      const da = (Math.PI * 2 / 6) * i;
      ctx.beginPath();
      ctx.arc(Math.cos(da) * s * 0.12, Math.sin(da) * s * 0.12, s * 0.025, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(40, 70%, 40%, ${alpha * 0.55})`;
      ctx.fill();
    }
  }, []);

  const drawCraspedia = useCallback((ctx: CanvasRenderingContext2D, s: number, alpha: number) => {
    // Stem
    ctx.beginPath();
    ctx.moveTo(0, s * 0.35);
    ctx.lineTo(0, s * 1.3);
    ctx.strokeStyle = `hsla(140, 35%, 50%, ${alpha * 0.4})`;
    ctx.lineWidth = 0.9;
    ctx.stroke();
    // Ball
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.42, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(50, 82%, 55%, ${alpha * 0.85})`;
    ctx.fill();
    // Bumpy texture
    for (let i = 0; i < 5; i++) {
      const da = (Math.PI * 2 / 5) * i + 0.2;
      ctx.beginPath();
      ctx.arc(Math.cos(da) * s * 0.22, Math.sin(da) * s * 0.22, s * 0.07, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(48, 72%, 48%, ${alpha * 0.45})`;
      ctx.fill();
    }
  }, []);

  const drawCalla = useCallback((ctx: CanvasRenderingContext2D, s: number, alpha: number) => {
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.65);
    ctx.bezierCurveTo(-s * 0.55, -s * 0.2, -s * 0.45, s * 0.4, 0, s * 0.55);
    ctx.bezierCurveTo(s * 0.45, s * 0.4, s * 0.55, -s * 0.2, 0, -s * 0.65);
    ctx.fillStyle = `hsla(0, 0%, 96%, ${alpha * 0.7})`;
    ctx.fill();
    ctx.strokeStyle = `hsla(220, 10%, 82%, ${alpha * 0.3})`;
    ctx.lineWidth = 0.7;
    ctx.stroke();
    // Spadix
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.38);
    ctx.lineTo(0, s * 0.18);
    ctx.strokeStyle = `hsla(50, 70%, 60%, ${alpha * 0.65})`;
    ctx.lineWidth = 1.8;
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.lineCap = "butt";
  }, []);

  const drawDarkLeaf = useCallback((ctx: CanvasRenderingContext2D, s: number, alpha: number) => {
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.75);
    ctx.bezierCurveTo(-s * 0.55, -s * 0.35, -s * 0.45, s * 0.35, 0, s * 0.75);
    ctx.bezierCurveTo(s * 0.45, s * 0.35, s * 0.55, -s * 0.35, 0, -s * 0.75);
    ctx.fillStyle = `hsla(350, 25%, 20%, ${alpha * 0.55})`;
    ctx.fill();
    // Center vein
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.6);
    ctx.lineTo(0, s * 0.6);
    ctx.strokeStyle = `hsla(350, 20%, 28%, ${alpha * 0.3})`;
    ctx.lineWidth = 0.6;
    ctx.stroke();
    // Side veins
    for (let i = 0; i < 3; i++) {
      const y = -s * 0.3 + i * s * 0.3;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(-s * 0.25, y - s * 0.1);
      ctx.moveTo(0, y);
      ctx.lineTo(s * 0.25, y - s * 0.1);
      ctx.strokeStyle = `hsla(350, 18%, 30%, ${alpha * 0.2})`;
      ctx.lineWidth = 0.4;
      ctx.stroke();
    }
  }, []);

  const drawWhiteBranch = useCallback((ctx: CanvasRenderingContext2D, s: number, alpha: number) => {
    ctx.beginPath();
    ctx.moveTo(0, s * 0.85);
    ctx.lineTo(0, -s * 0.85);
    ctx.strokeStyle = `hsla(0, 0%, 88%, ${alpha * 0.5})`;
    ctx.lineWidth = 0.8;
    ctx.stroke();
    for (let i = 0; i < 4; i++) {
      const y = -s * 0.6 + i * s * 0.35;
      const dir = i % 2 === 0 ? 1 : -1;
      ctx.beginPath();
      ctx.ellipse(dir * s * 0.22, y, s * 0.2, s * 0.07, dir * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(0, 0%, 93%, ${alpha * 0.38})`;
      ctx.fill();
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = compact ? 200 : 420;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);
    const cx = size / 2;
    const cy = size / 2;

    particlesRef.current = Array.from({ length: compact ? 35 : 90 }, () => createParticle(cx, cy));

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left) * (size / rect.width),
        y: (e.clientY - rect.top) * (size / rect.height),
        active: true,
      };
    };
    const handleMouseLeave = () => { mouseRef.current.active = false; };
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    let animId: number;
    const draw = () => {
      timeRef.current += 0.016;
      ctx.clearRect(0, 0, size, size);
      const t = timeRef.current;
      const isHover = mouseRef.current.active;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      const pulseBase = state === "thinking" ? 0.6 + Math.sin(t * 4) * 0.4
        : state === "responding" ? 0.8 + Math.sin(t * 2) * 0.2
        : isHover ? 0.55 + Math.sin(t * 1.5) * 0.2
        : 0.4 + Math.sin(t * 0.8) * 0.15;

      // --- Outer scanning rings ---
      const ringCount = compact ? 2 : 4;
      for (let i = 0; i < ringCount; i++) {
        const r = 50 + i * 25 + Math.sin(t * (0.8 + i * 0.2)) * 5;
        const rot = t * (0.15 + i * 0.08) * (i % 2 === 0 ? 1 : -1);
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rot);
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * (1.2 + i * 0.15));
        ctx.strokeStyle = `hsla(228, 50%, 55%, ${0.08 + pulseBase * 0.1 - i * 0.015})`;
        ctx.lineWidth = 1 + (isHover ? 0.5 : 0);
        ctx.setLineDash([4 + i * 2, 8 + i * 2]);
        ctx.stroke();
        ctx.restore();
      }

      // --- Data stream lines (Jarvis-style) ---
      if (!compact) {
        for (let i = 0; i < 6; i++) {
          const lineAngle = (Math.PI * 2 / 6) * i + t * 0.1;
          const innerR = 55;
          const outerR = 90 + Math.sin(t * 2 + i) * 20;
          const x1 = cx + Math.cos(lineAngle) * innerR;
          const y1 = cy + Math.sin(lineAngle) * innerR;
          const x2 = cx + Math.cos(lineAngle) * outerR;
          const y2 = cy + Math.sin(lineAngle) * outerR;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = `hsla(228, 45%, 60%, ${0.06 + pulseBase * 0.06})`;
          ctx.lineWidth = 0.6;
          ctx.setLineDash([2, 6]);
          ctx.stroke();
          ctx.setLineDash([]);
          // Dot at end
          ctx.beginPath();
          ctx.arc(x2, y2, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(228, 50%, 65%, ${0.15 + pulseBase * 0.15})`;
          ctx.fill();
        }
      }

      // --- Core glow ---
      const coreRadius = compact ? 28 : 50;
      const grad1 = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreRadius + 15);
      grad1.addColorStop(0, `hsla(228, 50%, 55%, ${0.22 * pulseBase})`);
      grad1.addColorStop(0.5, `hsla(340, 40%, 65%, ${0.06 * pulseBase})`);
      grad1.addColorStop(1, "transparent");
      ctx.fillStyle = grad1;
      ctx.beginPath();
      ctx.arc(cx, cy, coreRadius + 15, 0, Math.PI * 2);
      ctx.fill();

      // --- Inner hexagon ---
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 0.12);
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
      ctx.fillStyle = `hsla(228, 50%, 55%, ${0.03 + pulseBase * 0.04})`;
      ctx.fill();

      // Second inner hexagon (counter-rotate)
      ctx.rotate(-t * 0.24);
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i;
        const hr2 = coreRadius * 0.65 + Math.sin(t * 2 + i) * 1.5;
        if (i === 0) ctx.moveTo(Math.cos(a) * hr2, Math.sin(a) * hr2);
        else ctx.lineTo(Math.cos(a) * hr2, Math.sin(a) * hr2);
      }
      ctx.closePath();
      ctx.strokeStyle = `hsla(228, 45%, 60%, ${0.15 + pulseBase * 0.15})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
      ctx.restore();

      // --- "HBMaster" text ---
      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `900 ${compact ? 16 : 30}px 'Inter', sans-serif`;
      ctx.fillStyle = `hsla(228, 50%, 42%, ${0.75 + pulseBase * 0.25})`;
      ctx.shadowColor = `hsla(228, 50%, 55%, ${pulseBase * 0.35})`;
      ctx.shadowBlur = 14;
      ctx.fillText("HBMaster", cx, cy - (compact ? 2 : 7));
      ctx.shadowBlur = 0;
      ctx.font = `500 ${compact ? 8 : 11}px 'Inter', sans-serif`;
      ctx.fillStyle = `hsla(228, 30%, 55%, ${0.4 + pulseBase * 0.2})`;
      ctx.fillText("Mission Control", cx, cy + (compact ? 12 : 21));
      ctx.restore();

      // --- Bloom flare on responding ---
      if (state === "responding") {
        const flareR = 55 + Math.sin(t * 3) * 18;
        const flareGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, flareR);
        flareGrad.addColorStop(0, `hsla(340, 55%, 65%, ${0.05 + Math.sin(t * 5) * 0.03})`);
        flareGrad.addColorStop(0.5, `hsla(280, 40%, 55%, ${0.03})`);
        flareGrad.addColorStop(1, "transparent");
        ctx.fillStyle = flareGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, flareR, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- Mouse hover glow ---
      if (isHover && !compact) {
        const hoverGrad = ctx.createRadialGradient(mx, my, 0, mx, my, 60);
        hoverGrad.addColorStop(0, `hsla(228, 50%, 55%, 0.06)`);
        hoverGrad.addColorStop(1, "transparent");
        ctx.fillStyle = hoverGrad;
        ctx.beginPath();
        ctx.arc(mx, my, 60, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- Flower particles ---
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;

        // Orbital motion
        p.orbitAngle += p.orbitSpeed;
        const targetX = cx + Math.cos(p.orbitAngle) * p.orbitRadius;
        const targetY = cy + Math.sin(p.orbitAngle) * p.orbitRadius;
        p.x += (targetX - p.x) * 0.02 + p.vx;
        p.y += (targetY - p.y) * 0.02 + p.vy;
        p.rotation += p.rotSpeed;

        // Respond to AI state
        if (state === "responding") {
          p.vx += (cx - p.x) * 0.002;
          p.vy += (cy - p.y) * 0.002;
          p.orbitRadius *= 0.998; // spiral inward
        } else if (state === "thinking") {
          p.orbitSpeed *= 1.0005; // speed up orbit
        }

        // Mouse interaction — particles flee from cursor
        if (isHover && !compact) {
          const dx = p.x - mx;
          const dy = p.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 70 && dist > 0) {
            const force = (70 - dist) / 70 * 0.4;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        // Damping
        p.vx *= 0.98;
        p.vy *= 0.98;

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
          // Reset orbit radius when responding
          if (state !== "responding") {
            particles[i].orbitRadius = 40 + Math.random() * 150;
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [state, compact, createParticle, drawLily, drawTulip, drawCosmos, drawCraspedia, drawCalla, drawDarkLeaf, drawWhiteBranch]);

  const canvasSize = compact ? 200 : 420;

  return (
    <div
      className="relative flex flex-col items-center justify-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <canvas
        ref={canvasRef}
        className={`transition-opacity duration-300 ${hovered ? "cursor-crosshair" : ""}`}
        style={{ width: canvasSize, height: canvasSize }}
      />
      {/* Status indicator */}
      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full bg-card border shadow-sm -mt-3 transition-all duration-300 ${
        hovered ? "border-primary/30 shadow-md" : "border-border"
      }`}>
        <div className={`w-1.5 h-1.5 rounded-full transition-colors ${
          state === "responding" ? "bg-accent animate-pulse" :
          state === "thinking" ? "bg-bloom-warm animate-pulse" :
          hovered ? "bg-primary animate-pulse" :
          "bg-primary/50"
        }`} />
        <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">
          {state === "responding" ? "Responding" : state === "thinking" ? "Thinking" : hovered ? "Interactive" : "Online"}
        </span>
      </div>
    </div>
  );
};

export default AIHologram;

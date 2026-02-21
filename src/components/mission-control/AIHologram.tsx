import { useEffect, useRef, useCallback, useState } from "react";
import { flowerDrawers, FlowerType, FLOWER_TYPES, FLOWER_WEIGHTS } from "./flowerRenderers";

interface Particle {
  x: number; y: number; vx: number; vy: number;
  size: number; opacity: number; life: number; maxLife: number;
  type: FlowerType; rotation: number; rotSpeed: number;
  orbitAngle: number; orbitSpeed: number; orbitRadius: number;
  layer: number;
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

  const pickFlowerType = useCallback((): FlowerType => {
    let r = Math.random(), cumul = 0;
    for (let i = 0; i < FLOWER_WEIGHTS.length; i++) {
      cumul += FLOWER_WEIGHTS[i];
      if (r < cumul) return FLOWER_TYPES[i];
    }
    return FLOWER_TYPES[0];
  }, []);

  const createParticle = useCallback((cx: number, cy: number): Particle => {
    const angle = Math.random() * Math.PI * 2;
    const dist = 50 + Math.random() * 170;
    const type = pickFlowerType();
    const layer = Math.floor(Math.random() * 3);
    const sizeMultiplier = [0.7, 1, 1.3][layer];
    const baseSize = ["craspedia", "babybreath", "lavender", "eucalyptus"].includes(type)
      ? 2.5 + Math.random() * 3
      : ["whitebranch", "fern"].includes(type)
        ? 3.5 + Math.random() * 5
        : 5 + Math.random() * 7;

    return {
      x: cx + Math.cos(angle) * dist,
      y: cy + Math.sin(angle) * dist,
      vx: (Math.random() - 0.5) * 0.1,
      vy: (Math.random() - 0.5) * 0.1 - 0.06,
      size: baseSize * sizeMultiplier,
      opacity: (0.3 + Math.random() * 0.5) * [0.5, 0.75, 1][layer],
      life: Math.random() * 120,
      maxLife: 250 + Math.random() * 300,
      type, rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.012,
      orbitAngle: angle,
      orbitSpeed: (0.001 + Math.random() * 0.004) * (Math.random() < 0.5 ? 1 : -1) * [0.6, 1, 1.4][layer],
      orbitRadius: dist, layer,
    };
  }, [pickFlowerType]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = compact ? 220 : 480;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);
    const cx = size / 2;
    const cy = size / 2;

    const particleCount = compact ? 50 : 160;
    particlesRef.current = Array.from({ length: particleCount }, () => createParticle(cx, cy));

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

      // ═══ JARVIS HUD LAYER 1: Outer arc segments ═══
      if (!compact) {
        for (let i = 0; i < 3; i++) {
          const r = 195 + i * 18;
          const rot = t * (0.08 + i * 0.03) * (i % 2 === 0 ? 1 : -1);
          ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
          for (let j = 0; j < 4; j++) {
            const startA = (Math.PI / 2) * j + 0.15;
            const endA = startA + 1.1 - i * 0.1;
            ctx.beginPath(); ctx.arc(0, 0, r, startA, endA);
            ctx.strokeStyle = `hsla(228, 50%, 60%, ${0.06 + pulseBase * 0.08 - i * 0.015})`;
            ctx.lineWidth = 1.5 - i * 0.3; ctx.stroke();
          }
          ctx.restore();
        }

        // Tick marks on outermost ring
        ctx.save(); ctx.translate(cx, cy); ctx.rotate(t * 0.02);
        for (let i = 0; i < 60; i++) {
          const a = (Math.PI * 2 / 60) * i;
          const isMajor = i % 5 === 0;
          const inner = isMajor ? 185 : 190;
          const outer = 195;
          ctx.beginPath();
          ctx.moveTo(Math.cos(a) * inner, Math.sin(a) * inner);
          ctx.lineTo(Math.cos(a) * outer, Math.sin(a) * outer);
          ctx.strokeStyle = `hsla(228, 45%, 60%, ${isMajor ? 0.2 + pulseBase * 0.15 : 0.08})`;
          ctx.lineWidth = isMajor ? 1.2 : 0.5; ctx.stroke();
        }
        ctx.restore();
      }

      // ═══ JARVIS HUD LAYER 2: Scanning rings ═══
      const ringCount = compact ? 2 : 5;
      for (let i = 0; i < ringCount; i++) {
        const r = 55 + i * 28 + Math.sin(t * (0.8 + i * 0.2)) * 4;
        const rot = t * (0.12 + i * 0.06) * (i % 2 === 0 ? 1 : -1);
        ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
        ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * (1.0 + i * 0.15));
        ctx.strokeStyle = `hsla(228, 50%, 58%, ${0.07 + pulseBase * 0.09 - i * 0.01})`;
        ctx.lineWidth = 1.2; ctx.setLineDash([3 + i * 2, 7 + i * 2]); ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      }

      // ═══ JARVIS HUD LAYER 3: Radial data streams ═══
      if (!compact) {
        for (let i = 0; i < 8; i++) {
          const lineAngle = (Math.PI * 2 / 8) * i + t * 0.06;
          const innerR = 60;
          const outerR = 100 + Math.sin(t * 2 + i) * 25;
          const x1 = cx + Math.cos(lineAngle) * innerR;
          const y1 = cy + Math.sin(lineAngle) * innerR;
          const x2 = cx + Math.cos(lineAngle) * outerR;
          const y2 = cy + Math.sin(lineAngle) * outerR;
          ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
          ctx.strokeStyle = `hsla(228, 45%, 62%, ${0.05 + pulseBase * 0.06})`;
          ctx.lineWidth = 0.6; ctx.setLineDash([2, 5]); ctx.stroke(); ctx.setLineDash([]);
          const travelT = (t * 0.8 + i * 0.5) % 1;
          const dotX = x1 + (x2 - x1) * travelT;
          const dotY = y1 + (y2 - y1) * travelT;
          ctx.beginPath(); ctx.arc(dotX, dotY, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(228, 55%, 68%, ${0.3 + pulseBase * 0.3})`; ctx.fill();
        }
      }

      // ═══ JARVIS HUD LAYER 4: Corner brackets ═══
      if (!compact) {
        const bracketSize = 18;
        const bracketOffset = 168;
        const corners = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
        ctx.save(); ctx.translate(cx, cy); ctx.rotate(t * 0.04);
        for (const [dx, dy] of corners) {
          const bx = dx * bracketOffset;
          const by = dy * bracketOffset;
          ctx.beginPath();
          ctx.moveTo(bx, by + dy * -bracketSize);
          ctx.lineTo(bx, by);
          ctx.lineTo(bx + dx * -bracketSize, by);
          ctx.strokeStyle = `hsla(228, 50%, 58%, ${0.15 + pulseBase * 0.12})`;
          ctx.lineWidth = 1.5; ctx.stroke();
        }
        ctx.restore();
      }

      // ═══ JARVIS HUD LAYER 5: Scanning sweep ═══
      if (!compact) {
        const sweepAngle = t * 0.5;
        const sweepGrad = ctx.createConicGradient(sweepAngle, cx, cy);
        sweepGrad.addColorStop(0, `hsla(228, 55%, 60%, ${0.08 * pulseBase})`);
        sweepGrad.addColorStop(0.08, `hsla(228, 55%, 60%, 0)`);
        sweepGrad.addColorStop(0.5, `hsla(228, 55%, 60%, 0)`);
        sweepGrad.addColorStop(1, `hsla(228, 55%, 60%, 0)`);
        ctx.fillStyle = sweepGrad;
        ctx.beginPath(); ctx.arc(cx, cy, 180, 0, Math.PI * 2); ctx.fill();
      }

      // ═══ JARVIS VOICE WAVEFORM — "Talking" equalizer ═══
      if (!compact) {
        const barCount = 32;
        const barWidth = 3.2;
        const barGap = 1.5;
        const totalW = barCount * (barWidth + barGap);
        const waveBaseY = cy + (compact ? 40 : 52);
        const maxBarH = state === "responding" ? 28 : state === "thinking" ? 14 : 6;

        ctx.save();
        for (let i = 0; i < barCount; i++) {
          const x = cx - totalW / 2 + i * (barWidth + barGap);
          // Generate organic wave heights
          const freq1 = Math.sin(t * 8 + i * 0.4) * 0.5 + 0.5;
          const freq2 = Math.sin(t * 12 + i * 0.7) * 0.3 + 0.3;
          const freq3 = Math.sin(t * 5 + i * 0.25) * 0.2 + 0.2;
          const envelope = Math.sin((i / barCount) * Math.PI); // bell curve
          let h: number;
          if (state === "responding") {
            h = maxBarH * (freq1 * 0.5 + freq2 * 0.3 + freq3 * 0.2) * envelope;
          } else if (state === "thinking") {
            h = maxBarH * (0.3 + freq1 * 0.4) * envelope * (0.5 + Math.sin(t * 3) * 0.5);
          } else {
            // idle: minimal ambient ripple
            h = maxBarH * (0.2 + freq1 * 0.15) * envelope;
          }

          const barAlpha = state === "responding" ? 0.6 + freq1 * 0.3
            : state === "thinking" ? 0.25 + freq1 * 0.2
            : 0.08 + freq1 * 0.06;

          // Draw bar (mirrored top and bottom)
          const grad = ctx.createLinearGradient(x, waveBaseY - h, x, waveBaseY + h);
          grad.addColorStop(0, `hsla(228, 55%, 65%, ${barAlpha * 0.3})`);
          grad.addColorStop(0.5, `hsla(228, 55%, 65%, ${barAlpha})`);
          grad.addColorStop(1, `hsla(228, 55%, 65%, ${barAlpha * 0.3})`);
          ctx.fillStyle = grad;

          // Round-rect bars
          const radius = barWidth / 2;
          ctx.beginPath();
          ctx.roundRect(x, waveBaseY - h, barWidth, h * 2, radius);
          ctx.fill();
        }
        ctx.restore();

        // ═══ Voice oscilloscope sine wave (overlaid) ═══
        if (state === "responding" || state === "thinking") {
          const waveAmplitude = state === "responding" ? 12 : 5;
          const waveWidth = totalW * 0.9;
          ctx.beginPath();
          for (let i = 0; i <= 60; i++) {
            const ratio = i / 60;
            const x = cx - waveWidth / 2 + ratio * waveWidth;
            const wave = Math.sin(ratio * Math.PI * 6 + t * 10) * waveAmplitude
              + Math.sin(ratio * Math.PI * 3 + t * 6) * waveAmplitude * 0.4;
            const env = Math.sin(ratio * Math.PI);
            const y = waveBaseY + wave * env;
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
          }
          ctx.strokeStyle = `hsla(340, 50%, 65%, ${state === "responding" ? 0.25 : 0.12})`;
          ctx.lineWidth = 1.2; ctx.stroke();
        }
      }

      // ═══ Core glow ═══
      const coreRadius = compact ? 28 : 55;
      const grad1 = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreRadius + 20);
      grad1.addColorStop(0, `hsla(228, 50%, 55%, ${0.2 * pulseBase})`);
      grad1.addColorStop(0.4, `hsla(340, 40%, 65%, ${0.06 * pulseBase})`);
      grad1.addColorStop(1, "transparent");
      ctx.fillStyle = grad1;
      ctx.beginPath(); ctx.arc(cx, cy, coreRadius + 20, 0, Math.PI * 2); ctx.fill();

      // ═══ Inner hexagons ═══
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(t * 0.1);
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i - Math.PI / 6;
        const hr = coreRadius + Math.sin(t * 1.5 + i) * 2;
        if (i === 0) ctx.moveTo(Math.cos(a) * hr, Math.sin(a) * hr);
        else ctx.lineTo(Math.cos(a) * hr, Math.sin(a) * hr);
      }
      ctx.closePath();
      ctx.strokeStyle = `hsla(228, 50%, 55%, ${0.3 + pulseBase * 0.25})`;
      ctx.lineWidth = 1.5; ctx.stroke();
      ctx.fillStyle = `hsla(228, 50%, 55%, ${0.02 + pulseBase * 0.03})`; ctx.fill();

      ctx.rotate(-t * 0.2);
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i;
        const hr2 = coreRadius * 0.6 + Math.sin(t * 2 + i) * 1.5;
        if (i === 0) ctx.moveTo(Math.cos(a) * hr2, Math.sin(a) * hr2);
        else ctx.lineTo(Math.cos(a) * hr2, Math.sin(a) * hr2);
      }
      ctx.closePath();
      ctx.strokeStyle = `hsla(228, 45%, 60%, ${0.12 + pulseBase * 0.12})`;
      ctx.lineWidth = 0.8; ctx.stroke();
      ctx.restore();

      // ═══ NODE POINTS ═══
      if (!compact) {
        for (let i = 0; i < 12; i++) {
          const a = (Math.PI * 2 / 12) * i + t * 0.15;
          const r = 140 + Math.sin(t * 1.2 + i * 0.8) * 8;
          const nx = cx + Math.cos(a) * r;
          const ny = cy + Math.sin(a) * r;
          const nodeSize = 2 + Math.sin(t * 3 + i) * 0.8;
          ctx.beginPath(); ctx.arc(nx, ny, nodeSize, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(228, 55%, 65%, ${0.2 + pulseBase * 0.25})`; ctx.fill();
          ctx.beginPath(); ctx.arc(nx, ny, nodeSize + 4, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(228, 55%, 65%, ${0.04 + pulseBase * 0.04})`; ctx.fill();
        }
      }

      // ═══ "HBMaster" text ═══
      ctx.save(); ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.font = `900 ${compact ? 16 : 32}px 'Inter', sans-serif`;
      ctx.fillStyle = `hsla(228, 50%, 42%, ${0.75 + pulseBase * 0.25})`;
      ctx.shadowColor = `hsla(228, 50%, 55%, ${pulseBase * 0.4})`;
      ctx.shadowBlur = 18;
      ctx.fillText("HBMaster", cx, cy - (compact ? 2 : 8));
      ctx.shadowBlur = 0;
      ctx.font = `500 ${compact ? 8 : 11}px 'Inter', sans-serif`;
      ctx.fillStyle = `hsla(228, 30%, 55%, ${0.4 + pulseBase * 0.2})`;
      ctx.fillText("Mission Control", cx, cy + (compact ? 12 : 22));
      ctx.restore();

      // ═══ Bloom flare on responding ═══
      if (state === "responding") {
        const flareR = 70 + Math.sin(t * 3) * 20;
        const flareGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, flareR);
        flareGrad.addColorStop(0, `hsla(340, 55%, 65%, ${0.05 + Math.sin(t * 5) * 0.03})`);
        flareGrad.addColorStop(0.5, `hsla(280, 40%, 55%, ${0.03})`);
        flareGrad.addColorStop(1, "transparent");
        ctx.fillStyle = flareGrad;
        ctx.beginPath(); ctx.arc(cx, cy, flareR, 0, Math.PI * 2); ctx.fill();
      }

      // ═══ Mouse hover glow ═══
      if (isHover && !compact) {
        const hoverGrad = ctx.createRadialGradient(mx, my, 0, mx, my, 70);
        hoverGrad.addColorStop(0, `hsla(228, 50%, 55%, 0.07)`);
        hoverGrad.addColorStop(1, "transparent");
        ctx.fillStyle = hoverGrad;
        ctx.beginPath(); ctx.arc(mx, my, 70, 0, Math.PI * 2); ctx.fill();
      }

      // ═══ FLOWER PARTICLES ═══
      const particles = particlesRef.current;
      particles.sort((a, b) => a.layer - b.layer);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;

        p.orbitAngle += p.orbitSpeed;
        const targetX = cx + Math.cos(p.orbitAngle) * p.orbitRadius;
        const targetY = cy + Math.sin(p.orbitAngle) * p.orbitRadius;
        p.x += (targetX - p.x) * 0.02 + p.vx;
        p.y += (targetY - p.y) * 0.02 + p.vy;
        p.rotation += p.rotSpeed;

        if (state === "responding") {
          p.vx += (cx - p.x) * 0.0025;
          p.vy += (cy - p.y) * 0.0025;
          p.orbitRadius *= 0.997;
        } else if (state === "thinking") {
          p.orbitSpeed *= 1.0005;
        }

        if (isHover && !compact) {
          const dx = p.x - mx;
          const dy = p.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80 && dist > 0) {
            const force = (80 - dist) / 80 * 0.5;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        p.vx *= 0.97;
        p.vy *= 0.97;

        const lifeRatio = p.life / p.maxLife;
        const fadeIn = Math.min(lifeRatio * 5, 1);
        const fadeOut = Math.max(1 - (lifeRatio - 0.7) / 0.3, 0);
        const alpha = p.opacity * fadeIn * (lifeRatio > 0.7 ? fadeOut : 1);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        const drawFn = flowerDrawers[p.type];
        if (drawFn) drawFn(ctx, p.size, alpha);

        ctx.restore();

        if (p.life >= p.maxLife) {
          particles[i] = createParticle(cx, cy);
          if (state !== "responding") {
            particles[i].orbitRadius = 50 + Math.random() * 170;
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
  }, [state, compact, createParticle]);

  const canvasSize = compact ? 220 : 480;

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
      <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full -mt-4 transition-all duration-500
        backdrop-blur-xl bg-card/70 border shadow-lg
        ${hovered ? "border-primary/30 shadow-primary/10" : "border-border/50"}`}>
        <div className="relative">
          <div className={`w-2 h-2 rounded-full transition-colors ${
            state === "responding" ? "bg-accent" :
            state === "thinking" ? "bg-bloom-warm" :
            hovered ? "bg-primary" : "bg-primary/50"
          }`} />
          {(state !== "idle" || hovered) && (
            <div className={`absolute inset-0 w-2 h-2 rounded-full animate-ping ${
              state === "responding" ? "bg-accent/40" :
              state === "thinking" ? "bg-bloom-warm/40" : "bg-primary/30"
            }`} />
          )}
        </div>
        <span className="text-[10px] font-mono text-muted-foreground/80 uppercase tracking-[0.2em]">
          {state === "responding" ? "Speaking" : state === "thinking" ? "Analyzing" : hovered ? "Interactive" : "Online"}
        </span>
      </div>
    </div>
  );
};

export default AIHologram;

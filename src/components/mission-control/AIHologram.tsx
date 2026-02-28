import { useEffect, useRef, useCallback, useState, useMemo } from "react";
import { flowerDrawers, FlowerType, FLOWER_TYPES, FLOWER_WEIGHTS } from "./flowerRenderers";

interface Particle {
  x: number; y: number; vx: number; vy: number;
  size: number; opacity: number; life: number; maxLife: number;
  type: FlowerType; rotation: number; rotSpeed: number;
  orbitAngle: number; orbitSpeed: number; orbitRadius: number;
  layer: number;
}

interface HexNode {
  angle: number; radius: number; speed: number;
  pulsePhase: number; connections: number[];
}

interface AIHologramProps {
  state: "idle" | "thinking" | "responding" | "loading";
  compact?: boolean;
}

const AIHologram = ({ state, compact = false }: AIHologramProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const hexNodesRef = useRef<HexNode[]>([]);
  const timeRef = useRef(0);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });
  const [hovered, setHovered] = useState(false);
  const [containerWidth, setContainerWidth] = useState(480);
  const [jarvisScale, setJarvisScale] = useState(1);

  // Responsive size calculation
  // The "draw area" for the hologram core stays moderate, but the canvas spans the full width
  // so particles can fly in from the edges of the screen
  const coreSize = useMemo(() => {
    if (compact) return Math.min(220, containerWidth * 0.55);
    return Math.min(430, containerWidth * 0.85, window.innerHeight * 0.42);
  }, [compact, containerWidth]);

  const responsiveSize = useMemo(() => {
    // Canvas = full container width so particles are visible from edges
    return Math.max(coreSize, containerWidth);
  }, [coreSize, containerWidth]);

  // Observe container width
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // ╔══════════════════════════════════════════════════════════════════╗
  // ║  JARVIS SCALE ENGINE — Whole-hologram breathing & reactive      ║
  // ║  scale, like Tony Stark's Jarvis interface pulsing with life    ║
  // ║                                                                  ║
  // ║  idle:       gentle slow breathe (1.0 → 1.03)                   ║
  // ║  thinking:   medium pulse, slightly contracted (0.96 → 1.04)    ║
  // ║  responding: dramatic pump, speech-driven (0.94 → 1.08)         ║
  // ║  loading:    rapid micro-pulse, compressed (0.92 → 1.02)        ║
  // ╚══════════════════════════════════════════════════════════════════╝
  useEffect(() => {
    let animId: number;
    let t = 0;
    const tick = () => {
      t += 0.016;
      let scale: number;
      if (state === "responding") {
        // Dramatic speech pump — two overlapping sine waves for organic feel
        const primary = Math.sin(t * 3.2) * 0.06;
        const secondary = Math.sin(t * 7.5) * 0.02;
        const accent = Math.abs(Math.sin(t * 1.8)) * 0.02; // occasional surge
        scale = 1.0 + primary + secondary + accent;
      } else if (state === "thinking") {
        // Searching pulse — steady medium breathe with subtle jitter
        const breathe = Math.sin(t * 2.0) * 0.04;
        const jitter = Math.sin(t * 9) * 0.005;
        scale = 1.0 + breathe + jitter;
      } else if (state === "loading") {
        // Rapid compressed heartbeat — fast & tight
        const rapid = Math.sin(t * 6) * 0.04;
        const micro = Math.sin(t * 14) * 0.01;
        scale = 0.97 + rapid + micro;
      } else {
        // Idle — slow, calm, alive breathe
        const calm = Math.sin(t * 0.8) * 0.015;
        const drift = Math.sin(t * 2.2) * 0.005;
        scale = 1.0 + calm + drift;
      }
      setJarvisScale(scale);
      animId = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(animId);
  }, [state]);

  const pickFlowerType = useCallback((): FlowerType => {
    let r = Math.random(), cumul = 0;
    for (let i = 0; i < FLOWER_WEIGHTS.length; i++) {
      cumul += FLOWER_WEIGHTS[i];
      if (r < cumul) return FLOWER_TYPES[i];
    }
    return FLOWER_TYPES[0];
  }, []);

  const createParticle = useCallback((cx: number, cy: number, spawnFromEdge = false): Particle => {
    const angle = Math.random() * Math.PI * 2;
    const type = pickFlowerType();
    const layer = Math.floor(Math.random() * 3);
    const sizeMultiplier = [0.7, 1, 1.3][layer];
    const baseSize = ["craspedia", "babybreath", "lavender", "eucalyptus", "jasmine", "wisteria"].includes(type as string)
      ? 2.5 + Math.random() * 3
      : ["whitebranch", "fern", "freesia"].includes(type as string)
        ? 3.5 + Math.random() * 5
        : 5 + Math.random() * 7;

    // Spawn from far outside and orbit inward, or normal spawn
    const targetOrbitRadius = 50 + Math.random() * 170;
    const startRadius = spawnFromEdge ? cx * 1.6 + Math.random() * cx * 0.5 : targetOrbitRadius;

    return {
      x: cx + Math.cos(angle) * startRadius,
      y: cy + Math.sin(angle) * startRadius,
      vx: (Math.random() - 0.5) * 0.1,
      vy: (Math.random() - 0.5) * 0.1 - 0.06,
      size: baseSize * sizeMultiplier,
      opacity: spawnFromEdge ? 0 : (0.3 + Math.random() * 0.5) * [0.5, 0.75, 1][layer],
      life: spawnFromEdge ? 0 : Math.random() * 120,
      maxLife: 250 + Math.random() * 300,
      type, rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.012,
      orbitAngle: angle,
      orbitSpeed: (0.001 + Math.random() * 0.004) * (Math.random() < 0.5 ? 1 : -1) * [0.6, 1, 1.4][layer],
      orbitRadius: startRadius, layer,
    };
  }, [pickFlowerType]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = Math.round(responsiveSize);
    const core = Math.round(coreSize);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    // Canvas is wide (full container) but height matches core for layout
    const canvasH = Math.round(core * 1.1);
    canvas.width = size * dpr;
    canvas.height = canvasH * dpr;
    ctx.scale(dpr, dpr);
    const cx = size / 2;
    const cy = canvasH / 2;

    // Scale HUD elements proportionally to core size
    const s = core / 480;
    const particleCount = compact ? Math.round(200 * Math.max(s, 0.5)) : Math.round(640 * Math.max(s, 0.4));
    // Spawn most particles from edges so they fly in visibly
    particlesRef.current = Array.from({ length: particleCount }, (_, i) => createParticle(cx, cy, i < particleCount * 0.7));

    // Dynamic hex connection nodes
    const nodeCount = compact ? 8 : 24;
    hexNodesRef.current = Array.from({ length: nodeCount }, (_, i) => {
      const conns: number[] = [];
      // Each node connects to 2-4 neighbors
      for (let c = 0; c < 2 + Math.floor(Math.random() * 3); c++) {
        conns.push(Math.floor(Math.random() * nodeCount));
      }
      return {
        angle: (Math.PI * 2 / nodeCount) * i + Math.random() * 0.3,
        radius: 100 + Math.random() * 80,
        speed: (0.002 + Math.random() * 0.006) * (Math.random() < 0.5 ? 1 : -1),
        pulsePhase: Math.random() * Math.PI * 2,
        connections: conns.filter(c => c !== i),
      };
    });

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
      ctx.clearRect(0, 0, size, canvasH);
      const t = timeRef.current;
      const isHover = mouseRef.current.active;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const isLoading = state === "loading";

      // ╔══════════════════════════════════════════════════════════════════╗
      // ║  STATE ENGINE — Controls all visual behavior per AI status      ║
      // ║                                                                 ║
      // ║  States:                                                        ║
      // ║   • idle       — calm, slow orbit, baseline everything          ║
      // ║   • thinking   — faster spin, warm glow, "processing" feel     ║
      // ║   • responding — speech pulse, heartbeat, particles gather     ║
      // ║   • loading    — very fast spin, compressed particles, purple  ║
      // ║                                                                 ║
      // ║  To add a new state: add a case to each config block below     ║
      // ╚══════════════════════════════════════════════════════════════════╝

      // --- ORBIT SPEED MULTIPLIER ---
      // How fast particles orbit around the center
      // idle=1.0 (calm), thinking=1.6 (searching), responding=2.2 (active), loading=4.0 (urgent)
      const orbitSpeedMul = state === "responding" ? 2.2
        : state === "thinking" ? 1.6
        : isLoading ? 4.0 : 1.0;

      // --- ROTATION SPEED MULTIPLIER ---
      // How fast individual flowers spin on their own axis
      const rotSpeedMul = state === "responding" ? 1.5
        : state === "thinking" ? 1.3
        : isLoading ? 3.0 : 1.0;

      // --- PARTICLE SIZE MULTIPLIER ---
      // Flowers grow when responding (energetic), shrink when loading (compressed)
      const sizeMul = state === "responding" ? 1.3
        : state === "thinking" ? 0.9
        : isLoading ? 0.65 : 1.0;

      // --- COLOR TINT HUE ---
      // Overlay glow color: green=responding, warm=thinking, purple=loading, -1=none (idle)
      const tintHue = state === "responding" ? 155
        : state === "thinking" ? 35
        : isLoading ? 280 : -1;

      // --- HEARTBEAT EFFECT ---
      // Pulsating scale applied to all particles simulating a "heartbeat"
      // responding: strong heartbeat (speech), thinking: subtle pulse, idle: none
      const heartbeatFreq = state === "responding" ? 8
        : state === "thinking" ? 3
        : isLoading ? 12 : 0;
      const heartbeatAmp = state === "responding" ? 0.12
        : state === "thinking" ? 0.05
        : isLoading ? 0.08 : 0;
      const heartbeat = heartbeatFreq > 0
        ? 1 + Math.abs(Math.sin(t * heartbeatFreq)) * heartbeatAmp
        : 1;

      // --- SPEECH WAVE EFFECT ---
      // Radial wave that pulses outward from center during "responding"
      // Creates the visual of sound/speech emanating from the AI
      const speechWaveRadius = state === "responding"
        ? (t * 80) % (200 * s) : 0;
      const speechWaveActive = state === "responding";

      // --- BREATHING EFFECT ---
      // Gentle orbit radius oscillation, like the hologram is "alive"
      // Active in all states but more pronounced when responding
      const breathAmp = state === "responding" ? 8
        : state === "thinking" ? 5
        : isLoading ? 2 : 3;
      const breathFreq = state === "responding" ? 2.5
        : state === "thinking" ? 1.5
        : isLoading ? 5 : 0.8;
      const breathOffset = Math.sin(t * breathFreq) * breathAmp;

      // --- HUD SPIN MULTIPLIER ---
      // Controls speed of the outer arcs/rings
      const hudSpin = isLoading ? 3.5
        : state === "responding" ? 2.0
        : state === "thinking" ? 1.5 : 1.0;

      // --- PULSE BASE ---
      // Overall brightness oscillation of HUD elements
      const pulseBase = isLoading ? 0.5 + Math.sin(t * 6) * 0.5
        : state === "thinking" ? 0.6 + Math.sin(t * 4) * 0.4
        : state === "responding" ? 0.8 + Math.sin(t * 2) * 0.2
        : isHover ? 0.55 + Math.sin(t * 1.5) * 0.2
        : 0.4 + Math.sin(t * 0.8) * 0.15;

      // ═══ SPEECH WAVE RING — visible during responding ═══
      // Expanding ring emanating from center, like sound waves
      if (speechWaveActive && !compact) {
        const waveAlpha = Math.max(0, 0.25 - speechWaveRadius / (200 * s) * 0.25);
        ctx.beginPath();
        ctx.arc(cx, cy, speechWaveRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(155, 55%, 50%, ${waveAlpha})`;
        ctx.lineWidth = 2 * s;
        ctx.stroke();
        // Second wave offset
        const wave2 = ((t * 80) + 100 * s) % (200 * s);
        const wave2Alpha = Math.max(0, 0.2 - wave2 / (200 * s) * 0.2);
        ctx.beginPath();
        ctx.arc(cx, cy, wave2, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(155, 55%, 50%, ${wave2Alpha})`;
        ctx.lineWidth = 1.5 * s;
        ctx.stroke();
      }

      // ═══ HEARTBEAT CENTER GLOW — pulses with heartbeat ═══
      // Visible during active states, creates a warm center glow
      if (heartbeatFreq > 0 && !compact) {
        const glowSize = (60 + heartbeat * 20) * s;
        const glowGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowSize);
        const glowHue = tintHue >= 0 ? tintHue : 228;
        glowGrad.addColorStop(0, `hsla(${glowHue}, 50%, 55%, ${0.08 * heartbeat})`);
        glowGrad.addColorStop(1, "transparent");
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, glowSize, 0, Math.PI * 2);
        ctx.fill();
      }

      // ═══ JARVIS HUD LAYER 1: Outer arc segments ═══
      if (!compact) {
        for (let i = 0; i < 3; i++) {
          const r = (195 + i * 18) * s;
          const rot = t * (0.08 + i * 0.03) * hudSpin * (i % 2 === 0 ? 1 : -1);
          ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
          for (let j = 0; j < 4; j++) {
            const startA = (Math.PI / 2) * j + 0.15;
            const endA = startA + 1.1 - i * 0.1;
            ctx.beginPath(); ctx.arc(0, 0, r, startA, endA);
            ctx.strokeStyle = `hsla(228, 50%, 60%, ${0.06 + pulseBase * 0.08 - i * 0.015})`;
            ctx.lineWidth = (1.5 - i * 0.3) * s; ctx.stroke();
          }
          ctx.restore();
        }

        // Tick marks
        ctx.save(); ctx.translate(cx, cy); ctx.rotate(t * 0.02 * hudSpin);
        for (let i = 0; i < 60; i++) {
          const a = (Math.PI * 2 / 60) * i;
          const isMajor = i % 5 === 0;
          const inner = (isMajor ? 185 : 190) * s;
          const outer = 195 * s;
          ctx.beginPath();
          ctx.moveTo(Math.cos(a) * inner, Math.sin(a) * inner);
          ctx.lineTo(Math.cos(a) * outer, Math.sin(a) * outer);
          ctx.strokeStyle = `hsla(228, 45%, 60%, ${isMajor ? 0.2 + pulseBase * 0.15 : 0.08})`;
          ctx.lineWidth = (isMajor ? 1.2 : 0.5) * s; ctx.stroke();
        }
        ctx.restore();
      }

      // ═══ SCANNING RINGS ═══
      const ringCount = compact ? 2 : 5;
      for (let i = 0; i < ringCount; i++) {
        const r = (55 + i * 28) * s + Math.sin(t * (0.8 + i * 0.2)) * 4 * s;
        const rot = t * (0.12 + i * 0.06) * hudSpin * (i % 2 === 0 ? 1 : -1);
        ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
        ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * (1.0 + i * 0.15));
        ctx.strokeStyle = `hsla(228, 50%, 58%, ${0.07 + pulseBase * 0.09 - i * 0.01})`;
        ctx.lineWidth = 1.2 * s; ctx.setLineDash([3 * s + i * 2, 7 * s + i * 2]); ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      }

      // ═══ RADIAL DATA STREAMS ═══
      if (!compact) {
        for (let i = 0; i < 8; i++) {
          const lineAngle = (Math.PI * 2 / 8) * i + t * 0.06 * hudSpin;
          const innerR = 60 * s;
          const outerR = (100 + Math.sin(t * 2 + i) * 25) * s;
          const x1 = cx + Math.cos(lineAngle) * innerR;
          const y1 = cy + Math.sin(lineAngle) * innerR;
          const x2 = cx + Math.cos(lineAngle) * outerR;
          const y2 = cy + Math.sin(lineAngle) * outerR;
          ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
          ctx.strokeStyle = `hsla(228, 45%, 62%, ${0.05 + pulseBase * 0.06})`;
          ctx.lineWidth = 0.6 * s; ctx.setLineDash([2 * s, 5 * s]); ctx.stroke(); ctx.setLineDash([]);
          const travelT = (t * 0.8 * hudSpin + i * 0.5) % 1;
          const dotX = x1 + (x2 - x1) * travelT;
          const dotY = y1 + (y2 - y1) * travelT;
          ctx.beginPath(); ctx.arc(dotX, dotY, 1.8 * s, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(228, 55%, 68%, ${0.3 + pulseBase * 0.3})`; ctx.fill();
        }
      }

      // ═══ CORNER BRACKETS ═══
      if (!compact) {
        const bracketSize = 18 * s;
        const bracketOffset = 168 * s;
        const corners = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
        ctx.save(); ctx.translate(cx, cy); ctx.rotate(t * 0.04 * hudSpin);
        for (const [dx, dy] of corners) {
          const bx = dx * bracketOffset;
          const by = dy * bracketOffset;
          ctx.beginPath();
          ctx.moveTo(bx, by + dy * -bracketSize);
          ctx.lineTo(bx, by);
          ctx.lineTo(bx + dx * -bracketSize, by);
          ctx.strokeStyle = `hsla(228, 50%, 58%, ${0.15 + pulseBase * 0.12})`;
          ctx.lineWidth = 1.5 * s; ctx.stroke();
        }
        ctx.restore();
      }

      // ═══ SCANNING SWEEP ═══
      if (!compact) {
        const sweepAngle = t * 0.5 * hudSpin;
        const sweepGrad = ctx.createConicGradient(sweepAngle, cx, cy);
        sweepGrad.addColorStop(0, `hsla(228, 55%, 60%, ${0.08 * pulseBase})`);
        sweepGrad.addColorStop(0.08, `hsla(228, 55%, 60%, 0)`);
        sweepGrad.addColorStop(0.5, `hsla(228, 55%, 60%, 0)`);
        sweepGrad.addColorStop(1, `hsla(228, 55%, 60%, 0)`);
        ctx.fillStyle = sweepGrad;
        ctx.beginPath(); ctx.arc(cx, cy, 180 * s, 0, Math.PI * 2); ctx.fill();
      }

      // ═══ DYNAMIC HEXAGON CONNECTION NETWORK ═══
      const hexNodes = hexNodesRef.current;
      const nodePositions: { x: number; y: number }[] = [];
      for (let i = 0; i < hexNodes.length; i++) {
        const node = hexNodes[i];
        node.angle += node.speed * hudSpin;
        const wobble = Math.sin(t * 1.5 + node.pulsePhase) * 12 * s;
        const nx = cx + Math.cos(node.angle) * (node.radius * s + wobble);
        const ny = cy + Math.sin(node.angle) * (node.radius * s + wobble);
        nodePositions.push({ x: nx, y: ny });
      }

      // Draw connections between nodes
      for (let i = 0; i < hexNodes.length; i++) {
        const node = hexNodes[i];
        const p1 = nodePositions[i];
        for (const ci of node.connections) {
          if (ci >= nodePositions.length) continue;
          const p2 = nodePositions[ci];
          const dist = Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
          if (dist > 200 * s) continue;
          const connAlpha = Math.max(0, 1 - dist / (200 * s)) * 0.15 * (0.5 + pulseBase * 0.5);
          ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `hsla(228, 50%, 60%, ${connAlpha})`;
          ctx.lineWidth = 0.8 * s; ctx.stroke();
          const dotT = (t * 0.4 * hudSpin + i * 0.3) % 1;
          const dx = p1.x + (p2.x - p1.x) * dotT;
          const dy = p1.y + (p2.y - p1.y) * dotT;
          ctx.beginPath(); ctx.arc(dx, dy, 1.5 * s, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(228, 60%, 70%, ${connAlpha * 2})`; ctx.fill();
        }
      }

      // Draw node points with glow
      for (let i = 0; i < nodePositions.length; i++) {
        const p = nodePositions[i];
        const nodePulse = Math.sin(t * 2.5 + hexNodes[i].pulsePhase) * 0.5 + 0.5;
        const nodeSize = (2.5 + nodePulse * 1.5) * s;
        ctx.beginPath(); ctx.arc(p.x, p.y, nodeSize, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(228, 55%, 65%, ${0.25 + pulseBase * 0.25})`; ctx.fill();
        ctx.beginPath(); ctx.arc(p.x, p.y, nodeSize + 5 * s, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(228, 55%, 65%, ${0.03 + pulseBase * 0.03})`; ctx.fill();

        // Mini hexagon at each node
        if (!compact) {
          ctx.save(); ctx.translate(p.x, p.y);
          ctx.rotate(t * 0.3 * hudSpin + i);
          const hexR = (4 + nodePulse * 2) * s;
          ctx.beginPath();
          for (let h = 0; h < 6; h++) {
            const ha = (Math.PI / 3) * h;
            if (h === 0) ctx.moveTo(Math.cos(ha) * hexR, Math.sin(ha) * hexR);
            else ctx.lineTo(Math.cos(ha) * hexR, Math.sin(ha) * hexR);
          }
          ctx.closePath();
          ctx.strokeStyle = `hsla(228, 45%, 60%, ${0.15 + pulseBase * 0.15})`;
          ctx.lineWidth = 0.6 * s; ctx.stroke();
          ctx.restore();
        }
      }

      // ═══ VOICE WAVEFORM ═══
      if (!compact) {
        const barCount = 32;
        const barWidth = 3.2 * s;
        const barGap = 1.5 * s;
        const totalW = barCount * (barWidth + barGap);
        const waveBaseY = cy + 52 * s;
        const maxBarH = (state === "responding" ? 28 : state === "thinking" ? 14 : isLoading ? 18 : 6) * s;

        ctx.save();
        for (let i = 0; i < barCount; i++) {
          const x = cx - totalW / 2 + i * (barWidth + barGap);
          const freq1 = Math.sin(t * 8 * hudSpin + i * 0.4) * 0.5 + 0.5;
          const freq2 = Math.sin(t * 12 * hudSpin + i * 0.7) * 0.3 + 0.3;
          const freq3 = Math.sin(t * 5 * hudSpin + i * 0.25) * 0.2 + 0.2;
          const envelope = Math.sin((i / barCount) * Math.PI);
          let h: number;
          if (state === "responding") {
            h = maxBarH * (freq1 * 0.5 + freq2 * 0.3 + freq3 * 0.2) * envelope;
          } else if (state === "thinking" || isLoading) {
            h = maxBarH * (0.3 + freq1 * 0.4) * envelope * (0.5 + Math.sin(t * 3 * hudSpin) * 0.5);
          } else {
            h = maxBarH * (0.2 + freq1 * 0.15) * envelope;
          }

          const barAlpha = state === "responding" ? 0.6 + freq1 * 0.3
            : state === "thinking" || isLoading ? 0.25 + freq1 * 0.2
            : 0.08 + freq1 * 0.06;

          const grad = ctx.createLinearGradient(x, waveBaseY - h, x, waveBaseY + h);
          grad.addColorStop(0, `hsla(228, 55%, 65%, ${barAlpha * 0.3})`);
          grad.addColorStop(0.5, `hsla(228, 55%, 65%, ${barAlpha})`);
          grad.addColorStop(1, `hsla(228, 55%, 65%, ${barAlpha * 0.3})`);
          ctx.fillStyle = grad;

          const radius = barWidth / 2;
          ctx.beginPath();
          ctx.roundRect(x, waveBaseY - h, barWidth, h * 2, radius);
          ctx.fill();
        }
        ctx.restore();

        // Oscilloscope
        if (state === "responding" || state === "thinking" || isLoading) {
          const waveAmplitude = (state === "responding" ? 12 : isLoading ? 8 : 5) * s;
          const waveWidth = totalW * 0.9;
          ctx.beginPath();
          for (let i = 0; i <= 60; i++) {
            const ratio = i / 60;
            const x = cx - waveWidth / 2 + ratio * waveWidth;
            const wave = Math.sin(ratio * Math.PI * 6 + t * 10 * hudSpin) * waveAmplitude
              + Math.sin(ratio * Math.PI * 3 + t * 6 * hudSpin) * waveAmplitude * 0.4;
            const env = Math.sin(ratio * Math.PI);
            const y = waveBaseY + wave * env;
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
          }
          ctx.strokeStyle = `hsla(340, 50%, 65%, ${state === "responding" ? 0.25 : 0.12})`;
          ctx.lineWidth = 1.2 * s; ctx.stroke();
        }
      }

      // ═══ Core glow ═══
      const coreRadius = (compact ? 28 : 55) * s;
      const grad1 = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreRadius + 20 * s);
      grad1.addColorStop(0, `hsla(228, 50%, 55%, ${0.2 * pulseBase})`);
      grad1.addColorStop(0.4, `hsla(340, 40%, 65%, ${0.06 * pulseBase})`);
      grad1.addColorStop(1, "transparent");
      ctx.fillStyle = grad1;
      ctx.beginPath(); ctx.arc(cx, cy, coreRadius + 20 * s, 0, Math.PI * 2); ctx.fill();

      // ═══ ROTATING HEXAGONS — now fully animated ═══
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(t * 0.1 * hudSpin);
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i - Math.PI / 6;
        const hr = coreRadius + Math.sin(t * 1.5 * hudSpin + i) * 4 * s;
        if (i === 0) ctx.moveTo(Math.cos(a) * hr, Math.sin(a) * hr);
        else ctx.lineTo(Math.cos(a) * hr, Math.sin(a) * hr);
      }
      ctx.closePath();
      ctx.strokeStyle = `hsla(228, 50%, 55%, ${0.3 + pulseBase * 0.25})`;
      ctx.lineWidth = 1.5 * s; ctx.stroke();
      ctx.fillStyle = `hsla(228, 50%, 55%, ${0.02 + pulseBase * 0.03})`; ctx.fill();

      // Inner hexagon — counter-rotate
      ctx.rotate(-t * 0.2 * hudSpin);
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i;
        const hr2 = coreRadius * 0.6 + Math.sin(t * 2 * hudSpin + i) * 2 * s;
        if (i === 0) ctx.moveTo(Math.cos(a) * hr2, Math.sin(a) * hr2);
        else ctx.lineTo(Math.cos(a) * hr2, Math.sin(a) * hr2);
      }
      ctx.closePath();
      ctx.strokeStyle = `hsla(228, 45%, 60%, ${0.12 + pulseBase * 0.12})`;
      ctx.lineWidth = 0.8 * s; ctx.stroke();

      // Third hexagon — smaller, fast spin
      ctx.rotate(t * 0.35 * hudSpin);
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i + Math.PI / 6;
        const hr3 = coreRadius * 0.35 + Math.sin(t * 3 * hudSpin + i) * 1.5 * s;
        if (i === 0) ctx.moveTo(Math.cos(a) * hr3, Math.sin(a) * hr3);
        else ctx.lineTo(Math.cos(a) * hr3, Math.sin(a) * hr3);
      }
      ctx.closePath();
      ctx.strokeStyle = `hsla(228, 40%, 65%, ${0.1 + pulseBase * 0.1})`;
      ctx.lineWidth = 0.6 * s; ctx.stroke();
      ctx.restore();

      // ═══ "HBMaster" BOLD TEXT ═══
      ctx.save(); ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.shadowColor = `hsla(228, 60%, 55%, ${pulseBase * 0.7})`;
      ctx.shadowBlur = 30 * s;
      ctx.font = `900 ${Math.round((compact ? 18 : 38) * s)}px 'Inter', sans-serif`;
      ctx.letterSpacing = `${(compact ? 2 : 6) * s}px`;
      ctx.fillStyle = `hsla(228, 55%, 38%, ${0.85 + pulseBase * 0.15})`;
      ctx.fillText("HBMASTER", cx, cy - (compact ? 2 : 10) * s);
      // Second pass for extra glow
      ctx.shadowBlur = 50 * s;
      ctx.shadowColor = `hsla(228, 60%, 65%, ${pulseBase * 0.3})`;
      ctx.fillStyle = `hsla(228, 50%, 50%, ${0.15 + pulseBase * 0.1})`;
      ctx.fillText("HBMASTER", cx, cy - (compact ? 2 : 10) * s);
      ctx.shadowBlur = 0;
      ctx.font = `600 ${Math.round((compact ? 8 : 11) * s)}px 'Inter', sans-serif`;
      ctx.letterSpacing = `${(compact ? 1 : 4) * s}px`;
      ctx.fillStyle = `hsla(228, 30%, 55%, ${0.4 + pulseBase * 0.2})`;
      ctx.fillText("MISSION CONTROL", cx, cy + (compact ? 12 : 24) * s);
      ctx.letterSpacing = "0px";
      ctx.restore();

      // ═══ Bloom flare ═══
      if (state === "responding" || isLoading) {
        const flareR = (70 + Math.sin(t * 3 * hudSpin) * 20) * s;
        const flareGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, flareR);
        flareGrad.addColorStop(0, `hsla(340, 55%, 65%, ${0.05 + Math.sin(t * 5) * 0.03})`);
        flareGrad.addColorStop(0.5, `hsla(280, 40%, 55%, ${0.03})`);
        flareGrad.addColorStop(1, "transparent");
        ctx.fillStyle = flareGrad;
        ctx.beginPath(); ctx.arc(cx, cy, flareR, 0, Math.PI * 2); ctx.fill();
      }

      // ═══ Mouse hover glow ═══
      if (isHover && !compact) {
        const hoverGrad = ctx.createRadialGradient(mx, my, 0, mx, my, 70 * s);
        hoverGrad.addColorStop(0, `hsla(228, 50%, 55%, 0.07)`);
        hoverGrad.addColorStop(1, "transparent");
        ctx.fillStyle = hoverGrad;
        ctx.beginPath(); ctx.arc(mx, my, 70 * s, 0, Math.PI * 2); ctx.fill();
      }

      // ═══ FLOWER PARTICLES — 4x density ═══
      const particles = particlesRef.current;
      particles.sort((a, b) => a.layer - b.layer);

      // Note: orbitSpeedMul, rotSpeedMul, sizeMul, tintHue, heartbeat, breathOffset
      // are all defined in the STATE ENGINE block above

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;

        // Fly inward from edges
        if (p.orbitRadius > 220) {
          p.orbitRadius *= 0.991;
        }
        // Fade in opacity as particle approaches
        if (p.opacity < 0.6 && p.life < 80) {
          p.opacity = Math.min(p.opacity + 0.01, 0.3 + Math.random() * 0.4);
        }

        p.orbitAngle += p.orbitSpeed * orbitSpeedMul;
        const targetX = cx + Math.cos(p.orbitAngle) * (p.orbitRadius + breathOffset) * s;
        const targetY = cy + Math.sin(p.orbitAngle) * (p.orbitRadius + breathOffset) * s;
        p.x += (targetX - p.x) * 0.02 + p.vx;
        p.y += (targetY - p.y) * 0.02 + p.vy;
        p.rotation += p.rotSpeed * rotSpeedMul;

        if (state === "responding") {
          p.vx += (cx - p.x) * 0.003;
          p.vy += (cy - p.y) * 0.003;
          p.orbitRadius *= 0.996;
        } else if (state === "thinking" || isLoading) {
          p.orbitSpeed *= 1.0005;
        }

        if (isHover && !compact) {
          const dx = p.x - mx;
          const dy = p.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80 * s && dist > 0) {
            const force = (80 * s - dist) / (80 * s) * 0.5;
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

        const drawSize = p.size * sizeMul * heartbeat;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        // Apply color tint for non-idle states
        if (tintHue >= 0 && alpha > 0.1) {
          ctx.globalAlpha = 0.15;
          ctx.fillStyle = `hsl(${tintHue}, 60%, 55%)`;
          ctx.beginPath();
          ctx.arc(0, 0, drawSize * 1.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }

        const drawFn = flowerDrawers[p.type];
        if (drawFn) drawFn(ctx, drawSize, alpha);

        ctx.restore();

        if (p.life >= p.maxLife) {
          particles[i] = createParticle(cx, cy, true);
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
  }, [state, compact, createParticle, responsiveSize, coreSize]);

  const canvasW = Math.round(responsiveSize);
  const canvasH = Math.round(coreSize * 1.1);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-center w-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <canvas
        ref={canvasRef}
        className={`transition-opacity duration-300 ${hovered ? "cursor-crosshair" : ""}`}
        style={{
          width: canvasW,
          height: canvasH,
          transform: `scale(${jarvisScale})`,
          transformOrigin: "center center",
          willChange: "transform",
        }}
      />
      <div className={`flex items-center gap-2 px-3 md:px-4 py-1 md:py-1.5 rounded-full -mt-4 transition-all duration-500
        backdrop-blur-xl bg-card/70 border shadow-lg
        ${hovered ? "border-primary/30 shadow-primary/10" : "border-border/50"}`}>
        <div className="relative">
          <div className={`w-2 h-2 rounded-full transition-colors ${
            state === "responding" ? "bg-accent" :
            state === "thinking" ? "bg-bloom-warm" :
            state === "loading" ? "bg-primary animate-pulse" :
            hovered ? "bg-primary" : "bg-primary/50"
          }`} />
          {(state !== "idle" || hovered) && (
            <div className={`absolute inset-0 w-2 h-2 rounded-full animate-ping ${
              state === "responding" ? "bg-accent/40" :
              state === "thinking" ? "bg-bloom-warm/40" :
              state === "loading" ? "bg-primary/40" : "bg-primary/30"
            }`} />
          )}
        </div>
        <span className="text-[9px] md:text-[10px] font-mono text-muted-foreground/80 uppercase tracking-[0.2em]">
          {state === "responding" ? "Speaking" : state === "thinking" ? "Analyzing" : state === "loading" ? "Initializing" : hovered ? "Interactive" : "Online"}
        </span>
      </div>
    </div>
  );
};

export default AIHologram;

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

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  HOLOGRAM STATES — All available visual modes                            ║
// ║                                                                          ║
// ║  Core states (driven by chat):                                           ║
// ║   • idle       — calm baseline                                           ║
// ║   • thinking   — processing, warm glow                                   ║
// ║   • responding — speech, heartbeat, particles gather                     ║
// ║   • loading    — fast spin, compressed, purple                           ║
// ║                                                                          ║
// ║  Special states (triggered programmatically):                            ║
// ║   • analyse    — flying numbers/digits, data crunching feel              ║
// ║   • development— streaming code characters, hacker/dev feel             ║
// ║   • connectie  — network lines, nodes, connections forming              ║
// ╚══════════════════════════════════════════════════════════════════════════╝
type HologramState = "idle" | "thinking" | "responding" | "loading" | "analyse" | "development" | "connectie";

interface AIHologramProps {
  state: HologramState;
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
        const primary = Math.sin(t * 3.2) * 0.06;
        const secondary = Math.sin(t * 7.5) * 0.02;
        const accent = Math.abs(Math.sin(t * 1.8)) * 0.02;
        scale = 1.0 + primary + secondary + accent;
      } else if (state === "thinking") {
        const breathe = Math.sin(t * 2.0) * 0.04;
        const jitter = Math.sin(t * 9) * 0.005;
        scale = 1.0 + breathe + jitter;
      } else if (state === "loading") {
        const rapid = Math.sin(t * 6) * 0.04;
        const micro = Math.sin(t * 14) * 0.01;
        scale = 0.97 + rapid + micro;
      } else if (state === "analyse") {
        // Analyse — sharp data-crunch pulse, like processing spikes
        const crunch = Math.sin(t * 4) * 0.035;
        const spike = Math.abs(Math.sin(t * 11)) * 0.015;
        scale = 1.0 + crunch + spike;
      } else if (state === "development") {
        // Development — steady focused breathe with micro-jitter (typing feel)
        const focus = Math.sin(t * 1.5) * 0.025;
        const typing = Math.sin(t * 18) * 0.004;
        scale = 1.0 + focus + typing;
      } else if (state === "connectie") {
        // Connectie — expanding/contracting like a network forming
        const expand = Math.sin(t * 1.2) * 0.05;
        const pulse = Math.sin(t * 5) * 0.015;
        scale = 1.0 + expand + pulse;
      } else {
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
      // ║  Core states:                                                   ║
      // ║   • idle       — calm, slow orbit, baseline everything          ║
      // ║   • thinking   — faster spin, warm glow, "processing" feel     ║
      // ║   • responding — speech pulse, heartbeat, particles gather     ║
      // ║   • loading    — very fast spin, compressed particles, purple  ║
      // ║                                                                 ║
      // ║  Special states:                                                ║
      // ║   • analyse    — cyan tint, data numbers fly around            ║
      // ║   • development— green/matrix tint, code chars stream          ║
      // ║   • connectie  — blue-white, network lines & nodes form        ║
      // ║                                                                 ║
      // ║  To add a new state: add a case to each config block below     ║
      // ╚══════════════════════════════════════════════════════════════════╝

      const isAnalyse = state === "analyse";
      const isDev = state === "development";
      const isConnectie = state === "connectie";

      // --- ORBIT SPEED MULTIPLIER ---
      // analyse=1.8 (data orbiting), development=1.2 (focused), connectie=0.6 (network forming slowly)
      const orbitSpeedMul = state === "responding" ? 2.2
        : state === "thinking" ? 1.6
        : isLoading ? 4.0
        : isAnalyse ? 1.8
        : isDev ? 1.2
        : isConnectie ? 0.6
        : 1.0;

      // --- ROTATION SPEED MULTIPLIER ---
      const rotSpeedMul = state === "responding" ? 1.5
        : state === "thinking" ? 1.3
        : isLoading ? 3.0
        : isAnalyse ? 2.0
        : isDev ? 0.8
        : isConnectie ? 0.5
        : 1.0;

      // --- PARTICLE SIZE MULTIPLIER ---
      const sizeMul = state === "responding" ? 1.3
        : state === "thinking" ? 0.9
        : isLoading ? 0.65
        : isAnalyse ? 0.7   // smaller — numbers dominate
        : isDev ? 0.6       // small — code dominates
        : isConnectie ? 0.5 // minimal — connections are the star
        : 1.0;

      // --- COLOR TINT HUE ---
      // analyse=190 (cyan), development=140 (matrix green), connectie=210 (cool blue)
      const tintHue = state === "responding" ? 155
        : state === "thinking" ? 35
        : isLoading ? 280
        : isAnalyse ? 190
        : isDev ? 140
        : isConnectie ? 210
        : -1;

      // --- HEARTBEAT EFFECT ---
      const heartbeatFreq = state === "responding" ? 8
        : state === "thinking" ? 3
        : isLoading ? 12
        : isAnalyse ? 5     // data pulse
        : isDev ? 2         // subtle typing rhythm
        : isConnectie ? 1.5 // slow network pulse
        : 0;
      const heartbeatAmp = state === "responding" ? 0.12
        : state === "thinking" ? 0.05
        : isLoading ? 0.08
        : isAnalyse ? 0.06
        : isDev ? 0.03
        : isConnectie ? 0.04
        : 0;
      const heartbeat = heartbeatFreq > 0
        ? 1 + Math.abs(Math.sin(t * heartbeatFreq)) * heartbeatAmp
        : 1;

      // --- SPEECH WAVE EFFECT ---
      const speechWaveRadius = state === "responding"
        ? (t * 80) % (200 * s) : 0;
      const speechWaveActive = state === "responding";

      // --- BREATHING EFFECT ---
      const breathAmp = state === "responding" ? 8
        : state === "thinking" ? 5
        : isLoading ? 2
        : isAnalyse ? 4
        : isDev ? 3
        : isConnectie ? 6 // wider breathe for network expansion
        : 3;
      const breathFreq = state === "responding" ? 2.5
        : state === "thinking" ? 1.5
        : isLoading ? 5
        : isAnalyse ? 2.0
        : isDev ? 1.0
        : isConnectie ? 0.6
        : 0.8;
      const breathOffset = Math.sin(t * breathFreq) * breathAmp;

      // --- HUD SPIN MULTIPLIER ---
      const hudSpin = isLoading ? 3.5
        : state === "responding" ? 2.0
        : state === "thinking" ? 1.5
        : isAnalyse ? 2.5
        : isDev ? 1.8
        : isConnectie ? 0.8
        : 1.0;

      // --- PULSE BASE ---
      const pulseBase = isLoading ? 0.5 + Math.sin(t * 6) * 0.5
        : state === "thinking" ? 0.6 + Math.sin(t * 4) * 0.4
        : state === "responding" ? 0.8 + Math.sin(t * 2) * 0.2
        : isAnalyse ? 0.6 + Math.sin(t * 5) * 0.3
        : isDev ? 0.5 + Math.sin(t * 3) * 0.25
        : isConnectie ? 0.7 + Math.sin(t * 1.5) * 0.2
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

      // ╔══════════════════════════════════════════════════════════════════════╗
      // ║  SPECIAL STATE OVERLAYS                                              ║
      // ║  These render unique visual elements on top of the base hologram     ║
      // ╚══════════════════════════════════════════════════════════════════════╝

      // ═══ ANALYSE STATE — Flying numbers/digits orbiting the hologram ═══
      // Creates a "data crunching" visual with numbers spawning from edges,
      // orbiting around and fading. Cyan-tinted.
      if (isAnalyse && !compact) {
        ctx.save();
        ctx.font = `700 ${Math.round(14 * s)}px 'Courier New', monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const analyseChars = "0123456789%+-.€#∑∆π≈";
        for (let i = 0; i < 40; i++) {
          const age = (t * 0.5 + i * 0.37) % 8; // 8s cycle per digit
          const angle = (Math.PI * 2 / 40) * i + t * 0.3 + age * 0.5;
          // Fly in from edge, spiral to mid-range, then fade out
          const maxR = 280 * s;
          const minR = 40 * s;
          const progress = age / 8;
          const r = progress < 0.3
            ? maxR - (maxR - 100 * s) * (progress / 0.3) // fly in
            : progress < 0.7
              ? 100 * s + Math.sin(progress * Math.PI * 4) * 40 * s // orbit
              : minR + (progress - 0.7) / 0.3 * 60 * s; // drift to center
          const alpha = progress < 0.1 ? progress / 0.1
            : progress > 0.85 ? (1 - progress) / 0.15
            : 0.7;
          const dx = cx + Math.cos(angle) * r;
          const dy = cy + Math.sin(angle) * r;
          const charIdx = (i + Math.floor(t * 3)) % analyseChars.length;
          const fontSize = (10 + Math.sin(t * 3 + i) * 4) * s;
          ctx.font = `700 ${Math.round(fontSize)}px 'Courier New', monospace`;
          ctx.fillStyle = `hsla(190, 70%, 65%, ${alpha * 0.6})`;
          ctx.shadowColor = `hsla(190, 80%, 55%, ${alpha * 0.4})`;
          ctx.shadowBlur = 8 * s;
          ctx.fillText(analyseChars[charIdx], dx, dy);
        }
        ctx.shadowBlur = 0;
        ctx.restore();
      }

      // ═══ DEVELOPMENT STATE — Streaming code characters, matrix-style ═══
      // Columns of code-like text falling/rising through the hologram area.
      // Green matrix tint with monospace font.
      if (isDev && !compact) {
        ctx.save();
        const codeChars = "{}[]();=>const let var function return if else import export async await .map .filter <div/> useState useEffect";
        const codeTokens = codeChars.split(" ");
        // 20 vertical streams
        for (let col = 0; col < 20; col++) {
          const colX = cx - 180 * s + (col * 18 * s);
          // Each column scrolls at different speed
          const scrollSpeed = 30 + (col % 5) * 15;
          const scrollOffset = t * scrollSpeed + col * 47;
          // 8 chars per column
          for (let row = 0; row < 8; row++) {
            const rawY = ((scrollOffset + row * 22) % (300 * s)) - 50 * s;
            const py = cy - 130 * s + rawY;
            // Distance from center for fade
            const distFromCenter = Math.sqrt((colX - cx) ** 2 + (py - cy) ** 2);
            const maxDist = 180 * s;
            if (distFromCenter > maxDist) continue;
            const distFade = 1 - distFromCenter / maxDist;
            const alpha = distFade * 0.5 * (0.4 + Math.sin(t * 2 + col + row) * 0.3);
            const tokenIdx = (col * 8 + row + Math.floor(t * 2)) % codeTokens.length;
            const token = codeTokens[tokenIdx];
            const fontSize = (8 + Math.sin(t + col * 0.5) * 2) * s;
            ctx.font = `500 ${Math.round(fontSize)}px 'Courier New', monospace`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = `hsla(140, 70%, 60%, ${alpha})`;
            ctx.shadowColor = `hsla(140, 80%, 50%, ${alpha * 0.5})`;
            ctx.shadowBlur = 6 * s;
            ctx.fillText(token, colX, py);
          }
        }
        ctx.shadowBlur = 0;
        ctx.restore();
      }

      // ═══ CONNECTIE STATE — Network nodes & connection lines ═══
      // Dynamic network topology: nodes appear, form connections with animated
      // lines, dots travel along connections. Lines fly in and out from edges.
      if (isConnectie && !compact) {
        ctx.save();
        const netNodeCount = 30;
        const netNodes: { x: number; y: number; alpha: number; r: number }[] = [];
        for (let i = 0; i < netNodeCount; i++) {
          const age = (t * 0.3 + i * 0.51) % 6;
          const progress = age / 6;
          // Spawn from outside, drift to position, then fly out again
          const baseAngle = (Math.PI * 2 / netNodeCount) * i + Math.sin(t * 0.2 + i) * 0.3;
          const edgeR = 320 * s;
          const targetR = (50 + (i % 7) * 22) * s;
          let r: number;
          if (progress < 0.2) {
            r = edgeR - (edgeR - targetR) * (progress / 0.2); // fly in
          } else if (progress < 0.75) {
            r = targetR + Math.sin(t * 1.5 + i) * 15 * s; // orbit/wobble
          } else {
            r = targetR + (edgeR - targetR) * ((progress - 0.75) / 0.25); // fly out
          }
          const alpha = progress < 0.1 ? progress / 0.1
            : progress > 0.85 ? (1 - progress) / 0.15
            : 0.8;
          const nx = cx + Math.cos(baseAngle) * r;
          const ny = cy + Math.sin(baseAngle) * r;
          const nodeSize = (3 + Math.sin(t * 3 + i) * 1.5) * s;
          netNodes.push({ x: nx, y: ny, alpha, r: nodeSize });

          // Draw node circle with glow
          ctx.beginPath();
          ctx.arc(nx, ny, nodeSize, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(210, 60%, 70%, ${alpha * 0.7})`;
          ctx.fill();
          // Glow ring
          ctx.beginPath();
          ctx.arc(nx, ny, nodeSize + 4 * s, 0, Math.PI * 2);
          ctx.strokeStyle = `hsla(210, 60%, 70%, ${alpha * 0.15})`;
          ctx.lineWidth = 1 * s;
          ctx.stroke();
        }

        // Draw connections between nearby nodes
        for (let i = 0; i < netNodes.length; i++) {
          const a = netNodes[i];
          for (let j = i + 1; j < netNodes.length; j++) {
            const b = netNodes[j];
            const dist = Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
            if (dist > 120 * s) continue;
            const connAlpha = Math.min(a.alpha, b.alpha) * (1 - dist / (120 * s)) * 0.4;
            if (connAlpha < 0.02) continue;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `hsla(210, 55%, 65%, ${connAlpha})`;
            ctx.lineWidth = 1 * s;
            ctx.stroke();
            // Traveling dot along connection
            const dotProgress = (t * 0.8 + i * 0.2 + j * 0.15) % 1;
            const dotX = a.x + (b.x - a.x) * dotProgress;
            const dotY = a.y + (b.y - a.y) * dotProgress;
            ctx.beginPath();
            ctx.arc(dotX, dotY, 2 * s, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(210, 70%, 75%, ${connAlpha * 1.5})`;
            ctx.fill();
          }
        }
        ctx.restore();
      }


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
            state === "analyse" ? "bg-cyan-400" :
            state === "development" ? "bg-green-400" :
            state === "connectie" ? "bg-blue-300" :
            hovered ? "bg-primary" : "bg-primary/50"
          }`} />
          {(state !== "idle" || hovered) && (
            <div className={`absolute inset-0 w-2 h-2 rounded-full animate-ping ${
              state === "responding" ? "bg-accent/40" :
              state === "thinking" ? "bg-bloom-warm/40" :
              state === "loading" ? "bg-primary/40" :
              state === "analyse" ? "bg-cyan-400/40" :
              state === "development" ? "bg-green-400/40" :
              state === "connectie" ? "bg-blue-300/40" :
              "bg-primary/30"
            }`} />
          )}
        </div>
        <span className="text-[9px] md:text-[10px] font-mono text-muted-foreground/80 uppercase tracking-[0.2em]">
          {state === "responding" ? "Speaking" :
           state === "thinking" ? "Analyzing" :
           state === "loading" ? "Initializing" :
           state === "analyse" ? "Analysing Data" :
           state === "development" ? "Development" :
           state === "connectie" ? "Connecting" :
           hovered ? "Interactive" : "Online"}
        </span>
      </div>
    </div>
  );
};

export default AIHologram;

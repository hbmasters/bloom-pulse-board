// Flower & botanical drawing functions for the HBMaster hologram canvas
// Each function draws a single flower/plant at the origin, pre-rotated by caller

export const drawLily = (ctx: CanvasRenderingContext2D, s: number, alpha: number) => {
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
  ctx.beginPath(); ctx.arc(0, 0, s * 0.13, 0, Math.PI * 2);
  ctx.fillStyle = `hsla(45, 80%, 60%, ${alpha * 0.85})`; ctx.fill();
  for (let i = 0; i < 3; i++) {
    const sa = (Math.PI * 2 / 3) * i;
    ctx.beginPath(); ctx.arc(Math.cos(sa) * s * 0.08, Math.sin(sa) * s * 0.08, s * 0.03, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(35, 70%, 45%, ${alpha * 0.6})`; ctx.fill();
  }
};

export const drawTulip = (ctx: CanvasRenderingContext2D, s: number, alpha: number) => {
  const h = s * 0.95;
  for (let i = -1; i <= 1; i++) {
    ctx.beginPath();
    ctx.ellipse(i * s * 0.16, -h * 0.2, s * 0.28, h * 0.5, i * 0.1, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(280, 55%, ${48 + i * 6}%, ${alpha * 0.7})`; ctx.fill();
  }
  ctx.beginPath(); ctx.ellipse(0, -h * 0.3, s * 0.12, h * 0.2, 0, 0, Math.PI * 2);
  ctx.fillStyle = `hsla(285, 60%, 65%, ${alpha * 0.3})`; ctx.fill();
  ctx.beginPath(); ctx.moveTo(0, h * 0.2); ctx.lineTo(0, h * 0.6);
  ctx.strokeStyle = `hsla(140, 40%, 45%, ${alpha * 0.45})`; ctx.lineWidth = 1.2; ctx.stroke();
};

export const drawCosmos = (ctx: CanvasRenderingContext2D, s: number, alpha: number) => {
  for (let i = 0; i < 8; i++) {
    const a = (Math.PI * 2 / 8) * i;
    ctx.beginPath();
    ctx.ellipse(Math.cos(a) * s * 0.38, Math.sin(a) * s * 0.38, s * 0.32, s * 0.13, a, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(285, 50%, 55%, ${alpha * 0.65})`; ctx.fill();
  }
  ctx.beginPath(); ctx.arc(0, 0, s * 0.2, 0, Math.PI * 2);
  ctx.fillStyle = `hsla(50, 75%, 55%, ${alpha * 0.9})`; ctx.fill();
};

export const drawCraspedia = (ctx: CanvasRenderingContext2D, s: number, alpha: number) => {
  ctx.beginPath(); ctx.moveTo(0, s * 0.35); ctx.lineTo(0, s * 1.3);
  ctx.strokeStyle = `hsla(140, 35%, 50%, ${alpha * 0.4})`; ctx.lineWidth = 0.9; ctx.stroke();
  ctx.beginPath(); ctx.arc(0, 0, s * 0.42, 0, Math.PI * 2);
  ctx.fillStyle = `hsla(50, 82%, 55%, ${alpha * 0.85})`; ctx.fill();
  for (let i = 0; i < 5; i++) {
    const da = (Math.PI * 2 / 5) * i + 0.2;
    ctx.beginPath(); ctx.arc(Math.cos(da) * s * 0.22, Math.sin(da) * s * 0.22, s * 0.07, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(48, 72%, 48%, ${alpha * 0.45})`; ctx.fill();
  }
};

export const drawCalla = (ctx: CanvasRenderingContext2D, s: number, alpha: number) => {
  ctx.beginPath();
  ctx.moveTo(0, -s * 0.65);
  ctx.bezierCurveTo(-s * 0.55, -s * 0.2, -s * 0.45, s * 0.4, 0, s * 0.55);
  ctx.bezierCurveTo(s * 0.45, s * 0.4, s * 0.55, -s * 0.2, 0, -s * 0.65);
  ctx.fillStyle = `hsla(0, 0%, 96%, ${alpha * 0.7})`; ctx.fill();
  ctx.strokeStyle = `hsla(220, 10%, 82%, ${alpha * 0.3})`; ctx.lineWidth = 0.7; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, -s * 0.38); ctx.lineTo(0, s * 0.18);
  ctx.strokeStyle = `hsla(50, 70%, 60%, ${alpha * 0.65})`; ctx.lineWidth = 1.8; ctx.lineCap = "round"; ctx.stroke(); ctx.lineCap = "butt";
};

export const drawDarkLeaf = (ctx: CanvasRenderingContext2D, s: number, alpha: number) => {
  ctx.beginPath();
  ctx.moveTo(0, -s * 0.75);
  ctx.bezierCurveTo(-s * 0.55, -s * 0.35, -s * 0.45, s * 0.35, 0, s * 0.75);
  ctx.bezierCurveTo(s * 0.45, s * 0.35, s * 0.55, -s * 0.35, 0, -s * 0.75);
  ctx.fillStyle = `hsla(350, 25%, 20%, ${alpha * 0.55})`; ctx.fill();
  ctx.beginPath(); ctx.moveTo(0, -s * 0.6); ctx.lineTo(0, s * 0.6);
  ctx.strokeStyle = `hsla(350, 20%, 28%, ${alpha * 0.3})`; ctx.lineWidth = 0.6; ctx.stroke();
  for (let i = 0; i < 3; i++) {
    const y = -s * 0.3 + i * s * 0.3;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(-s * 0.25, y - s * 0.1);
    ctx.moveTo(0, y); ctx.lineTo(s * 0.25, y - s * 0.1);
    ctx.strokeStyle = `hsla(350, 18%, 30%, ${alpha * 0.2})`; ctx.lineWidth = 0.4; ctx.stroke();
  }
};

export const drawWhiteBranch = (ctx: CanvasRenderingContext2D, s: number, alpha: number) => {
  ctx.beginPath(); ctx.moveTo(0, s * 0.85); ctx.lineTo(0, -s * 0.85);
  ctx.strokeStyle = `hsla(0, 0%, 88%, ${alpha * 0.5})`; ctx.lineWidth = 0.8; ctx.stroke();
  for (let i = 0; i < 4; i++) {
    const y = -s * 0.6 + i * s * 0.35;
    const dir = i % 2 === 0 ? 1 : -1;
    ctx.beginPath(); ctx.ellipse(dir * s * 0.22, y, s * 0.2, s * 0.07, dir * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(0, 0%, 93%, ${alpha * 0.38})`; ctx.fill();
  }
};

// === NEW FLOWER TYPES ===

export const drawRose = (ctx: CanvasRenderingContext2D, s: number, alpha: number) => {
  // Layered spiral petals
  for (let layer = 3; layer >= 0; layer--) {
    const petals = 5 + layer;
    const radius = s * (0.15 + layer * 0.12);
    for (let i = 0; i < petals; i++) {
      const a = (Math.PI * 2 / petals) * i + layer * 0.3;
      ctx.beginPath();
      ctx.ellipse(
        Math.cos(a) * radius * 0.5, Math.sin(a) * radius * 0.5,
        s * (0.2 + layer * 0.04), s * (0.12 + layer * 0.02),
        a + 0.3, 0, Math.PI * 2
      );
      const lightness = 55 + layer * 7;
      ctx.fillStyle = `hsla(350, 70%, ${lightness}%, ${alpha * (0.6 - layer * 0.08)})`;
      ctx.fill();
    }
  }
  // Center bud
  ctx.beginPath(); ctx.arc(0, 0, s * 0.1, 0, Math.PI * 2);
  ctx.fillStyle = `hsla(348, 75%, 45%, ${alpha * 0.7})`; ctx.fill();
};

export const drawSunflower = (ctx: CanvasRenderingContext2D, s: number, alpha: number) => {
  // Petals
  for (let i = 0; i < 14; i++) {
    const a = (Math.PI * 2 / 14) * i;
    ctx.beginPath();
    ctx.ellipse(Math.cos(a) * s * 0.45, Math.sin(a) * s * 0.45, s * 0.25, s * 0.08, a, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(45, 90%, 55%, ${alpha * 0.7})`; ctx.fill();
  }
  // Dark center with seeds pattern
  ctx.beginPath(); ctx.arc(0, 0, s * 0.28, 0, Math.PI * 2);
  ctx.fillStyle = `hsla(30, 60%, 25%, ${alpha * 0.85})`; ctx.fill();
  // Fibonacci seed pattern
  for (let i = 0; i < 12; i++) {
    const a = i * 2.399; // golden angle
    const r = s * 0.05 * Math.sqrt(i);
    ctx.beginPath(); ctx.arc(Math.cos(a) * r, Math.sin(a) * r, s * 0.025, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(40, 70%, 40%, ${alpha * 0.5})`; ctx.fill();
  }
};

export const drawDaisy = (ctx: CanvasRenderingContext2D, s: number, alpha: number) => {
  for (let i = 0; i < 12; i++) {
    const a = (Math.PI * 2 / 12) * i;
    ctx.beginPath();
    ctx.ellipse(Math.cos(a) * s * 0.35, Math.sin(a) * s * 0.35, s * 0.22, s * 0.08, a, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(0, 0%, 97%, ${alpha * 0.8})`; ctx.fill();
    ctx.strokeStyle = `hsla(0, 0%, 85%, ${alpha * 0.3})`; ctx.lineWidth = 0.4; ctx.stroke();
  }
  ctx.beginPath(); ctx.arc(0, 0, s * 0.15, 0, Math.PI * 2);
  ctx.fillStyle = `hsla(50, 85%, 55%, ${alpha * 0.9})`; ctx.fill();
};

export const drawOrchid = (ctx: CanvasRenderingContext2D, s: number, alpha: number) => {
  // Top petals (3)
  for (let i = 0; i < 3; i++) {
    const a = (Math.PI * 2 / 3) * i - Math.PI / 2;
    ctx.beginPath();
    ctx.ellipse(Math.cos(a) * s * 0.3, Math.sin(a) * s * 0.3, s * 0.3, s * 0.15, a + 0.5, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(300, 45%, 72%, ${alpha * 0.65})`; ctx.fill();
  }
  // Lip petal
  ctx.beginPath();
  ctx.ellipse(0, s * 0.15, s * 0.25, s * 0.35, 0, 0, Math.PI * 2);
  ctx.fillStyle = `hsla(330, 60%, 65%, ${alpha * 0.55})`; ctx.fill();
  // Spots
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.arc((Math.random() - 0.5) * s * 0.2, s * 0.1 + (Math.random() - 0.5) * s * 0.15, s * 0.03, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(340, 70%, 40%, ${alpha * 0.4})`; ctx.fill();
  }
  // Column
  ctx.beginPath(); ctx.arc(0, -s * 0.05, s * 0.06, 0, Math.PI * 2);
  ctx.fillStyle = `hsla(50, 60%, 70%, ${alpha * 0.7})`; ctx.fill();
};

export const drawHydrangea = (ctx: CanvasRenderingContext2D, s: number, alpha: number) => {
  // Cluster of tiny 4-petal flowers
  const positions = [
    [0, 0], [-s * 0.2, -s * 0.15], [s * 0.2, -s * 0.1], [-s * 0.1, s * 0.2],
    [s * 0.15, s * 0.18], [-s * 0.25, s * 0.05], [s * 0.28, s * 0.02],
    [0, -s * 0.28], [s * 0.05, s * 0.3], [-s * 0.18, -s * 0.25]
  ];
  for (const [px, py] of positions) {
    const hue = 220 + Math.random() * 30;
    for (let i = 0; i < 4; i++) {
      const a = (Math.PI / 2) * i;
      ctx.beginPath();
      ctx.ellipse(px + Math.cos(a) * s * 0.06, py + Math.sin(a) * s * 0.06, s * 0.07, s * 0.04, a, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${hue}, 55%, 68%, ${alpha * 0.6})`; ctx.fill();
    }
    ctx.beginPath(); ctx.arc(px, py, s * 0.02, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(55, 60%, 70%, ${alpha * 0.5})`; ctx.fill();
  }
};

export const drawLavender = (ctx: CanvasRenderingContext2D, s: number, alpha: number) => {
  // Stem
  ctx.beginPath(); ctx.moveTo(0, s * 0.3); ctx.lineTo(0, s * 1.2);
  ctx.strokeStyle = `hsla(140, 30%, 55%, ${alpha * 0.4})`; ctx.lineWidth = 0.8; ctx.stroke();
  // Flower spike
  for (let i = 0; i < 8; i++) {
    const y = -s * 0.4 + i * s * 0.1;
    const w = s * (0.12 - i * 0.008);
    ctx.beginPath();
    ctx.ellipse(-w * 0.5, y, w, s * 0.04, -0.2, 0, Math.PI * 2);
    ctx.ellipse(w * 0.5, y, w, s * 0.04, 0.2, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(270, 55%, ${58 + i * 2}%, ${alpha * (0.7 - i * 0.04)})`; ctx.fill();
  }
};

export const drawPeony = (ctx: CanvasRenderingContext2D, s: number, alpha: number) => {
  // Dense ruffled petals in layers
  for (let layer = 4; layer >= 0; layer--) {
    const petals = 7 + layer * 2;
    for (let i = 0; i < petals; i++) {
      const a = (Math.PI * 2 / petals) * i + layer * 0.4;
      const r = s * (0.1 + layer * 0.1);
      const wobble = Math.sin(i * 2.3 + layer) * s * 0.03;
      ctx.beginPath();
      ctx.ellipse(
        Math.cos(a) * r + wobble, Math.sin(a) * r,
        s * (0.18 - layer * 0.01), s * (0.1 - layer * 0.005),
        a + wobble * 0.1, 0, Math.PI * 2
      );
      const sat = 55 + layer * 5;
      const light = 72 + layer * 4;
      ctx.fillStyle = `hsla(340, ${sat}%, ${light}%, ${alpha * (0.5 - layer * 0.06)})`; ctx.fill();
    }
  }
  ctx.beginPath(); ctx.arc(0, 0, s * 0.08, 0, Math.PI * 2);
  ctx.fillStyle = `hsla(45, 70%, 65%, ${alpha * 0.6})`; ctx.fill();
};

export const drawFern = (ctx: CanvasRenderingContext2D, s: number, alpha: number) => {
  // Central stem
  ctx.beginPath();
  ctx.moveTo(0, s * 0.8);
  ctx.quadraticCurveTo(s * 0.05, 0, 0, -s * 0.8);
  ctx.strokeStyle = `hsla(130, 40%, 40%, ${alpha * 0.5})`; ctx.lineWidth = 1; ctx.stroke();
  // Leaflets
  for (let i = 0; i < 7; i++) {
    const y = -s * 0.6 + i * s * 0.2;
    const leafSize = s * (0.25 - Math.abs(i - 3) * 0.03);
    const dir = i % 2 === 0 ? 1 : -1;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.quadraticCurveTo(dir * leafSize * 0.8, y - leafSize * 0.3, dir * leafSize, y);
    ctx.quadraticCurveTo(dir * leafSize * 0.8, y + leafSize * 0.3, 0, y);
    ctx.fillStyle = `hsla(135, 45%, ${38 + i * 3}%, ${alpha * 0.45})`; ctx.fill();
  }
};

export const drawBabyBreath = (ctx: CanvasRenderingContext2D, s: number, alpha: number) => {
  // Delicate branching stems with tiny flowers
  const branches = [
    { x: 0, y: s * 0.5, ex: -s * 0.3, ey: -s * 0.4 },
    { x: 0, y: s * 0.5, ex: s * 0.2, ey: -s * 0.5 },
    { x: 0, y: s * 0.5, ex: s * 0.35, ey: -s * 0.2 },
    { x: 0, y: s * 0.5, ex: -s * 0.15, ey: -s * 0.55 },
  ];
  for (const b of branches) {
    ctx.beginPath(); ctx.moveTo(b.x, b.y);
    ctx.quadraticCurveTo(b.ex * 0.5, (b.y + b.ey) * 0.5, b.ex, b.ey);
    ctx.strokeStyle = `hsla(120, 20%, 65%, ${alpha * 0.35})`; ctx.lineWidth = 0.5; ctx.stroke();
    // Tiny flower at end
    ctx.beginPath(); ctx.arc(b.ex, b.ey, s * 0.04, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(0, 0%, 98%, ${alpha * 0.75})`; ctx.fill();
  }
};

// Map of all flower types to their draw functions
export const flowerDrawers: Record<string, (ctx: CanvasRenderingContext2D, s: number, alpha: number) => void> = {
  lily: drawLily,
  tulip: drawTulip,
  cosmos: drawCosmos,
  craspedia: drawCraspedia,
  calla: drawCalla,
  darkleaf: drawDarkLeaf,
  whitebranch: drawWhiteBranch,
  rose: drawRose,
  sunflower: drawSunflower,
  daisy: drawDaisy,
  orchid: drawOrchid,
  hydrangea: drawHydrangea,
  lavender: drawLavender,
  peony: drawPeony,
  fern: drawFern,
  babybreath: drawBabyBreath,
};

export type FlowerType = keyof typeof flowerDrawers;

export const FLOWER_TYPES: FlowerType[] = Object.keys(flowerDrawers);

// Weighted probabilities for each flower type
export const FLOWER_WEIGHTS: number[] = [
  0.08, // lily
  0.08, // tulip
  0.07, // cosmos
  0.07, // craspedia
  0.06, // calla
  0.06, // darkleaf
  0.06, // whitebranch
  0.09, // rose
  0.07, // sunflower
  0.06, // daisy
  0.06, // orchid
  0.06, // hydrangea
  0.06, // lavender
  0.06, // peony
  0.03, // fern
  0.03, // babybreath
];

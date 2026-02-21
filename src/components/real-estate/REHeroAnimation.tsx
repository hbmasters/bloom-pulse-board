import { useEffect, useRef } from "react";

interface HeroAnimationProps {
  onTooltip?: (text: string | null, x: number, y: number) => void;
}

const REHeroAnimation = ({ onTooltip }: HeroAnimationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const mouseRef = useRef({ x: -1, y: -1 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // --- TYPES ---
    interface Building {
      x: number; w: number; h: number; floors: number;
      type: "small" | "large" | "watertoren"; label: string;
    }
    interface Flower {
      x: number; y: number; size: number; color: string; phase: number; petals: number;
    }
    interface Mover {
      x: number; speed: number; type: "bike" | "van" | "walk"; y: number;
    }
    interface Boat {
      x: number; speed: number; size: number; phase: number;
    }

    let W = 0, H = 0, ground = 0, waterY = 0, s = 1;
    let buildings: Building[] = [];
    let flowers: Flower[] = [];
    let movers: Mover[] = [];
    let boats: Boat[] = [];
    let planeX = -100;

    const flowerColors = [
      "rgba(230,120,140,", "rgba(240,180,60,", "rgba(200,100,180,",
      "rgba(255,140,100,", "rgba(180,220,120,", "rgba(120,180,220,",
    ];

    const rebuild = () => {
      const rect = canvas.getBoundingClientRect();
      W = rect.width; H = rect.height;
      ground = H * 0.68;
      waterY = H * 0.78;
      s = W / 1200;

      buildings = [
        { x: 60 * s, w: 50 * s, h: 70 * s, floors: 2, type: "small", label: "SNF gecertificeerd" },
        { x: 120 * s, w: 45 * s, h: 65 * s, floors: 2, type: "small", label: "Vergund" },
        { x: 180 * s, w: 50 * s, h: 75 * s, floors: 2, type: "small", label: "Periodiek geïnspecteerd" },
        { x: 250 * s, w: 48 * s, h: 68 * s, floors: 2, type: "small", label: "SNF gecertificeerd" },
        { x: 330 * s, w: 52 * s, h: 72 * s, floors: 2, type: "small", label: "Vergund" },
        // Large building 1
        { x: 440 * s, w: 120 * s, h: 170 * s, floors: 5, type: "large", label: "SNF gecertificeerd" },
        // Watertoren Aalsmeer
        { x: 590 * s, w: 40 * s, h: 220 * s, floors: 0, type: "watertoren", label: "Watertoren Aalsmeer" },
        // More small houses
        { x: 660 * s, w: 48 * s, h: 66 * s, floors: 2, type: "small", label: "Periodiek geïnspecteerd" },
        { x: 720 * s, w: 50 * s, h: 74 * s, floors: 2, type: "small", label: "Vergund" },
        { x: 780 * s, w: 46 * s, h: 62 * s, floors: 2, type: "small", label: "SNF gecertificeerd" },
        { x: 840 * s, w: 50 * s, h: 70 * s, floors: 2, type: "small", label: "Vergund" },
        // Large building 2
        { x: 930 * s, w: 110 * s, h: 150 * s, floors: 4, type: "large", label: "Vergund" },
        { x: 1070 * s, w: 48 * s, h: 68 * s, floors: 2, type: "small", label: "Periodiek geïnspecteerd" },
        { x: 1130 * s, w: 50 * s, h: 72 * s, floors: 2, type: "small", label: "SNF gecertificeerd" },
      ];

      flowers = [];
      for (let i = 0; i < 45; i++) {
        flowers.push({
          x: Math.random() * W,
          y: ground + 2 + Math.random() * (waterY - ground - 8),
          size: (3 + Math.random() * 5) * s,
          color: flowerColors[Math.floor(Math.random() * flowerColors.length)],
          phase: Math.random() * Math.PI * 2, petals: 4 + Math.floor(Math.random() * 3),
        });
      }
      for (const b of buildings) {
        if (b.type === "watertoren") continue;
        const count = b.type === "small" ? 2 : 4;
        for (let j = 0; j < count; j++) {
          flowers.push({
            x: b.x + Math.random() * b.w,
            y: ground + 2 + Math.random() * 10 * s,
            size: (2 + Math.random() * 4) * s,
            color: flowerColors[Math.floor(Math.random() * flowerColors.length)],
            phase: Math.random() * Math.PI * 2, petals: 5,
          });
        }
      }

      movers = [
        { x: Math.random() * W, speed: 0.8 * s, type: "bike", y: ground + 8 * s },
        { x: Math.random() * W, speed: 0.6 * s, type: "walk", y: ground + 5 * s },
        { x: Math.random() * W, speed: 1.3 * s, type: "van", y: ground + 12 * s },
        { x: Math.random() * W, speed: 0.9 * s, type: "bike", y: ground + 9 * s },
        { x: Math.random() * W, speed: 0.7 * s, type: "walk", y: ground + 4 * s },
      ];

      boats = [
        { x: W * 0.15, speed: 0.3 * s, size: 20 * s, phase: 0 },
        { x: W * 0.45, speed: -0.2 * s, size: 16 * s, phase: 1.5 },
        { x: W * 0.7, speed: 0.25 * s, size: 22 * s, phase: 3 },
        { x: W * 0.9, speed: -0.35 * s, size: 18 * s, phase: 4.5 },
      ];

      planeX = -200;
    };
    rebuild();

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const handleLeave = () => {
      mouseRef.current = { x: -1, y: -1 };
      onTooltip?.(null, 0, 0);
    };
    canvas.addEventListener("mousemove", handleMouse);
    canvas.addEventListener("mouseleave", handleLeave);

    const handleResize = () => { resize(); rebuild(); };
    window.addEventListener("resize", handleResize);

    // --- DRAW HELPERS ---
    const drawWatertoren = (b: Building, hovered: boolean, t: number) => {
      const cx = b.x + b.w / 2;
      const baseY = ground;
      const topY = ground - b.h;

      // The real Aalsmeer watertoren is a tall slender Art Deco tower
      // Proportions: width ~1:5 height, no separate tank, continuous column
      const bodyW = b.w * 0.85;
      const halfW = bodyW / 2;

      // Main body colors (brick tones adapted to dark theme)
      const brickDark = hovered ? "#2a3d4e" : "#1c2e3e";
      const brickLight = hovered ? "#334a5c" : "#243848";
      const pilasterColor = hovered ? "#3a5568" : "#2a4558";

      // Main tower body
      const bodyGrad = ctx.createLinearGradient(cx - halfW, topY, cx + halfW, topY);
      bodyGrad.addColorStop(0, brickDark);
      bodyGrad.addColorStop(0.15, brickLight);
      bodyGrad.addColorStop(0.35, brickDark);
      bodyGrad.addColorStop(0.5, brickLight);
      bodyGrad.addColorStop(0.65, brickDark);
      bodyGrad.addColorStop(0.85, brickLight);
      bodyGrad.addColorStop(1, brickDark);
      ctx.fillStyle = bodyGrad;
      ctx.fillRect(cx - halfW, topY, bodyW, b.h);

      // Vertical pilasters (Art Deco columns on the facade)
      const pilasterW = 3 * s;
      const pilasters = [-halfW, -halfW * 0.5, 0, halfW * 0.5, halfW - pilasterW];
      for (const px of pilasters) {
        ctx.fillStyle = pilasterColor;
        ctx.fillRect(cx + px, topY, pilasterW, b.h);
      }

      // Stepped horizontal bands (Art Deco detail) at ~25% and ~75% height
      for (const frac of [0.2, 0.45, 0.7]) {
        const bandY = topY + b.h * frac;
        ctx.fillStyle = pilasterColor;
        ctx.fillRect(cx - halfW - 2 * s, bandY, bodyW + 4 * s, 2 * s);
      }

      // Central vertical decorative band (narrower, darker)
      const centralW = 6 * s;
      ctx.fillStyle = brickDark;
      ctx.fillRect(cx - centralW / 2, topY + b.h * 0.15, centralW, b.h * 0.75);

      // Keyhole/arch shape at base (distinctive feature)
      const archW = 10 * s;
      const archH = 25 * s;
      const archY = baseY - archH;
      ctx.beginPath();
      ctx.moveTo(cx - archW / 2, baseY);
      ctx.lineTo(cx - archW / 2, archY + 5 * s);
      ctx.quadraticCurveTo(cx - archW / 2, archY, cx, archY);
      ctx.quadraticCurveTo(cx + archW / 2, archY, cx + archW / 2, archY + 5 * s);
      ctx.lineTo(cx + archW / 2, baseY);
      ctx.closePath();
      ctx.fillStyle = hovered ? "rgba(15,30,50,0.9)" : "rgba(10,22,40,0.9)";
      ctx.fill();
      ctx.strokeStyle = hovered ? "rgba(61,139,156,0.3)" : "rgba(61,139,156,0.08)";
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Small windows (narrow vertical slits, Art Deco style)
      const windowSlots = [0.25, 0.38, 0.52, 0.65];
      for (let i = 0; i < windowSlots.length; i++) {
        const wy = topY + b.h * windowSlots[i];
        const ww = 3 * s;
        const wh = 5 * s;
        const lit = Math.sin(t * 0.5 + i * 4) > 0;
        ctx.fillStyle = lit
          ? `rgba(245,217,138,${0.4 + Math.sin(t * 0.8 + i) * 0.15})`
          : "rgba(15,25,40,0.7)";
        ctx.fillRect(cx - ww / 2 - 8 * s, wy, ww, wh);
        ctx.fillRect(cx - ww / 2 + 8 * s, wy, ww, wh);
      }

      // Green/copper pyramidal roof cap (the distinctive green top)
      const roofH = 30 * s;
      const roofBaseW = halfW + 3 * s;
      const roofGrad = ctx.createLinearGradient(cx, topY - roofH, cx, topY);
      roofGrad.addColorStop(0, hovered ? "rgba(100,180,140,0.7)" : "rgba(70,140,110,0.5)");
      roofGrad.addColorStop(0.5, hovered ? "rgba(80,160,120,0.6)" : "rgba(55,120,90,0.4)");
      roofGrad.addColorStop(1, hovered ? "rgba(60,130,100,0.5)" : "rgba(40,100,75,0.35)");
      ctx.beginPath();
      ctx.moveTo(cx - roofBaseW, topY);
      ctx.lineTo(cx, topY - roofH);
      ctx.lineTo(cx + roofBaseW, topY);
      ctx.closePath();
      ctx.fillStyle = roofGrad;
      ctx.fill();
      ctx.strokeStyle = hovered ? "rgba(100,180,140,0.5)" : "rgba(70,140,110,0.2)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Spire/antenna on top
      ctx.beginPath();
      ctx.moveTo(cx, topY - roofH);
      ctx.lineTo(cx, topY - roofH - 12 * s);
      ctx.strokeStyle = hovered ? "rgba(180,200,220,0.6)" : "rgba(140,160,180,0.3)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Tower outline
      ctx.strokeStyle = hovered ? "rgba(61,139,156,0.5)" : "rgba(61,139,156,0.1)";
      ctx.lineWidth = hovered ? 1.5 : 0.5;
      ctx.strokeRect(cx - halfW, topY, bodyW, b.h);

      // Hover glow
      if (hovered) {
        ctx.shadowColor = "rgba(61,139,156,0.3)";
        ctx.shadowBlur = 20;
        ctx.strokeStyle = "rgba(61,139,156,0.3)";
        ctx.lineWidth = 1;
        ctx.strokeRect(cx - halfW - 2 * s, topY - roofH, bodyW + 4 * s, b.h + roofH);
        ctx.shadowBlur = 0;
      }
    };

    const drawBoat = (boat: Boat, t: number) => {
      const by = waterY + 8 * s + Math.sin(t * 1.5 + boat.phase) * 2 * s;
      const bx = boat.x;
      const sz = boat.size;

      ctx.save();
      ctx.translate(bx, by);

      // Hull
      ctx.beginPath();
      ctx.moveTo(-sz * 0.6, 0);
      ctx.lineTo(-sz * 0.4, sz * 0.25);
      ctx.lineTo(sz * 0.4, sz * 0.25);
      ctx.lineTo(sz * 0.6, 0);
      ctx.closePath();
      ctx.fillStyle = "rgba(40,65,95,0.8)";
      ctx.fill();
      ctx.strokeStyle = "rgba(61,139,156,0.3)";
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Mast
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -sz * 0.6);
      ctx.strokeStyle = "rgba(180,200,220,0.5)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Sail
      ctx.beginPath();
      ctx.moveTo(0, -sz * 0.55);
      ctx.lineTo(sz * 0.3, -sz * 0.15);
      ctx.lineTo(0, -sz * 0.05);
      ctx.closePath();
      ctx.fillStyle = "rgba(220,230,240,0.25)";
      ctx.fill();

      // Small light
      ctx.beginPath();
      ctx.arc(0, -sz * 0.6, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(245,217,138,${0.4 + Math.sin(t * 2 + boat.phase) * 0.2})`;
      ctx.fill();

      ctx.restore();
    };

    const drawPlane = (px: number, t: number) => {
      const py = H * 0.12 + Math.sin(t * 0.3) * 10 * s;
      ctx.save();
      ctx.translate(px, py);

      // Body
      ctx.fillStyle = "rgba(180,200,220,0.6)";
      ctx.beginPath();
      ctx.ellipse(0, 0, 20 * s, 4 * s, 0, 0, Math.PI * 2);
      ctx.fill();

      // Wings
      ctx.beginPath();
      ctx.moveTo(-5 * s, 0);
      ctx.lineTo(-2 * s, -14 * s);
      ctx.lineTo(3 * s, -14 * s);
      ctx.lineTo(2 * s, 0);
      ctx.closePath();
      ctx.fillStyle = "rgba(160,185,210,0.5)";
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-5 * s, 0);
      ctx.lineTo(-2 * s, 14 * s);
      ctx.lineTo(3 * s, 14 * s);
      ctx.lineTo(2 * s, 0);
      ctx.closePath();
      ctx.fill();

      // Tail
      ctx.beginPath();
      ctx.moveTo(-18 * s, 0);
      ctx.lineTo(-22 * s, -6 * s);
      ctx.lineTo(-16 * s, -6 * s);
      ctx.lineTo(-15 * s, 0);
      ctx.closePath();
      ctx.fillStyle = "rgba(160,185,210,0.4)";
      ctx.fill();

      // Blinking light
      ctx.beginPath();
      ctx.arc(20 * s, 0, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,80,80,${Math.sin(t * 4) > 0 ? 0.8 : 0.1})`;
      ctx.fill();

      // Contrail
      ctx.beginPath();
      ctx.moveTo(-20 * s, -2 * s);
      ctx.lineTo(-80 * s, -2 * s);
      ctx.strokeStyle = "rgba(200,215,235,0.08)";
      ctx.lineWidth = 3 * s;
      ctx.stroke();

      ctx.restore();
    };

    // --- MAIN DRAW ---
    let animId: number;
    const draw = () => {
      timeRef.current += 0.016;
      const t = timeRef.current;
      ctx.clearRect(0, 0, W, H);

      // Sky
      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, "#060e1a");
      sky.addColorStop(0.4, "#0d1b2e");
      sky.addColorStop(0.7, "#132640");
      sky.addColorStop(1, "#1a2744");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);

      // Stars
      for (let i = 0; i < 35; i++) {
        const sx = (i * 137.5) % W;
        const sy = (i * 73.3) % (H * 0.45);
        ctx.beginPath();
        ctx.arc(sx, sy, 1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,220,255,${0.3 + Math.sin(t * 1.5 + i * 0.7) * 0.3})`;
        ctx.fill();
      }

      // Airplane (flies across slowly)
      planeX += 0.6 * s;
      if (planeX > W + 200) planeX = -200;
      drawPlane(planeX, t);

      // Ground (land strip)
      ctx.fillStyle = "#0f1f34";
      ctx.fillRect(0, ground, W, waterY - ground);

      // Ground line
      ctx.beginPath();
      ctx.moveTo(0, ground);
      ctx.lineTo(W, ground);
      ctx.strokeStyle = "rgba(61,139,156,0.15)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Westeinderplassen (water area below ground)
      const waterGrad = ctx.createLinearGradient(0, waterY, 0, H);
      waterGrad.addColorStop(0, "rgba(15,40,70,0.9)");
      waterGrad.addColorStop(0.3, "rgba(20,50,85,0.8)");
      waterGrad.addColorStop(1, "rgba(10,30,55,0.95)");
      ctx.fillStyle = waterGrad;
      ctx.fillRect(0, waterY, W, H - waterY);

      // Water edge line
      ctx.beginPath();
      ctx.moveTo(0, waterY);
      ctx.lineTo(W, waterY);
      ctx.strokeStyle = "rgba(61,139,156,0.2)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Water ripples
      for (let i = 0; i < 12; i++) {
        const rx = (i * W / 12 + t * 15 * s) % W;
        const ry = waterY + 5 * s + (i % 3) * 12 * s;
        ctx.beginPath();
        ctx.moveTo(rx - 15 * s, ry);
        ctx.quadraticCurveTo(rx, ry - 2 * s * Math.sin(t * 2 + i), rx + 15 * s, ry);
        ctx.strokeStyle = `rgba(61,139,156,${0.06 + Math.sin(t + i) * 0.03})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Water label on hover
      const mx = mouseRef.current.x, my = mouseRef.current.y;
      let hoveredRoute: string | null = null;
      const waterHovered = my > waterY && my < H && mx > 0;
      if (waterHovered) hoveredRoute = "Westeinderplassen";

      // "Westeinderplassen" subtle label
      ctx.fillStyle = "rgba(61,139,156,0.12)";
      ctx.font = `${10 * s}px Inter, sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText("Westeinderplassen", W * 0.5, waterY + 30 * s);
      ctx.textAlign = "start";

      // Route lines (on land)
      const routeY1 = ground + 8 * s;
      const routeY2 = ground + 14 * s;
      for (const [ry, label] of [[routeY1, "Fietsroute"], [routeY2, "Shuttle"]] as [number, string][]) {
        const near = my > ry - 6 && my < ry + 6 && mx > 0 && my < waterY;
        if (near) hoveredRoute = label;
        ctx.beginPath();
        ctx.setLineDash(near ? [8, 4] : [4, 8]);
        ctx.moveTo(0, ry);
        ctx.lineTo(W, ry);
        ctx.strokeStyle = near ? "rgba(61,139,156,0.5)" : "rgba(61,139,156,0.08)";
        ctx.lineWidth = near ? 1.5 : 0.8;
        ctx.stroke();
        ctx.setLineDash([]);
        for (let d = 0; d < 6; d++) {
          const dx = (t * 50 * s + d * W / 6) % W;
          ctx.beginPath();
          ctx.arc(dx, ry, near ? 1.8 : 1, 0, Math.PI * 2);
          ctx.fillStyle = near ? "rgba(61,139,156,0.6)" : "rgba(61,139,156,0.15)";
          ctx.fill();
        }
      }

      // Buildings
      let hoveredBuilding: Building | null = null;
      for (const b of buildings) {
        const bx = b.x;
        const by = ground - b.h;
        const bHitTop = b.type === "watertoren" ? by - 15 * s : by;
        const hovered = mx >= bx - (b.type === "watertoren" ? 10 * s : 0) &&
          mx <= bx + b.w + (b.type === "watertoren" ? 10 * s : 0) &&
          my >= bHitTop && my <= ground;
        if (hovered) hoveredBuilding = b;

        if (b.type === "watertoren") {
          drawWatertoren(b, hovered, t);
          continue;
        }

        const bGrad = ctx.createLinearGradient(bx, by, bx, ground);
        bGrad.addColorStop(0, hovered ? "#1e3a54" : "#132840");
        bGrad.addColorStop(1, hovered ? "#162d45" : "#0e2035");
        ctx.fillStyle = bGrad;

        if (b.type === "large") {
          ctx.beginPath();
          ctx.moveTo(bx, ground);
          ctx.lineTo(bx, by + 10 * s);
          ctx.quadraticCurveTo(bx, by, bx + 10 * s, by);
          ctx.lineTo(bx + b.w - 10 * s, by);
          ctx.quadraticCurveTo(bx + b.w, by, bx + b.w, by + 10 * s);
          ctx.lineTo(bx + b.w, ground);
          ctx.fill();
          ctx.strokeStyle = hovered ? "rgba(61,139,156,0.5)" : "rgba(61,139,156,0.12)";
          ctx.lineWidth = hovered ? 1.5 : 0.5;
          ctx.beginPath();
          ctx.moveTo(bx, ground);
          ctx.lineTo(bx, by + 10 * s);
          ctx.quadraticCurveTo(bx, by, bx + 10 * s, by);
          ctx.lineTo(bx + b.w - 10 * s, by);
          ctx.quadraticCurveTo(bx + b.w, by, bx + b.w, by + 10 * s);
          ctx.lineTo(bx + b.w, ground);
          ctx.stroke();
        } else {
          ctx.fillRect(bx, by, b.w, b.h);
          ctx.strokeStyle = hovered ? "rgba(61,139,156,0.5)" : "rgba(61,139,156,0.12)";
          ctx.lineWidth = hovered ? 1.5 : 0.5;
          ctx.strokeRect(bx, by, b.w, b.h);
          // Pointed roof
          const roofH = 16 * s;
          ctx.beginPath();
          ctx.moveTo(bx - 4 * s, by);
          ctx.lineTo(bx + b.w / 2, by - roofH);
          ctx.lineTo(bx + b.w + 4 * s, by);
          ctx.closePath();
          ctx.fillStyle = hovered ? "#1e3a54" : "#162d45";
          ctx.fill();
          ctx.strokeStyle = hovered ? "rgba(61,139,156,0.5)" : "rgba(61,139,156,0.15)";
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Windows
        const wRows = b.floors;
        const wCols = b.type === "large" ? 5 : 2;
        const ww = b.w * 0.14;
        const wh = b.h / (wRows + 1) * 0.45;
        const xPad = (b.w - wCols * ww) / (wCols + 1);
        const yPad = b.h / (wRows + 1);
        for (let r = 0; r < wRows; r++) {
          for (let c = 0; c < wCols; c++) {
            const wx = bx + xPad + c * (ww + xPad);
            const wy = by + yPad * (r + 0.5);
            const lit = Math.sin(t * 0.5 + r * 3 + c * 7 + b.x * 0.01) > -0.2;
            ctx.fillStyle = lit
              ? `rgba(245,217,138,${0.5 + Math.sin(t * 0.8 + r + c) * 0.2})`
              : "rgba(20,40,60,0.6)";
            ctx.fillRect(wx, wy, ww, wh);
          }
        }

        if (hovered) {
          ctx.shadowColor = "rgba(61,139,156,0.25)";
          ctx.shadowBlur = 15;
          ctx.strokeStyle = "rgba(61,139,156,0.35)";
          ctx.lineWidth = 1;
          ctx.strokeRect(bx, by, b.w, b.h);
          ctx.shadowBlur = 0;
        }
      }

      // Flowers
      for (const f of flowers) {
        const sway = Math.sin(t * 1.2 + f.phase) * 2 * s;
        const sz = f.size * (0.8 + Math.sin(t * 0.6 + f.phase) * 0.2);
        ctx.save();
        ctx.translate(f.x + sway, f.y);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-sway * 0.3, sz * 2.5);
        ctx.strokeStyle = "rgba(80,160,80,0.35)";
        ctx.lineWidth = 0.8;
        ctx.stroke();
        for (let p = 0; p < f.petals; p++) {
          const a = (Math.PI * 2 / f.petals) * p + t * 0.1 + f.phase;
          ctx.beginPath();
          ctx.ellipse(Math.cos(a) * sz * 0.5, Math.sin(a) * sz * 0.5, sz * 0.4, sz * 0.2, a, 0, Math.PI * 2);
          ctx.fillStyle = f.color + "0.55)";
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(0, 0, sz * 0.18, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,220,100,0.65)";
        ctx.fill();
        ctx.restore();
      }

      // Movers (on land)
      for (const m of movers) {
        m.x += m.speed;
        if (m.x > W + 30) m.x = -30;
        ctx.save();
        ctx.translate(m.x, m.y);
        if (m.type === "bike") {
          ctx.fillStyle = "rgba(200,215,235,0.5)";
          ctx.beginPath(); ctx.arc(0, -8 * s, 2.5 * s, 0, Math.PI * 2); ctx.fill();
          ctx.fillRect(-1.5 * s, -5.5 * s, 3 * s, 7 * s);
          ctx.strokeStyle = "rgba(61,139,156,0.4)"; ctx.lineWidth = 0.8;
          ctx.beginPath(); ctx.arc(-4 * s, 2 * s, 3 * s, 0, Math.PI * 2); ctx.stroke();
          ctx.beginPath(); ctx.arc(4 * s, 2 * s, 3 * s, 0, Math.PI * 2); ctx.stroke();
        } else if (m.type === "van") {
          ctx.fillStyle = "rgba(30,58,84,0.8)";
          ctx.fillRect(-12 * s, -10 * s, 24 * s, 12 * s);
          ctx.fillStyle = "rgba(61,139,156,0.25)";
          ctx.fillRect(-10 * s, -8 * s, 6 * s, 5 * s);
          ctx.fillStyle = "rgba(100,120,140,0.6)";
          ctx.beginPath(); ctx.arc(-6 * s, 3 * s, 2.5 * s, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(8 * s, 3 * s, 2.5 * s, 0, Math.PI * 2); ctx.fill();
        } else {
          ctx.fillStyle = "rgba(200,215,235,0.4)";
          ctx.beginPath(); ctx.arc(0, -8 * s, 2.5 * s, 0, Math.PI * 2); ctx.fill();
          ctx.fillRect(-1.5 * s, -5.5 * s, 3 * s, 8 * s);
          const leg = Math.sin(t * 4 + m.x * 0.05) * 0.3;
          ctx.save(); ctx.translate(0, 2.5 * s); ctx.rotate(leg);
          ctx.fillRect(-1 * s, 0, 1.5 * s, 5 * s); ctx.restore();
          ctx.save(); ctx.translate(0, 2.5 * s); ctx.rotate(-leg);
          ctx.fillRect(-0.5 * s, 0, 1.5 * s, 5 * s); ctx.restore();
        }
        ctx.restore();
      }

      // Boats on water
      for (const boat of boats) {
        boat.x += boat.speed;
        if (boat.x > W + 40) boat.x = -40;
        if (boat.x < -40) boat.x = W + 40;
        drawBoat(boat, t);
      }

      // Tooltip
      if (hoveredBuilding) {
        const bx = hoveredBuilding.x + hoveredBuilding.w / 2;
        const by = ground - hoveredBuilding.h - (hoveredBuilding.type === "watertoren" ? 30 * s : hoveredBuilding.type === "small" ? 22 * s : 15);
        onTooltip?.(hoveredBuilding.label, bx, by);
      } else if (hoveredRoute) {
        onTooltip?.(hoveredRoute, mx, my - 20);
      } else {
        onTooltip?.(null, 0, 0);
      }

      // Pollen particles
      for (let i = 0; i < 10; i++) {
        const px = (t * 6 + i * 97) % W;
        const py = ((i * 43 + Math.sin(t + i) * 15) % (ground - 30)) + 20;
        ctx.beginPath();
        ctx.arc(px, py, 0.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,220,120,${0.05 + Math.sin(t * 2 + i) * 0.03})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouse);
      canvas.removeEventListener("mouseleave", handleLeave);
    };
  }, [onTooltip]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ cursor: "crosshair" }}
    />
  );
};

export default REHeroAnimation;

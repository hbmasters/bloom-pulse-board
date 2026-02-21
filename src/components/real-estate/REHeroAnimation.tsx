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

    // --- DATA ---
    interface Building {
      x: number; w: number; h: number; floors: number;
      type: "small" | "large"; label: string;
    }
    interface Flower {
      x: number; y: number; size: number; color: string; phase: number;
      petals: number;
    }
    interface Mover {
      x: number; speed: number; type: "bike" | "van" | "walk"; y: number;
    }

    let W = 0, H = 0, ground = 0, s = 1;
    let buildings: Building[] = [];
    let flowers: Flower[] = [];
    let movers: Mover[] = [];

    const flowerColors = [
      "rgba(230,120,140,", // pink
      "rgba(240,180,60,",  // yellow
      "rgba(200,100,180,", // purple
      "rgba(255,140,100,", // coral
      "rgba(180,220,120,", // lime
      "rgba(120,180,220,", // blue
    ];

    const rebuild = () => {
      const rect = canvas.getBoundingClientRect();
      W = rect.width; H = rect.height;
      ground = H * 0.72;
      s = W / 1200;

      // Many small houses with pointed roofs + 2 larger buildings
      buildings = [
        { x: 60 * s, w: 50 * s, h: 70 * s, floors: 2, type: "small", label: "SNF gecertificeerd" },
        { x: 120 * s, w: 45 * s, h: 65 * s, floors: 2, type: "small", label: "Vergund" },
        { x: 180 * s, w: 50 * s, h: 75 * s, floors: 2, type: "small", label: "Periodiek geïnspecteerd" },
        { x: 250 * s, w: 48 * s, h: 68 * s, floors: 2, type: "small", label: "SNF gecertificeerd" },
        { x: 330 * s, w: 52 * s, h: 72 * s, floors: 2, type: "small", label: "Vergund" },
        // Large 1
        { x: 440 * s, w: 130 * s, h: 180 * s, floors: 5, type: "large", label: "SNF gecertificeerd" },
        // More small
        { x: 610 * s, w: 48 * s, h: 66 * s, floors: 2, type: "small", label: "Periodiek geïnspecteerd" },
        { x: 670 * s, w: 50 * s, h: 74 * s, floors: 2, type: "small", label: "Vergund" },
        { x: 730 * s, w: 46 * s, h: 62 * s, floors: 2, type: "small", label: "SNF gecertificeerd" },
        { x: 790 * s, w: 50 * s, h: 70 * s, floors: 2, type: "small", label: "Vergund" },
        // Large 2
        { x: 880 * s, w: 120 * s, h: 160 * s, floors: 4, type: "large", label: "Vergund" },
        // More small
        { x: 1040 * s, w: 48 * s, h: 68 * s, floors: 2, type: "small", label: "Periodiek geïnspecteerd" },
        { x: 1100 * s, w: 50 * s, h: 72 * s, floors: 2, type: "small", label: "SNF gecertificeerd" },
      ];

      // Flowers scattered around ground level and near buildings
      flowers = [];
      for (let i = 0; i < 50; i++) {
        flowers.push({
          x: Math.random() * W,
          y: ground + 5 + Math.random() * (H - ground - 20),
          size: (3 + Math.random() * 5) * s,
          color: flowerColors[Math.floor(Math.random() * flowerColors.length)],
          phase: Math.random() * Math.PI * 2,
          petals: 4 + Math.floor(Math.random() * 3),
        });
      }
      // Add flowers near buildings
      for (const b of buildings) {
        const count = b.type === "small" ? 3 : 5;
        for (let j = 0; j < count; j++) {
          flowers.push({
            x: b.x + Math.random() * b.w,
            y: ground + 2 + Math.random() * 15 * s,
            size: (2 + Math.random() * 4) * s,
            color: flowerColors[Math.floor(Math.random() * flowerColors.length)],
            phase: Math.random() * Math.PI * 2,
            petals: 5,
          });
        }
      }

      movers = [
        { x: Math.random() * W, speed: 0.8 * s, type: "bike", y: ground + 25 * s },
        { x: Math.random() * W, speed: 0.6 * s, type: "walk", y: ground + 18 * s },
        { x: Math.random() * W, speed: 1.3 * s, type: "van", y: ground + 35 * s },
        { x: Math.random() * W, speed: 0.9 * s, type: "bike", y: ground + 28 * s },
        { x: Math.random() * W, speed: 0.7 * s, type: "walk", y: ground + 16 * s },
      ];
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

    let animId: number;
    const draw = () => {
      timeRef.current += 0.016;
      const t = timeRef.current;
      ctx.clearRect(0, 0, W, H);

      // Sky
      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, "#060e1a");
      sky.addColorStop(0.5, "#0d1b2e");
      sky.addColorStop(1, "#1a2744");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);

      // Stars
      for (let i = 0; i < 35; i++) {
        const sx = (i * 137.5) % W;
        const sy = (i * 73.3) % (H * 0.5);
        const tw = 0.3 + Math.sin(t * 1.5 + i * 0.7) * 0.3;
        ctx.beginPath();
        ctx.arc(sx, sy, 1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,220,255,${tw})`;
        ctx.fill();
      }

      // Ground
      ctx.fillStyle = "#0f1f34";
      ctx.fillRect(0, ground, W, H - ground);
      ctx.beginPath();
      ctx.moveTo(0, ground);
      ctx.lineTo(W, ground);
      ctx.strokeStyle = "rgba(61,139,156,0.15)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Route lines
      const routeY1 = ground + 26 * s;
      const routeY2 = ground + 36 * s;
      const mx = mouseRef.current.x, my = mouseRef.current.y;
      let hoveredRoute: string | null = null;

      for (const [ry, label] of [[routeY1, "Fietsroute"], [routeY2, "Shuttle"]] as [number, string][]) {
        const near = my > ry - 8 && my < ry + 8 && mx > 0;
        if (near) hoveredRoute = label;
        ctx.beginPath();
        ctx.setLineDash(near ? [8, 4] : [4, 8]);
        ctx.moveTo(0, ry);
        ctx.lineTo(W, ry);
        ctx.strokeStyle = near ? "rgba(61,139,156,0.5)" : "rgba(61,139,156,0.1)";
        ctx.lineWidth = near ? 2 : 1;
        ctx.stroke();
        ctx.setLineDash([]);
        // Flow dots
        for (let d = 0; d < 6; d++) {
          const dx = (t * 50 * s + d * W / 6) % W;
          ctx.beginPath();
          ctx.arc(dx, ry, near ? 2 : 1.2, 0, Math.PI * 2);
          ctx.fillStyle = near ? "rgba(61,139,156,0.7)" : "rgba(61,139,156,0.2)";
          ctx.fill();
        }
      }

      // Buildings
      let hoveredBuilding: Building | null = null;
      for (const b of buildings) {
        const bx = b.x;
        const by = ground - b.h;
        const hovered = mx >= bx && mx <= bx + b.w && my >= by && my <= ground;
        if (hovered) hoveredBuilding = b;

        // Body
        const bGrad = ctx.createLinearGradient(bx, by, bx, ground);
        bGrad.addColorStop(0, hovered ? "#1e3a54" : "#132840");
        bGrad.addColorStop(1, hovered ? "#162d45" : "#0e2035");
        ctx.fillStyle = bGrad;

        if (b.type === "large") {
          // Rounded top for large buildings
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
          // Small house with body
          ctx.fillRect(bx, by, b.w, b.h);
          ctx.strokeStyle = hovered ? "rgba(61,139,156,0.5)" : "rgba(61,139,156,0.12)";
          ctx.lineWidth = hovered ? 1.5 : 0.5;
          ctx.strokeRect(bx, by, b.w, b.h);

          // Pointed roof (triangle)
          const roofH = 18 * s;
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
            if (lit) {
              ctx.fillStyle = "rgba(245,217,138,0.06)";
              ctx.fillRect(wx - 2, wy - 2, ww + 4, wh + 6);
            }
          }
        }

        // Hover glow
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
        const blooming = 0.8 + Math.sin(t * 0.6 + f.phase) * 0.2;
        const sz = f.size * blooming;

        ctx.save();
        ctx.translate(f.x + sway, f.y);

        // Stem
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-sway * 0.3, sz * 2.5);
        ctx.strokeStyle = "rgba(80,160,80,0.4)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Petals
        for (let p = 0; p < f.petals; p++) {
          const angle = (Math.PI * 2 / f.petals) * p + t * 0.1 + f.phase;
          ctx.beginPath();
          ctx.ellipse(
            Math.cos(angle) * sz * 0.5,
            Math.sin(angle) * sz * 0.5,
            sz * 0.4, sz * 0.2,
            angle, 0, Math.PI * 2
          );
          ctx.fillStyle = f.color + "0.6)";
          ctx.fill();
        }

        // Center
        ctx.beginPath();
        ctx.arc(0, 0, sz * 0.2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,220,100,0.7)";
        ctx.fill();

        ctx.restore();
      }

      // Movers
      for (const m of movers) {
        m.x += m.speed;
        if (m.x > W + 30) m.x = -30;

        ctx.save();
        ctx.translate(m.x, m.y);

        if (m.type === "bike") {
          ctx.fillStyle = "rgba(200,215,235,0.5)";
          ctx.beginPath();
          ctx.arc(0, -8 * s, 2.5 * s, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillRect(-1.5 * s, -5.5 * s, 3 * s, 7 * s);
          ctx.strokeStyle = "rgba(61,139,156,0.4)";
          ctx.lineWidth = 0.8;
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
          ctx.beginPath();
          ctx.arc(0, -8 * s, 2.5 * s, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillRect(-1.5 * s, -5.5 * s, 3 * s, 8 * s);
          const leg = Math.sin(t * 4 + m.x * 0.05) * 0.3;
          ctx.save(); ctx.translate(0, 2.5 * s); ctx.rotate(leg);
          ctx.fillRect(-1 * s, 0, 1.5 * s, 5 * s); ctx.restore();
          ctx.save(); ctx.translate(0, 2.5 * s); ctx.rotate(-leg);
          ctx.fillRect(-0.5 * s, 0, 1.5 * s, 5 * s); ctx.restore();
        }
        ctx.restore();
      }

      // Tooltip
      if (hoveredBuilding) {
        const bx = hoveredBuilding.x + hoveredBuilding.w / 2;
        const by = ground - hoveredBuilding.h - (hoveredBuilding.type === "small" ? 25 * s : 15);
        onTooltip?.(hoveredBuilding.label, bx, by);
      } else if (hoveredRoute) {
        onTooltip?.(hoveredRoute, mx, my - 20);
      } else {
        onTooltip?.(null, 0, 0);
      }

      // Floating pollen particles
      for (let i = 0; i < 12; i++) {
        const px = (t * 6 + i * 97) % W;
        const py = ((i * 43 + Math.sin(t + i) * 15) % (ground - 30)) + 20;
        ctx.beginPath();
        ctx.arc(px, py, 0.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,220,120,${0.06 + Math.sin(t * 2 + i) * 0.03})`;
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

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
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    // Colors
    const navy = "#0d1b2e";
    const teal = "#3d8b9c";
    const tealDim = "rgba(61,139,156,0.15)";
    const warm = "#e8c87a";
    const windowGlow = "#f5d98a";

    // Building definitions
    interface Building {
      x: number; w: number; h: number; floors: number; type: "row" | "apartment" | "hotel";
      label: string; hoverable: boolean;
    }

    const getBuildings = (W: number, H: number): Building[] => {
      const ground = H * 0.72;
      const s = W / 1200;
      return [
        { x: 80 * s, w: 70 * s, h: 120 * s, floors: 3, type: "row", label: "SNF gecertificeerd", hoverable: true },
        { x: 160 * s, w: 70 * s, h: 110 * s, floors: 3, type: "row", label: "Vergund", hoverable: true },
        { x: 240 * s, w: 70 * s, h: 130 * s, floors: 3, type: "row", label: "Periodiek geïnspecteerd", hoverable: true },
        { x: 400 * s, w: 140 * s, h: 200 * s, floors: 6, type: "hotel", label: "SNF gecertificeerd", hoverable: true },
        { x: 620 * s, w: 70 * s, h: 115 * s, floors: 3, type: "row", label: "Vergund", hoverable: true },
        { x: 700 * s, w: 70 * s, h: 125 * s, floors: 3, type: "row", label: "Periodiek geïnspecteerd", hoverable: true },
        { x: 850 * s, w: 120 * s, h: 170 * s, floors: 5, type: "apartment", label: "Vergund", hoverable: true },
        { x: 1020 * s, w: 70 * s, h: 105 * s, floors: 3, type: "row", label: "SNF gecertificeerd", hoverable: true },
        { x: 1100 * s, w: 70 * s, h: 115 * s, floors: 3, type: "row", label: "Vergund", hoverable: true },
      ];
    };

    // Moving entities
    interface Mover {
      x: number; speed: number; type: "bike" | "van" | "walk"; y: number;
      routeLabel: string;
    }

    const getMovers = (W: number, H: number): Mover[] => {
      const ground = H * 0.72;
      const s = W / 1200;
      return [
        { x: Math.random() * W, speed: 0.8 * s, type: "bike", y: ground + 28 * s, routeLabel: "Fietsroute" },
        { x: Math.random() * W, speed: 0.6 * s, type: "walk", y: ground + 22 * s, routeLabel: "Looproute" },
        { x: Math.random() * W, speed: 1.4 * s, type: "van", y: ground + 38 * s, routeLabel: "Shuttle" },
        { x: Math.random() * W, speed: 0.9 * s, type: "bike", y: ground + 30 * s, routeLabel: "Fietsroute" },
        { x: Math.random() * W, speed: 1.2 * s, type: "van", y: ground + 42 * s, routeLabel: "Shuttle" },
        { x: Math.random() * W, speed: 0.7 * s, type: "walk", y: ground + 20 * s, routeLabel: "Looproute" },
      ];
    };

    let W = canvas.getBoundingClientRect().width;
    let H = canvas.getBoundingClientRect().height;
    let buildings = getBuildings(W, H);
    let movers = getMovers(W, H);

    // Route paths
    interface RouteSeg { x1: number; y1: number; x2: number; y2: number; label: string; }

    const getRoutes = (W: number, H: number): RouteSeg[] => {
      const ground = H * 0.72;
      const s = W / 1200;
      return [
        { x1: 0, y1: ground + 30 * s, x2: W, y2: ground + 30 * s, label: "Fietsroute" },
        { x1: 0, y1: ground + 40 * s, x2: W, y2: ground + 40 * s, label: "Shuttle" },
      ];
    };
    let routes = getRoutes(W, H);

    const handleResize = () => {
      resize();
      W = canvas.getBoundingClientRect().width;
      H = canvas.getBoundingClientRect().height;
      buildings = getBuildings(W, H);
      movers = getMovers(W, H);
      routes = getRoutes(W, H);
    };

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

    let animId: number;
    const draw = () => {
      timeRef.current += 0.016;
      const t = timeRef.current;
      const s = W / 1200;
      const ground = H * 0.72;

      ctx.clearRect(0, 0, W, H);

      // Sky gradient
      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, "#060e1a");
      sky.addColorStop(0.5, "#0d1b2e");
      sky.addColorStop(0.85, "#152238");
      sky.addColorStop(1, "#1a2744");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);

      // Stars
      for (let i = 0; i < 40; i++) {
        const sx = ((i * 137.5) % W);
        const sy = ((i * 73.3) % (H * 0.5));
        const twinkle = 0.3 + Math.sin(t * 1.5 + i * 0.7) * 0.3;
        ctx.beginPath();
        ctx.arc(sx, sy, 1 + (i % 3) * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,220,255,${twinkle})`;
        ctx.fill();
      }

      // Ground plane
      ctx.fillStyle = "#0f1f34";
      ctx.fillRect(0, ground, W, H - ground);

      // Ground line
      ctx.beginPath();
      ctx.moveTo(0, ground);
      ctx.lineTo(W, ground);
      ctx.strokeStyle = "rgba(61,139,156,0.2)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Route lines (dashed)
      let hoveredRoute: string | null = null;
      for (const r of routes) {
        const mx = mouseRef.current.x;
        const my = mouseRef.current.y;
        const near = my > r.y1 - 8 && my < r.y1 + 8 && mx > 0;
        if (near) hoveredRoute = r.label;

        ctx.beginPath();
        ctx.setLineDash(near ? [8, 4] : [4, 8]);
        ctx.moveTo(r.x1, r.y1);
        ctx.lineTo(r.x2, r.y2);
        ctx.strokeStyle = near ? "rgba(61,139,156,0.6)" : "rgba(61,139,156,0.12)";
        ctx.lineWidth = near ? 2 : 1;
        ctx.stroke();
        ctx.setLineDash([]);

        // Flowing dots
        for (let d = 0; d < 8; d++) {
          const dotX = ((t * 60 * s + d * W / 8) % W);
          ctx.beginPath();
          ctx.arc(dotX, r.y1, near ? 2.5 : 1.5, 0, Math.PI * 2);
          ctx.fillStyle = near ? "rgba(61,139,156,0.8)" : "rgba(61,139,156,0.25)";
          ctx.fill();
        }
      }

      // Buildings
      let hoveredBuilding: Building | null = null;
      for (const b of buildings) {
        const bx = b.x;
        const by = ground - b.h;
        const mx = mouseRef.current.x;
        const my = mouseRef.current.y;
        const hovered = mx >= bx && mx <= bx + b.w && my >= by && my <= ground;
        if (hovered && b.hoverable) hoveredBuilding = b;

        // Building body
        const bGrad = ctx.createLinearGradient(bx, by, bx, ground);
        bGrad.addColorStop(0, hovered ? "#1e3a54" : "#132840");
        bGrad.addColorStop(1, hovered ? "#162d45" : "#0e2035");
        ctx.fillStyle = bGrad;

        // Rounded top for hotel
        if (b.type === "hotel") {
          ctx.beginPath();
          ctx.moveTo(bx, ground);
          ctx.lineTo(bx, by + 10 * s);
          ctx.quadraticCurveTo(bx, by, bx + 10 * s, by);
          ctx.lineTo(bx + b.w - 10 * s, by);
          ctx.quadraticCurveTo(bx + b.w, by, bx + b.w, by + 10 * s);
          ctx.lineTo(bx + b.w, ground);
          ctx.fill();
        } else {
          ctx.fillRect(bx, by, b.w, b.h);
        }

        // Outline
        ctx.strokeStyle = hovered ? "rgba(61,139,156,0.6)" : "rgba(61,139,156,0.15)";
        ctx.lineWidth = hovered ? 1.5 : 0.5;
        if (b.type === "hotel") {
          ctx.beginPath();
          ctx.moveTo(bx, ground);
          ctx.lineTo(bx, by + 10 * s);
          ctx.quadraticCurveTo(bx, by, bx + 10 * s, by);
          ctx.lineTo(bx + b.w - 10 * s, by);
          ctx.quadraticCurveTo(bx + b.w, by, bx + b.w, by + 10 * s);
          ctx.lineTo(bx + b.w, ground);
          ctx.stroke();
        } else {
          ctx.strokeRect(bx, by, b.w, b.h);
        }

        // Windows
        const wRows = b.floors;
        const wCols = b.type === "hotel" ? 5 : b.type === "apartment" ? 4 : 3;
        const ww = b.w * 0.12;
        const wh = b.h / (wRows + 1) * 0.5;
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
              ctx.fillStyle = `rgba(245,217,138,${0.08})`;
              ctx.fillRect(wx - 2, wy - 2, ww + 4, wh + 8);
            }
          }
        }

        // Roof accent
        if (b.type !== "hotel") {
          ctx.beginPath();
          ctx.moveTo(bx - 2 * s, by);
          ctx.lineTo(bx + b.w / 2, by - 8 * s);
          ctx.lineTo(bx + b.w + 2 * s, by);
          ctx.strokeStyle = hovered ? "rgba(61,139,156,0.5)" : "rgba(61,139,156,0.12)";
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Hover glow
        if (hovered) {
          ctx.shadowColor = "rgba(61,139,156,0.3)";
          ctx.shadowBlur = 20;
          ctx.strokeStyle = "rgba(61,139,156,0.4)";
          ctx.lineWidth = 1;
          if (b.type === "hotel") {
            ctx.beginPath();
            ctx.moveTo(bx, ground);
            ctx.lineTo(bx, by + 10 * s);
            ctx.quadraticCurveTo(bx, by, bx + 10 * s, by);
            ctx.lineTo(bx + b.w - 10 * s, by);
            ctx.quadraticCurveTo(bx + b.w, by, bx + b.w, by + 10 * s);
            ctx.lineTo(bx + b.w, ground);
            ctx.stroke();
          } else {
            ctx.strokeRect(bx, by, b.w, b.h);
          }
          ctx.shadowBlur = 0;
        }
      }

      // Draw movers
      for (const m of movers) {
        m.x += m.speed;
        if (m.x > W + 30) m.x = -30;

        ctx.save();
        ctx.translate(m.x, m.y);

        if (m.type === "bike") {
          // Simple cyclist silhouette
          ctx.fillStyle = "rgba(200,215,235,0.6)";
          ctx.beginPath();
          ctx.arc(0, -10 * s, 3 * s, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillRect(-2 * s, -7 * s, 4 * s, 8 * s);
          // Wheels
          ctx.strokeStyle = "rgba(61,139,156,0.5)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(-5 * s, 2 * s, 4 * s, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(5 * s, 2 * s, 4 * s, 0, Math.PI * 2);
          ctx.stroke();
        } else if (m.type === "van") {
          // Simple van
          ctx.fillStyle = "rgba(30,58,84,0.9)";
          ctx.fillRect(-15 * s, -12 * s, 30 * s, 14 * s);
          ctx.fillStyle = "rgba(61,139,156,0.3)";
          ctx.fillRect(-13 * s, -10 * s, 8 * s, 6 * s);
          // Wheels
          ctx.fillStyle = "rgba(100,120,140,0.7)";
          ctx.beginPath();
          ctx.arc(-8 * s, 3 * s, 3 * s, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(10 * s, 3 * s, 3 * s, 0, Math.PI * 2);
          ctx.fill();
          // Headlight
          ctx.fillStyle = `rgba(245,217,138,${0.4 + Math.sin(t * 3) * 0.1})`;
          ctx.fillRect(14 * s, -6 * s, 3 * s, 3 * s);
        } else {
          // Walker silhouette
          ctx.fillStyle = "rgba(200,215,235,0.5)";
          ctx.beginPath();
          ctx.arc(0, -10 * s, 3 * s, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillRect(-1.5 * s, -7 * s, 3 * s, 10 * s);
          // Legs (animated)
          const legAngle = Math.sin(t * 4 + m.x * 0.05) * 0.3;
          ctx.save();
          ctx.translate(0, 3 * s);
          ctx.rotate(legAngle);
          ctx.fillRect(-1 * s, 0, 2 * s, 6 * s);
          ctx.restore();
          ctx.save();
          ctx.translate(0, 3 * s);
          ctx.rotate(-legAngle);
          ctx.fillRect(-1 * s, 0, 2 * s, 6 * s);
          ctx.restore();
        }
        ctx.restore();
      }

      // Tooltips via callback
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      if (hoveredBuilding) {
        const bx = hoveredBuilding.x + hoveredBuilding.w / 2;
        const by = ground - hoveredBuilding.h - 15;
        onTooltip?.(hoveredBuilding.label, bx, by);
      } else if (hoveredRoute) {
        onTooltip?.(hoveredRoute, mx, my - 20);
      } else {
        onTooltip?.(null, 0, 0);
      }

      // Ambient particles
      for (let i = 0; i < 15; i++) {
        const px = ((t * 8 + i * 97) % W);
        const py = ((i * 43 + Math.sin(t + i) * 20) % (ground - 40)) + 20;
        ctx.beginPath();
        ctx.arc(px, py, 0.8 + Math.sin(t + i) * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(61,139,156,${0.08 + Math.sin(t * 2 + i) * 0.04})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
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

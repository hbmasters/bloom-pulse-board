import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import type { WidgetStatus } from "./types";

interface FloatingPetal {
  x: number; y: number; vx: number; vy: number;
  size: number; opacity: number; life: number; maxLife: number;
  rotation: number; rotSpeed: number;
  type: "petal" | "leaf" | "dot";
  color: string;
}

interface WidgetFABProps {
  onClick: () => void;
  isOpen: boolean;
  status: WidgetStatus;
  accentHsl: string;
}

const WidgetFAB = ({ onClick, isOpen, status, accentHsl }: WidgetFABProps) => {
  const [hovered, setHovered] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const petalsRef = useRef<FloatingPetal[]>([]);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);

  const statusColor = status === "online" ? "hsl(155 55% 42%)" : status === "busy" ? "hsl(40 90% 50%)" : "hsl(0 60% 50%)";

  const spawnPetal = useCallback((): FloatingPetal => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.3 + Math.random() * 0.6;
    const types: FloatingPetal["type"][] = ["petal", "petal", "leaf", "dot"];
    const colors = [
      `hsla(340, 60%, 70%,`,  // pink
      `hsla(${accentHsl},`,    // accent
      `hsla(155, 50%, 55%,`,   // green
      `hsla(45, 70%, 65%,`,    // yellow
      `hsla(280, 40%, 65%,`,   // lavender
      `hsla(15, 60%, 65%,`,    // coral
    ];
    return {
      x: 40, y: 40,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 0.3,
      size: 3 + Math.random() * 5,
      opacity: 0.7 + Math.random() * 0.3,
      life: 0,
      maxLife: 60 + Math.random() * 50,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.08,
      type: types[Math.floor(Math.random() * types.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
    };
  }, [accentHsl]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const S = 80;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = S * dpr;
    canvas.height = S * dpr;
    ctx.scale(dpr, dpr);

    const draw = () => {
      timeRef.current += 0.016;
      ctx.clearRect(0, 0, S, S);

      // Spawn petals periodically (more when hovered)
      if (!isOpen && status === "online") {
        const spawnRate = hovered ? 0.3 : 0.08;
        if (Math.random() < spawnRate) {
          petalsRef.current.push(spawnPetal());
        }
      }

      // Update & draw petals
      petalsRef.current = petalsRef.current.filter(p => p.life < p.maxLife);
      for (const p of petalsRef.current) {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.003; // slight float up
        p.vx *= 0.995;
        p.rotation += p.rotSpeed;

        const fadeIn = Math.min(p.life / 8, 1);
        const fadeOut = Math.max(0, 1 - (p.life - p.maxLife + 20) / 20);
        const alpha = p.opacity * fadeIn * fadeOut;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = alpha;

        if (p.type === "petal") {
          // Flower petal shape
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 0.5, p.size, 0, 0, Math.PI * 2);
          ctx.fillStyle = p.color + `${alpha})`;
          ctx.fill();
          // Vein
          ctx.beginPath();
          ctx.moveTo(0, -p.size * 0.7);
          ctx.lineTo(0, p.size * 0.7);
          ctx.strokeStyle = p.color + `${alpha * 0.3})`;
          ctx.lineWidth = 0.3;
          ctx.stroke();
        } else if (p.type === "leaf") {
          // Small leaf
          ctx.beginPath();
          ctx.moveTo(0, -p.size * 0.6);
          ctx.bezierCurveTo(p.size * 0.5, -p.size * 0.2, p.size * 0.4, p.size * 0.3, 0, p.size * 0.6);
          ctx.bezierCurveTo(-p.size * 0.4, p.size * 0.3, -p.size * 0.5, -p.size * 0.2, 0, -p.size * 0.6);
          ctx.fillStyle = `hsla(155, 50%, 50%, ${alpha})`;
          ctx.fill();
        } else {
          // Dot / pollen
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.25, 0, Math.PI * 2);
          ctx.fillStyle = p.color + `${alpha})`;
          ctx.fill();
        }

        ctx.restore();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [isOpen, status, hovered, spawnPetal]);

  return (
    <div className="relative">
      {/* Flower particle canvas — positioned behind & around the button */}
      <canvas
        ref={canvasRef}
        className="absolute pointer-events-none"
        style={{ width: 80, height: 80, top: -10, left: -10 }}
      />

      <button
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label={isOpen ? "Sluit HBMaster" : "Open HBMaster"}
        className={cn(
          "relative w-14 h-14 rounded-full flex items-center justify-center",
          "transition-all duration-250 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "shadow-lg hover:shadow-xl",
          isOpen && "rotate-45"
        )}
        style={{
          background: `hsl(${accentHsl})`,
          boxShadow: hovered
            ? `0 0 32px -4px hsl(${accentHsl} / 0.5), 0 8px 24px -8px hsl(${accentHsl} / 0.3)`
            : `0 4px 16px -4px hsl(${accentHsl} / 0.3)`,
        }}
      >
        {/* Halo pulse — kept */}
        {status === "online" && !isOpen && (
          <span
            className="absolute inset-0 rounded-full animate-ping opacity-20"
            style={{ background: `hsl(${accentHsl})`, animationDuration: "3s" }}
          />
        )}

        {/* Icon */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-primary-foreground transition-transform duration-250">
          {isOpen ? (
            <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          ) : (
            <>
              <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
              <path d="M12 9V6M12 18V15M15 12H18M6 12H9" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
            </>
          )}
        </svg>

        {/* Status dot */}
        <span
          className={cn("absolute top-0.5 right-0.5 w-3 h-3 rounded-full border-2 border-background", status === "online" && "animate-pulse")}
          style={{ background: statusColor, animationDuration: "2s" }}
        />
      </button>
    </div>
  );
};

export default WidgetFAB;

import { useEffect, useRef } from "react";

interface MiniHologramProps {
  state: "idle" | "speaking";
  accentHsl: string;
  size?: number;
}

const MiniHologram = ({ state, accentHsl, size = 120 }: MiniHologramProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);
    const cx = size / 2;
    const cy = size / 2;

    let animId: number;
    const draw = () => {
      timeRef.current += 0.016;
      const t = timeRef.current;
      ctx.clearRect(0, 0, size, size);

      const isSpeaking = state === "speaking";
      const pulse = isSpeaking
        ? 0.7 + Math.sin(t * 3) * 0.3
        : 0.35 + Math.sin(t * 0.8) * 0.15;

      // Outer ring
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 0.15 * (isSpeaking ? 2.5 : 1));
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.42, 0, Math.PI * 1.4);
      ctx.strokeStyle = `hsla(${accentHsl}, ${0.12 + pulse * 0.15})`;
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // Inner ring — counter-rotate
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-t * 0.2 * (isSpeaking ? 2 : 1));
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.3, 0.3, Math.PI * 1.7);
      ctx.strokeStyle = `hsla(${accentHsl}, ${0.08 + pulse * 0.1})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
      ctx.restore();

      // Hexagon
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 0.1);
      const hexR = size * 0.22 + Math.sin(t * 1.5) * 2;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i - Math.PI / 6;
        if (i === 0) ctx.moveTo(Math.cos(a) * hexR, Math.sin(a) * hexR);
        else ctx.lineTo(Math.cos(a) * hexR, Math.sin(a) * hexR);
      }
      ctx.closePath();
      ctx.strokeStyle = `hsla(${accentHsl}, ${0.25 + pulse * 0.2})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.fillStyle = `hsla(${accentHsl}, ${0.03 + pulse * 0.03})`;
      ctx.fill();
      ctx.restore();

      // Core glow
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.25);
      grad.addColorStop(0, `hsla(${accentHsl}, ${0.15 * pulse})`);
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.25, 0, Math.PI * 2);
      ctx.fill();

      // Voice bars (when speaking)
      if (isSpeaking) {
        const barCount = 12;
        const barW = 2;
        const totalW = barCount * (barW + 1.5);
        const baseY = cy + 4;
        for (let i = 0; i < barCount; i++) {
          const x = cx - totalW / 2 + i * (barW + 1.5);
          const freq = Math.sin(t * 10 + i * 0.5) * 0.5 + 0.5;
          const env = Math.sin((i / barCount) * Math.PI);
          const h = 10 * freq * env;
          ctx.fillStyle = `hsla(${accentHsl}, ${0.4 + freq * 0.3})`;
          ctx.beginPath();
          ctx.roundRect(x, baseY - h, barW, h * 2, 1);
          ctx.fill();
        }
      }

      // Center dot
      ctx.beginPath();
      ctx.arc(cx, cy - (isSpeaking ? 8 : 0), 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${accentHsl}, ${0.5 + pulse * 0.3})`;
      ctx.fill();

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, [state, accentHsl, size]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size }}
      className="pointer-events-none"
    />
  );
};

export default MiniHologram;

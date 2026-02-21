import { useEffect, useRef } from "react";

interface HexAvatarProps {
  accentHsl: string;
  size?: number;
  animate?: boolean;
}

/**
 * Small hexagonal HBMaster avatar with animated inner rings.
 * Used in chat header and message bubbles.
 */
const HexAvatar = ({ accentHsl, size = 32, animate = true }: HexAvatarProps) => {
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

      const pulse = 0.5 + Math.sin(t * 1.2) * 0.2;
      const s = size;

      // Background hexagon fill
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i - Math.PI / 6;
        const r = s * 0.46;
        if (i === 0) ctx.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
        else ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
      }
      ctx.closePath();
      ctx.fillStyle = `hsla(${accentHsl}, ${0.12 + pulse * 0.06})`;
      ctx.fill();
      ctx.strokeStyle = `hsla(${accentHsl}, ${0.3 + pulse * 0.2})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Inner rotating hexagon
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 0.15);
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i;
        const r = s * 0.28;
        if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
        else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      ctx.closePath();
      ctx.strokeStyle = `hsla(${accentHsl}, ${0.2 + pulse * 0.15})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Inner counter-rotating hex
      ctx.rotate(-t * 0.3);
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i + Math.PI / 6;
        const r = s * 0.16;
        if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
        else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      ctx.closePath();
      ctx.strokeStyle = `hsla(${accentHsl}, ${0.15 + pulse * 0.1})`;
      ctx.lineWidth = 0.6;
      ctx.stroke();
      ctx.restore();

      // Center dot
      ctx.beginPath();
      ctx.arc(cx, cy, s * 0.06, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${accentHsl}, ${0.5 + pulse * 0.3})`;
      ctx.fill();

      // Core glow
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, s * 0.3);
      grad.addColorStop(0, `hsla(${accentHsl}, ${0.08 * pulse})`);
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, s * 0.3, 0, Math.PI * 2);
      ctx.fill();

      // Subtle rotating arc segments
      for (let i = 0; i < 3; i++) {
        const r = s * (0.34 + i * 0.04);
        const rot = t * (0.2 + i * 0.1) * (i % 2 === 0 ? 1 : -1);
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rot);
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 0.6);
        ctx.strokeStyle = `hsla(${accentHsl}, ${0.08 + pulse * 0.06})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.restore();
      }

      if (animate) {
        animId = requestAnimationFrame(draw);
      }
    };

    draw();
    return () => { if (animId) cancelAnimationFrame(animId); };
  }, [accentHsl, size, animate]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size }}
      className="shrink-0"
    />
  );
};

export default HexAvatar;

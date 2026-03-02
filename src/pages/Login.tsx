import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, User, Eye, EyeOff, LogIn } from "lucide-react";
import HBMasterLogo from "@/components/mission-control/HBMasterLogo";
import { useToast } from "@/hooks/use-toast";

/* ── Mini hologram ring SVG ── */
function HoloRing({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" className={className}>
      <circle cx="100" cy="100" r="90" stroke="hsl(228 50% 55%)" strokeWidth="0.6" opacity="0.25">
        <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="30s" repeatCount="indefinite" />
      </circle>
      <circle cx="100" cy="100" r="70" stroke="hsl(228 60% 62%)" strokeWidth="0.4" opacity="0.18">
        <animateTransform attributeName="transform" type="rotate" from="360 100 100" to="0 100 100" dur="22s" repeatCount="indefinite" />
      </circle>
      <circle cx="100" cy="100" r="50" stroke="hsl(155 55% 42%)" strokeWidth="0.5" opacity="0.2">
        <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="15s" repeatCount="indefinite" />
      </circle>
      {/* Hex shape */}
      <polygon
        points="100,20 169,55 169,125 100,160 31,125 31,55"
        stroke="hsl(228 50% 55%)"
        strokeWidth="0.5"
        fill="none"
        opacity="0.15"
      >
        <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="40s" repeatCount="indefinite" />
      </polygon>
      {/* Orbiting dots */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <circle key={i} cx="100" cy="100" r="2" fill="hsl(228 50% 65%)" opacity="0.4">
          <animateMotion
            dur={`${8 + i * 2}s`}
            repeatCount="indefinite"
            path={`M0,0 a${60 + i * 12},${60 + i * 12} 0 1,1 0,0.1`}
          />
        </circle>
      ))}
      <circle cx="100" cy="100" r="3" fill="hsl(228 60% 60%)" opacity="0.5" />
    </svg>
  );
}

/* ── Floating particles ── */
function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3 - 0.15,
      size: 1 + Math.random() * 2,
      opacity: 0.1 + Math.random() * 0.3,
      hue: Math.random() > 0.7 ? 155 : 228,
    }));

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 50%, 60%, ${p.opacity})`;
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if already logged in
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) navigate("/");
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/");
    });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast({ title: "Vul alle velden in", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (error) {
      toast({ title: "Inloggen mislukt", description: error.message, variant: "destructive" });
    } else {
      navigate("/");
    }
  };

  return (
    <div className="mc-dark min-h-[100dvh] flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[hsl(220_18%_9%)]" />
      <FloatingParticles />

      {/* Large hologram rings behind card */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <HoloRing size={Math.min(700, typeof window !== "undefined" ? window.innerWidth * 0.9 : 700)} />
      </div>

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-card/60 backdrop-blur-xl border border-border rounded-2xl p-8 shadow-[0_0_80px_-20px_hsl(228_50%_55%/0.3)]">
          {/* Logo & Title */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 animate-pulse-slow" />
              </div>
              <HBMasterLogo size={64} className="relative z-10" />
            </div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              HBMaster
            </h1>
            <p className="text-sm text-muted-foreground mt-1 font-mono tracking-wider uppercase">
              Mission Control
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email field */}
            <div className="relative group">
              <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                focusedField === "email" ? "text-primary" : "text-muted-foreground"
              }`}>
                <User className="w-4 h-4" />
              </div>
              <Input
                type="email"
                placeholder="E-mailadres"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                className={`pl-10 h-12 bg-secondary/50 border-border transition-all duration-300 ${
                  focusedField === "email"
                    ? "border-primary ring-1 ring-primary/30 shadow-[0_0_20px_-5px_hsl(228_50%_55%/0.3)]"
                    : "hover:border-muted-foreground/30"
                }`}
                autoComplete="email"
              />
            </div>

            {/* Password field */}
            <div className="relative group">
              <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                focusedField === "password" ? "text-primary" : "text-muted-foreground"
              }`}>
                <Lock className="w-4 h-4" />
              </div>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Wachtwoord"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                className={`pl-10 pr-10 h-12 bg-secondary/50 border-border transition-all duration-300 ${
                  focusedField === "password"
                    ? "border-primary ring-1 ring-primary/30 shadow-[0_0_20px_-5px_hsl(228_50%_55%/0.3)]"
                    : "hover:border-muted-foreground/30"
                }`}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-base font-semibold bg-gradient-brand hover:opacity-90 transition-all duration-300 shadow-[0_0_30px_-8px_hsl(228_50%_55%/0.4)] hover:shadow-[0_0_40px_-8px_hsl(228_50%_55%/0.6)]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Inloggen...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Inloggen
                </span>
              )}
            </Button>
          </form>

          {/* Footer accent */}
          <div className="mt-8 flex items-center justify-center gap-2 text-muted-foreground/40">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[10px] font-mono uppercase tracking-widest">Secured by HBMaster</span>
            <div className="h-px flex-1 bg-border" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, User, Eye, EyeOff, LogIn } from "lucide-react";
import HBMasterLogo from "@/components/mission-control/HBMasterLogo";
import { useToast } from "@/hooks/use-toast";
import { LoginHoloRing } from "@/components/login/LoginHoloRing";
import { LoginParticles } from "@/components/login/LoginParticles";
import { LoginSystemStatus } from "@/components/login/LoginSystemStatus";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

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
    <div className="min-h-[100dvh] flex items-center justify-center relative overflow-hidden bg-background">
      {/* Soft radial accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      <LoginParticles />

      {/* Floral hologram behind card */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <LoginHoloRing size={Math.min(700, typeof window !== "undefined" ? window.innerWidth * 0.9 : 700)} />
      </div>

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-card/80 backdrop-blur-xl border border-border rounded-2xl p-8 shadow-[var(--shadow-card)]">
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
                    ? "border-primary ring-1 ring-primary/30 shadow-[var(--shadow-glow-primary)]"
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
                    ? "border-primary ring-1 ring-primary/30 shadow-[var(--shadow-glow-primary)]"
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
              className="w-full h-12 text-base font-semibold bg-gradient-brand hover:opacity-90 transition-all duration-300 shadow-[var(--shadow-glow-primary)] hover:shadow-[0_0_40px_-8px_hsl(var(--primary)/0.4)]"
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

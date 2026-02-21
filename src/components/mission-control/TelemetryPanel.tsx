import { useState, useEffect } from "react";
import { Activity, Zap, Users, BarChart3, CheckCircle2, Cpu } from "lucide-react";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  color: string;
  delay?: number;
}

const StatCard = ({ icon, label, value, sub, color, delay = 0 }: StatCardProps) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); }, [delay]);

  return (
    <div className={`rounded-xl border border-border bg-card p-3 transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${color}`}>
          {icon}
        </div>
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-xl font-mono font-bold text-foreground">{value}</div>
      {sub && <div className="text-[10px] font-mono text-muted-foreground mt-0.5">{sub}</div>}
    </div>
  );
};

const TelemetryPanel = () => {
  const [latency, setLatency] = useState(142);

  useEffect(() => {
    const i = setInterval(() => {
      setLatency(120 + Math.round(Math.random() * 80));
    }, 3000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="flex flex-col h-full p-4 space-y-3 overflow-y-auto">
      <h3 className="text-[10px] font-mono font-black text-muted-foreground uppercase tracking-widest">AI Telemetry</h3>
      
      <div className="grid grid-cols-2 gap-2">
        <StatCard icon={<Activity className="w-3.5 h-3.5 text-accent" />} label="Status" value="Online" color="bg-accent/10" delay={0} />
        <StatCard icon={<Zap className="w-3.5 h-3.5 text-bloom-warm" />} label="Latency" value={`${latency}ms`} sub="avg response" color="bg-bloom-warm/10" delay={50} />
        <StatCard icon={<Users className="w-3.5 h-3.5 text-primary" />} label="Sessions" value="3" sub="actief" color="bg-primary/10" delay={100} />
        <StatCard icon={<BarChart3 className="w-3.5 h-3.5 text-bloom-sky" />} label="Tokens" value="12.4k" sub="vandaag" color="bg-bloom-sky/10" delay={150} />
        <StatCard icon={<CheckCircle2 className="w-3.5 h-3.5 text-accent" />} label="Success" value="98.2%" sub="last 24h" color="bg-accent/10" delay={200} />
        <StatCard icon={<Cpu className="w-3.5 h-3.5 text-bloom-warm" />} label="Top Task" value="Planning" sub="40% van queries" color="bg-bloom-warm/10" delay={250} />
      </div>

      {/* System status */}
      <div className="mt-4">
        <h4 className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-2">System Status</h4>
        <div className="space-y-1.5">
          {[
            { name: "AI Gateway", status: "operational" },
            { name: "Database", status: "operational" },
            { name: "Realtime", status: "operational" },
            { name: "Edge Functions", status: "operational" },
          ].map(s => (
            <div key={s.name} className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-secondary/50 border border-border">
              <span className="text-[11px] font-mono text-muted-foreground">{s.name}</span>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span className="text-[9px] font-mono text-accent">{s.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TelemetryPanel;

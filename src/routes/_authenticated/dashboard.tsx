import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { CalendarHeart, Activity, Sparkles, BarChart3, AlertTriangle, CheckCircle2, Bell, Info } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({ component: Dashboard });

function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [insights, setInsights] = useState<any[]>([]);

  useEffect(() => {
    api.get("/api/analytics/dashboard").then((r) => setData(r.data)).catch(() => {});
    api.get("/api/analytics/insights").then((r) => setInsights(r.data?.insights || r.data || [])).catch(() => {});
  }, []);

  const weeks = data?.weeks_pregnant ?? data?.profile?.weeks_pregnant ?? 0;
  const pct = Math.min(100, (weeks / 40) * 100);
  const trimester = weeks <= 13 ? 1 : weeks <= 27 ? 2 : 3;
  const next = data?.next_appointment;
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="font-display text-4xl font-bold">{greeting}, {user?.full_name?.split(" ")[0] || "Mama"} 🌸</h1>
        <p className="text-muted-foreground mt-1">Here's how your journey is going today.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Progress ring */}
        <div className="lg:col-span-1 rounded-3xl bg-white border border-rose-100 p-6 shadow-soft hover-lift flex flex-col items-center justify-center">
          <ProgressRing percent={pct} weeks={weeks} />
          <div className="mt-3 text-sm text-muted-foreground">Trimester {trimester} of 3</div>
        </div>

        {/* Next appointment */}
        <Card className="lg:col-span-1">
          <CardIcon color="rose"><CalendarHeart className="w-5 h-5" /></CardIcon>
          <div className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">Next appointment</div>
          {next ? (
            <>
              <div className="mt-1 font-display text-2xl font-semibold">{next.doctor_name || next.doctor}</div>
              <div className="text-sm text-muted-foreground">{next.appointment_type || next.type}</div>
              <div className="mt-3 text-sm">{new Date(next.appointment_date || next.date).toLocaleString()}</div>
            </>
          ) : (
            <>
              <div className="mt-1 font-display text-2xl font-semibold">No upcoming visits</div>
              <Link to="/appointments" className="mt-3 inline-block text-rose-600 text-sm font-medium hover:underline">Schedule one →</Link>
            </>
          )}
        </Card>

        {/* Health stats */}
        <Card className="lg:col-span-1">
          <CardIcon color="amber"><Activity className="w-5 h-5" /></CardIcon>
          <div className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">Health snapshot</div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Stat label="Logs" value={data?.total_symptoms ?? data?.symptom_count ?? 0} />
            <Stat label="Avg severity" value={(data?.avg_severity ?? 0).toFixed?.(1) ?? "—"} />
          </div>
        </Card>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="font-display text-2xl font-semibold mb-4">Quick actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickAction to="/appointments" color="rose" icon={CalendarHeart} label="Book appointment" />
          <QuickAction to="/health" color="amber" icon={Activity} label="Log symptom" />
          <QuickAction to="/chat" color="violet" icon={Sparkles} label="Ask AI" />
          <QuickAction to="/insights" color="emerald" icon={BarChart3} label="View insights" />
        </div>
      </div>

      {/* Insights */}
      <div>
        <h2 className="font-display text-2xl font-semibold mb-4">AI insights for you</h2>
        {insights.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-rose-200 bg-white/60 p-8 text-center text-muted-foreground">
            Insights will appear here as you log symptoms and appointments.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.slice(0, 6).map((ins: any, i: number) => <InsightCard key={i} insight={ins} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function ProgressRing({ percent, weeks }: { percent: number; weeks: number }) {
  const r = 70, c = 2 * Math.PI * r;
  return (
    <div className="relative w-44 h-44">
      <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
        <circle cx="80" cy="80" r={r} stroke="rgb(255,228,230)" strokeWidth="14" fill="none" />
        <circle cx="80" cy="80" r={r} stroke="url(#g)" strokeWidth="14" fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c - (c * percent) / 100} style={{ transition: "stroke-dashoffset 1s ease" }} />
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fda4af" />
            <stop offset="100%" stopColor="#f43f5e" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="font-display text-5xl font-bold text-gradient-rose">{weeks}</div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">of 40 weeks</div>
      </div>
    </div>
  );
}

function Card({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`rounded-3xl bg-white border border-rose-100 p-6 shadow-soft hover-lift ${className}`}>{children}</div>;
}
function CardIcon({ color, children }: { color: string; children: React.ReactNode }) {
  const map: Record<string, string> = { rose: "bg-rose-100 text-rose-600", amber: "bg-amber-100 text-amber-600", violet: "bg-violet-100 text-violet-600", emerald: "bg-emerald-100 text-emerald-600" };
  return <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${map[color]}`}>{children}</div>;
}
function Stat({ label, value }: { label: string; value: any }) {
  return <div className="rounded-2xl bg-rose-50/60 p-3"><div className="text-2xl font-display font-bold text-rose-600">{value}</div><div className="text-xs text-muted-foreground">{label}</div></div>;
}
function QuickAction({ to, color, icon: Icon, label }: any) {
  const map: Record<string, string> = { rose: "from-rose-400 to-rose-600", amber: "from-amber-400 to-orange-500", violet: "from-violet-400 to-fuchsia-500", emerald: "from-emerald-400 to-teal-500" };
  return (
    <Link to={to} className="group rounded-3xl bg-white border border-rose-100 p-5 hover-lift">
      <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${map[color]} text-white flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform`}><Icon className="w-5 h-5" /></div>
      <div className="mt-4 font-semibold">{label}</div>
    </Link>
  );
}
function InsightCard({ insight }: { insight: any }) {
  const type = (insight.type || insight.category || "info").toLowerCase();
  const styles: Record<string, { bg: string; text: string; icon: any }> = {
    warning: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", icon: AlertTriangle },
    success: { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", icon: CheckCircle2 },
    reminder: { bg: "bg-rose-50 border-rose-200", text: "text-rose-700", icon: Bell },
    info: { bg: "bg-blue-50 border-blue-200", text: "text-blue-700", icon: Info },
  };
  const s = styles[type] || styles.info;
  const Icon = s.icon;
  return (
    <div className={`rounded-3xl border ${s.bg} p-5 flex gap-4`}>
      <div className={`w-10 h-10 rounded-2xl bg-white flex items-center justify-center ${s.text} shrink-0`}><Icon className="w-5 h-5" /></div>
      <div>
        <div className={`font-semibold ${s.text}`}>{insight.title || "Insight"}</div>
        <div className="text-sm text-foreground/80 mt-1 leading-relaxed">{insight.message || insight.description || insight.content}</div>
      </div>
    </div>
  );
}
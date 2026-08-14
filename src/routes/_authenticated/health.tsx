import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Plus, X, Loader2, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/_authenticated/health")({ component: HealthTracker });

const SYMPTOMS = ["Nausea","Vomiting","Fatigue","Back Pain","Headache","Swelling","Heartburn","Insomnia","Dizziness","Cramps","Breast Tenderness","Frequent Urination","Mood Swings","Shortness of Breath","Other"];
const SEV_LABELS = ["Mild","Moderate","Noticeable","Severe","Very Severe"];
const SEV_COLORS = ["bg-emerald-100 text-emerald-700","bg-lime-100 text-lime-700","bg-amber-100 text-amber-700","bg-orange-100 text-orange-700","bg-rose-100 text-rose-700"];

function HealthTracker() {
  const [logs, setLogs] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ symptom: SYMPTOMS[0], severity: 2, week: 12, notes: "" });

  const load = async () => {
    try { const r = await api.get("/api/health/symptoms"); setLogs(r.data || []); } catch {}
    try { const r = await api.get("/api/health/stats"); setStats(r.data || {}); } catch {}
  };
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      await api.post("/api/health/symptoms", form);
      setForm({ symptom: SYMPTOMS[0], severity: 2, week: form.week, notes: "" });
      setOpen(false); load();
    } finally { setLoading(false); }
  };

  const hasHigh = logs.some((l) => (l.severity ?? 0) >= 4);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-4xl font-bold">Health tracker</h1>
          <p className="text-muted-foreground mt-1">Log how you feel to spot patterns.</p>
        </div>
        <button onClick={() => setOpen((o) => !o)} className="px-5 py-3 rounded-2xl gradient-rose text-white font-semibold shadow-soft hover:shadow-glow transition-all inline-flex items-center gap-2">
          {open ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />} {open ? "Close" : "Log symptom"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total logs" value={stats.total ?? logs.length} />
        <StatCard label="Avg severity" value={(stats.avg_severity ?? avg(logs.map((l) => l.severity || 0))).toFixed?.(1) ?? "—"} />
        <StatCard label="Most common" value={stats.most_common || mostCommon(logs) || "—"} />
      </div>

      {hasHigh && (
        <div className="rounded-3xl bg-amber-50 border border-amber-200 p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
          <div className="text-sm text-amber-800"><b>High severity detected.</b> Consider reaching out to your provider if symptoms persist.</div>
        </div>
      )}

      {open && (
        <form onSubmit={submit} className="rounded-3xl bg-white border border-rose-100 p-6 shadow-soft animate-in slide-in-from-top-4 duration-300 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Symptom"><select className={inp} value={form.symptom} onChange={(e) => setForm({ ...form, symptom: e.target.value })}>{SYMPTOMS.map((s) => <option key={s}>{s}</option>)}</select></Field>
            <Field label="Week of pregnancy"><input type="number" min={1} max={42} className={inp} value={form.week} onChange={(e) => setForm({ ...form, week: Number(e.target.value) })} /></Field>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Severity</span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${SEV_COLORS[form.severity - 1]}`}>{SEV_LABELS[form.severity - 1]}</span>
            </div>
            <input type="range" min={1} max={5} value={form.severity} onChange={(e) => setForm({ ...form, severity: Number(e.target.value) })} className="w-full accent-rose-500" />
          </div>
          <Field label="Notes"><textarea className={inp} rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></Field>
          <button disabled={loading} className="px-6 py-3 rounded-2xl gradient-rose text-white font-semibold inline-flex items-center gap-2">{loading && <Loader2 className="w-4 h-4 animate-spin" />}Save log</button>
        </form>
      )}

      <div>
        <h2 className="font-display text-2xl font-semibold mb-4">Symptom history</h2>
        {logs.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-rose-200 bg-white/60 p-8 text-center text-muted-foreground">No logs yet.</div>
        ) : (
          <div className="space-y-3">
            {logs.map((l) => {
              const sev = Math.max(1, Math.min(5, l.severity || 1));
              return (
                <div key={l.id} className="rounded-3xl bg-white border border-rose-100 p-5 shadow-soft flex items-center gap-4 hover-lift">
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${SEV_COLORS[sev - 1]}`}>{SEV_LABELS[sev - 1]}</div>
                  <div className="flex-1">
                    <div className="font-semibold">{l.symptom}</div>
                    <div className="text-xs text-muted-foreground">Week {l.week} · {new Date(l.created_at || Date.now()).toLocaleDateString()}</div>
                    {l.notes && <div className="text-sm text-foreground/80 mt-1">{l.notes}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: any) {
  return <div className="rounded-3xl bg-white border border-rose-100 p-5 shadow-soft hover-lift"><div className="font-display text-3xl font-bold text-gradient-rose">{value}</div><div className="text-sm text-muted-foreground mt-1">{label}</div></div>;
}
function avg(arr: number[]) { return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0; }
function mostCommon(arr: any[]) { const m: any = {}; arr.forEach((x) => { if (x.symptom) m[x.symptom] = (m[x.symptom] || 0) + 1; }); return Object.entries(m).sort((a: any, b: any) => b[1] - a[1])[0]?.[0]; }
const inp = "w-full px-4 py-3 rounded-2xl border border-rose-100 bg-white focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition-all";
function Field({ label, children }: any) { return <label className="block"><span className="block text-sm font-medium mb-1.5">{label}</span>{children}</label>; }
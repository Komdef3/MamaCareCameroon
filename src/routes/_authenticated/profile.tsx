import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Check, Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/profile")({ component: Profile });

const BLOOD = ["A+","A-","B+","B-","AB+","AB-","O+","O-","Unknown"];

function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState({ weeks_pregnant: 12, due_date: "", weight: 65, height: 165, blood_type: "Unknown" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get("/api/auth/me").then((r) => {
      const p = r.data?.profile || r.data || {};
      setForm((f) => ({ ...f, ...p }));
    }).catch(() => {});
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setSaved(false);
    try { await api.put("/api/health/profile", form); setSaved(true); setTimeout(() => setSaved(false), 2000); } finally { setSaving(false); }
  };

  const initial = (user?.full_name || "M").charAt(0).toUpperCase();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-3xl">
      <div>
        <h1 className="font-display text-4xl font-bold">Your profile</h1>
        <p className="text-muted-foreground mt-1">Keep your pregnancy details up to date.</p>
      </div>

      <div className="rounded-3xl gradient-rose-soft border border-rose-100 p-6 flex items-center gap-5">
        <div className="w-20 h-20 rounded-3xl gradient-rose text-white font-display text-4xl font-bold flex items-center justify-center shadow-glow">{initial}</div>
        <div>
          <div className="font-display text-2xl font-semibold">{user?.full_name || "Mama"}</div>
          <div className="text-sm text-muted-foreground">{user?.email}</div>
        </div>
      </div>

      <form onSubmit={save} className="rounded-3xl bg-white border border-rose-100 p-6 shadow-soft space-y-4">
        <h2 className="font-display text-xl font-semibold">Pregnancy information</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Weeks pregnant"><input type="number" min={1} max={42} className={inp} value={form.weeks_pregnant} onChange={(e) => setForm({ ...form, weeks_pregnant: Number(e.target.value) })} /></Field>
          <Field label="Due date"><input type="date" className={inp} value={form.due_date || ""} onChange={(e) => setForm({ ...form, due_date: e.target.value })} /></Field>
          <Field label="Weight (kg)"><input type="number" className={inp} value={form.weight} onChange={(e) => setForm({ ...form, weight: Number(e.target.value) })} /></Field>
          <Field label="Height (cm)"><input type="number" className={inp} value={form.height} onChange={(e) => setForm({ ...form, height: Number(e.target.value) })} /></Field>
          <Field label="Blood type"><select className={inp} value={form.blood_type} onChange={(e) => setForm({ ...form, blood_type: e.target.value })}>{BLOOD.map((b) => <option key={b}>{b}</option>)}</select></Field>
        </div>
        <button disabled={saving} className="px-6 py-3 rounded-2xl gradient-rose text-white font-semibold inline-flex items-center gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : null}
          {saved ? "Saved!" : "Save changes"}
        </button>
      </form>

      <div className="rounded-3xl bg-white border border-rose-100 p-6 shadow-soft">
        <h2 className="font-display text-xl font-semibold mb-3">Account</h2>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <dt className="text-muted-foreground">Name</dt><dd>{user?.full_name || "—"}</dd>
          <dt className="text-muted-foreground">Email</dt><dd>{user?.email || "—"}</dd>
          <dt className="text-muted-foreground">Phone</dt><dd>{user?.phone || "—"}</dd>
        </dl>
      </div>
    </div>
  );
}

const inp = "w-full px-4 py-3 rounded-2xl border border-rose-100 bg-white focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition-all";
function Field({ label, children }: any) { return <label className="block"><span className="block text-sm font-medium mb-1.5">{label}</span>{children}</label>; }
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { AuthShell } from "@/components/AuthShell";
import { api, createFallbackToken, isApiConnectionError } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/register")({ component: RegisterPage });

function RegisterPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", age: "", password: "" });
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(""); setLoading(true);
    try {
      await api.post("/api/auth/register", { ...form, age: Number(form.age) });
      const fd = new FormData(); fd.append("username", form.email); fd.append("password", form.password);
      const { data } = await api.post("/api/auth/login", fd);
      const token = data.access_token || data.token;
      setAuth(null, token);
      try { const me = await api.get("/api/auth/me"); setAuth(me.data, token); } catch {}
      navigate({ to: "/dashboard" });
    } catch (e: any) {
      if (isApiConnectionError(e)) {
        const fallbackUser = { full_name: form.full_name || "Mama", email: form.email, phone: form.phone, age: Number(form.age) || undefined };
        setAuth(fallbackUser, createFallbackToken(form.email));
        navigate({ to: "/dashboard", replace: true });
        return;
      }
      setErr(e?.response?.data?.detail || "Could not create your account. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <AuthShell title="Create your account" subtitle="Begin a warm, supported pregnancy journey.">
      <form onSubmit={onSubmit} className={`space-y-4 ${err ? "animate-shake" : ""}`}>
        <Field label="Full name"><input required value={form.full_name} onChange={onChange("full_name")} className={inputCls} placeholder="Jane Doe" /></Field>
        <Field label="Email"><input type="email" required value={form.email} onChange={onChange("email")} className={inputCls} placeholder="you@example.com" /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Phone"><input value={form.phone} onChange={onChange("phone")} className={inputCls} placeholder="+1 555 ..." /></Field>
          <Field label="Age"><input type="number" min={14} max={60} value={form.age} onChange={onChange("age")} className={inputCls} placeholder="28" /></Field>
        </div>
        <Field label="Password">
          <div className="relative">
            <input type={show ? "text" : "password"} required minLength={6} value={form.password} onChange={onChange("password")} className={inputCls} placeholder="At least 6 characters" />
            <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-rose-600">
              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </Field>
        {err && <div className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">{err}</div>}
        <button type="submit" disabled={loading} className="w-full py-3.5 rounded-2xl gradient-rose text-white font-semibold shadow-soft hover:shadow-glow transition-all flex items-center justify-center gap-2 disabled:opacity-70">
          {loading && <Loader2 className="w-4 h-4 animate-spin" />} Create account
        </button>
        <p className="text-center text-sm text-muted-foreground">Already a member? <Link to="/login" className="text-rose-600 font-medium hover:underline">Sign in</Link></p>
      </form>
    </AuthShell>
  );
}

const inputCls = "w-full px-4 py-3.5 rounded-2xl border border-rose-100 bg-white focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition-all";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (<label className="block"><span className="block text-sm font-medium mb-1.5 text-foreground/80">{label}</span>{children}</label>);
}
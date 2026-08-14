import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Plus, CalendarHeart, MapPin, Check, Trash2, Loader2, X } from "lucide-react";

export const Route = createFileRoute("/_authenticated/appointments")({ component: Appointments });

const TYPES = [
  "Prenatal Checkup",
  "Ultrasound Scan",
  "Blood Test",
  "Glucose Test",
  "GBS Test",
  "Nutrition Counseling",
  "Mental Health",
  "Other (specify below)",
];

const CAMEROON_HOSPITALS = [
  "Yaoundé Central Hospital - Yaoundé",
  "Yaoundé University Teaching Hospital (CHUY) - Yaoundé",
  "Yaoundé Gynaeco-Obstetric and Paediatric Hospital - Yaoundé",
  "Cité Verte District Hospital - Yaoundé",
  "Biyem-Assi District Hospital - Yaoundé",
  "Efoulan District Hospital - Yaoundé",
  "Nkolndongo District Hospital - Yaoundé",
  "Laquintinie Hospital - Douala",
  "Douala General Hospital - Douala",
  "Gyneco-Obstetric and Paediatric Hospital - Douala",
  "Bonassama District Hospital - Douala",
  "Deido District Hospital - Douala",
  "Buea Regional Hospital - Buea",
  "Limbe Regional Hospital - Limbe",
  "Kumba District Hospital - Kumba",
  "Tiko District Hospital - Tiko",
  "Bamenda Regional Hospital - Bamenda",
  "Mbingo Baptist Hospital - Mbingo",
  "Shisong Catholic Hospital - Shisong",
  "Fundong District Hospital - Fundong",
  "Bafoussam Regional Hospital - Bafoussam",
  "Mbouda District Hospital - Mbouda",
  "Ebolowa Regional Hospital - Ebolowa",
  "Bertoua Regional Hospital - Bertoua",
  "Ngaoundéré Regional Hospital - Ngaoundéré",
  "Garoua Regional Hospital - Garoua",
  "Maroua Regional Hospital - Maroua",
  "Mvog-Betsi Medical Centre - Yaoundé",
  "La Cathédrale Medical Clinic - Yaoundé",
  "Polyclinique de l'Avenue - Douala",
  "Baptist Hospital - Mutengene",
  "Marie Anne Polyclinic - Buea",
  "Other (type below)",
];

function Appointments() {
  const [items, setItems] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(CAMEROON_HOSPITALS[0]);
  const [customHospital, setCustomHospital] = useState("");
  const [selectedType, setSelectedType] = useState(TYPES[0]);
  const [customType, setCustomType] = useState("");
  const [form, setForm] = useState({
    doctor_name: "",
    appointment_date: "",
    notes: "",
  });

  const load = () =>
    api.get("/api/appointments/").then((r) => setItems(r.data || [])).catch(() => {});

  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const hospitalName = selectedHospital === "Other (type below)"
      ? customHospital
      : selectedHospital;

    const appointmentType = selectedType === "Other (specify below)"
      ? customType
      : selectedType;

    try {
      await api.post("/api/appointments/", {
        doctor_name: form.doctor_name,
        appointment_type: appointmentType,
        appointment_date: form.appointment_date,
        location: hospitalName,
        notes: form.notes,
      });
      setForm({ doctor_name: "", appointment_date: "", notes: "" });
      setSelectedHospital(CAMEROON_HOSPITALS[0]);
      setSelectedType(TYPES[0]);
      setCustomHospital("");
      setCustomType("");
      setOpen(false);
      load();
    } finally {
      setLoading(false);
    }
  };

  const complete = async (id: any) => { await api.put(`/api/appointments/${id}/complete`); load(); };
  const del = async (id: any) => { await api.delete(`/api/appointments/${id}`); load(); };

  const upcoming = items.filter((a) => !a.completed);
  const completed = items.filter((a) => a.completed);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-4xl font-bold">Appointments</h1>
          <p className="text-muted-foreground mt-1">Stay on top of your prenatal care.</p>
        </div>
        <button
          onClick={() => setOpen((o) => !o)}
          className="px-5 py-3 rounded-2xl gradient-rose text-white font-semibold shadow-soft hover:shadow-glow transition-all inline-flex items-center gap-2"
        >
          {open ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {open ? "Close" : "Schedule appointment"}
        </button>
      </div>

      {open && (
        <form
          onSubmit={submit}
          className="rounded-3xl bg-white border border-rose-100 p-6 shadow-soft animate-in slide-in-from-top-4 duration-300 space-y-4"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Doctor / Specialist Name">
              <input
                required
                value={form.doctor_name}
                onChange={(e) => setForm({ ...form, doctor_name: e.target.value })}
                className={inp}
                placeholder="e.g. Dr. Nkengfack"
              />
            </Field>

            <Field label="Date & Time">
              <input
                required
                type="datetime-local"
                value={form.appointment_date}
                onChange={(e) => setForm({ ...form, appointment_date: e.target.value })}
                className={inp}
              />
            </Field>
          </div>

          <Field label="Appointment Type">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className={inp}
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </Field>

          {selectedType === "Other (specify below)" && (
            <Field label="Specify Appointment Type">
              <input
                required
                value={customType}
                onChange={(e) => setCustomType(e.target.value)}
                className={inp}
                placeholder="e.g. Diabetes check, Vaccination..."
              />
            </Field>
          )}

          <Field label="Hospital / Clinic">
            <select
              value={selectedHospital}
              onChange={(e) => setSelectedHospital(e.target.value)}
              className={inp}
            >
              {CAMEROON_HOSPITALS.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </Field>

          {selectedHospital === "Other (type below)" && (
            <Field label="Enter Hospital / Clinic Name">
              <input
                required
                value={customHospital}
                onChange={(e) => setCustomHospital(e.target.value)}
                className={inp}
                placeholder="Type the hospital or clinic name..."
              />
            </Field>
          )}

          <Field label="Notes (optional)">
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className={inp}
              rows={3}
              placeholder="Any questions to ask your doctor, or special notes..."
            />
          </Field>

          <div className="flex gap-3 pt-2">
            <button
              disabled={loading}
              className="px-6 py-3 rounded-2xl gradient-rose text-white font-semibold inline-flex items-center gap-2 disabled:opacity-60"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Save appointment
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-6 py-3 rounded-2xl border border-rose-100 text-rose-600 font-semibold hover:bg-rose-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <Section title="Upcoming" empty="No upcoming appointments. Book one above.">
        {upcoming.map((a) => (
          <AppointmentCard key={a.id} a={a} onComplete={() => complete(a.id)} onDelete={() => del(a.id)} />
        ))}
      </Section>

      {completed.length > 0 && (
        <Section title="Completed">
          {completed.map((a) => (
            <AppointmentCard key={a.id} a={a} onDelete={() => del(a.id)} completed />
          ))}
        </Section>
      )}
    </div>
  );
}

function Section({ title, children, empty }: any) {
  const arr = Array.isArray(children) ? children : [children];
  return (
    <div>
      <h2 className="font-display text-2xl font-semibold mb-4">{title}</h2>
      {arr.filter(Boolean).length ? (
        <div className="space-y-3">{children}</div>
      ) : empty ? (
        <div className="rounded-3xl border border-dashed border-rose-200 bg-white/60 p-8 text-center text-muted-foreground">
          {empty}
        </div>
      ) : null}
    </div>
  );
}

function AppointmentCard({ a, onComplete, onDelete, completed }: any) {
  return (
    <div className={`rounded-3xl bg-white border border-rose-100 p-5 shadow-soft flex items-center gap-4 hover-lift ${completed ? "opacity-70" : ""}`}>
      <div className="w-12 h-12 rounded-2xl gradient-rose-soft text-rose-600 flex items-center justify-center shrink-0">
        <CalendarHeart className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-display text-lg font-semibold">{a.doctor_name}</div>
        <div className="flex flex-wrap gap-2 mt-1 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 font-medium">
            {a.appointment_type}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
            {new Date(a.appointment_date).toLocaleString()}
          </span>
          {a.location && (
            <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 inline-flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {a.location}
            </span>
          )}
        </div>
        {a.notes && (
          <p className="text-xs text-muted-foreground mt-1.5 line-clamp-1">{a.notes}</p>
        )}
      </div>
      <div className="flex gap-2 shrink-0">
        {!completed && onComplete && (
          <button
            onClick={onComplete}
            title="Mark complete"
            className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 hover:bg-emerald-200 flex items-center justify-center transition-colors"
          >
            <Check className="w-4 h-4" />
          </button>
        )}
        {completed && (
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Check className="w-4 h-4" />
          </div>
        )}
        <button
          onClick={onDelete}
          className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

const inp = "w-full px-4 py-3 rounded-2xl border border-rose-100 bg-white focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition-all text-sm";

function Field({ label, children }: any) {
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-1.5 text-foreground/80">{label}</span>
      {children}
    </label>
  );
}

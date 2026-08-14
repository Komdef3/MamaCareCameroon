import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line, PieChart, Pie, Cell } from "recharts";

export const Route = createFileRoute("/_authenticated/insights")({ component: Insights });

const ROSE = ["#f43f5e", "#fb7185", "#fda4af", "#fecdd3", "#ffe4e6"];

function Insights() {
  const [data, setData] = useState<any>({});
  const [insights, setInsights] = useState<any[]>([]);
  useEffect(() => {
    api.get("/api/analytics/dashboard").then((r) => setData(r.data || {})).catch(() => {});
    api.get("/api/analytics/insights").then((r) => setInsights(r.data?.insights || r.data || [])).catch(() => {});
  }, []);

  const weeks = data.weeks_pregnant ?? 0;
  const trimester = weeks <= 13 ? 1 : weeks <= 27 ? 2 : 3;
  const symptomBars = data.symptom_counts || data.most_common_symptoms || [];
  const severityByWeek = data.severity_by_week || [];
  const apptTypes = data.appointment_types || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="font-display text-4xl font-bold">Insights</h1>
        <p className="text-muted-foreground mt-1">Your journey in numbers.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Weeks pregnant" value={weeks} />
        <StatCard label="Symptom logs" value={data.total_symptoms ?? 0} />
        <StatCard label="Appointments" value={data.total_appointments ?? 0} />
        <StatCard label="Avg severity" value={(data.avg_severity ?? 0).toFixed?.(1) ?? "—"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Chart title="Most common symptoms">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={symptomBars}>
              <XAxis dataKey="symptom" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#f43f5e" radius={[12, 12, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Chart>
        <Chart title="Severity by week">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={severityByWeek}>
              <XAxis dataKey="week" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} domain={[0, 5]} />
              <Tooltip />
              <Line type="monotone" dataKey="severity" stroke="#f43f5e" strokeWidth={3} dot={{ fill: "#f43f5e", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Chart>
        <Chart title="Appointment types">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={apptTypes} dataKey="count" nameKey="type" innerRadius={50} outerRadius={90}>
                {apptTypes.map((_: any, i: number) => <Cell key={i} fill={ROSE[i % ROSE.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Chart>
        <Chart title="Pregnancy progress">
          <div className="flex items-center justify-around h-[260px]">
            {[1, 2, 3].map((t) => (
              <div key={t} className={`flex flex-col items-center gap-3 ${trimester === t ? "scale-110" : "opacity-50"} transition-all`}>
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center font-display text-3xl font-bold ${trimester === t ? "gradient-rose text-white shadow-glow" : "bg-rose-50 text-rose-400"}`}>T{t}</div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Trimester {t}</div>
              </div>
            ))}
          </div>
        </Chart>
      </div>

      {insights.length > 0 && (
        <div>
          <h2 className="font-display text-2xl font-semibold mb-4">Personalized for you</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((ins: any, i: number) => (
              <div key={i} className="rounded-3xl bg-white border border-rose-100 p-5 shadow-soft hover-lift">
                <div className="text-2xl">{ins.emoji || "🌸"}</div>
                <div className="font-semibold mt-2">{ins.title || "Insight"}</div>
                <div className="text-sm text-muted-foreground mt-1">{ins.message || ins.content || ins.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: any) {
  return <div className="rounded-3xl bg-white border border-rose-100 p-5 shadow-soft hover-lift"><div className="font-display text-3xl font-bold text-gradient-rose">{value}</div><div className="text-sm text-muted-foreground mt-1">{label}</div></div>;
}
function Chart({ title, children }: any) {
  return <div className="rounded-3xl bg-white border border-rose-100 p-5 shadow-soft"><h3 className="font-display text-lg font-semibold mb-3">{title}</h3>{children}</div>;
}
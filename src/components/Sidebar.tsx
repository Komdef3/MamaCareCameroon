import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, CalendarHeart, Activity, Sparkles, BarChart3, User, LogOut } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { useAuth } from "@/lib/auth";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/appointments", label: "Appointments", icon: CalendarHeart },
  { to: "/health", label: "Health Tracker", icon: Activity },
  { to: "/chat", label: "AI Assistant", icon: Sparkles },
  { to: "/insights", label: "Insights", icon: BarChart3 },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function Sidebar() {
  const { user, logout } = useAuth();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const initial = (user?.full_name || "M").charAt(0).toUpperCase();

  return (
    <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col bg-white/80 backdrop-blur-xl border-r border-rose-100 z-40">
      <div className="px-6 py-6">
        <BrandLogo showTagline />
      </div>

      <div className="mx-4 mb-4 p-3 rounded-2xl gradient-rose-soft border border-rose-100 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full gradient-rose text-white flex items-center justify-center font-semibold">{initial}</div>
        <div className="min-w-0">
          <div className="text-sm font-semibold truncate">{user?.full_name || "Guest"}</div>
          <div className="text-xs text-muted-foreground truncate">{user?.email || "—"}</div>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {links.map(({ to, label, icon: Icon }) => {
          const active = path === to;
          return (
            <Link
              key={to}
              to={to}
              className={`group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                active
                  ? "gradient-rose text-white shadow-soft"
                  : "text-foreground/70 hover:bg-rose-50 hover:text-rose-600"
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? "" : "group-hover:scale-110 transition-transform"}`} />
              {label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={logout}
        className="m-4 px-4 py-3 flex items-center gap-3 text-sm font-medium text-rose-600 rounded-2xl border border-rose-100 hover:bg-rose-50 transition-colors"
      >
        <LogOut className="w-5 h-5" /> Log out
      </button>
    </aside>
  );
}
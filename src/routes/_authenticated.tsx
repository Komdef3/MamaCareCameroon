import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Sidebar } from "@/components/Sidebar";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && !localStorage.getItem("token")) {
      throw redirect({ to: "/login" });
    }
  },
  component: () => (
    <div className="min-h-screen">
      <Sidebar />
      <main className="lg:pl-64">
        <div className="px-6 lg:px-10 py-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  ),
});
import { HeartPulse, Sparkles, ShieldCheck } from "lucide-react";
import authBg from "@/assets/auth-bg.jpg";
import { BrandLogo } from "@/components/BrandLogo";

export function AuthShell({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 text-white overflow-hidden">
        {/* Background image with ken-burns */}
        <img
          src={authBg}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover animate-ken-burns"
        />
        {/* Soft color/gradient overlays: dark enough for white text, light enough to keep the baby visible */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-900/55 via-rose-800/35 to-rose-600/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-rose-950/70 via-transparent to-transparent" />
        {/* Animated soft blobs */}
        <div className="absolute -top-24 -left-16 w-80 h-80 rounded-full bg-white/20 blur-3xl animate-float" />
        <div className="absolute bottom-0 -right-24 w-96 h-96 rounded-full bg-amber-200/20 blur-3xl animate-float" style={{ animationDelay: "3s" }} />
        <div className="absolute top-1/3 left-1/2 w-40 h-40 rounded-full bg-white/15 blur-2xl animate-pulse-soft" />
        <Sparkles className="absolute top-24 right-16 w-5 h-5 text-white/80 animate-sparkle" />
        <Sparkles className="absolute bottom-32 left-20 w-4 h-4 text-amber-200 animate-sparkle" style={{ animationDelay: "1.2s" }} />

        <BrandLogo light className="relative animate-fade-up" />

        <div className="relative space-y-8 animate-fade-up delay-200">
          <h2 className="font-display text-5xl font-bold leading-tight drop-shadow-lg">A gentle companion for every week of your journey.</h2>
          <div className="space-y-4">
            {[
              { icon: HeartPulse, t: "Track how you feel", d: "Symptom logs that turn into insights." },
              { icon: Sparkles, t: "AI care, on demand", d: "Warm, helpful answers any hour." },
              { icon: ShieldCheck, t: "Private & secure", d: "Your story stays yours." },
            ].map((f, i) => (
              <div key={f.t} className="flex items-start gap-3 animate-fade-up" style={{ animationDelay: `${0.3 + i * 0.12}s` }}>
                <div className="w-10 h-10 rounded-2xl bg-white/25 backdrop-blur flex items-center justify-center shrink-0 hover:scale-110 transition-transform">
                  <f.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold">{f.t}</div>
                  <div className="text-sm text-white/90">{f.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative text-sm text-white/80 animate-fade-in delay-700">© {new Date().getFullYear()} MamaCare · Made with 🌸 for African mothers</div>
      </div>

      {/* Right form */}
      <div className="relative flex items-center justify-center p-6 sm:p-12 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-96 h-96 rounded-full bg-rose-200/40 blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-32 w-96 h-96 rounded-full bg-amber-100/50 blur-3xl animate-float" style={{ animationDelay: "3s" }} />
        <div className="relative w-full max-w-md animate-fade-up">
          <BrandLogo className="lg:hidden mb-8" />
          <h1 className="font-display text-4xl font-bold">{title}</h1>
          <p className="mt-2 text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
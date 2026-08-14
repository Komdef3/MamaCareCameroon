import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, MessageCircleHeart, Sparkles, CalendarHeart, ArrowRight, Star, Quote } from "lucide-react";
import heroMother from "@/assets/hero-mother.jpg";
import community from "@/assets/community.jpg";
import { BrandLogo } from "@/components/BrandLogo";

export const Route = createFileRoute("/")({ component: Landing });

const features = [
  { icon: Heart, title: "Health Tracking", desc: "Log symptoms week-by-week and notice patterns early." },
  { icon: MessageCircleHeart, title: "AI Chatbot", desc: "Friendly, evidence-aware answers to pregnancy questions." },
  { icon: Sparkles, title: "Smart Insights", desc: "Personalized nudges based on your trimester and history." },
  { icon: CalendarHeart, title: "Appointment Manager", desc: "Never miss a checkup with gentle reminders." },
];

function Landing() {
  return (
    <div className="min-h-screen overflow-hidden">
      <header className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 py-6 flex items-center justify-between">
        <BrandLogo className="animate-fade-up" />
        <div className="flex items-center gap-3 animate-fade-up delay-200">
          <Link to="/login" className="px-4 py-2 text-sm font-medium text-rose-600 hover:text-rose-700">Sign in</Link>
          <Link to="/register" className="px-5 py-2.5 text-sm font-semibold rounded-full gradient-rose text-white shadow-soft hover:shadow-glow transition-shadow">Get started</Link>
        </div>
      </header>

      <section className="relative px-6 lg:px-10 pt-10 pb-24">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-rose-200/40 blur-3xl animate-float" />
          <div className="absolute top-40 -right-32 w-[28rem] h-[28rem] rounded-full bg-rose-300/30 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
          <div className="absolute bottom-0 left-1/3 w-72 h-72 rounded-full bg-orange-200/30 blur-3xl animate-float" style={{ animationDelay: "4s" }} />
        </div>

        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100 text-rose-700 text-xs font-medium tracking-wide animate-fade-up">
              <Sparkles className="w-3.5 h-3.5" /> Built with love for expecting African mothers
            </span>
            <h1 className="mt-6 font-display text-5xl md:text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tight animate-fade-up delay-100">
              Your Journey to <br />
              <span className="text-gradient-rose">Motherhood,</span> Beautifully Supported
            </h1>
            <p className="mt-6 max-w-xl mx-auto lg:mx-0 text-lg text-muted-foreground animate-fade-up delay-200">
              Track your pregnancy week by week, log how you feel, and get warm, personalized guidance from an AI companion that truly understands you.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-4 animate-fade-up delay-300">
              <Link to="/register" className="group px-7 py-3.5 rounded-full gradient-rose text-white font-semibold shadow-soft hover:shadow-glow hover:-translate-y-0.5 transition-all inline-flex items-center gap-2">
                Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/login" className="px-7 py-3.5 rounded-full bg-white/80 backdrop-blur border border-rose-100 font-semibold text-rose-700 hover:bg-white transition-colors">
                Sign In
              </Link>
            </div>
            <div className="mt-8 flex items-center justify-center lg:justify-start gap-3 animate-fade-up delay-500">
              <div className="flex -space-x-2">
                {["#fda4af", "#f9a8d4", "#fcd34d"].map((c) => (
                  <div key={c} className="w-8 h-8 rounded-full border-2 border-white" style={{ background: c }} />
                ))}
              </div>
              <div className="flex items-center gap-1 text-rose-600">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
              </div>
              <span className="text-sm text-muted-foreground">Trusted by thousands of mothers</span>
            </div>
          </div>

          <div className="relative animate-fade-up delay-200">
            <div className="relative aspect-[4/5] max-w-md mx-auto">
              {/* Decorative animated blobs behind image */}
              <div className="absolute -inset-6 rounded-[3rem] gradient-rose opacity-30 blur-2xl animate-pulse-soft" />
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full gradient-rose opacity-80 animate-float" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-amber-200/70 blur-xl animate-float" style={{ animationDelay: "2s" }} />

              {/* Image card */}
              <div className="relative h-full w-full rounded-[2.5rem] overflow-hidden shadow-glow ring-1 ring-white/60">
                <img src={heroMother} alt="Joyful expecting mother" className="absolute inset-0 w-full h-full object-cover animate-ken-burns" width={1024} height={1280} />
                <div className="absolute inset-0 bg-gradient-to-t from-rose-900/40 via-transparent to-transparent" />

                {/* Floating stat cards */}
                <div className="absolute top-5 left-5 glass rounded-2xl px-3 py-2 flex items-center gap-2 shadow-soft animate-fade-up delay-500">
                  <Heart className="w-4 h-4 text-rose-500 animate-heartbeat" />
                  <div className="text-xs">
                    <div className="font-semibold leading-tight">Week 24</div>
                    <div className="text-muted-foreground">Baby is thriving</div>
                  </div>
                </div>
                <div className="absolute bottom-5 right-5 glass rounded-2xl px-3 py-2 shadow-soft animate-fade-up delay-700">
                  <div className="text-xs text-muted-foreground">Today's mood</div>
                  <div className="text-sm font-semibold text-rose-700">Glowing ✨</div>
                </div>
              </div>

              {/* Sparkles */}
              <Sparkles className="absolute top-10 -left-6 w-6 h-6 text-rose-400 animate-sparkle" />
              <Sparkles className="absolute bottom-20 -right-4 w-5 h-5 text-amber-400 animate-sparkle" style={{ animationDelay: "1s" }} />
              <Sparkles className="absolute top-1/2 -right-8 w-4 h-4 text-rose-300 animate-sparkle" style={{ animationDelay: "1.6s" }} />
            </div>
          </div>
        </div>

        <div className="relative mt-24 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          {[{ k: "40", v: "Weeks Tracked" }, { k: "AI", v: "Health Assistant" }, { k: "24/7", v: "Always Available" }].map((s) => (
            <div key={s.v} className="glass rounded-3xl px-6 py-6 text-center shadow-soft hover-lift animate-fade-up">
              <div className="font-display text-4xl font-bold text-gradient-rose">{s.k}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 lg:px-10 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl md:text-5xl font-bold">Everything you need, in one warm place</h2>
            <p className="mt-3 text-muted-foreground">Designed with the calm and clarity every mother deserves.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <div key={f.title} className="group rounded-3xl bg-white/80 backdrop-blur border border-rose-100/80 p-6 hover-lift animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-12 h-12 rounded-2xl gradient-rose-soft flex items-center justify-center text-rose-600 group-hover:gradient-rose group-hover:text-white transition-all">
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community / testimonial */}
      <section className="px-6 lg:px-10 pb-24">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
          <div className="relative animate-fade-up">
            <div className="absolute -inset-4 gradient-rose opacity-20 blur-2xl rounded-[3rem]" />
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-glow aspect-[5/4]">
              <img src={community} alt="Mothers sharing joy" className="w-full h-full object-cover animate-ken-burns" loading="lazy" width={1280} height={896} />
            </div>
          </div>
          <div className="animate-fade-up delay-200">
            <Quote className="w-10 h-10 text-rose-300" />
            <p className="mt-4 font-display text-3xl md:text-4xl leading-snug">
              "MamaCare felt like a warm friend walking with me through every week. Gentle, smart, and always there."
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full gradient-rose flex items-center justify-center text-white font-semibold">A</div>
              <div>
                <div className="font-semibold">Amara O.</div>
                <div className="text-sm text-muted-foreground">Lagos, Nigeria · Mother of one</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 lg:px-10 pb-24">
        <div className="max-w-5xl mx-auto rounded-[2.5rem] gradient-rose animate-gradient p-12 md:p-16 text-center text-white shadow-glow relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-20 -left-10 w-72 h-72 rounded-full bg-white/10 blur-2xl" />
          <h2 className="relative font-display text-4xl md:text-5xl font-bold">Begin your beautiful chapter today</h2>
          <p className="relative mt-4 text-white/90 max-w-xl mx-auto">Free to start. Designed with care. Ready when you are.</p>
          <Link to="/register" className="relative mt-8 inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-rose-600 font-semibold hover:scale-105 transition-transform shadow-soft">
            Create your account <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <footer className="text-center text-xs text-muted-foreground pb-10">© {new Date().getFullYear()} MamaCare. Made with 🌸 for mothers.</footer>
    </div>
  );
}

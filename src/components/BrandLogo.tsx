import { Link } from "@tanstack/react-router";
import { Baby } from "lucide-react";

type BrandLogoProps = {
  className?: string;
  light?: boolean;
  showTagline?: boolean;
};

export function LogoMark({ light = false }: { light?: boolean }) {
  return (
    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${light ? "bg-white/25 backdrop-blur" : "gradient-rose shadow-soft"}`}>
      <Baby className={`w-5 h-5 ${light ? "text-white" : "text-white"} animate-heartbeat`} />
    </div>
  );
}

export function BrandLogo({ className = "", light = false, showTagline = false }: BrandLogoProps) {
  return (
    <Link to="/" className={`flex items-center gap-3 ${className}`}>
      <LogoMark light={light} />
      <div>
        <div className={`font-display text-2xl font-bold ${light ? "text-white" : "text-gradient-rose"}`}>MamaCare</div>
        {showTagline && (
          <div className={`text-[10px] uppercase tracking-widest ${light ? "text-white/80" : "text-rose-400"}`}>
            Pregnancy companion
          </div>
        )}
      </div>
    </Link>
  );
}
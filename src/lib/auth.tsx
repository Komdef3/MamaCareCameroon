import * as React from "react";
import type { User } from "./api";

interface AuthCtx {
  user: User | null;
  token: string | null;
  setAuth: (u: User | null, t: string | null) => void;
  logout: () => void;
}

const Ctx = React.createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [token, setToken] = React.useState<string | null>(null);

  React.useEffect(() => {
    try {
      const t = localStorage.getItem("token");
      const u = localStorage.getItem("user");
      if (t) setToken(t);
      if (u) setUser(JSON.parse(u));
    } catch {}
  }, []);

  const setAuth = (u: User | null, t: string | null) => {
    setUser(u);
    setToken(t);
    if (t) localStorage.setItem("token", t);
    else localStorage.removeItem("token");
    if (u) localStorage.setItem("user", JSON.stringify(u));
    else localStorage.removeItem("user");
  };

  const logout = () => {
    setAuth(null, null);
    window.location.href = "/login";
  };

  return <Ctx.Provider value={{ user, token, setAuth, logout }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = React.useContext(Ctx);
  if (!v) throw new Error("useAuth must be inside AuthProvider");
  return v;
}
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { Send, Sparkles, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/chat")({ component: Chat });

const SUGGESTIONS = ["What foods should I avoid?", "Is fatigue normal?", "How much water should I drink?", "When should I call my doctor?"];

function Chat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { api.get("/api/chat/history").then((r) => setMessages(r.data || [])).catch(() => {}); }, []);
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [messages, typing]);

  const send = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg) return;
    setInput(""); setMessages((m) => [...m, { role: "user", content: msg, id: Date.now() }]); setTyping(true);
    try {
      const { data } = await api.post("/api/chat/", { message: msg });
      setMessages((m) => [...m, { role: "assistant", content: data.response, id: data.id || Date.now() + 1 }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Sorry, I couldn't reach my brain right now.", id: Date.now() + 1 }]);
    } finally { setTyping(false); }
  };

  const clear = async () => { try { await api.delete("/api/chat/history"); } catch {} setMessages([]); };

  return (
    <div className="grid lg:grid-cols-[280px_1fr] gap-6 h-[calc(100vh-7rem)] animate-in fade-in duration-500">
      <aside className="hidden lg:flex flex-col rounded-3xl bg-white border border-rose-100 p-5 shadow-soft">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-400 to-fuchsia-500 text-white flex items-center justify-center"><Sparkles className="w-5 h-5" /></div>
          <div>
            <div className="font-display text-lg font-semibold">MamaCare AI</div>
            <div className="text-xs text-emerald-600 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-soft" /> Online</div>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">Friendly guidance, not a substitute for your doctor.</p>
        <button onClick={clear} className="mt-auto px-4 py-2.5 rounded-2xl text-sm border border-rose-100 text-rose-600 hover:bg-rose-50 inline-flex items-center justify-center gap-2"><Trash2 className="w-4 h-4" /> Clear chat</button>
      </aside>

      <div className="flex flex-col rounded-3xl bg-white border border-rose-100 shadow-soft overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-10">
              <div className="w-16 h-16 rounded-3xl mx-auto bg-gradient-to-br from-violet-400 to-fuchsia-500 text-white flex items-center justify-center shadow-soft"><Sparkles className="w-7 h-7" /></div>
              <h3 className="font-display text-2xl font-bold mt-4">How can I support you today?</h3>
              <p className="text-muted-foreground text-sm mt-1">Try a suggestion to get started.</p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => <button key={s} onClick={() => send(s)} className="px-4 py-2 rounded-full bg-rose-50 text-rose-700 text-sm hover:bg-rose-100 transition-colors">{s}</button>)}
              </div>
            </div>
          )}
          {messages.map((m) => m.role === "user" ? (
            <div key={m.id} className="flex justify-end animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="max-w-[75%] px-4 py-3 rounded-3xl rounded-br-md gradient-rose text-white shadow-soft whitespace-pre-wrap">{m.content}</div>
            </div>
          ) : (
            <div key={m.id} className="flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-violet-400 to-fuchsia-500 text-white flex items-center justify-center shrink-0"><Sparkles className="w-4 h-4" /></div>
              <div className="max-w-[75%] px-4 py-3 rounded-3xl rounded-tl-md bg-white border border-rose-100 whitespace-pre-wrap">{m.content}</div>
            </div>
          ))}
          {typing && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-violet-400 to-fuchsia-500 text-white flex items-center justify-center"><Sparkles className="w-4 h-4" /></div>
              <div className="px-5 py-4 rounded-3xl bg-white border border-rose-100 flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-bounce-dot" />
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-bounce-dot" style={{ animationDelay: "0.15s" }} />
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-bounce-dot" style={{ animationDelay: "0.3s" }} />
              </div>
            </div>
          )}
        </div>
        <div className="border-t border-rose-100 p-4">
          <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex items-end gap-3">
            <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} rows={1} placeholder="Ask me anything…" className="flex-1 px-4 py-3 rounded-2xl border border-rose-100 bg-rose-50/50 focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100 resize-none" />
            <button type="submit" className="w-12 h-12 rounded-2xl gradient-rose text-white flex items-center justify-center shadow-soft hover:shadow-glow transition-all"><Send className="w-5 h-5" /></button>
          </form>
          <p className="text-[11px] text-muted-foreground mt-2 text-center">AI guidance is informational only. Always consult your provider for medical decisions.</p>
        </div>
      </div>
    </div>
  );
}
import { useRef, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

const FOCUS = ["Long Term Trading", "Swing Trading", "Day Trading", "Portfolio Management"];

function StarField() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    const stars = [];
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    for (let i = 0; i < 180; i++) {
      stars.push({ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, r: Math.random() * 1.3 + 0.15, alpha: Math.random() * 0.5 + 0.08, twinkle: Math.random() * Math.PI * 2, ts: Math.random() * 0.012 + 0.003, color: Math.random() > 0.88 ? "125,211,252" : "255,255,255" });
    }
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => { s.twinkle += s.ts; const a = s.alpha * (0.4 + 0.6 * Math.sin(s.twinkle)); ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(${s.color},${a})`; ctx.fill(); });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0" />;
}

export default function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", password: "", age_group: "", trading_expertise: "", focus_areas: [] });

  function toggleFocus(v) {
    setForm((p) => ({ ...p, focus_areas: p.focus_areas.includes(v) ? p.focus_areas.filter((x) => x !== v) : [...p.focus_areas, v] }));
  }

  async function submit(e) {
    e.preventDefault();
    if (!form.age_group || !form.trading_expertise) { alert("Please select age group and trading expertise"); return; }
    setLoading(true);
    try {
      const res = await api.post("/auth/signup", form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.detail || "Signup failed");
    } finally { setLoading(false); }
  }

  const inputStyle = { width: "100%", background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.15)", padding: "12px 0", color: "#ffffff", fontSize: "15px", outline: "none", transition: "border-color 0.3s" };
  const labelStyle = { display: "block", fontSize: "10px", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(148,163,184,0.65)", marginBottom: "10px" };

  return (
  <div className="min-h-screen relative overflow-hidden bg-[#040810]">

    {/* Ambient Glow */}
    <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[120px]" />
    <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[120px]" />

    <div className="relative z-10 min-h-screen flex flex-col">

      {/* ================= HEADER ================= */}
      <header className="px-8 md:px-16 lg:px-24 py-6 flex items-center justify-between border-b border-white/5">
        <Link
          to="/"
          className="text-xs uppercase tracking-[0.4em] text-indigo-400 hover:text-indigo-300 transition"
        >
          Chai Street
        </Link>

        <Link
          to="/login"
          className="text-xs uppercase tracking-[0.4em] text-gray-500 hover:text-indigo-400 transition"
        >
          Member Login
        </Link>
      </header>

      {/* ================= MAIN ================= */}
      <main className="flex-1 px-6 py-24 flex justify-center">

        <div
          className="w-full max-w-3xl rounded-3xl p-14 border backdrop-blur-xl transition-all duration-500"
          style={{
            background:
              "linear-gradient(160deg, rgba(15,20,40,0.95), rgba(8,12,22,0.98))",
            borderColor: "rgba(99,102,241,0.25)",
            boxShadow: "0 25px 80px rgba(0,0,0,0.7)",
          }}
        >

          {/* LABEL */}
          <p className="text-xs uppercase tracking-[0.4em] text-indigo-400 mb-6 font-semibold">
            Access Request
          </p>

          {/* TITLE */}
          <h1 className="text-4xl md:text-5xl font-semibold text-white mb-6 tracking-tight leading-tight">
            Join a disciplined
            <br />
            trading environment.
          </h1>

          {/* SUBTEXT */}
          <p className="text-gray-400 mb-14 leading-relaxed max-w-xl">
            Chai Street is a private trading community built around
            risk control, context awareness, and long-term capital preservation.
          </p>

          {/* FORM */}
          <form onSubmit={submit} className="space-y-12">

            {/* NAME */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">

              <div>
                <label className="block text-xs uppercase tracking-[0.3em] text-gray-500 mb-3">
                  First Name
                </label>
                <input
                  value={form.first_name}
                  onChange={(e) =>
                    setForm({ ...form, first_name: e.target.value })
                  }
                  className="w-full bg-transparent border-b border-white/20 pb-3
                  text-white outline-none transition-all duration-300
                  focus:border-indigo-400
                  focus:shadow-[0_5px_20px_rgba(99,102,241,0.3)]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-[0.3em] text-gray-500 mb-3">
                  Last Name
                </label>
                <input
                  value={form.last_name}
                  onChange={(e) =>
                    setForm({ ...form, last_name: e.target.value })
                  }
                  className="w-full bg-transparent border-b border-white/20 pb-3
                  text-white outline-none transition-all duration-300
                  focus:border-indigo-400
                  focus:shadow-[0_5px_20px_rgba(99,102,241,0.3)]"
                />
              </div>

            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-xs uppercase tracking-[0.3em] text-gray-500 mb-3">
                Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                className="w-full bg-transparent border-b border-white/20 pb-3
                text-white outline-none transition-all duration-300
                focus:border-indigo-400
                focus:shadow-[0_5px_20px_rgba(99,102,241,0.3)]"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-xs uppercase tracking-[0.3em] text-gray-500 mb-3">
                Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                className="w-full bg-transparent border-b border-white/20 pb-3
                text-white outline-none transition-all duration-300
                focus:border-indigo-400
                focus:shadow-[0_5px_20px_rgba(99,102,241,0.3)]"
              />
            </div>

            {/* AGE GROUP */}
            <div>
              <label className="block text-xs uppercase tracking-[0.3em] text-gray-500 mb-3">
                Age Group
              </label>
              <select
                value={form.age_group}
                onChange={(e) =>
                  setForm({ ...form, age_group: e.target.value })
                }
                className="w-full bg-transparent border-b border-white/20 pb-3
                text-white outline-none transition-all duration-300
                focus:border-indigo-400"
              >
                <option value="" className="bg-[#0b0f14]">Select age group</option>
                <option value="20-30" className="bg-[#0b0f14]">20–30</option>
                <option value="30-40" className="bg-[#0b0f14]">30–40</option>
                <option value="40-50" className="bg-[#0b0f14]">40–50</option>
              </select>
            </div>

            {/* EXPERTISE */}
            <div>
              <label className="block text-xs uppercase tracking-[0.3em] text-gray-500 mb-3">
                Trading Expertise
              </label>
              <select
                value={form.trading_expertise}
                onChange={(e) =>
                  setForm({ ...form, trading_expertise: e.target.value })
                }
                className="w-full bg-transparent border-b border-white/20 pb-3
                text-white outline-none transition-all duration-300
                focus:border-indigo-400"
              >
                <option value="" className="bg-[#0b0f14]">Select expertise</option>
                <option value="beginner" className="bg-[#0b0f14]">Beginner</option>
                <option value="advanced" className="bg-[#0b0f14]">Advanced</option>
                <option value="expert" className="bg-[#0b0f14]">Expert</option>
              </select>
            </div>

            {/* FOCUS */}
            <div>
              <label className="block text-xs uppercase tracking-[0.3em] text-gray-500 mb-6">
                Primary Focus
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {FOCUS.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => toggleFocus(f)}
                    className={`h-12 flex items-center justify-center text-xs uppercase tracking-wide rounded-full transition-all duration-300
                      ${
                        form.focus_areas.includes(f)
                          ? "bg-indigo-500/20 border border-indigo-400 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                          : "border border-white/20 text-gray-400 hover:border-indigo-400 hover:text-indigo-300"
                      }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="w-full relative overflow-hidden rounded-2xl py-4 font-semibold text-white tracking-wide transition-all duration-300 group"
              style={{
                background:
                  "linear-gradient(135deg, #6366f1, #8b5cf6)",
                boxShadow:
                  "0 0 40px rgba(99,102,241,0.5)",
              }}
            >
              <span className="relative z-10">
                Submit Request →
              </span>
              <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300" />
            </button>

          </form>

          <p className="mt-14 text-xs text-gray-500 leading-relaxed max-w-md">
            Access is subject to review and approval. Not all applications are accepted.
          </p>

        </div>
      </main>

      <footer className="px-8 md:px-16 lg:px-24 py-6 border-t border-white/5 text-gray-600 text-xs">
        © 2026 Chai Street. All rights reserved.
      </footer>

    </div>
  </div>
);
}
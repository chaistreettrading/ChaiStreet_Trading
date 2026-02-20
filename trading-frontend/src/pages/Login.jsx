import { useContext, useRef, useEffect, useState } from "react";
import { AuthContext } from "../auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

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

export default function Login() {
  const navigate = useNavigate();
  const { fetchUser } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      await fetchUser();
      navigate("/dashboard");
    } catch {
      setError("Invalid credentials. Please try again.");
    } finally { setLoading(false); }
  }

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
          to="/signup"
          className="text-xs uppercase tracking-[0.4em] text-gray-500 hover:text-indigo-400 transition"
        >
          Apply for Access
        </Link>
      </header>

      {/* ================= MAIN ================= */}
      <main className="flex-1 flex items-center justify-center px-6">

        <div
          className="relative w-full max-w-md rounded-3xl p-12 border backdrop-blur-xl transition-all duration-500"
          style={{
            background:
              "linear-gradient(160deg, rgba(15,20,40,0.95), rgba(8,12,22,0.98))",
            borderColor: "rgba(99,102,241,0.25)",
            boxShadow: "0 25px 70px rgba(0,0,0,0.7)",
          }}
        >

          {/* Section Label */}
          <p className="text-xs uppercase tracking-[0.4em] text-indigo-400 mb-6 font-semibold">
            Member Login
          </p>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-semibold text-white mb-4 tracking-tight">
            Welcome back.
          </h1>

          {/* Subtext */}
          <p className="text-gray-400 mb-10 leading-relaxed">
            Access your dashboard and portfolio environment.
          </p>

          {/* Error */}
          {error && (
            <div className="mb-8 px-4 py-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={submit} className="space-y-8">

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
                required
                className="w-full bg-transparent border-b border-white/20 pb-3
                text-white outline-none transition-all duration-300
                focus:border-indigo-400
                focus:shadow-[0_5px_20px_rgba(99,102,241,0.3)]
                placeholder:text-gray-600"
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
                required
                className="w-full bg-transparent border-b border-white/20 pb-3
                text-white outline-none transition-all duration-300
                focus:border-indigo-400
                focus:shadow-[0_5px_20px_rgba(99,102,241,0.3)]
                placeholder:text-gray-600"
              />
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="w-full relative overflow-hidden rounded-2xl py-4
              font-semibold text-white tracking-wide
              transition-all duration-300 group"
              style={{
                background:
                  "linear-gradient(135deg, #6366f1, #8b5cf6)",
                boxShadow:
                  "0 0 40px rgba(99,102,241,0.5)",
              }}
            >
              <span className="relative z-10">
                SIGN IN →
              </span>

              <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300" />
            </button>
          </form>

          {/* Links */}
          <div className="mt-10 text-sm text-gray-500 space-y-3">
            <p>
              Forgot your password?{" "}
              <Link
                to="/reset-password"
                className="text-indigo-400 hover:text-indigo-300 transition"
              >
                Reset it here
              </Link>
            </p>

            <p>
              Don’t have access?{" "}
              <Link
                to="/signup"
                className="text-indigo-400 hover:text-indigo-300 transition"
              >
                Apply for access
              </Link>
            </p>
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="px-8 md:px-16 lg:px-24 py-6 border-t border-white/5 text-gray-600 text-xs">
        © 2026 Chai Street. All rights reserved.
      </footer>
    </div>
  </div>
);
}
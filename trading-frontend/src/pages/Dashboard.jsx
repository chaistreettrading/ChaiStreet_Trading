import { useContext, useRef, useEffect } from "react";
import { AuthContext } from "../auth/AuthContext";
import api from "../api/axios";
import { Link } from "react-router-dom";

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
    for (let i = 0; i < 160; i++) {
      stars.push({ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, r: Math.random() * 1.2 + 0.15, alpha: Math.random() * 0.45 + 0.08, twinkle: Math.random() * Math.PI * 2, ts: Math.random() * 0.01 + 0.003, color: "255,255,255" });
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

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const needsDiscord = user && !user.discord_user_id;

  async function handleDiscordJoin() {
    try {
      const res = await api.get("/discord/oauth/url");
      window.location.href = res.data.url;
    } catch { alert("Unable to start Discord connection"); }
  }

  return (
    <div style={{ background: "#080b14", minHeight: "100vh" }} className="relative overflow-hidden flex flex-col">
      <StarField />

      {/* Header */}
      <header className="relative z-10 w-full px-8 md:px-16 lg:px-24 py-4 flex items-center justify-between" style={{ background: "rgba(8,11,20,0.85)", backdropFilter: "blur(14px)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <Link to="/" className="flex items-center gap-3">
          <img src="/cup.png" alt="Chai Street Trading" style={{ height: "36px", width: "auto", filter: "drop-shadow(0 0 8px rgba(212,175,55,0.6)) brightness(1.05)" }} />
          <span style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.75)" }}>Chai Street</span>
        </Link>

        {user && (
          <button
            onClick={logout}
            className="flex items-center gap-2 transition-colors"
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: "11px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        )}
      </header>

      <main className="relative z-10 flex-1 px-8 md:px-16 lg:px-24 py-16">
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>

          {/* Loading state */}
          {!user && (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", paddingTop: "120px" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", border: "1.5px solid rgba(212,175,55,0.2)", borderTopColor: "rgba(212,175,55,0.8)", animation: "spin 0.9s linear infinite", margin: "0 auto 24px" }} />
                <p style={{ fontSize: "11px", letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(148,163,184,0.5)" }}>Loading dashboard</p>
              </div>
            </div>
          )}

          {user && (
            <>
              {/* Discord Gate */}
              {needsDiscord && (
                <div
                  style={{
                    marginBottom: "60px", borderRadius: "20px", padding: "44px 48px",
                    background: "rgba(10,13,26,0.9)", border: "1px solid rgba(212,175,55,0.2)",
                    boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
                  }}
                >
                  <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)", marginBottom: "40px", marginLeft: "-48px", marginRight: "-48px" }} />
                  <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#d4af37", marginBottom: "12px" }}>Community Access Required</p>
                  <h3 style={{ fontSize: "22px", fontWeight: 700, color: "#ffffff", marginBottom: "16px", letterSpacing: "-0.01em" }}>Join the private Chai Street Discord</h3>
                  <p style={{ fontSize: "15px", color: "rgba(148,163,184,0.75)", lineHeight: 1.65, maxWidth: "520px", marginBottom: "28px" }}>
                    Chai Street operates through a private Discord environment where analysis, discussion, and updates are delivered in real time.
                  </p>
                  <button onClick={handleDiscordJoin}
                    className="group flex items-center gap-3"
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                  >
                    <span style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#d4af37", borderBottom: "1px solid #d4af37", paddingBottom: "2px" }}>Connect Discord</span>
                    <span style={{ color: "#d4af37", fontSize: "16px" }} className="group-hover:translate-x-2 transition-transform inline-block">→</span>
                  </button>
                </div>
              )}

              {/* Welcome */}
              <div style={{ marginBottom: "56px" }}>
                <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(148,163,184,0.45)", marginBottom: "16px" }}>Dashboard</p>
                <h1 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.025em", lineHeight: 1.1 }}>
                  Welcome back,{" "}
                  <span style={{ color: "#d4af37" }}>{user.first_name}</span>
                </h1>
                <div style={{ marginTop: "24px", height: "1px", background: "linear-gradient(to right, rgba(212,175,55,0.35), transparent)", maxWidth: "220px" }} />
              </div>

              {/* Info cards */}
              <div className="grid md:grid-cols-3 gap-4" style={{ marginBottom: "52px" }}>
                {[{ title: "Email", value: user.email }, { title: "Age Group", value: user.age_group }, { title: "Expertise", value: user.trading_expertise }].map((c) => (
                  <InfoCard key={c.title} title={c.title} value={c.value} />
                ))}
              </div>

              {/* Focus areas */}
              <div style={{ marginBottom: "52px" }}>
                <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(148,163,184,0.45)", marginBottom: "20px" }}>Primary Focus</p>
                <div className="flex flex-wrap gap-3">
                  {user.focus_areas.split(",").map((f) => (
                    <div key={f}
                      style={{
                        padding: "8px 20px", borderRadius: "999px",
                        border: "1px solid rgba(212,175,55,0.2)",
                        background: "rgba(10,13,26,0.8)",
                        fontSize: "10px", fontWeight: 600,
                        letterSpacing: "0.16em", textTransform: "uppercase",
                        color: "rgba(255,255,255,0.6)",
                      }}
                    >{f.trim()}</div>
                  ))}
                </div>
              </div>

              {/* Discord connected */}
              {!needsDiscord && (
                <div style={{ paddingTop: "28px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="flex items-center gap-2.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    <p style={{ fontSize: "13px", color: "rgba(148,163,184,0.65)" }}>
                      Connected to Discord as{" "}
                      <strong style={{ color: "#ffffff", fontWeight: 600 }}>{user.discord_username}</strong>
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <footer className="relative z-10 px-8 md:px-16 lg:px-24 py-7" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <p style={{ fontSize: "11px", color: "rgba(107,114,128,0.6)" }}>© 2026 Chai Street · Private Trading Community</p>
      </footer>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function InfoCard({ title, value }) {
  return (
    <div
      style={{
        background: "rgba(10,13,26,0.85)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "16px",
        padding: "28px",
        transition: "all 0.28s ease",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.borderColor = "rgba(212,175,55,0.2)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.3)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(148,163,184,0.45)", marginBottom: "10px" }}>{title}</p>
      <p style={{ fontSize: "15px", color: "#ffffff", fontWeight: 300, lineHeight: 1.4 }}>{value}</p>
    </div>
  );
}
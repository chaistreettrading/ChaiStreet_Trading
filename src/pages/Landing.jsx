
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import Navbar from "../components/Navbar";
import {
  TrendingUp,
  BarChart3,
  Timer,
  Scale,
  Users,
  ShieldCheck
} from "lucide-react";

/* ── Starfield ── */
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
    for (let i = 0; i < 220; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.4 + 0.15,
        alpha: Math.random() * 0.5 + 0.1,
        twinkle: Math.random() * Math.PI * 2,
        ts: Math.random() * 0.012 + 0.003,
        color: Math.random() > 0.88 ? "125,211,252" : "255,255,255",
      });
    }
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => {
        s.twinkle += s.ts;
        const a = s.alpha * (0.45 + 0.55 * Math.sin(s.twinkle));
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.color}, ${a})`;
ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0" />;
}

/* ── Scroll reveal ── */
function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
    >{children}</motion.div>
  );
}

/* ── Feature card — matching video: dark bg, rounded corners, app-icon box ── */
function FeatureCard({ icon, title, desc, delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}

      className="relative rounded-3xl p-8 border backdrop-blur-xl transition-all duration-500 cursor-default group overflow-hidden"
      style={{
        background: hovered
          ? "linear-gradient(135deg, rgba(20,30,60,0.95), rgba(12,18,35,0.95))"
          : "linear-gradient(135deg, rgba(12,18,35,0.9), rgba(8,12,22,0.9))",
       borderColor: hovered
  ? "rgba(99,102,241,0.22)"
  : "rgba(255,255,255,0.06)",

        boxShadow: hovered
  ? "0 12px 35px rgba(0,0,0,0.55)"
  : "0 6px 22px rgba(0,0,0,0.45)",
  transform: hovered ? "translateY(-6px) scale(1.02)" : "translateY(0)",
      }}
    >
      {/* Glow overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{
          background:
  "radial-gradient(circle at 20% 20%, rgba(99,102,241,0.10), transparent 65%)",

        }}
        />

      {/* Icon Box */}
      <div
        className="relative w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500"
        style={{
          background: hovered
            ? "linear-gradient(135deg, rgba(99,102,241,0.4), rgba(139,92,246,0.4))"
            : "rgba(255,255,255,0.05)",
          border: hovered
            ? "1px solid rgba(99,102,241,0.6)"
            : "1px solid rgba(255,255,255,0.08)",
          boxShadow: hovered
  ? "0 0 12px rgba(99,102,241,0.25)"
  : "none",

        }}
      >
        <span
          className="transition-all duration-300"
          style={{
            color: hovered ? "#ffffff" : "#a5b4fc",
          }}
        >
          {icon}
        </span>
      </div>

      <h3 className="relative text-xl font-semibold text-white mb-4 tracking-tight">
        {title}
      </h3>

      <p className="relative text-base text-gray-400 leading-7">
        {desc}
      </p>
    </motion.div>
  );
}
/* ── Stat ── */
function StatItem({ value, label, delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <motion.div ref={ref} className="text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      <p style={{ fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 800, color: "#ffffff", marginBottom: "8px", letterSpacing: "-0.02em", lineHeight: 1 }}>
        {value}
      </p>
      <p style={{ fontSize: "11px", color: "rgba(148,163,184,0.6)", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 500 }}>
        {label}
      </p>
    </motion.div>
  );
}

/* ── SVG Icons matching the video app-icon style ── */
const IconLongTerm = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="13" width="4" height="8" rx="1" fill="#f472b6" opacity="0.9"/>
    <rect x="9" y="9" width="4" height="12" rx="1" fill="#818cf8"/>
    <rect x="15" y="5" width="4" height="16" rx="1" fill="#34d399"/>
  </svg>
);
const IconSwing = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path d="M3 17 L7 11 L11 14 L16 7 L21 10" stroke="#818cf8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 7 L21 7 L21 12" stroke="#818cf8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconDay = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="4" stroke="#fbbf24" strokeWidth="2"/>
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const IconPortfolio = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path d="M12 3L2 7l10 4 10-4-10-4z" stroke="#f59e0b" strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M2 17l10 4 10-4M2 12l10 4 10-4" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconCommunity = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#60a5fa" strokeWidth="1.8" strokeLinecap="round"/>
    <circle cx="9" cy="7" r="4" stroke="#60a5fa" strokeWidth="1.8"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="#60a5fa" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);
const IconRisk = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#34d399" strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M9 12l2 2 4-4" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
/* ── Main ── */
export default function Landing() {
 const features = [
  {
    icon: <BarChart3 size={22} strokeWidth={1.8} />,
    title: "Long Term Trading",
    desc: "Strategic position building with a focus on macro trends, fundamental analysis, and patient capital allocation.",
  },
  {
    icon: <TrendingUp size={22} strokeWidth={1.8} />,
    title: "Swing Trading",
    desc: "Capitalize on medium-term price movements using technical setups, volume analysis, and key level identification.",
  },
  {
    icon: <Timer size={22} strokeWidth={1.8} />,
    title: "Day Trading",
    desc: "Intraday opportunities with strict risk parameters, real-time analysis, and disciplined entry/exit protocols.",
  },
  {
    icon: <Scale size={22} strokeWidth={1.8} />,
    title: "Portfolio Management",
    desc: "Holistic portfolio construction, risk diversification, drawdown control, and long-term wealth preservation.",
  },
  {
    icon: <Users size={22} strokeWidth={1.8} />,
    title: "Private Community",
    desc: "Members-only Discord environment with real-time trade alerts, live discussions, and mentorship from experienced traders.",
  },
  {
    icon: <ShieldCheck size={22} strokeWidth={1.8} />,
    title: "Risk Management",
    desc: "Advanced risk frameworks, position sizing algorithms, and stop-loss discipline built into every strategy.",
  },
];

  return (
    <div style={{ background: "#080b14", minHeight: "100vh" }} className="relative overflow-x-hidden">
      <StarField />

      {/* Subtle ambient blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div style={{ position: "absolute", top: "-15%", left: "-8%", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", top: "5%", right: "-12%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(56,189,248,0.05) 0%, transparent 70%)", borderRadius: "50%" }} />
      </div>

      <Navbar />

      {/* ═══ HERO ═══ */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center pt-20 pb-16">

        {/* Badge — pill with dot */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "8px 18px", borderRadius: "999px",
            background: "rgba(99,102,241,0.1)",
            border: "1px solid rgba(99,102,241,0.35)",
            marginBottom: "40px",
          }}
        >
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#818cf8", boxShadow: "0 0 8px rgba(129,140,248,0.8)", animation: "pulse 2s infinite" }} />
          <span style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#a5b4fc" }}>
            Private · Members Only · USA
          </span>
        </motion.div>

        {/* Giant headline — exactly like video */}
<motion.h1
  initial={{ opacity: 0, y: 28 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.95, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
  className="text-center"
  style={{
    fontSize: "clamp(56px, 8vw, 100px)",
    fontWeight: 800,
    lineHeight: 1.05,
    letterSpacing: "-0.02em",
    maxWidth: "1100px",
    margin: "0 auto 28px",
  }}
>
  <span style={{ display: "block", color: "#ffffff" }}>
    Trade with{" "}
    <span
      style={{
        background: "linear-gradient(135deg, #818cf8, #a78bfa)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      Precision.
    </span>
  </span>

  <span style={{ display: "block", marginTop: "12px" }}>
    <span style={{ color: "#ffffff" }}>Trade with </span>
    <span
      style={{
        background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      Discipline.
    </span>
  </span>
</motion.h1>
{/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          style={{ maxWidth: "660px", fontSize: "17px", color: "rgba(148,163,184,0.85)", lineHeight: 1.7, marginBottom: "44px" }}
        >
          Chai Street Trading is a private community built around risk control,
          market context, and long-term capital preservation — engineered for
          serious traders.
        </motion.p>

        {/* CTAs — purple glowing pill + dark bordered pill like video */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 items-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
        >
          <Link
            to="/signup"
            className="group relative inline-flex items-center gap-3 font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-[1.03]"
            style={{
              fontSize: "15px",
              padding: "16px 36px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #7c3aed, #9333ea)",
              boxShadow: "0 0 40px rgba(124,58,237,0.55), 0 4px 20px rgba(0,0,0,0.3)",
            }}
          >
            <span className="relative z-10">Apply for Access</span>
            <motion.span
              className="relative z-10 font-light"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >→</motion.span>
            <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300" />
          </Link>

          <button
  onClick={() => {
    document
      .getElementById("features")
      ?.scrollIntoView({ behavior: "smooth" });
  }}
  className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-white text-sm transition-all duration-300 overflow-hidden"
  style={{
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.12)",
    backdropFilter: "blur(10px)",
  }}
>
  <span className="relative z-10">Learn More</span>

  <span className="relative z-10 transition-transform duration-300 group-hover:translate-y-1">
    ↓
  </span>

  {/* Hover glow */}
  <span
    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
    style={{
      background:
        "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.15))",
    }}
  />
</button>
        </motion.div>

        {/* Scroll line */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
        >
          <motion.div
            style={{ width: "1px", height: "48px", background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.35), transparent)", margin: "0 auto" }}
            animate={{ scaleY: [0.5, 1, 0.5], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2.2, repeat: Infinity }}
          />
        </motion.div>
      </section>

      {/* ═══ STATS ═══ */}
      <section id="community" className="relative z-10 py-24" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <StatItem value="500+" label="Active Members" delay={0} />
            <StatItem value="3+" label="Years Active" delay={0.1} />
            <StatItem value="6" label="Trading Styles" delay={0.2} />
            <StatItem value="24/7" label="Community" delay={0.3} />
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section id="features" className="relative z-10 py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-16">
            <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.4em", textTransform: "uppercase", color: "#818cf8", marginBottom: "16px" }}>
              What We Offer
            </p>
            <h2 style={{ fontSize: "clamp(36px, 4.5vw, 52px)", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.025em", marginBottom: "18px" }}>
              Built for{" "}
              <span style={{ background: "linear-gradient(135deg, #818cf8, #38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Every Trader
              </span>
            </h2>
            <p style={{ maxWidth: "560px", margin: "0 auto", fontSize: "16px", color: "rgba(148,163,184,0.8)", lineHeight: 1.65 }}>
              Whether you trade daily or build long-term positions, our community
              delivers structured strategies and real-time intelligence.
            </p>
          </Reveal>

          {/* 2-column grid like video */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

            {features.map((f, i) => (
              <FeatureCard key={f.title} icon={f.icon} title={f.title} desc={f.desc} delay={i * 0.08} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PHILOSOPHY ═══ */}
      <section id="about" className="relative z-10 py-28 px-6" style={{ background: "linear-gradient(180deg, transparent, rgba(12,16,40,0.5), transparent)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            {/* Left */}
            <Reveal>
              <div className="inline-flex items-center px-5 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-md mb-6 shadow-[0_0_25px_rgba(99,102,241,0.25)]">
  <span className="text-xs uppercase tracking-[0.3em] text-indigo-400 font-semibold">
    Our Philosophy
  </span>
</div>
              <h2 style={{ fontSize: "clamp(40px, 5vw, 60px)", fontWeight: 900, color: "#ffffff", lineHeight: 1.08, letterSpacing: "-0.03em", marginBottom: "24px" }}>
                Markets reward{" "}
                <span style={{ background: "linear-gradient(135deg, #f59e0b, #fbbf24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  understanding,
                </span>{" "}
                not urgency.
              </h2>
              <p style={{ fontSize: "16px", color: "rgba(148,163,184,0.8)", lineHeight: 1.7, marginBottom: "28px" }}>
                Chai Street is not a signal service, not a prediction engine,
                and not a hype-driven community. We help traders understand{" "}
                <strong style={{ color: "#ffffff" }}>why</strong> markets move
                — so decisions are grounded in context, not emotion.
              </p>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 font-semibold transition-all duration-300 group"
                style={{ fontSize: "15px", color: "#818cf8" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#a5b4fc"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#818cf8"; }}
              >
                Join the Community
                <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
              </Link>
            </Reveal>

            {/* Right — numbered pillars like video */}
 <Reveal delay={0.15}>
  <div
    className="relative p-8 rounded-3xl overflow-hidden"
    style={{
      background: "rgba(14,18,38,0.9)",
      border: "1px solid rgba(99,102,241,0.25)",
      boxShadow: "0 0 60px rgba(99,102,241,0.12)",
      backdropFilter: "blur(20px)",
    }}
  >
    {/* Header */}
    <div className="flex items-center gap-3 mb-8">
      <div
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "14px",
          background: "rgba(99,102,241,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TrendingUp size={20} strokeWidth={1.8} color="#818cf8" />
      </div>

      <div>
        <p style={{ fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(148,163,184,0.6)" }}>
          Community Status
        </p>
        <p style={{ fontSize: "15px", fontWeight: 600, color: "#ffffff" }}>
          Active & Growing
        </p>
      </div>
    </div>

    {/* Progress Bars */}
    {[
      { label: "Risk Management", value: 95 },
      { label: "Technical Analysis", value: 88 },
      { label: "Market Context", value: 92 },
    ].map((item, i) => (
      <div key={item.label} className="mb-6">
        <div className="flex justify-between mb-2">
          <span style={{ fontSize: "13px", color: "rgba(148,163,184,0.8)" }}>
            {item.label}
          </span>
          <span style={{ fontSize: "13px", color: "#818cf8" }}>
            {item.value}%
          </span>
        </div>

        <div
          style={{
            height: "6px",
            background: "rgba(255,255,255,0.07)",
            borderRadius: "999px",
            overflow: "hidden",
          }}
        >
         <motion.div
  initial={{ width: 0 }}
  whileInView={{ width: `${item.value}%` }}
  transition={{ duration: 1.2, delay: i * 0.2 }}
  style={{
    height: "100%",
    background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
    borderRadius: "999px",
  }}
/>
        </div>
      </div>
    ))}

    {/* Bottom Stats */}
    <div
      className="grid grid-cols-3 gap-4 pt-6"
      style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="text-center">
        <p style={{ fontSize: "20px", fontWeight: 700, color: "#ffffff" }}>500+</p>
        <p style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(148,163,184,0.6)" }}>
          Members
        </p>
      </div>

      <div className="text-center">
        <p style={{ fontSize: "20px", fontWeight: 700, color: "#ffffff" }}>4</p>
        <p style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(148,163,184,0.6)" }}>
          Strategies
        </p>
      </div>

      <div className="text-center">
        <p style={{ fontSize: "20px", fontWeight: 700, color: "#ffffff" }}>24/7</p>
        <p style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(148,163,184,0.6)" }}>
          Live Chat
        </p>
      </div>
    </div>
  </div>
</Reveal>

          </div>
        </div>
      </section>

      {/* ═══ TRADING PATHWAYS ═══ */}
    <section id="pathways" className="relative z-10 py-28 px-6">
  <div className="max-w-7xl mx-auto">

    {/* Header */}
    <Reveal className="text-center mb-20">
      <p
        style={{
          fontSize: "11px",
          fontWeight: 600,
          letterSpacing: "0.4em",
          textTransform: "uppercase",
          color: "#818cf8",
          marginBottom: "16px",
        }}
      >
        Trading Pathways
      </p>

      <h2
        style={{
          fontSize: "clamp(36px, 4.5vw, 52px)",
          fontWeight: 800,
          color: "#ffffff",
          letterSpacing: "-0.025em",
        }}
      >
        Choose your path.{" "}
        <span
          style={{
            color: "rgba(148,163,184,0.55)",
            fontWeight: 400,
            fontSize: "0.75em",
          }}
        >
          Build with discipline.
        </span>
      </h2>
    </Reveal>

    {/* 4 Vertical Cards */}
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">

      {[
        {
          title: "Long-Term Investing",
          level: "For Novice Investors",
          features: [
            "Regime awareness framework",
            "Risk alignment models",
            "Capital growth structure",
            "Community access",
          ],
        },
        {
          title: "Swing Trading",
          level: "Intermediate",
          features: [
            "Volatility-based setups",
            "Multi-day execution models",
            "Structure-based entries",
            "Real-time discussions",
          ],
        },
        {
          title: "Day Trading & Futures",
          level: "Advanced",
          features: [
            "Liquidity-based execution",
            "Acceptance & structure models",
            "Intraday risk control",
            "High-conviction trade reviews",
          ],
        },
        {
          title: "Private 1-on-1 Coaching",
          level: "Selective",
          features: [
            "Portfolio strategy review",
            "Psychology alignment",
            "Personal risk framework",
            "Tailored mentorship",
          ],
        },
      ].map((card, i) => (
        <Reveal key={card.title} delay={i * 0.08}>
          <div
            className="relative rounded-3xl p-10 flex flex-col h-full transition-all duration-300 hover:-translate-y-2"
            style={{
              background: "rgba(12,16,36,0.92)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 12px 35px rgba(0,0,0,0.45)",
            }}
          >

            {/* Title */}
            <h3
              style={{
                fontSize: "20px",
                fontWeight: 700,
                color: "#ffffff",
                marginBottom: "8px",
              }}
            >
              {card.title}
            </h3>

            {/* Level */}
            <p
              style={{
                fontSize: "11px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#818cf8",
                marginBottom: "30px",
              }}
            >
              {card.level}
            </p>

            {/* Feature List */}
            <div className="flex flex-col gap-4 mb-10 flex-grow">
              {card.features.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div
                    style={{
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                      background: "rgba(99,102,241,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10px",
                        color: "#818cf8",
                      }}
                    >
                      ✓
                    </span>
                  </div>

                  <span
                    style={{
                      fontSize: "14px",
                      color: "rgba(148,163,184,0.8)",
                    }}
                  >
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link
              to="/signup"
              className="text-center font-semibold transition-all duration-300 hover:bg-white/10"
              style={{
                padding: "14px 0",
                borderRadius: "14px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#ffffff",
              }}
            >
              Apply Now →
            </Link>

          </div>
        </Reveal>
      ))}

    </div>
  </div>
</section>


      {/* ═══ CTA BANNER ═══ */}
      <section id="contact" className="relative z-10 py-28 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <div
              className="relative rounded-3xl p-14 overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(99,102,241,0.14), rgba(139,92,246,0.09))",
                border: "1px solid rgba(99,102,241,0.38)",
                boxShadow: "0 0 80px rgba(99,102,241,0.12)",
              }}
            >
              <div className="absolute inset-0 opacity-[0.15] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "50px 50px" }} />
              <div className="relative z-10">
                <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.4em", textTransform: "uppercase", color: "#818cf8", marginBottom: "18px" }}>Ready to Join?</p>
                <h2 style={{ fontSize: "clamp(36px, 5vw, 54px)", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.025em", marginBottom: "18px" }}>
                  Start Trading{" "}
                  <span style={{ background: "linear-gradient(135deg, #818cf8, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Smarter</span>
                </h2>
                <p style={{ maxWidth: "480px", margin: "0 auto 40px", fontSize: "16px", color: "rgba(148,163,184,0.8)", lineHeight: 1.65 }}>
                  Join a community of serious traders focused on risk control, discipline, and long-term growth.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/signup"
                    className="group relative inline-flex items-center justify-center gap-3 font-bold text-white overflow-hidden transition-all duration-300 hover:scale-[1.03]"
                    style={{ fontSize: "15px", padding: "16px 40px", borderRadius: "16px", background: "linear-gradient(135deg, #7c3aed, #9333ea)", boxShadow: "0 0 40px rgba(124,58,237,0.5)" }}
                  >
                    <span className="relative z-10">Apply for Access</span>
                    <span className="relative z-10">→</span>
                    <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300" />
                  </Link>
                  <Link to="/login"
                    className="inline-flex items-center justify-center font-semibold text-white transition-all duration-300 hover:bg-white/5"
                    style={{ fontSize: "15px", padding: "16px 40px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.2)" }}
                  >Sign In</Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="relative z-10 py-10 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <img src="/chai-logo.png" alt="Chai Street Trading" style={{ height: "28px", width: "auto", objectFit: "contain", opacity: 0.7, filter: "drop-shadow(0 0 5px rgba(212,175,55,0.4))" }} />
            <span style={{ fontSize: "11px", color: "rgba(107,114,128,0.8)", textTransform: "uppercase", letterSpacing: "0.18em" }}>Chai Street Trading</span>
          </div>
          <p style={{ fontSize: "12px", color: "rgba(107,114,128,0.7)" }}>© 2026 Chai Street. All rights reserved.</p>
          <p style={{ fontSize: "11px", color: "rgba(99,102,241,0.6)", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 500 }}>Context over noise</p>
        </div>
      </footer>
    </div>
  );
}
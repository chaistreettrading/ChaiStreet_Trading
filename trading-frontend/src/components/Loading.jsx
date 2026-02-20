import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

function StarField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    const stars = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    // Create stars
    for (let i = 0; i < 220; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.3 + 0.2,
        alpha: Math.random() * 0.5 + 0.1,
        speed: Math.random() * 0.05 + 0.02,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach((s) => {
        s.y += s.speed;
        if (s.y > canvas.height) {
          s.y = 0;
          s.x = Math.random() * canvas.width;
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: "none" }}
    />
  );
}

export default function IntroLoader({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => onComplete?.(), 3800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at center, #0b1222 0%, #070c18 50%, #050816 100%)",
      }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <StarField />

      {/* Subtle Depth Gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, rgba(56,189,248,0.05), transparent 60%)",
        }}
      />

      {/* LOGO — Bigger, Clean, No Glow */}
      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: [0, -8, 0],
        }}
        transition={{
          duration: 1,
          ease: [0.16, 1, 0.3, 1],
          delay: 0.2,
          y: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      >
        <img
          src="/cup.png"
          alt="Chai Street Trading"
          style={{
            width: "320px",      // 🔥 increased size
            maxWidth: "75vw",
            height: "auto",
            objectFit: "contain",
            filter: "brightness(1.05)", // no glow
          }}
        />
      </motion.div>

      {/* TEXT */}
      <motion.div
        className="relative z-10 mt-10 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <TypewriterText />

        <motion.p
          className="mt-5 text-xs font-light"
          style={{
            color: "rgba(148,163,184,0.6)",
            letterSpacing: "0.45em",
            textTransform: "uppercase",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4 }}
        >
          Private Trading Community
        </motion.p>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        className="absolute z-10"
        style={{ bottom: "52px", left: "50%", transform: "translateX(-50%)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div
          style={{
            width: "260px",
            height: "2px",
            background: "rgba(255,255,255,0.08)",
            borderRadius: "2px",
            overflow: "hidden",
          }}
        >
          <motion.div
            style={{
              height: "100%",
              background:
                "linear-gradient(90deg, #6366f1, #a78bfa 50%, #38bdf8)",
            }}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.6, duration: 3 }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

function TypewriterText() {
  const words = [
    { text: "CHAI", blue: false },
    { text: "STREET", blue: true },
    { text: "TRADING", blue: true },
  ];

  let globalIdx = 0;

  return (
    <div className="flex gap-[18px] items-center justify-center flex-wrap px-4">
      {words.map((word, wi) => (
        <span key={wi} className="inline-flex">
          {word.text.split("").map((char) => {
            const idx = globalIdx++;
            return (
              <motion.span
                key={idx}
                style={{
                  fontSize: "clamp(20px, 3vw, 34px)",
                  fontWeight: 900,
                  letterSpacing: "0.22em",
                  color: word.blue ? "#38bdf8" : "#ffffff",
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 + idx * 0.05 }}
              >
                {char}
              </motion.span>
            );
          })}
        </span>
      ))}

      <motion.span
        style={{
          display: "inline-block",
          width: "2px",
          height: "1em",
          background: "#38bdf8",
          marginLeft: "4px",
        }}
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      />
    </div>
  );
}

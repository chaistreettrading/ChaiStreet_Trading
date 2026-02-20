import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "About", href: "#about" },
    { label: "Community", href: "#community" },
    { label: "Contact", href: "#contact" },
  ];

  const scrollTo = (id) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 w-full z-50"
        style={{
          background: scrolled
            ? "rgba(8,11,20,0.97)"
            : "rgba(8,11,20,0.85)",
          backdropFilter: "blur(18px)",
          borderBottom: scrolled
            ? "1px solid rgba(255,255,255,0.08)"
            : "1px solid rgba(255,255,255,0.05)",
        }}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.6,
          delay: 0.1,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {/* Increased Navbar Height */}
        <div className="w-full px-10 md:px-20 h-[90px] flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-4 group">
            <img
              src="/cup.png"
              alt="Chai Street Trading"
              style={{
                height: "50px",   // 🔥 increased logo size
                filter:
                  "drop-shadow(0 0 10px rgba(212,175,55,0.65)) brightness(1.05)",
              }}
            />
            <span
              className="hidden sm:block font-semibold uppercase tracking-[0.18em]"
              style={{
                fontSize: "16px",  // 🔥 bigger brand text
                color: "rgba(255,255,255,0.9)",
              }}
            >
              Chai Street
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-14">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className="transition-all duration-200 font-medium"
                style={{
                  fontSize: "17px",   // 🔥 bigger nav links
                  color: "rgba(255,255,255,0.75)",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.color = "#ffffff")
                }
                onMouseLeave={(e) =>
                  (e.target.style.color =
                    "rgba(255,255,255,0.75)")
                }
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/login"
              style={{
                fontSize: "17px",   // 🔥 bigger Sign In
                fontWeight: 500,
                color: "rgba(255,255,255,0.75)",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.target.style.color = "#ffffff")
              }
              onMouseLeave={(e) =>
                (e.target.style.color =
                  "rgba(255,255,255,0.75)")
              }
            >
              Sign In
            </Link>

            <Link
              to="/signup"
              className="font-semibold text-white transition-all duration-300 hover:scale-[1.05]"
              style={{
                fontSize: "16px",     // 🔥 bigger button text
                padding: "15px 34px", // 🔥 bigger button
                borderRadius: "999px",
                background:
                  "linear-gradient(135deg, #7c3aed, #9333ea)",
                boxShadow:
                  "0 0 30px rgba(124,58,237,0.6)",
              }}
            >
              Apply for Access
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2"
            style={{ color: "rgba(255,255,255,0.8)" }}
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="16" y2="18" />
            </svg>
          </button>
        </div>
      </motion.header>

      {/* Mobile Drawer (unchanged except slightly larger logo) */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[998]"
              style={{
                background: "rgba(0,0,0,0.7)",
                backdropFilter: "blur(4px)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />

            <motion.aside
              className="fixed top-0 right-0 h-full w-[320px] z-[999] flex flex-col px-8 py-8"
              style={{
                background: "#0d1120",
                borderLeft:
                  "1px solid rgba(255,255,255,0.08)",
              }}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                duration: 0.32,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div className="flex items-center justify-between mb-12">
                <img
                  src="/chai-logo.png"
                  alt="Chai Street"
                  style={{
                    height: "40px",
                    filter:
                      "drop-shadow(0 0 8px rgba(212,175,55,0.6))",
                  }}
                />
                <button
                  onClick={() => setMobileOpen(false)}
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    fontSize: "30px",
                  }}
                >
                  ×
                </button>
              </div>

              <nav className="flex flex-col gap-5 mb-auto">
                {navLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => scrollTo(link.href)}
                    className="text-left px-3 py-3 rounded-xl transition"
                    style={{
                      fontSize: "17px",
                      color: "rgba(255,255,255,0.75)",
                    }}
                  >
                    {link.label}
                  </button>
                ))}
              </nav>

              <div className="flex flex-col gap-4 mt-10">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="text-center py-3 rounded-full"
                  style={{
                    border:
                      "1px solid rgba(255,255,255,0.2)",
                    color:
                      "rgba(255,255,255,0.8)",
                  }}
                >
                  Sign In
                </Link>

                <Link
                  to="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="text-center py-3 rounded-full text-white font-semibold"
                  style={{
                    background:
                      "linear-gradient(135deg, #7c3aed, #9333ea)",
                  }}
                >
                  Apply for Access
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

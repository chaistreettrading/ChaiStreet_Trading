import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const needsDiscord = user && !user.discord_user_id;

  async function handleDiscordJoin() {
    try {
      const res = await api.get("/discord/oauth/url");
      window.location.href = res.data.url;
    } catch {
      alert("Unable to start Discord connection");
    }
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at top, #1a1f26 0%, #0b0f14 55%, #070b10 100%)",
      }}
    >
      {/* GLOBAL GRID / DEPTH */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:70px_70px]" />

      <div className="relative z-10 min-h-screen flex flex-col">

        {/* ================= HEADER ================= */}
        <header className="w-full px-8 md:px-16 lg:px-24 py-6 flex items-center justify-between bg-black/40 backdrop-blur-xl border-b border-white/10">
          <Link
            to="/"
            className="text-xs tracking-ultra uppercase text-stone-300 hover:text-gold transition"
          >
            Chai Street
          </Link>

          {user && (
            <button
              onClick={logout}
              className="text-xs tracking-ultra uppercase text-stone-400 hover:text-gold transition"
            >
              Logout
            </button>
          )}
        </header>

        {/* ================= MAIN ================= */}
        <main className="flex-1 px-8 md:px-16 lg:px-24 py-20">
          <div className="max-w-5xl mx-auto">

            {/* LOADING */}
            {!user && (
              <div className="flex justify-center py-40">
                <div className="text-center">
                  <div className="w-10 h-10 border-2 border-gold/40 border-t-gold rounded-full animate-spin mx-auto mb-6" />
                  <p className="text-xs tracking-ultra uppercase text-stone-400">
                    Loading dashboard
                  </p>
                </div>
              </div>
            )}

            {user && (
              <>
                {/* ================= DISCORD GATE ================= */}
                {needsDiscord && (
                  <section className="mb-24 bg-[#0e141b] border border-gold/20 rounded-3xl px-12 py-16">
                    <p className="text-xs tracking-ultra uppercase text-gold mb-4">
                      Community Access Required
                    </p>

                    <h3 className="text-xl md:text-2xl font-serif tracking-tight text-white mb-6">
                      Join the private Chai Street Discord
                    </h3>

                    <p className="text-base md:text-lg text-stone-400 leading-relaxed max-w-2xl mb-10">
                      Chai Street operates through a private Discord environment
                      where analysis, discussion, and updates are delivered in
                      real time.
                    </p>

                    <button
                      onClick={handleDiscordJoin}
                      className="group inline-flex items-center gap-4 text-xs tracking-ultra uppercase text-gold hover:text-white transition"
                    >
                      <span className="border-b border-gold pb-1 group-hover:border-white transition">
                        Connect Discord
                      </span>
                      <span className="group-hover:translate-x-2 transition-transform">
                        →
                      </span>
                    </button>
                  </section>
                )}

                {/* ================= WELCOME ================= */}
                <section className="mb-24">
                  <p className="text-xs tracking-ultra uppercase text-stone-400">
                    Dashboard
                  </p>

                  <h1 className="mt-6 text-3xl md:text-4xl font-serif tracking-tight text-white">
                    Welcome back,{" "}
                    <span className="text-gold">{user.first_name}</span>
                  </h1>
                </section>

                {/* ================= PROFILE ================= */}
                <section className="grid md:grid-cols-3 gap-12 mb-24">
                  <Info title="Email" value={user.email} />
                  <Info title="Age Group" value={user.age_group} />
                  <Info title="Expertise" value={user.trading_expertise} />
                </section>

                {/* ================= FOCUS AREAS ================= */}
                <section className="mb-24">
                  <p className="text-xs tracking-ultra uppercase text-stone-400 mb-6">
                    Primary Focus
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {user.focus_areas.split(",").map((f) => (
                      <div
                        key={f}
                        className="h-12 flex items-center justify-center rounded-full border border-gold/20 bg-[#0e141b] text-xs tracking-ultra uppercase text-stone-300"
                      >
                        {f.trim()}
                      </div>
                    ))}
                  </div>
                </section>

                {/* ================= DISCORD STATUS ================= */}
                {!needsDiscord && (
                  <section className="pt-10 border-t border-white/10">
                    <p className="text-sm text-stone-400">
                      Connected to Discord as{" "}
                      <span className="text-white font-medium">
                        {user.discord_username}
                      </span>
                    </p>
                  </section>
                )}
              </>
            )}
          </div>
        </main>

        {/* ================= FOOTER ================= */}
        <footer className="px-8 md:px-16 lg:px-24 py-10 border-t border-white/10 text-stone-500">
          <p className="text-xs tracking-wide">
            © 2026 Chai Street · Private Trading Community
          </p>
        </footer>
      </div>
    </div>
  );
}

/* ================= INFO CARD ================= */

function Info({ title, value }) {
  return (
    <div className="bg-[#0e141b] border border-white/10 rounded-2xl p-8">
      <p className="text-xs tracking-ultra uppercase text-stone-400 mb-3">
        {title}
      </p>
      <p className="text-base md:text-lg text-white font-light">
        {value}
      </p>
    </div>
  );
}

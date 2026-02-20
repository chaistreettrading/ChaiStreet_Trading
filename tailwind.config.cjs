/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        serif: ["Cormorant Garamond", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        gold: {
          DEFAULT: "hsl(var(--gold))",
          light: "hsl(var(--gold-light))",
          dark: "hsl(var(--gold-dark))",
          glow: "hsl(var(--gold-glow))",
          muted: "hsl(var(--gold-muted))",
        },
        stone: {
          200: "hsl(var(--stone-200))",
          300: "hsl(var(--stone-300))",
          400: "hsl(var(--stone-400))",
          500: "hsl(var(--stone-500))",
          600: "hsl(var(--stone-600))",
          700: "hsl(var(--stone-700))",
          800: "hsl(var(--stone-800))",
          900: "hsl(var(--stone-900))",
        },
      },
      boxShadow: {
        gold: "0 4px 20px -4px hsl(38 65% 50% / 0.15)",
        "gold-soft": "0 4px 24px -6px hsl(38 65% 50% / 0.2)",
        "gold-glow": "0 0 30px -5px hsl(38 65% 50% / 0.35)",
        glass: "0 8px 32px -8px hsl(30 10% 15% / 0.08)",
        soft: "0 2px 12px -2px hsl(30 10% 15% / 0.06)",
      },
      letterSpacing: {
        ultra: "0.25em",
        "wide-custom": "0.15em",
      },
      animation: {
        "fade-in-up": "fade-in-up 0.8s ease-out forwards",
        "fade-in": "fade-in 0.6s ease-out forwards",
        "float-subtle": "float-subtle 6s ease-in-out infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "slide-up": "slide-up 0.6s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

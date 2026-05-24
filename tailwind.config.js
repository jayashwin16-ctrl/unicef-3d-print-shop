/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#06b6d4",
          "blue-dark": "#0e7490",
          accent: "#06b6d4",
          "accent-deep": "#0e7490",
          ink: "#0f172a",
          heading: "#0f172a",
          bg: "#f1f5f9",
          surface: "#f8fafc",
          card: "#ffffff",
          border: "#e2e8f0",
          muted: "#64748b",
          dim: "#94a3b8",
        },
        print: { from: "#22d3ee", to: "#0d9488" },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
      },
      fontSize: {
        display: ["2.5rem", { lineHeight: "1.15", letterSpacing: "-0.025em", fontWeight: "800" }],
        "display-lg": ["3.25rem", { lineHeight: "1.1", letterSpacing: "-0.03em", fontWeight: "800" }],
      },
      boxShadow: {
        soft: "0 4px 24px -4px rgba(15, 23, 42, 0.08)",
        card: "0 1px 3px rgba(15, 23, 42, 0.06), 0 12px 32px -8px rgba(15, 23, 42, 0.1)",
        "card-hover": "0 4px 6px rgba(15, 23, 42, 0.04), 0 24px 48px -12px rgba(6, 182, 212, 0.15)",
        nav: "0 1px 0 rgba(15, 23, 42, 0.06), 0 8px 32px -8px rgba(15, 23, 42, 0.08)",
      },
      maxWidth: {
        site: "72rem",
        prose: "42rem",
      },
      backgroundImage: {
        "mesh-hero":
          "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(6, 182, 212, 0.25), transparent), radial-gradient(ellipse 50% 40% at 100% 50%, rgba(13, 148, 136, 0.12), transparent)",
        "gradient-cta": "linear-gradient(135deg, #0891b2 0%, #06b6d4 50%, #22d3ee 100%)",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

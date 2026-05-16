/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#1CABE2",
          "blue-dark": "#374EA2",
          heading: "#1a2e4a",
          bg: "#f0f7fc",
          card: "#ffffff",
          border: "#d0e4f0",
          muted: "#666666",
          dim: "#999999",
        },
        unicef: { blue: "#1CABE2", dark: "#374EA2", accent: "#FFC20E" },
      },
      fontFamily: {
        sans: [
          "Segoe UI",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
      },
      maxWidth: {
        site: "900px",
      },
    },
  },
  plugins: [],
};

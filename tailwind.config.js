/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#0ea5e9",
          "blue-dark": "#0369a1",
          heading: "#1a2e4a",
          bg: "#f0f7fc",
          card: "#ffffff",
          border: "#d0e4f0",
          muted: "#666666",
          dim: "#999999",
        },
        print: { from: "#0ea5e9", to: "#0f766e" },
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

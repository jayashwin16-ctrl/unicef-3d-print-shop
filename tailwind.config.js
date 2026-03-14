/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        unicef: { blue: "#1CABE2", dark: "#374EA2", accent: "#FFC20E" },
      },
    },
  },
  plugins: [],
};

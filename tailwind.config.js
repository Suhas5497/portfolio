/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        primary: "#10b981",
        "primary-dark": "#059669",
        background: "#ffffff",
        "text-primary": "#111827",
        "text-secondary": "#6b7280",
        border: "#e5e7eb",
      },
    },
  },
  plugins: [],
};

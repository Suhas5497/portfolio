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
        display: ["Sora", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        primary: "rgb(var(--c-primary) / <alpha-value>)",
        "primary-dark": "rgb(var(--c-primary-dark) / <alpha-value>)",
        "primary-light": "rgb(var(--c-primary-light) / <alpha-value>)",
        accent: "rgb(var(--c-accent) / <alpha-value>)",
        "accent-dark": "rgb(var(--c-accent-dark) / <alpha-value>)",
        bg: "#0a0a0f",
        surface: "#0f0f1a",
        "surface-2": "#131320",
        "border-dim": "#1e1e30",
        "text-primary": "#f1f5f9",
        "text-secondary": "#94a3b8",
        "text-muted": "#64748b",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};

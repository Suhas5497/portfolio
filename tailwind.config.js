/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Sora', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        script: ['Caveat', 'cursive'],
      },
      colors: {
        // Role-driven tokens: set per experience via [data-theme] in index.css
        primary: 'rgb(var(--c-primary) / <alpha-value>)',
        'primary-light': 'rgb(var(--c-primary-light) / <alpha-value>)',
        accent: 'rgb(var(--c-accent) / <alpha-value>)',
        tertiary: 'rgb(var(--c-tertiary) / <alpha-value>)',
        bg: '#07070c',
        surface: '#0e0e18',
        'surface-2': '#141422',
        ink: {
          DEFAULT: '#f1f5f9',
          2: '#a3b0c2',
          3: '#6b7a90',
        },
      },
      maxWidth: { page: '1240px' },
    },
  },
  plugins: [],
};

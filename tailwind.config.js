/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0B1D2D',
          navy: '#102A40',
          card: '#14334C',
          deep: '#081724',
          cyan: '#66C1BF',
          'cyan-hover': '#4FA9A7',
          contrast: '#08252B',
          border: '#234963',
          'border-subtle': '#32627D',
          text: '#F1F7F8',
          muted: '#9EB5C1',
          subtle: '#7893A2',
          purple: '#8E7CF8',
          green: '#43C486',
          yellow: '#E2B552',
          red: '#E16666',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
      },
      boxShadow: {
        'brand-card': '0 12px 30px rgba(0, 0, 0, 0.22)',
        'brand-button': '0 2px 8px rgba(102, 193, 191, 0.25)',
        'brand-glow': '0 0 20px rgba(102, 193, 191, 0.3)',
      }
    },
  },
  plugins: [],
}

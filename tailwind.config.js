/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#2d6a4f', // Deep forest green
          800: '#1b4332', // Deep primary
          900: '#081c15', // Darkest forest
          leaf: '#52b788',
          accent: '#f59e0b',
          amberDark: '#d97706',
          warmBg: '#fcfbf7',
          warmCard: '#ffffff',
          charcoal: '#1f2937',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

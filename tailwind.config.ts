import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-base': '#07090f',
        'bg-surface': '#0d1117',
        'bg-card': '#111827',
        'bg-card-hover': '#161f30',
        'border-default': '#1f2d45',
        'border-light': '#283d5e',
        'gold': '#c9952a',
        'gold-light': '#e8b84b',
        'gold-dim': '#7a5c1a',
        'text-base': '#dde4ee',
        'text-muted': '#8b9ab0',
        'text-dim': '#5a6a80',
        'accent-blue': '#2d6be4',
        'accent-green': '#0d9e6e',
        'accent-red': '#c94040',
        'accent-amber': '#c97d2a',
      },
      fontFamily: {
        playfair: ['var(--font-playfair)', 'Georgia', 'serif'],
        dm: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        shimmer: 'shimmer 1.8s infinite',
        'progress-indeterminate': 'progress-indeterminate 1.4s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        'progress-indeterminate': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(400%)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
export default config

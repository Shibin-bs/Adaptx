/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'space-bg': '#030712',
        'space-navy': '#0a0f2e',
        'space-dark': '#0d1b4b',
        'electric-blue': '#1d4ed8',
        'electric-blue-light': '#3b82f6',
        'cyber-cyan': '#06b6d4',
        'cyber-cyan-light': '#67e8f9',
        'neon-blue': '#60a5fa',
        'bio-green': '#10b981',
        'bio-cyan': '#14b8a6',
        'warning-amber': '#f59e0b',
        'critical-red': '#ef4444',
        'highlight-blue': '#93c5fd',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Courier New"', 'monospace'],
        display: ['Orbitron', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'scan': 'scan 4s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px #06b6d4, 0 0 10px #06b6d4' },
          '50%': { boxShadow: '0 0 20px #06b6d4, 0 0 40px #06b6d4, 0 0 60px #06b6d4' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
      backdropBlur: { xs: '2px' },
      boxShadow: {
        'neon-blue': '0 0 10px #3b82f6, 0 0 20px #3b82f6',
        'neon-cyan': '0 0 10px #06b6d4, 0 0 20px #06b6d4',
        'neon-green': '0 0 10px #10b981, 0 0 20px #10b981',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
    },
  },
  plugins: [],
}

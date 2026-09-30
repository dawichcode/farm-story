import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'agric-green': '#2D6A2D',
        'gold':        '#C9A84C',
        'crimson':     '#9B1C1C',
        'black':       '#0F0F0F',
      },
      fontFamily: {
        sans:    ['Inter', 'sans-serif'],
        display: ['Manrope', 'sans-serif'],
        mono:    ['IBM Plex Mono', 'monospace'],
      },
      keyframes: {
        'slide-in-left': {
          '0%':   { transform: 'translateX(-40px)', opacity: '0' },
          '100%': { transform: 'translateX(0)',     opacity: '1' },
        },
        'slide-out-left': {
          '0%':   { transform: 'translateX(0)',     opacity: '1' },
          '100%': { transform: 'translateX(-40px)', opacity: '0' },
        },
        'slide-in-right': {
          '0%':   { transform: 'translateX(40px)', opacity: '0' },
          '100%': { transform: 'translateX(0)',    opacity: '1' },
        },
        'slide-out-right': {
          '0%':   { transform: 'translateX(0)',    opacity: '1' },
          '100%': { transform: 'translateX(40px)', opacity: '0' },
        },
        'slide-in-up': {
          '0%':   { transform: 'translateY(32px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        'slide-out-down': {
          '0%':   { transform: 'translateY(0)',    opacity: '1' },
          '100%': { transform: 'translateY(32px)', opacity: '0' },
        },
        'roll-in': {
          '0%':   { transform: 'translateY(-24px) rotate(-6deg)', opacity: '0' },
          '60%':  { transform: 'translateY(4px)   rotate(1deg)',  opacity: '1' },
          '100%': { transform: 'translateY(0)     rotate(0deg)',  opacity: '1' },
        },
        'roll-off': {
          '0%':   { transform: 'translateY(0)    rotate(0deg)',  opacity: '1' },
          '100%': { transform: 'translateY(24px) rotate(4deg)',  opacity: '0' },
        },
        'jump-in': {
          '0%':   { transform: 'scale(0.85)', opacity: '0' },
          '60%':  { transform: 'scale(1.04)', opacity: '1' },
          '100%': { transform: 'scale(1)',    opacity: '1' },
        },
        'jump-off': {
          '0%':   { transform: 'scale(1)',    opacity: '1' },
          '40%':  { transform: 'scale(1.04)', opacity: '1' },
          '100%': { transform: 'scale(0.85)', opacity: '0' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'score-pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%':      { transform: 'scale(1.03)' },
        },
      },
      animation: {
        'slide-in-left':   'slide-in-left  0.35s cubic-bezier(0.22, 1, 0.36, 1) both',
        'slide-out-left':  'slide-out-left 0.25s cubic-bezier(0.55, 0, 1, 0.45) both',
        'slide-in-right':  'slide-in-right 0.35s cubic-bezier(0.22, 1, 0.36, 1) both',
        'slide-out-right': 'slide-out-right 0.25s cubic-bezier(0.55, 0, 1, 0.45) both',
        'slide-in-up':     'slide-in-up    0.4s  cubic-bezier(0.22, 1, 0.36, 1) both',
        'slide-out-down':  'slide-out-down 0.25s cubic-bezier(0.55, 0, 1, 0.45) both',
        'roll-in':         'roll-in        0.5s  cubic-bezier(0.22, 1, 0.36, 1) both',
        'roll-off':        'roll-off       0.3s  cubic-bezier(0.55, 0, 1, 0.45) both',
        'jump-in':         'jump-in        0.4s  cubic-bezier(0.22, 1, 0.36, 1) both',
        'jump-off':        'jump-off       0.3s  cubic-bezier(0.55, 0, 1, 0.45) both',
        'fade-in':         'fade-in        0.3s  ease both',
        'score-pulse':     'score-pulse    1.8s  ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config

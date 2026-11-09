/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          void: '#060913',
          base: '#0a1020',
          panel: 'rgba(14, 23, 44, 0.72)',
          'panel-hover': 'rgba(20, 33, 62, 0.88)',
          'panel-active': 'rgba(26, 43, 80, 0.95)',
        },
        jade: {
          DEFAULT: '#2dd4bf',
          hover: '#14b8a6',
          deep: '#0f766e',
          glow: 'rgba(45, 212, 191, 0.25)',
        },
        neon: {
          cyan: '#00e5ff',
          gold: '#fbbf24',
          rose: '#f43f5e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans JP', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
        serif: ['Noto Serif JP', 'Songti SC', 'STSong', 'serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

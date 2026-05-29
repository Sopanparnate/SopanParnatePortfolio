/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#0a0a0a',
        paper: '#f5f2ec',
        mist: '#1a1a1a',
        border: '#242424',
        subtle: '#3a3a3a',
        dim: '#888888',
        champagne: '#e8d5b0',
        warm: '#c8b99a',
      },
      letterSpacing: {
        tightest: '-0.04em',
        tighter: '-0.03em',
        tight: '-0.02em',
        widest: '0.2em',
      },
    },
  },
  plugins: [],
};

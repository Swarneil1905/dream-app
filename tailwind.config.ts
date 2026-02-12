import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-night': '#0A071B',
        'deep-night-soft': '#120E28',
        'astral-blue': '#4A4E69',
        'astral-blue-bright': '#5C6188',
        'soft-lavender': '#C3B1E1',
        'soft-lavender-dim': '#9B8BC4',
        'cloud-white': '#F0F4F8',
        'muted-gray': '#A3A8C0',
        'insight-tint': '#1D1A3A',
        'accent-moon': '#E8E0F0',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'fade-in': 'fade-in 0.6s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'dream-gradient': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(195, 177, 225, 0.15), transparent), radial-gradient(ellipse 60% 40% at 80% 100%, rgba(74, 78, 105, 0.2), transparent), radial-gradient(ellipse 50% 30% at 10% 80%, rgba(195, 177, 225, 0.08), transparent)',
      },
    },
  },
  plugins: [],
} satisfies Config;

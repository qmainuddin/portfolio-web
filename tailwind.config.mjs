/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--bg-primary)',
        foreground: 'var(--text-primary)',
        tmro: {
          sage: '#52b788',
          'sage-light': '#95d5b2',
          'sage-pale': '#d8e8dc',
          forest: '#1e382b',
          'forest-dark': '#13241c',
          'forest-night': '#09130e',
          moss: '#2d6a4f',
          pine: '#1b4332',
          sand: '#e8ece9',
          cream: '#f4f7f4',
        },
        brand: {
          50: '#f0f7f3',
          100: '#dceee3',
          200: '#bce0cb',
          300: '#90ccad',
          400: '#5fb18a',
          500: '#3d966e',
          600: '#2d7856',
          700: '#256046',
          800: '#204d39',
          900: '#1c4030',
          950: '#0d241b',
        },
        accent: {
          sage: '#52b788',
          emerald: '#10b981',
          teal: '#14b8a6',
          amber: '#eab308',
        },
      },
      fontFamily: {
        sans: [
          'Plus Jakarta Sans',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        serif: ['Instrument Serif', 'Georgia', 'serif'],
        mono: [
          'JetBrains Mono',
          'Fira Code',
          'SFMono-Regular',
          'Menlo',
          'monospace',
        ],
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'glow-sage': '0 0 35px -5px rgba(82, 183, 136, 0.25)',
        'glow-forest': '0 0 45px -10px rgba(30, 56, 43, 0.35)',
        'tmro-card': '0 4px 20px -2px rgba(18, 34, 26, 0.06), 0 2px 6px -1px rgba(18, 34, 26, 0.04)',
        'tmro-card-dark': '0 8px 30px -4px rgba(0, 0, 0, 0.5)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};

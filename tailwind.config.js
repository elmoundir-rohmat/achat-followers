/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Soft pastel color palette
        'cream': '#FAF7F2',
        'peach': {
          50: '#FFF5F0',
          100: '#FFE8E0',
          200: '#FFD4C2',
          300: '#FFB8A0',
          400: '#FF9A7A',
          500: '#FF7A5C',
        },
        'lavender': {
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
        },
        'soft-pink': {
          50: '#FDF2F8',
          100: '#FCE7F3',
          200: '#FBCFE8',
          300: '#F9A8D4',
          400: '#F472B6',
          500: '#EC4899',
        },
        'warm-yellow': {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
        },
        'baby-purple': {
          50: '#FAF5FF',
          100: '#F3E8FF',
          200: '#E9D5FF',
          300: '#D8B4FE',
          400: '#C084FC',
          500: '#A855F7',
        },
        'soft-orange': {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
        },
      },
      borderRadius: {
        'pill': '9999px',
        'card': '32px',
        'card-sm': '24px',
        'button': '9999px',
      },
      boxShadow: {
        'soft': '0 2px 20px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.08)',
        'soft-lg': '0 4px 30px rgba(0, 0, 0, 0.06), 0 2px 8px rgba(0, 0, 0, 0.08)',
        'soft-xl': '0 8px 40px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.1)',
        'inner-soft': 'inset 0 2px 4px rgba(0, 0, 0, 0.03)',
      },
      fontFamily: {
        'rounded': ['Inter', 'SF Pro Rounded', 'Nunito', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
    },
  },
  plugins: [],
};

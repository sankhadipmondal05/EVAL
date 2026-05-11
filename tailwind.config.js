/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        background: '#0d0d0d',
        foreground: '#f5f5f7',
        primary: '#d97757',
        secondary: '#7e69ab',
        accent: '#33cccc',
        muted: '#171717',
        border: '#262626',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
    },
  },
}

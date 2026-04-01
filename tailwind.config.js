/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#BB0000',
        'primary-dark': '#8B0000',
        'primary-light': '#FFE8E8',
        cream: '#FAF8F5',
        'border-color': '#E8E4DF',
      },
      fontFamily: {
        serif: ['"Instrument Serif"', 'serif'],
        sans: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}


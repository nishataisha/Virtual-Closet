/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FFF8F5',
        blush: '#FCD3C5',
        salmon: '#FAA994',
        gold: '#E8AF59',
        garnet: '#571310',
        paprika: '#A72913',
        bistre: '#210100',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

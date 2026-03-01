export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bistre: '#210100',
        goldfinch: '#E6A341',
        butter: '#FECE79',
        indianred: '#B14A36',
        garnet: '#8C0902',
        salmon: '#FAA994',
        pinkopal: '#FCD3C5',
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
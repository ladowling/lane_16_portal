/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Arial', 'sans-serif'],
      },
      colors: {
        lane: {
          green: '#3ba321',
          lime: '#79b900',
          ink: '#161616',
        },
      },
    },
  },
  plugins: [],
};

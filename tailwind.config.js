/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: "#18529D",
        secondary: "#28AD56",
        brand: {
          50: '#f3f7ff',
          100: '#e5edff',
          200: '#c7d6ff',
          300: '#a3b9ff',
          400: '#7a96ff',
          500: '#4f6dff',
          600: '#364fe6',
          700: '#2a3dba',
          800: '#223292',
          900: '#1d2b74',
        },
      },
    },
  },
  plugins: [],
};


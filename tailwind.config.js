/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundImage: {
        'light-mode': "url('/public/img/background.jpg')",
        'dark-mode': "url('/public/img/background-dark.jpg')",
      },
      colors: {
        'primary': "#002aff",
        'primary-hover': "#4800ff",
        'dark-primary': '#7feaff',
        'dark-primary-hover': '#5f8cff'
      },
      screens: {
        'xs': '270px'
      }
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif']
    }
  },
  plugins: []
};

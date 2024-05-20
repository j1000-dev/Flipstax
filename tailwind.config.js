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
        'primary': "#A7C7E7",
        'primary-hover': "#5D3FD3",
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

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        background: "#121212",
        primary: "#FFFFFF",
        secondary: "#1E1E1E",
        accent: "#FFA500",
        divider: "#2C2C2C",
        iconGray: "#A0A0A0",
      },
    },
  },
  plugins: [],
};

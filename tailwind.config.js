/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#14263D',
          dark: '#0E1C2E',
          light: '#1C304A',
          subtle: '#263746',
        },
        teal: {
          DEFAULT: '#247C78',
          dark: '#1C6360',
          light: '#2EA09A',
          bg: '#F0F9F8',
        },
        offwhite: '#F5F3ED',
        greyblue: '#D9E2E8',
      }
    },
  },
  plugins: [],
}

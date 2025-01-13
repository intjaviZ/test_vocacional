/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFFFFF',
        secondary: '#611F7D',
        cobre: '#E68C31',
      },
      backgroundImage: {
        movil: "url('./public/bg-mv.png')",
        escritorio: "url('./public/bg-es')",
      },
      width: {
        "card-mv": "95%",
      },
      height: {
        "input-re": "95%"
      }
    },
  },
  plugins: [],
}


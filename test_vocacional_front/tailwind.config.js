/** @type {import('tailwindcss').Config} */
/* ABREVIATURAS
mv: movil
tb: tablet
es: escritorio
in: ingreso form-in = formulario de ingreso
re: reingreso form-re = formulariod de reingreso
cp: card-pregunta
medidas según los breakpoints de tailwind
mn: minimo
sm: small
md: mediano
cp: cardPregunta
*/
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        fadeIn: "fadeIn 0.5s ease-in forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      colors: {
        primary: '#FFFFFF',
        secondary: '#611F7D',
        cobre: '#E68C31',
      },
      width: {
        "card-mv": "95%",
        "card-tb": "85%",
        "card-es": "80%",
        "form-in-mn": "70%",
        "form-in-sm": "50%",
        "form-in-md": "40%",
        "form-in-lg": "30%",
        "form-in-xl": "25%"
      },
      minWidth: {
        "grafica": "310px",
        "card-pr": "900px"
      },
      maxWidth: {
        "form-mv": "80%",
        "form-pc": "800px",
        "cp": "1800px"
      },
      height: {
        "form-re-es": "110%",
        "grafica-sm": "400px",
        "grafica-md": "500px",
        "grafica-xl": "700px",
        "grafica-2xl": "1000px"
      },
      maxHeight: {
        "input": "55%"
      },
      padding: {
        "top-relativo": "5%",
        "left-cp": "5%",
        "left-cp-es": "25%"
      }
    },
  },
  plugins: [],
}


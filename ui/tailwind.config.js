/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat"],
      },

      colors: {
        barnRed: "#780000",
        venetianRed: "#C1121F",
        lightRed: "#C1121F",
        airBlue: "#669BBC",
        prussianBlue: "#003049",
        papayaWhip: "#FDF0D5",
        headingColor: "#C80000",
        textColor: "#CECECE",
        cartNumBg: "#e80013",
        primary: "#111111",
        cardOverlay: "rgba(256,256,256,0.05)",
        darkOverlay: "rgba(0,0,0,0.5)",
        lightOverlay: "rgba(256,256,256,0.2)",
        lighttextGray: "#9ca0ab",
        card: "rgba(40,40,40,0.8)",
        cardBg: "#181818",
        cardBgLight: "#2e3033",
        cartTotal: "#343739",
        loaderOverlay: "rgba(256,256,256,0.1)",
        cardColor1: "rgb(39, 133, 106)",
        cardColor2: "rgb(30, 50, 100)",
        cardColor3: "rgb(141, 103, 171)",
        cardColor4: "rgb(132, 0, 231)",
        cardColor5: "rgb(225, 51, 0)",
        cardColor6: "rgb(30, 50, 100)",
        cardColor7: "rgb(232, 17, 91)",
        cardColor8: "rgb(96, 129, 8)",
        cardColor9: "rgb(115, 88, 255)",
        cardColor10: "rgb(5, 105, 82)",
        cardColor11: "rgb(80, 55, 80)",
        cardColor12: "rgb(216, 64, 0)",
        cardColor13: "rgb(140, 25, 50)",
        cardColor14: "rgb(71, 125, 149)",
      },
    },
  },
  plugins: [],
}


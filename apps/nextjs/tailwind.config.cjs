/** @type {import("tailwindcss").Config} */

const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

module.exports = {
  presets: [require("@acme/tailwind-config")],
  theme: {
    colors: {
      slate: colors.white,
      polarNight: "#4C566A",
      snowStorm1: "#D8DEE9",
      snowStorm2: "#E5E9F0",
      snowStorm3: "#ECEFF4",
      frost1: "#8FBCBB",
      frost2: "#88C0D0",
      frost3: "#81A1C1",
      frost4: "#5E81AC",
      auroraRed: "#BF616A",
      auroraGreed: "#A3BE8C",
      red: colors.red,
      blue: colors.blue,
      green: colors.green,
      gray: colors.gray,
    },
    extend: {
      screens: {
        xs: "430px",
        ...defaultTheme.screens,
      },
      animation: {
        "spin-slow": "spin 4s linear infinite",
      },
    },
  },
  plugins: [],
};

import type { Config } from "tailwindcss";
const {heroui} = require("@heroui/react");
const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        white: "#ffffff",
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily:{
        outfit: ["var(--font-outfit)"],
      },
    },
  },
  plugins: [
    heroui({
      addCommonColors: true,
    }),
    require('daisyui'),
    ],
};
export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        warm: {
          50:  "#FFFBF8",
          100: "#FEF3E8",
          200: "#FDE8CC",
          300: "#FAD4A8",
          400: "#F5B878",
          500: "#C4622D",
          600: "#A8501F",
          700: "#8A3E14",
          800: "#6E2F0C",
          900: "#3D1A06",
        },
        sage: {
          50:  "#F0F5F1",
          100: "#E8F0E9",
          200: "#D0E3D2",
          300: "#A8C9AC",
          400: "#7BAE84",
          500: "#5C8A64",
          600: "#4A7C59",
          700: "#3A6347",
          800: "#2C4E38",
          900: "#1E352A",
        },
        brown: {
          100: "#F5EDE8",
          200: "#E8D5CA",
          300: "#CBA898",
          400: "#A8755F",
          500: "#7B4F3A",
          600: "#6B3E2C",
          700: "#5A2E1E",
          800: "#3D1F0D",
          900: "#2C1810",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;

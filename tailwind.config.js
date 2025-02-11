import { heroui } from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },

      colors: {
        primary: { // Yellow Palette
          DEFAULT: '#E8FD5A', // Main Yellow
          light: '#FDFF9A',  // Light Yellow
          dark: '#C1D246',   // Dark Yellow
          50: '#FFFFE0',
          100: '#FEFFBD',
          200: '#FCFF7F',
          300: '#FAFF41',
          400: '#F5FB17',
          500: '#E8FD5A', // DEFAULT
          600: '#C7D744',
          700: '#A2B12F',
          800: '#7D8B1A',
          900: '#586504',
        },
        secondary: { // Purple Palette
          DEFAULT: '#D00CB9', // Main Purple
          light: '#E571D4',  // Light Purple
          dark: '#A30991',   // Dark Purple
          50: '#FBE0F6',
          100: '#F5B3EC',
          200: '#F084E1',
          300: '#EB55D7',
          400: '#E62ACD',
          500: '#D00CB9', // DEFAULT
          600: '#A10A8F',
          700: '#720768',
          800: '#44043E',
          900: '#1B0116',
        },
        tertiary: {  // Blue Palette
          DEFAULT: '#6DD1DA', // Main Blue
          light: '#9DE4EA',  // Light Blue
          dark: '#58ABB2',   // Dark Blue
          50: '#EBF9FA',
          100: '#D0F2F4',
          200: '#A4E4E8',
          300: '#78D6DD',
          400: '#4CC8D1',
          500: '#6DD1DA', // DEFAULT
          600: '#33B5BC',
          700: '#2A8D93',
          800: '#21656A',
          900: '#173E41',
        },
        success: {
          DEFAULT: '#7ed957'
        },
        waringn: {
          DEFAULT: '#f5a525'
        },
        dange: {
          DEFAULT: '#df1259'
        },
        dark: {
          DEFAULT: '#1c1b1b',
        },
        light: {
          DEFAULT: '#F2F2EA',
        },
        primaryText: {
          DEFAULT: '#000000',
          light: '#000000',
          dark: '#000000',
        },
        btnText: {
          DEFAULT: '#000000',
          light: '#000000',
          dark: '#000000',
        },
      },
      backgroundColor: (theme) => ({
        ...theme('colors'),
        lightBackground: '#fff',
        darkBackground: '#000',
        sidebarlightBackground: '#fff',
        sidebardarkBackground: '#121212',
      }),
      borderRadius: {
        DEFAULT: '1.2rem',
        md: '0.8rem',
        sm: '0.5rem',
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
}

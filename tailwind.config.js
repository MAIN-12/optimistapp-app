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
        primary: {
          DEFAULT: '#015a86',
          light: '#0280B8',
          dark: '#01466A',
          50: '#E0F2FC',
          100: '#B3DCF6',
          200: '#80C2F0',
          300: '#4DA7E9',
          400: '#1A8CE2',
          500: '#015a86', // DEFAULT
          600: '#014F76',
          700: '#014466',
          800: '#013856',
          900: '#012D46',
        },
        secondary: {
          DEFAULT: '#4e5357',
          light: '#6B7176',
          dark: '#3A3E41',
        },
        ternary: {
          DEFAULT: '#3e86b0',
          light: '#5EA2CA',
          dark: '#316D8E',
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
          DEFAULT: '#fff',
          light: '#fff',
          dark: '#fff',
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

// hero.ts
import { heroui } from "@heroui/react";

export default heroui({
    themes: {
        light: {
            colors: {
                primary: {
                    50: '#E7F7EC',
                    100: '#C3EBD0',
                    200: '#9ADDB1',
                    300: '#6FCF91',
                    400: '#4FC478',
                    500: '#00A63E',
                    600: '#009839',
                    700: '#008732',
                    800: '#00762C',
                    900: '#005D20',
                    foreground: "#fff",
                    DEFAULT: '#00A63E',
                },
                secondary: {
                    50: '#f8f9fa',
                    100: '#e9ecef',
                    200: '#dee2e6',
                    300: '#ced4da',
                    400: '#adb5bd',
                    500: '#6c757d',
                    600: '#4e5357',
                    700: '#495057',
                    800: '#343a40',
                    900: '#212529',
                    DEFAULT: '#4e5357',
                    foreground: "#fff",
                },
                background: {
                    DEFAULT: "#f9f9f9"
                },
            },
        },
        dark: {
            colors: {
                primary: {
                    50: '#E7F7EC',
                    100: '#C3EBD0',
                    200: '#9ADDB1',
                    300: '#6FCF91',
                    400: '#4FC478',
                    500: '#00A63E',
                    600: '#009839',
                    700: '#008732',
                    800: '#00762C',
                    900: '#005D20',
                    foreground: "#fff",
                    DEFAULT: '#00A63E',
                },
                secondary: {
                    50: '#212529',
                    100: '#343a40',
                    200: '#495057',
                    300: '#4e5357',
                    400: '#6c757d',
                    500: '#adb5bd',
                    600: '#ced4da',
                    700: '#dee2e6',
                    800: '#e9ecef',
                    900: '#f8f9fa',
                    DEFAULT: '#4e5357',
                    foreground: "#fff",
                },
                background: {
                    DEFAULT: "#111111"
                },
            },
        },
    },
});
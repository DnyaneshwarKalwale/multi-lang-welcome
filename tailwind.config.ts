import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import animatePlugin from "tailwindcss-animate";

export default {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        
        // Primary Blues - Bright Theme:
        primary: {
          DEFAULT: "#0088FF", // Bright Blue Main
          50: "#F0F9FF",
          100: "#E0F2FF",
          200: "#C0E5FF",
          300: "#99D8FF",
          400: "#66C2FF",
          500: "#0088FF", // Main
          600: "#0077E6",
          700: "#0066CC",
          800: "#0055AD",
          900: "#00448A",
          light: "#33ADFF", // Light Bright Blue
        },
        
        // Secondary Blues - Lighter:
        secondary: {
          DEFAULT: "#66B2FF", // Lighter Blue Main
          50: "#F5FAFF",
          100: "#EBF5FF",
          200: "#D6EBFF",
          300: "#B8DFFF",
          400: "#8CCEFF", 
          500: "#66B2FF", // Main
          600: "#4D99E6",
          700: "#3B80CC",
          800: "#3366AD",
          900: "#2A4D8A",
          light: "#99CCFF", // Very Light Blue
        },
        
        // Accent Blues (replacing greens):
        accent: {
          DEFAULT: "#33ADFF", // Bright Blue accent
          50: "#F0F9FF",
          100: "#E0F2FF",
          200: "#C0E5FF",
          300: "#99D8FF",
          400: "#66C2FF",
          500: "#33ADFF", // Main
          600: "#0088FF",
          700: "#0077E6",
          800: "#0066CC",
          900: "#0055AD",
          light: "#66C2FF", // Light
        },
        
        // Neutral Tones - Keep whites/grays:
        neutral: {
          white: "#FFFFFF", // White
          lightest: "#F6F9FC", // Lightest
          light: "#E6E6E6", // Light
          medium: "#9BA2AF", // Medium
          dark: "#525F7F", // Dark
          darkest: "#32325D", // Darkest
          black: "#0A2540", // Black
        },
        
        // System states - All blue now
        success: "#0088FF", // Blue (was green)
        warning: "#66B2FF", // Light blue (was orange)
        error: "#0066CC", // Dark blue (was red)
        info: "#0088FF", // Blue
        
        // Traditional shadcn-ui colors
        destructive: {
          DEFAULT: "#0066CC", // Dark blue (was red)
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F6F9FC",
          foreground: "#525F7F",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#0A2540",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#0A2540",
        },
      },
      fontFamily: {
        sans: ["Poppins", ...fontFamily.sans],
        heading: ["Agrandir", "Poppins", ...fontFamily.sans],
        mono: ["Poppins", ...fontFamily.sans],
        base: ["Poppins", ...fontFamily.sans],
        body: ["Poppins", ...fontFamily.sans],
        display: ["Agrandir", "Poppins", ...fontFamily.sans],
        agrandir: ["Agrandir", ...fontFamily.sans],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" }
        },
        "slide-in": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" }
        },
        "zoom-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" }
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "pulse-slow": "pulse-slow 3s infinite ease-in-out",
        "slide-in": "slide-in 0.3s ease-out",
        "zoom-in": "zoom-in 0.4s ease-out",
        "spin-slow": "spin-slow 8s linear infinite"
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-pattern': "url('data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"80\" height=\"80\" viewBox=\"0 0 80 80\"%3E%3Cg fill=\"%230070E0\" fill-opacity=\"0.05\"%3E%3Cpath d=\"M0 0h80v80H0V0zm20 20v40h40V20H20zm20 35a15 15 0 1 1 0-30 15 15 0 0 1 0 30z\" opacity=\"0.5\"/%3E%3C/g%3E%3C/svg%3E')",
        'dots-pattern': "url('data:image/svg+xml,%3Csvg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%230070E0\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"3\" cy=\"3\" r=\"1\"/%3E%3C/g%3E%3C/svg%3E')",
      },
    },
  },
  plugins: [animatePlugin],
} satisfies Config;

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
          DEFAULT: "#469BFE", // Updated to match logo color
          50: "#F0F9FF",
          100: "#E0F2FF",
          200: "#C0E5FF",
          300: "#99D8FF",
          400: "#66C2FF",
          500: "#469BFE", // Main - Updated to match logo color
          600: "#2A8AFA",
          700: "#0E75F6",
          800: "#0661D1",
          900: "#044EAD",
          light: "#6BB0FE", // Light Bright Blue - Updated to match logo color
        },
        
        // Secondary Blues - Lighter:
        secondary: {
          DEFAULT: "#6BB0FE", // Lighter Blue Main - Updated to match primary
          50: "#F5FAFF",
          100: "#EBF5FF",
          200: "#D6EBFF",
          300: "#B8DFFF",
          400: "#8CCEFF", 
          500: "#6BB0FE", // Main - Updated to match primary
          600: "#479EFD",
          700: "#2A8AFA",
          800: "#1477F3",
          900: "#0D66D9",
          light: "#8FC1FE", // Very Light Blue - Updated
        },
        
        // Accent Blues (replacing greens):
        accent: {
          DEFAULT: "#469BFE", // Bright Blue accent - Updated to match primary
          50: "#F0F9FF",
          100: "#E0F2FF",
          200: "#C0E5FF",
          300: "#99D8FF",
          400: "#78B6FE",
          500: "#469BFE", // Main - Updated to match primary
          600: "#2A8AFA",
          700: "#0E75F6",
          800: "#0661D1",
          900: "#044EAD",
          light: "#6BB0FE", // Light - Updated
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
        
        // System states - Updated to match primary
        success: "#469BFE", // Updated to match primary
        warning: "#6BB0FE", // Updated to match primary light
        error: "#0E75F6", // Updated to match primary dark
        info: "#469BFE", // Updated to match primary
        
        // Traditional shadcn-ui colors
        destructive: {
          DEFAULT: "#0E75F6", // Dark blue (was red) - Updated to match primary
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

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
        
        // Primary Blues
        primary: {
          DEFAULT: "#0070E0", // Main
          50: "#F0F6FF",
          100: "#E1EEFF",
          200: "#C3DDFF",
          300: "#9BC3FF",
          400: "#64A6FA",
          500: "#0070E0", // Main
          600: "#005FD1",
          700: "#004CAD",
          800: "#003C8A",
          900: "#003087", // Dark
          light: "#1A9CFF", // Light
        },
        
        // Secondary Purples
        secondary: {
          DEFAULT: "#635BFF", // Main
          50: "#F5F4FF",
          100: "#ECEBFF",
          200: "#D9D7FF",
          300: "#B9B4FF",
          400: "#9690FF", 
          500: "#635BFF", // Main
          600: "#564CFF",
          700: "#4F46E5", // Dark
          800: "#4338CA",
          900: "#3730A3",
          light: "#857DFF", // Light
        },
        
        // Accent Greens
        accent: {
          DEFAULT: "#12B76A", // Main
          50: "#ECFDF3",
          100: "#DEFAEC",
          200: "#BBF3D9",
          300: "#86E8BA",
          400: "#43D58C",
          500: "#12B76A", // Main
          600: "#0DA15D",
          700: "#039E74", // Dark
          800: "#05734D",
          900: "#064A37",
          light: "#32D583", // Light
        },
        
        // Neutral Tones
        neutral: {
          white: "#FFFFFF", // White
          lightest: "#F6F9FC", // Lightest
          light: "#E6E6E6", // Light
          medium: "#9BA2AF", // Medium
          dark: "#525F7F", // Dark
          darkest: "#32325D", // Darkest
          black: "#0A2540", // Black
        },
        
        // Complementary Colors
        coral: {
          DEFAULT: "#FF9E80", // Coral
        },
        yellow: {
          DEFAULT: "#FFD666", // Yellow
        },
        
        // System states
        success: "#12B76A",
        warning: "#F79009", 
        error: "#F04438",
        info: "#0070E0",
        
        // Traditional shadcn-ui colors (keeping light mode only)
        destructive: {
          DEFAULT: "#F04438",
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
        sans: ["Outfit", "var(--font-sans)", ...fontFamily.sans],
        heading: ["Lexend", "sans-serif"],
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
        'hero-pattern': "url('data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"80\" height=\"80\" viewBox=\"0 0 80 80\"%3E%3Cg fill=\"%237C3AED\" fill-opacity=\"0.05\"%3E%3Cpath d=\"M0 0h80v80H0V0zm20 20v40h40V20H20zm20 35a15 15 0 1 1 0-30 15 15 0 0 1 0 30z\" opacity=\"0.5\"/%3E%3C/g%3E%3C/svg%3E')",
        'dots-pattern': "url('data:image/svg+xml,%3Csvg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%237C3AED\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"3\" cy=\"3\" r=\"1\"/%3E%3C/g%3E%3C/svg%3E')",
      },
    },
  },
  plugins: [animatePlugin],
} satisfies Config;

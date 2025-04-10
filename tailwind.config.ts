
import { type Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
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
        primary: {
          '50': "#f5f3ff",
          '100': "#ede9fe",
          '200': "#ddd6fe",
          '300': "#c4b5fd",
          '400': "#a78bfa",
          '500': "#8b5cf6",
          '600': "#7c3aed",
          '700': "#6d28d9",
          '800': "#5b21b6",
          '900': "#4c1d95",
          '950': "#2e1065",
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          '50': "#ecfeff",
          '100': "#cffafe",
          '200': "#a5f3fc",
          '300': "#67e8f9",
          '400': "#22d3ee",
          '500': "#06b6d4",
          '600': "#0891b2",
          '700': "#0e7490",
          '800': "#155e75",
          '900': "#164e63",
          '950': "#083344",
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // LinkedIn theme colors
        'linkedin': {
          '50': '#E8F4F9',
          '100': '#D1E9F3',
          '200': '#A3D4E7',
          '300': '#74BFDC',
          '400': '#46A9D0',
          '500': '#0077B5',
          '600': '#005E93',
          '700': '#004471',
          '800': '#002F4E',
          '900': '#00172C',
          '950': '#000B16',
          'blue': '#0077B5',
          'darkBlue': '#004471',
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        heading: ['Lexend', 'sans-serif'],
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

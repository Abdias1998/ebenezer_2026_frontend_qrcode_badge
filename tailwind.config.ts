import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
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
        // Named "royal" for historical reasons — values are the Eben Ezer 5
        // brand red/crimson (sampled from the official event flyer).
        royal: {
          50: "#fef2ee",
          100: "#fde1d6",
          200: "#fbc0ab",
          300: "#f79571",
          400: "#f16a44",
          500: "#e8452c",
          600: "#c62f1e",
          700: "#9e2117",
          800: "#6e1712",
          900: "#4a0e0e",
          950: "#2e0806",
        },
        gold: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-cal)", "var(--font-inter)", "system-ui", "sans-serif"],
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
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 2s linear infinite",
        fadeIn: "fadeIn 0.4s ease-out",
      },
      backgroundImage: {
        "gradient-royal": "linear-gradient(135deg, #4a0e0e 0%, #9e2117 50%, #e8452c 100%)",
        "gradient-gold": "linear-gradient(135deg, #92400e 0%, #d97706 50%, #f59e0b 100%)",
        "gradient-hero": "linear-gradient(135deg, #2e0806 0%, #6e1712 40%, #c62f1e 100%)",
      },
      boxShadow: {
        glow: "0 0 20px rgba(232, 69, 44, 0.35)",
        "glow-gold": "0 0 20px rgba(245, 158, 11, 0.3)",
        soft: "0 4px 24px rgba(0, 0, 0, 0.06)",
        card: "0 1px 3px rgba(0,0,0,0.05), 0 8px 24px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;

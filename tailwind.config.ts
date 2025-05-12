import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "gradient-animation": {
          "0%, 100%": {
            backgroundPosition: "0% 50%",
            transform: "rotate(0deg)",
          },
          "50%": {
            backgroundPosition: "100% 50%",
            transform: "rotate(3deg)",
          },
        },
        ellipsis: {
          "0%": { content: "''" },
          "25%": { content: "'.'" },
          "50%": { content: "'..'" },
          "75%": { content: "'...'" },
          "100%": { content: "''" },
        },
        "border-flash-red": {
          "0%": {
            borderColor: "hsl(var(--border))",
            backgroundColor: "hsl(var(--card))",
          },
          "50%": {
            borderColor: "rgb(239 68 68)",
            backgroundColor: "rgb(254 226 226)",
          },
          "100%": {
            borderColor: "rgb(248 113 113)",
            backgroundColor: "hsl(var(--card))",
          },
        },
        "border-flash-green": {
          "0%": {
            borderColor: "hsl(var(--border))",
            backgroundColor: "hsl(var(--card))",
          },
          "50%": {
            borderColor: "rgb(34 197 94)",
            backgroundColor: "rgb(220 252 231)",
          },
          "100%": {
            borderColor: "rgb(187 247 208)",
            backgroundColor: "hsl(var(--card))",
          },
        },
        "float-up": {
          "0%": {
            opacity: "1",
            transform: "translateY(0)",
          },
          "100%": {
            opacity: "0",
            transform: "translateY(-20px)",
          },
        },
        "gavel-hit": {
          "0%, 100%": {
            transform: "rotate(0deg)",
          },
          "50%": {
            transform: "rotate(45deg)",
          },
        },
        "fade-in-out": {
          "0%, 100%": {
            opacity: "0",
          },
          "10%, 90%": {
            opacity: "1",
          },
        },
        gradient: {
          "0%, 100%": {
            backgroundPosition: "0% 50%",
          },
          "50%": {
            backgroundPosition: "100% 50%",
          },
        },
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "spin-slow": {
          "0%": {
            transform: "rotate(0deg)",
          },
          "100%": {
            transform: "rotate(360deg)",
          },
        },
        "spin-reverse": {
          "0%": {
            transform: "rotate(0deg)",
          },
          "100%": {
            transform: "rotate(-360deg)",
          },
        },
        "spin-slow-reverse": {
          "0%": {
            transform: "rotate(0deg)",
          },
          "100%": {
            transform: "rotate(-360deg)",
          },
        },
        "caret-blink": {
          "0%,70%,100%": {
            opacity: "1",
          },
          "20%,50%": {
            opacity: "0",
          },
        },
        "slide-down-fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(-10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "slide-up-fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "slide-left-fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateX(-10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
        "slide-right-fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateX(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
        "float-up-fade-out": {
          "0%": {
            opacity: "1",
            transform: "translateY(0px)",
          },
          "100%": {
            opacity: "0",
            transform: "translateY(-20px)",
          },
        },
      },
      animation: {
        "gradient-animation": "gradient-animation 15s ease infinite",
        ellipsis: "ellipsis 1.5s steps(4, end) infinite",
        "border-flash-red": "border-flash-red 0.75s ease-in-out 1",
        "border-flash-green": "border-flash-green 0.75s ease-in-out 1",
        "gavel-hit": "gavel-hit 0.75s ease-in-out infinite",
        "float-up-fade-out": "float-up-fade-out 0.5s ease-out forwards",
        "float-up": "float-up 0.5s ease-out forwards",
        "fade-in-out": "fade-in-out 2s ease-in-out",
        gradient: "gradient 15s ease infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "spin-slow": "spin-slow 3s linear infinite",
        "spin-reverse": "spin-reverse 1s linear infinite",
        "spin-slow-reverse": "spin-slow-reverse 3s linear infinite",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "slide-down-fade-in": "slide-down-fade-in 0.3s ease-out forwards",
        "slide-up-fade-in": "slide-up-fade-in 0.3s ease-out forwards",
        "slide-left-fade-in": "slide-left-fade-in 0.3s ease-out forwards",
        "slide-right-fade-in": "slide-right-fade-in 0.3s ease-out forwards",
      },
    },
  },
};
export default config;

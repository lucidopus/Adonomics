import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config = {
  darkMode: "class",
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-in-bottom": "slideInFromBottom 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-in-top": "slideInFromTop 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-in-left": "slideInFromLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-in-right": "slideInFromRight 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in": "scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in-spring": "scaleInSpring 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "fade-in": "fadeIn 0.5s ease-out",
        "fade-in-up": "fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        "shimmer": "shimmer 2s infinite linear",
        "pulse-gentle": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-in": "bounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'apple': '0 1px 2px rgba(0, 0, 0, 0.02), 0 4px 16px rgba(0, 0, 0, 0.06), 0 8px 32px rgba(0, 0, 0, 0.04)',
        'apple-lg': '0 2px 8px rgba(0, 0, 0, 0.04), 0 8px 24px rgba(0, 0, 0, 0.08), 0 16px 48px rgba(0, 0, 0, 0.06)',
        'apple-xl': '0 4px 16px rgba(0, 0, 0, 0.06), 0 16px 40px rgba(0, 0, 0, 0.1), 0 32px 80px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;

export default config;
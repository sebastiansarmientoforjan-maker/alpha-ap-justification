import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Alpha Design System Colors
        primary: {
          50: '#E6F0F5',
          100: '#CCE1EB',
          200: '#99C3D7',
          300: '#66A5C3',
          400: '#3387AF',
          500: '#2C4F5E',
          600: '#234050',
          700: '#1A303C',
          800: '#122028',
          900: '#091014',
        },
        secondary: {
          50: '#E6F7FA',
          100: '#CCEFF5',
          200: '#99DFEB',
          300: '#66CFE1',
          400: '#33BFD7',
          500: '#00AFCD',
          600: '#008CA4',
          700: '#00697B',
          800: '#004652',
          900: '#002329',
        },
        accent: {
          50: '#E6FCFF',
          100: '#CCF9FF',
          200: '#99F3FF',
          300: '#66EDFF',
          400: '#33E7FF',
          500: '#00D9FF',
          600: '#00AED9',
          700: '#0082A3',
          800: '#00566D',
          900: '#002B37',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'Consolas', 'monospace'],
      },
      animation: {
        spotlight: "spotlight 2s ease .75s 1 forwards",
        meteor: "meteor 5s linear infinite",
        beam: "beam 8s linear infinite",
        orbit: "orbit 20s linear infinite",
        shimmer: "shimmer 2s linear infinite",
        "number-tick": "number-tick 0.5s ease-out",
        "particle-float": "particleFloat 3s ease-in-out infinite",
        "particle-fade": "particleFade 2s ease-out forwards",
        "glass-shimmer": "glassShimmer 3s ease-in-out infinite",
        "fade-in-up": "fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-in-right": "slideInRight 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        spotlight: {
          "0%": {
            opacity: "0",
            transform: "translate(-72%, -62%) scale(0.5)",
          },
          "100%": {
            opacity: "1",
            transform: "translate(-50%,-40%) scale(1)",
          },
        },
        meteor: {
          "0%": { transform: "rotate(215deg) translateX(0)", opacity: "1" },
          "70%": { opacity: "1" },
          "100%": {
            transform: "rotate(215deg) translateX(-500px)",
            opacity: "0",
          },
        },
        beam: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        orbit: {
          "0%": { transform: "rotate(0deg) translateY(calc(var(--radius) * 1px)) rotate(0deg)" },
          "100%": { transform: "rotate(360deg) translateY(calc(var(--radius) * 1px)) rotate(-360deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        "number-tick": {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        particleFloat: {
          "0%, 100%": { transform: "translateY(0) translateX(0)" },
          "50%": { transform: "translateY(-20px) translateX(10px)" },
        },
        particleFade: {
          "0%": { opacity: "1", transform: "scale(1)" },
          "100%": { opacity: "0", transform: "scale(0.3) translateX(-100px)" },
        },
        glassShimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(0, 217, 255, 0.3)',
        'glow-strong': '0 0 40px rgba(0, 217, 255, 0.5)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
      },
    },
  },
  plugins: [],
};
export default config;

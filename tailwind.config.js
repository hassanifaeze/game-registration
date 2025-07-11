/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // This line is crucial for scanning your React components
  ],
  theme: {
    extend: {
      // Your custom theme extensions (colors, fonts, etc.)
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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        // Your custom keyframes
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "glow-pulse": {
          "0%, 100%": {
            boxShadow:
              "0 0 20px rgba(239, 68, 68, 0.5), 0 0 40px rgba(239, 68, 68, 0.3)",
          },
          "50%": {
            boxShadow:
              "0 0 30px rgba(239, 68, 68, 0.8), 0 0 60px rgba(239, 68, 68, 0.5)",
          },
        },
        "flame-flicker": {
          "0%, 100%": { opacity: "1", transform: "scale(1) rotate(0deg)" },
          "25%": { opacity: "0.8", transform: "scale(1.1) rotate(1deg)" },
          "50%": { opacity: "0.9", transform: "scale(0.95) rotate(-1deg)" },
          "75%": { opacity: "0.85", transform: "scale(1.05) rotate(0.5deg)" },
        },
      },
      animation: {
        // Your custom animations
        "spin-slow": "spin-slow 3s linear infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        flame: "flame-flicker 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
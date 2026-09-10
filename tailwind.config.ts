import type { Config } from "tailwindcss";

/*
  Tokens mirror the shipped VYRO app (index.html :root) so the landing page and the
  product read as one surface. The greens are deliberate: the app's ground is a
  green-black (#0E1210), never #000, which is what keeps lime reading as atmosphere
  rather than an accent stuck onto flat black.
*/
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        lime: {
          DEFAULT: "#CCFF00",
          deep: "#9FCC00",
          bright: "#DDFF5C",
          ink: "#1A1F14",
          text: "#D6FF66",
        },
        surface: {
          DEFAULT: "#0E1210", // --bg
          warm: "#12160E", // --bg-warm
          1: "#1B1F1A", // --s1
          2: "#20241F", // --s2
          3: "#282D27", // --s3
        },
      },
      fontFamily: {
        display: ["Outfit", "Inter", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        body: ["Inter", "Outfit", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
      keyframes: {
        pulseDot: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: ".4", transform: "scale(.7)" },
        },
        // Prize figure breathes rather than blinks — the glow swells, the text never moves.
        prizeGlow: {
          "0%, 100%": {
            textShadow: "0 0 40px rgba(204,255,0,.45), 0 0 90px rgba(204,255,0,.18)",
          },
          "50%": {
            textShadow: "0 0 55px rgba(204,255,0,.75), 0 0 120px rgba(204,255,0,.35)",
          },
        },
        stickyIn: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        pulseDot: "pulseDot 1.6s ease-in-out infinite",
        prizeGlow: "prizeGlow 3.2s ease-in-out infinite",
        stickyIn: "stickyIn .35s cubic-bezier(.16,1,.3,1) both",
      },
    },
  },
  plugins: [],
};

export default config;

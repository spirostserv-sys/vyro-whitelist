import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        lime: {
          DEFAULT: "#CCFF00",
          deep: "#9FCC00",
          bright: "#E9FF7A",
          ink: "#12160A",
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
      },
      animation: {
        pulseDot: "pulseDot 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;

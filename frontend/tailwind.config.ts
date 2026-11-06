import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          maroon: "#7B263A",
          DEFAULT: "#7B263A",
          hover: "#611C2C",
        },
        saffron: {
          DEFAULT: "#D97724",
          light: "#EFA458",
          dark: "#B85C14",
        },
        heritage: {
          gold: "#C49A45",
          "gold-light": "#DFC280",
          "gold-dark": "#9F792A",
        },
        ivory: {
          DEFAULT: "#FAF7F0",
          card: "#FFFFFF",
          subtle: "#F5EFE6",
        },
        charcoal: {
          DEFAULT: "#302A27",
          muted: "#4A423D",
        },
        secondary: {
          text: "#766B60",
        },
        border: {
          heritage: "#E9DFD0",
          DEFAULT: "#E9DFD0",
        },
      },
      fontFamily: {
        serif: ["var(--font-noto-serif)", "Noto Serif", "serif"],
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        telugu: ["var(--font-noto-telugu)", "Noto Sans Telugu", "sans-serif"],
      },
      boxShadow: {
        heritage: "0 4px 20px -2px rgba(123, 38, 58, 0.08)",
        "heritage-lg": "0 10px 30px -4px rgba(123, 38, 58, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;

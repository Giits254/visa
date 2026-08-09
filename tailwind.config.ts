import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        night: {
          DEFAULT: "#101B2D",
          light: "#17263F",
          soft: "#1F3050",
        },
        sand: {
          DEFAULT: "#F3E9D7",
          dim: "#EADFC8",
          deep: "#DFCFA9",
        },
        gold: {
          DEFAULT: "#C89B3C",
          light: "#E0B65E",
          dark: "#9C7527",
        },
        teal: {
          DEFAULT: "#1D8A82",
          light: "#2CA79D",
          dark: "#146862",
        },
        ink: "#16202E",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "lattice": "url('/lattice.svg')",
        "dune-line": "linear-gradient(180deg, rgba(16,27,45,0) 0%, #101B2D 100%)",
      },
      boxShadow: {
        stamp: "0 0 0 1px rgba(200,155,60,0.35), 0 12px 30px -10px rgba(16,27,45,0.35)",
      },
    },
  },
  plugins: [],
};
export default config;

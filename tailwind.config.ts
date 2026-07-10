import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: "#B8EB86",
          hover: "#A2D96E",
          soft: "rgba(184, 235, 134, 0.13)", // badge background per spec
        },
        ink: "#121212",
        muted: "#6B6B6B",
        divider: "#E0E0E0",
        surface: "#FFFFFF",
        canvas: "#F5F5F5",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      fontSize: {
        hero: ["72px", { lineHeight: "1.05", letterSpacing: "-2px", fontWeight: "800" }],
        "hero-md": ["56px", { lineHeight: "1.05", letterSpacing: "-1.5px", fontWeight: "800" }],
        "hero-sm": ["40px", { lineHeight: "1.08", letterSpacing: "-1px", fontWeight: "800" }],
        section: ["48px", { lineHeight: "1.1", letterSpacing: "-1.5px", fontWeight: "700" }],
        "section-md": ["36px", { lineHeight: "1.12", letterSpacing: "-1px", fontWeight: "700" }],
        "section-sm": ["28px", { lineHeight: "1.15", letterSpacing: "-0.5px", fontWeight: "700" }],
        label: ["12px", { letterSpacing: "0.08em", fontWeight: "600" }],
      },
      letterSpacing: {
        label: "0.08em",
      },
      maxWidth: {
        content: "1440px",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.65, 0, 0.35, 1)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;

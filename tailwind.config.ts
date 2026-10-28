import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0b1110",
        panel: "#111a18",
        mint: "#b9f56a",
        muted: "#93a39d"
      },
      boxShadow: {
        glow: "0 0 60px rgba(185,245,106,.10)"
      }
    }
  },
  plugins: []
};
export default config;

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
        background: "var(--background)",
        foreground: "var(--foreground)",
        ev: {
          green: {
            50: "#ecfdf5",
            100: "#d1fae5",
            500: "#10b981",
            600: "#059669",
            700: "#047857",
          },
          blue: {
            50: "#f0f9ff",
            100: "#e0f2fe",
            500: "#0ea5e9",
            600: "#0284c7",
            700: "#0369a1",
          },
          charcoal: {
            800: "#1f2937",
            900: "#111827",
            950: "#0b0f17",
          }
        }
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 12px 28px -4px rgba(0, 0, 0, 0.08), 0 4px 10px -2px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
};
export default config;

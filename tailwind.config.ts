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
        'brand-primary': '#BA8C3A',      // Camel/Or
        'brand-primary-hover': '#A87B34', // Camel/Or hover
        'brand-secondary': '#000000',     // Noir
        'brand-accent': '#E5C771',       // Doré clair
        'brand-text-primary': '#1A1A1A', // Texte principal
        'brand-text-secondary': '#555555',// Texte secondaire
        'brand-bg-primary': '#F5F5F5',   // Fond principal
        'brand-bg-secondary': '#FFFFFF', // Fond des cartes
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        serif: ['var(--font-cormorant)', 'serif'],
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms"), require("daisyui")],
  daisyui: {
    themes: [
      {
        tallel: {
          "primary": "#BA8C3A",
          "secondary": "#000000",
          "accent": "#E5C771",
          "neutral": "#1A1A1A",
          "base-100": "#F5F5F5", // Fond principal
          "info": "#555555",
          "success": "#4CAF50",
          "warning": "#FFC107",
          "error": "#F44336",

          // Customizations
          "--rounded-box": "0.25rem", // 4px
          "--rounded-btn": "0.25rem", // 4px
        },
      },
    ],
    darkTheme: "tallel", // or false if you want to disable dark mode
    base: true,
    styled: true,
    utils: true,
    prefix: "",
    logs: true,
    themeRoot: ":root",
  },
};
export default config;

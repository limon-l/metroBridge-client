/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      screens: {
        xs: "360px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
      colors: {
        primary: "#24204D",
        "primary-light": "#3A3570",
        "primary-dark": "#1A1738",
        accent: "#EB2D2E",
        "accent-light": "#F05252",
        neutral: "#737A7F",
        surface: "#F5F6F7",
        border: "#E5E7EB",
      },
      fontFamily: {
        sans: ["Inter", "Poppins", "system-ui", "sans-serif"],
      },
      fontSize: {
        h1: ["32px", { lineHeight: "40px" }],
        h2: ["24px", { lineHeight: "32px" }],
        h3: ["20px", { lineHeight: "28px" }],
        body: ["16px", { lineHeight: "24px" }],
        small: ["14px", { lineHeight: "20px" }],
      },
      borderRadius: {
        card: "12px",
      },
      boxShadow: {
        soft: "0 10px 25px -12px rgba(36, 32, 77, 0.22)",
      },
      gridTemplateColumns: {
        dashboard: "260px minmax(0, 1fr)",
      },
    },
  },
  plugins: [],
};

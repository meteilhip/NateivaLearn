/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#E50914", // Rouge CTA
        dark: "#0B0B0B",    // Noir profond
        light: "#F5F5F5",   // Gris clair pour background
      },
    },
  },
  plugins: [],
};

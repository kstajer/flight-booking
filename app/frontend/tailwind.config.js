/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "plane-bg": "url('/public/plane-background.png')",
      },
    },
  },
  plugins: [],
};

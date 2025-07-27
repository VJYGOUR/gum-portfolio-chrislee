export default {
  content: ["./index.html", "./src/**/*.{js,html}"],
  theme: {
    extend: {
      keyframes: {
        slide: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        slide: "slide 2s ease-out forwards", // <--- Added 'forwards' here
      },
    },
  },
  plugins: [],
};

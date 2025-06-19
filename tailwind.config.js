module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/lib/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        sans:['inter','sans-seruf'],
      backgroundImage: {
        'glassmorphism': "radial-gradient(circle at center, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), url('/images/bg-noise.png')",
      },

      colors: {
        'orange-400': '#FFA500',
        'yellow-500': '#FFFF00',
      },
      },
    },
  },
  plugins: [],
};
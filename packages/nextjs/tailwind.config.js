import { defineConfig } from 'tailwindcss'

export default defineConfig({
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
        themes: ["light", "dark", "cupcake", "synthwave"], // Example themes
        darkTheme: "dark", // Theme to use when system prefers dark mode
      },
})
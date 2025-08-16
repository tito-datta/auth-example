/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './stories/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        // High-contrast dark mode backgrounds and text
        'dark-bg': '#191920ff',
        'dark-bg-secondary': '#433f3cff',
        'dark-border': '#27272a',
        'dark-text': '#f8fafc',
        'dark-text-secondary': '#94bcedff',
      },
    },
  },
  plugins: [],
}

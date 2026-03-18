/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'slate-gray': '#2D2D35',
        'mint-green': '#00F5D4',
        'teal-accent': '#00BBF9',
      },
      boxShadow: {
        'neu-flat': '8px 8px 16px #24242a, -8px -8px 16px #363640',
        'neu-flat-sm': '4px 4px 8px #24242a, -4px -4px 8px #363640',
        'neu-inset': 'inset 6px 6px 12px #24242a, inset -6px -6px 12px #363640',
        'neu-inset-sm': 'inset 3px 3px 6px #24242a, inset -3px -3px 6px #363640',
        'neu-button': '5px 5px 10px #24242a, -5px -5px 10px #363640',
        'neu-button-pressed': 'inset 5px 5px 10px #24242a, inset -5px -5px 10px #363640',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries')
  ],
};

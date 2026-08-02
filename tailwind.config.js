/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,html}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#000000',
          red: '#e10600',
          gray: '#d9d6d3',
          offwhite: '#f2f2f0',
          white: '#ffffff'
        },
        /* Map common utility palettes to brand colors so existing classes pick up branding */
        cyan: {
          300: '#e10600',
          400: '#e10600',
          500: '#e10600'
        },
        fuchsia: {
          500: '#e10600'
        },
        slate: {
          300: '#d9d6d3',
          400: '#d9d6d3'
        },
        black: '#000000',
        white: '#ffffff'
      }
    }
  },
  plugins: []
};

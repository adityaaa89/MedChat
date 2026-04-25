/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FFFFFF',
          100: '#FFFDF8', // Ivory
          200: '#F8F3EA', // Cream
        },
        pastel: {
          teal: '#3E6B6B',
          teal_light: '#E8F0ED',
          teal_hover: '#2F5555',
          clay: '#C77A5B',
          blue: '#D6E4F0',
          blue_border: '#C3D6E5',
          sage: '#DCE7DD',
          sage_border: '#C8D9C9',
          sage_btn: '#A8C3A0',
          sage_btn_hover: '#96B38E',
          lavender: '#E6DDF0',
          lavender_border: '#D5C9E6',
          peach: '#F4D9C6',
        },
        slate: {
          800: '#1F2933',
          500: '#4B5563',
        }
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#fdf4f3',
          100: '#fce8e4',
          200: '#fad5ce',
          300: '#f5b5aa',
          400: '#ed8a78',
          500: '#e1644d',
          600: '#cd4730',
          700: '#ac3825',
          800: '#8e3122',
          900: '#762e22',
        },
        warm: {
          50: '#fefcfb',
          100: '#fdf8f5',
          200: '#faf0e8',
          300: '#f5e3d4',
          400: '#eecdb3',
          500: '#e5b08e',
        }
      }
    }
  },
  plugins: [],
};

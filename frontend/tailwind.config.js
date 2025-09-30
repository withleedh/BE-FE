/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hyundai: {
          navy: '#002C5F',
          blue: '#00AAD2',
          silver: '#C8CDD0',
          dark: '#1A1A1A',
          gray: {
            100: '#F5F6F7',
            200: '#E9ECEF',
            300: '#DEE2E6',
            400: '#CED4DA',
            500: '#ADB5BD',
            600: '#6C757D',
            700: '#495057',
            800: '#343A40',
            900: '#212529',
          }
        },
        status: {
          normal: '#10B981',
          warning: '#F59E0B',
          critical: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        fromBlue: '#0A86F0',
        toBlue: '#3870AB',
        fromGreen: '#7AFF55',
        toGreen: '#00AA06',
        bgColor: '#F4F6F8',
        mainText: '#1E1E2F',
        alertGreen: '#C1F9AA',
        alertRed: '#F4BFBF',
        grayText: '#AFAFAF',
        redText: '#FF1717',
        greenText: '#7AFF55',
      },

      fontFamily: {
        montserrat: ["Montserrat", 'sans-serif'],
      },

      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-down': {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-left': {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'fade-right': {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        blink: {
          '0%, 100%': { color: 'white' },
          '50%': { color: '#00DDFF' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.8s ease-out',
        'fade-up': 'fade-up 0.8s ease-in-out',
        'fade-down': 'fade-down 0.8s ease-out',
        'fade-left': 'fade-left 0.8s ease-out',
        'fade-right': 'fade-right 0.8s ease-out',
        'blink': 'blink 0.7s infinite',
      },
    },

  },
  plugins: [],
}

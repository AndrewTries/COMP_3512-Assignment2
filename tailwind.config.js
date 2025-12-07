export default {
  content: ["./**/*.html", "./**/*.js"],
  theme: {
    extend: {
      keyframes: {
        toast: {
          '0%': {
            opacity: '0',
            transform: 'translateY(0)',
          },
          '10%': {
            opacity: '1',
            transform: 'translateY(40px)',
          },
          '90%': {
            opacity: '1',
            transform: 'translateY(40px)',
          },
          '100%': {
            opacity: '0',
            transform: 'translateY(0)',
          },
        },
      },
      animation: {
        toast: 'toast 4s ease-in-out forwards',
      },
    },
  },
  plugins: [],
};

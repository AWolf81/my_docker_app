module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.svelte', './src/**/*.css'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      boxShadow: {
        inner: 'inset 0 4px 8px 0 rgba(0, 0, 0, 0.12)'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: [require('@tailwindcss/forms')]
};

/** @type {import('tailwindcss/plugin').TailwindPluginCreator} */
const plugin = require('tailwindcss/plugin');

module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      maxWidth: {
        vw: '100vw'
      },
      maxHeight: {
        'vh-50': '50vh',
        'vh-75': '75vh'
      }
    }
  },
  plugins: [
    plugin(function ({ addVariant, e }) {
      addVariant('high-contrast', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.high-contrast .${e(`high-contrast${separator}${className}`)}`;
        });
      });
    })
  ]
};

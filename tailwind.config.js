import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {}
	},
	plugins: [
		plugin(function ({ addVariant, e }) {
			addVariant('high-contrast', ({ modifySelectors, separator }) => {
				modifySelectors(({ className }) => {
					return `:is(.high-contrast .${e(`high-contrast${separator}${className}`)})`;
				});
			});
		})
	]
};

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
	plugins: []
};

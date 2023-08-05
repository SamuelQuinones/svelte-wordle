module.exports = {
	root: true,
	globals: {
		__VERSION__: 'readonly'
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended-type-checked',
		'plugin:@typescript-eslint/stylistic-type-checked',
		'plugin:svelte/prettier',
		'prettier'
	],
	rules: {
		'prettier/prettier': ['warn', {}, { usePrettierrc: true }],
		'@typescript-eslint/no-unused-vars': [
			'warn',
			{ varsIgnorePattern: '^_', argsIgnorePattern: '^_' }
		]
	},
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'prettier'],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
		project: true,
		tsconfigRootDir: __dirname,
		extraFileExtensions: ['.svelte']
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	},
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser'
			}
		},
		{
			files: ['*.cjs', '*.config.js'],
			extends: ['plugin:@typescript-eslint/disable-type-checked']
		}
	]
};

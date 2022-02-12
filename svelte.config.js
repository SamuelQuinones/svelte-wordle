// import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';
import * as path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess({
		postcss: true
	}),

	kit: {
		adapter: adapter(),
		vite: {
			define: {
				__version__: JSON.stringify(process.env.npm_package_version)
			},
			resolve: {
				alias: {
					$lib: path.resolve('src/lib/'),
					$stores: path.resolve('src/stores/'),
					$constants: path.resolve('src/constants/')
				}
			}
		}
	}
};

export default config;

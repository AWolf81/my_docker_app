import sveltePreprocess from 'svelte-preprocess'
import node from '@sveltejs/adapter-node'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: sveltePreprocess(),
	kit: {
		// By default, `npm run build` will create a standard Node app.
		// You can create optimized builds for different platforms by
		// specifying a different adapter
		adapter: node(),

		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		vite: {
			//
			// resolve: {
			// 	alias: {
			// 		// '@apollo/client/core': '/node_modules/client/core/'
			// 		'svelte-apollo': '/node_modules/svelte-apollo/dist/svelte-apollo.es.js'
			// 	},
			// },
			ssr: {
				noExternal: [ 'tslib', 'svelte-apollo']
			}
		}
	},
};

export default config;

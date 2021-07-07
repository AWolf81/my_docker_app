import sveltePreprocess from 'svelte-preprocess'
import node from '@sveltejs/adapter-node'

// const dev = process.env.NODE_ENV === 'development'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: sveltePreprocess({
		// sourceMap: true,
		// defaults: {
		// 	script: "typescript",
		// }
	}),
	kit: {
		// By default, `npm run build` will create a standard Node app.
		// You can create optimized builds for different platforms by
		// specifying a different adapter
		adapter: node(),

		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		vite: {
			// --> resolve needed with-out Provider component
			// resolve: {
			// 	alias: {
			// 		'svelte-apollo': '/node_modules/svelte-apollo/dist/svelte-apollo.es.js'
			// 	},
			// },
			// optimizeDeps: {
			// 	include: [
			// 	  "@apollo/client/core",
			// 	  "@apollo/client/cache",
			// 	  "@apollo/client/link/ws",
			// 	  "@apollo/client/link/context",
			// 	  "@apollo/client/link/error",
			// 	  "@apollo/client/utilities",
			// 	],
			// 	exclude: ["@apollo/client", "svelte-apollo"],
			// },
			// ssr: {
			// 	noExternal: ["tslib"]
			// }
		}
		// vite: {
		// 	optimizeDeps: {
		// 		include: [
		// 		  "@apollo/client/core",
		// 		  "@apollo/client/cache",
		// 		  "@apollo/client/link/ws",
		// 		  "@apollo/client/link/context",
		// 		  "@apollo/client/link/error",
		// 		  "@apollo/client/utilities",
		// 		],
		// 		exclude: ["@apollo/client", "svelte-apollo"],
		// 	  },
		// }
	},
};

export default config;

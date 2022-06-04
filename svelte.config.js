import preprocess from 'svelte-preprocess';
import adapt from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		adapter: adapt({
			fallback: "404.html"
		})
	},
	preprocess: preprocess({

	}),

	methodOverride: {
		allowed: ['PUT', 'PATCH', 'DELETE']
	}
};

export default config;

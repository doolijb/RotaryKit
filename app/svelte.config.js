import adapter from "@sveltejs/adapter-auto"
import { vitePreprocess } from "@sveltejs/kit/vite"

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [vitePreprocess({})],
	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter(),
		alias: {
			"@constants": "./src/lib/constants",
			"@components": "./src/lib/client/components",
			"@components/*": "./src/lib/client/components/*",
			"@stores": "./src/lib/client/stores",
			"@data": "./src/lib/data",
			"@interfaces": "./src/lib/interfaces",
			"@server": "./src/lib/server",
			"@server/*": "./src/lib/server/*",
			"@testing": "./src/lib/testing",
			"@testing/*": "./src/lib/testing/*",
			"@themes": "./src/lib/client/themes",
			"@themes/*": "./src/lib/client/themes/*",
			"@validation": "./src/lib/validation",
			"@validation/*": "./src/lib/validation/*"
		}
	}
}

export default config

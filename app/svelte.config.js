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
			/**
			 *	Client
			 */
			"@components": "./src/lib/client/components",
			"@stores": "./src/lib/client/stores",
			"@themes": "./src/lib/client/themes",

			/**
			 *	Server
			 */
			"@auth": "./src/lib/server/auth",
			"@database": "./src/lib/server/database",

			 /**
			 * 	Shared
			 */
			"@constants": "./src/lib/shared/constants",
			"@data": "./src/lib/shared/data",
			"@types": "src/lib/shared/interfaces",
			"@testing": "./src/lib/shared/testing",
			"@validation": "src/lib/shared/validation",
		}
	}
}

export default config

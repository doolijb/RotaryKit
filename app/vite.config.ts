import { sveltekit } from "@sveltejs/kit/vite"
import { defineConfig, type UserConfigExport } from "vitest/config"
import fs from "fs"
import yaml from "js-yaml"
import { zeroAPI } from "sveltekit-zero-api"

// Read the aliases from the YAML file
const aliases = yaml.load(fs.readFileSync("aliases.yaml", "utf-8")) as { [key: string]: unknown }

// Create the alias configuration
const aliasConfig = Object.fromEntries(
	Object.entries(aliases).map(([alias, path]) => [alias.replace(/[""]/g, ""), path as string])
)

const config = {
	plugins: [sveltekit(), zeroAPI()],
	test: {
		include: ["src/**/*.int.test.ts", "src/**/int.test.ts"],
		setupFiles: ["./src/lib/shared/testing/setupIntegrationTests.ts"],
		testTimeout: 60_000,
		hookTimeout: 60_000,
		browser: {
			name: "firefox", // or 'chrome', 'safari', etc.
			headless: true
		}
	},
	build: {
		rollupOptions: {
			external: [/\.storybook\..+$/, /\.test\..+$/]
		},
		sourcemap: true,
		ssr: true,
	},
	resolve: {
		// alias: aliasConfig
	},
	kit: {
		alias: aliasConfig
	}
} satisfies UserConfigExport

export default defineConfig(config)

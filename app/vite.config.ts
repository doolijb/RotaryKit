import { sveltekit } from "@sveltejs/kit/vite"
import { defineConfig } from "vitest/config"
import fs from "fs"
import yaml from "js-yaml"


// Read the aliases from the YAML file
const aliases = yaml.load(fs.readFileSync("aliases.yaml", "utf-8"))

// Create the alias configuration
const aliasConfig = Object.fromEntries(
  Object.entries(aliases).map(([alias, path]) => [alias.replace(/[""]/g, ""), path as string])
)

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ["src/**/*.test.ts"],
		setupFiles: ["./src/lib/shared/testing/setupTests.ts"],
	},
	build: {
		rollupOptions: {
			external: [/\.storybook\..+$/, /\.test\..+$/]
		}
	},
	resolve: {
		alias: aliasConfig
	  },
})

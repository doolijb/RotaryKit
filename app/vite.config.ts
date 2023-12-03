import { sveltekit } from "@sveltejs/kit/vite"
import { defineConfig, type UserConfigExport } from "vitest/config"
import fs from "fs"
import yaml from "js-yaml"
import path from "path"


// Read the aliases from the YAML file
const aliases = yaml.load(fs.readFileSync("aliases.yaml", "utf-8"))

// Create the alias configuration
const aliasConfig = Object.fromEntries(
  Object.entries(aliases).map(([alias, path]) => [alias.replace(/[""]/g, ""), path as string])
)

const config = {
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
} satisfies UserConfigExport

export default defineConfig(config)
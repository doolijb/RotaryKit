import type { StorybookConfig } from "@storybook/sveltekit"

const config: StorybookConfig = {
	stories: [
		{
			directory: "../src/lib/client/components",
			titlePrefix: "Components"
		}
	],
	
	addons: [
		"@storybook/addon-links",
		"@storybook/addon-essentials",
		"@storybook/addon-interactions"
	],
	framework: {
		name: "@storybook/sveltekit",
		options: {}
	},
	docs: {
		autodocs: "tag"
	}
}
export default config

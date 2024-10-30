import type { StorybookConfig } from "@storybook/sveltekit"
import path from "path"

const config: StorybookConfig = {
	stories: [
		{
			directory: "../src/lib/client/components",
			titlePrefix: "Components"
		},
		{
			directory: "../src/lib/client/emailTemplates",
			titlePrefix: "Email Templates"
		}
	],

	addons: [
		"@storybook/addon-links",
		"@storybook/addon-essentials",
		"@storybook/addon-interactions",
		"storybook-addon-mock",
		"@chromatic-com/storybook",
		"@storybook/addon-styling-webpack"
	],
	framework: {
		name: "@storybook/sveltekit",
		options: {}
	},
	docs: {}
}
export default config

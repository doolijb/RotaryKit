import type { StorybookConfig } from '@storybook/sveltekit';

const config: StorybookConfig = {
  // "stories": [
	// 	{
	// 		directory: "../src/lib/client/components",
	// 		titlePrefix: "Components"
	// 	},
	// 	{
	// 		directory: "../src/lib/client/emailTemplates",
	// 		titlePrefix: "Email Templates"
	// 	}
	// ],
  "stories": [
		"../src/**/*.mdx",
		"../src/**/*.stories.@(js|ts|svelte)"
	  ],
  "addons": [
    "@storybook/addon-essentials",
    "@storybook/addon-svelte-csf",
    "@chromatic-com/storybook",
    "@storybook/experimental-addon-test",
    "@storybook/addon-styling-webpack",
    "@storybook/addon-themes"
  ],
  "framework": {
    "name": "@storybook/sveltekit",
    "options": {}
  }
};
export default config;
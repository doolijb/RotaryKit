import { join } from 'path';
import type { Config } from 'tailwindcss';

// 1. Import the Skeleton plugin
import { skeleton } from '@skeletonlabs/tw-plugin';

const config = {
	// 2. Opt for dark mode to be handled via the class method
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		// 3. Append the path to the Skeleton package
		join(require.resolve(
			'@skeletonlabs/skeleton'),
			'../**/*.{html,js,svelte,ts}'
		)
	],
	theme: {
		extend: {},
	},
	plugins: [
		skeleton({
			themes: {
				preset: [
					{ name: "crimson", enhancements: false },
					{ name: "gold-nouveau", enhancements: false },
					{ name: "hamlindigo", enhancements: false },
					{ name: "modern", enhancements: false },
					{ name: "rocket", enhancements: false },
					{ name: "sahara", enhancements: false },
					{ name: "seafoam", enhancements: false },
					{ name: "skeleton", enhancements: false },
					{ name: "vintage", enhancements: false },
					{ name: "wintry", enhancements: false },
				]
			}
		})
	]
} satisfies Config;

export default config;
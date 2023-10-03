import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	// exclude .storybook.* and .test.* files in build
	build: {
		rollupOptions: {
			external: [/\.storybook\..+$/, /\.test\..+$/]
		}
	}
});

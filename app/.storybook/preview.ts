import type { Preview } from "@storybook/svelte"
import { ThemeProvider, themeMap } from "../src/lib/client/themes"
import { EmptyDecorator } from "../src/lib/client/components/_decorators"
import { SvelteComponent } from "svelte";

const themes = new Array<{ value: string; title: string }>()
// loop over theme values
for (const theme of themeMap.values()) {
	themes.push({
		value: theme.value,
		title: theme.title
	})
}

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/
			}
		},
		sveltekit_experimental: {
			stores: {
				page: {
					url: new URL("http://localhost"),
					params: {}
				},
				navigating: null,
				session: null,
				updated: false,
			},
		}
	},
	decorators: [
		(args, story) => { 
			if (!story.parameters?.skipThemeProvider) {
				return {
					Component: ThemeProvider,
					props: {
						theme: story.globals.theme,
						darkMode: story.globals.darkMode
					}
				}
			} else {
				return {
					Component: EmptyDecorator
				}
			}
		}
	],
	globalTypes: {
		theme: {
			// Skeleton theme switcher
			name: "Theme",
			description: "Global theme for components",
			defaultValue: "skeleton",
			toolbar: {
				dynamicTitle: true,
				icon: "paintbrush",
				items: themes
			}
		},
		darkMode: {
			name: "Dark Mode",
			description: "Global dark mode for components",
			defaultValue: false,
			toolbar: {
				dynamicTitle: true,
				icon: "circlehollow",
				items: [
					{ value: false, title: "Light", icon: "sun" },
					{ value: true, title: "Dark", icon: "moon" }
				],
				showName: true
			}
		}
	}
}

export default preview

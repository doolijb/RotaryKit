import type { Preview } from '@storybook/svelte'
import ThemeProvider from './ThemeProvider.svelte'
import { withThemeByClassName, withThemeByDataAttribute } from '@storybook/addon-themes';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },

  decorators: [
		// (args, story) => {
			// if (!story.parameters?.skipThemeProvider) {
				// return {
				// 	Component: ThemeProvider,
				// 	props: {
				// 		theme: story.globals.theme,
				// 		darkMode: story.globals.darkMode
				// 	}
				// }
			// } else {
			// 	return {
			// 		Component: EmptyDecorator
			// 	}
			// }
		// }
    withThemeByDataAttribute({
      themes: {
        cerberus: 'cerberus',
      },
      defaultTheme: 'cerberus',
      attributeName: 'data-theme',
    }),
    () => ThemeProvider,
	],

};

export default preview;
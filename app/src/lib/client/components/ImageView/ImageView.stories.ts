import type { Meta, StoryObj, Args } from "@storybook/svelte"

import ImageView from "."
import { faker } from "@faker-js/faker"

const meta: Meta<typeof ImageView> = {
	component: Image,
	parameters: {
		sveltekit_experimental: {
			stores: {
				page: {
					data: {
						storageUrl: "https://placehold.co"
					}
				}
			}
		}
	},
	tags: ["autodocs"],
	docs: {
		description: {
			component:
				"The Image component is used to display images with support for different sizes and formats. It can handle WebP and JPG formats and provides options for small, medium, large, and original sizes."
		}
	}
}

export default meta

type Story = StoryObj<typeof meta>

const result = {
	id: faker.string.uuid(),
	title: faker.lorem.words(),
	originalPath: "/3840x2160/png",
	webpPath: "/1920x1080/webp",
	jpgPath: "/1920x1080/jpg",
	mediumWebpPath: "/800x600/webp",
	mediumJpgPath: "/800x600/jpg",
	smallWebpPath: "/200x175/webp",
	smallJpgPath: "/200x175/jpg"
} as SelectImage

export const Default: Story = {
	parameters: {
		docs: {
			source: {
				code: `
          <Image {image} />
        `
			}
		}
	},
	args: {
		size: undefined,
		result
	}
}

export const OriginalSize: Story = {
	args: {
		size: "original",
		result
	}
}

export const LargeSize: Story = {
	args: {
		size: "large",
		result
	}
}

export const MediumSize: Story = {
	args: {
		size: "medium",
		result
	}
}

export const SmallSize: Story = {
	args: {
		size: "small",
		result
	}
}

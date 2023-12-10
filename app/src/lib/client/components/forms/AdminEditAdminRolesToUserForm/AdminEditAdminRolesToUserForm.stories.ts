import type { ComponentType } from "svelte"
import { faker } from "@faker-js/faker"

import type { Meta } from "@storybook/svelte"

import Component from "."

const meta: Meta<typeof Component> = {
	argTypes: {} as any,
	component: Component as ComponentType,
	decorators: [],
	tags: ["autodocs"]
}

export default meta

const Template = (args: { value: boolean }) => ({
	Component,
	props: args
})

const adminRoles: SelectAdminRole = [
	{
		id: "bf08df7a-8711-4e7b-9fe5-87529dfbe556",
		name: "Editor",
	},
	{
		id: "f42a3ed3-1133-413f-8829-536a23167fa0",
		name: "Contributor",
	},
	{
		id: "182ae78c-4801-44a1-b329-cf751d09a1be",
		name: "Customer Support",
	},
	{
		id: "c997baf2-bded-4835-82ba-536ccecf0bfa",
		name: "Administrator",
	},
	{
		id: "f06cd6c9-f812-4518-a231-83839393c70c",
		name: "Security",
	},
	{
		id: "fa81a230-6588-4915-b392-06bdd5d4a7b1",
		name: "Data Engineer",
	},
]

export const Default = {
	args: {
		adminRoles,
		result: {
			id: "bf08df7a-8711-4e7b-9fe5-87529dfbe556",
			username: "jackSparrow",
			isAdmin: true,
			isSuperUser: false,
			toAdminRoles: []
		}
	},
	render: Template
}

export const Filled = {
	args: {
		adminRoles,
		result: {
			id: "bf08df7a-8711-4e7b-9fe5-87529dfbe556",
			username: "jackSparrow",
			isAdmin: true,
			isSuperUser: false,
			toAdminRoles: [
				{
					adminRole: {
						id: "bf08df7a-8711-4e7b-9fe5-87529dfbe556",
						name: "Editor",
					}
				},
				{
					adminRole: {
						id: "f42a3ed3-1133-413f-8829-536a23167fa0",
						name: "Contributor",
					},
				}
			],
		}
	},
	render: Template
}

// export const WithErrors = {
//     args: {
//         formData: {
//             email: "bad@email",
//             passphrase: "some passphrase",
//             passphraseConfirm: "does not match",
//         },
//     },
// }

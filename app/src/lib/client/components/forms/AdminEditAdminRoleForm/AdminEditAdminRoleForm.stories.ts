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

const adminPermissions = [
	{
		id: "bf08df7a-8711-4e7b-9fe5-87529dfbe556",
		name: "Create Admin Permissions",
		action: "POST",
		resource: "admin_permissions"
	},
	{
		id: "f42a3ed3-1133-413f-8829-536a23167fa0",
		name: "Create Admin Roles",
		action: "POST",
		resource: "admin_roles"
	},
	{
		id: "182ae78c-4801-44a1-b329-cf751d09a1be",
		name: "Create Email Verifications",
		action: "POST",
		resource: "email_verifications"
	},
	{
		id: "c997baf2-bded-4835-82ba-536ccecf0bfa",
		name: "Create Emails",
		action: "POST",
		resource: "emails"
	},
	{
		id: "f06cd6c9-f812-4518-a231-83839393c70c",
		name: "Create Passphrase Resets",
		action: "POST",
		resource: "passphrase_resets"
	},
	{
		id: "fa81a230-6588-4915-b392-06bdd5d4a7b1",
		name: "Create Passphrases",
		action: "POST",
		resource: "passphrases"
	},
	{
		id: "1b039d78-4a78-420c-a9fb-056942f4fa27",
		name: "Create User Tokens",
		action: "POST",
		resource: "user_tokens"
	},
	{
		id: "a497ab6f-e410-416a-94a8-4f4323f83784",
		name: "Create Users",
		action: "POST",
		resource: "users"
	},
	{
		id: "9110f252-8b7a-4c6e-8ead-81accfd31384",
		name: "Delete Admin Permissions",
		action: "DELETE",
		resource: "admin_permissions"
	},
	{
		id: "5c42c715-91f2-4dca-9645-dedf8df5a43b",
		name: "Delete Admin Roles",
		action: "DELETE",
		resource: "admin_roles"
	},
	{
		id: "1781e824-2c0a-4f29-adc4-d85700807424",
		name: "Delete Email Verifications",
		action: "DELETE",
		resource: "email_verifications"
	},
	{
		id: "3a127f18-3402-48a4-a58d-30cebc7d65f1",
		name: "Delete Emails",
		action: "DELETE",
		resource: "emails"
	},
	{
		id: "662f196b-5f3d-4dca-b3a0-8aac80e9a6d3",
		name: "Delete Passphrase Resets",
		action: "DELETE",
		resource: "passphrase_resets"
	},
	{
		id: "14bfa643-4cd9-4732-bffa-c0f43d3012f4",
		name: "Delete Passphrases",
		action: "DELETE",
		resource: "passphrases"
	},
	{
		id: "f2c58b84-b303-4b77-a053-54b06882ef6b",
		name: "Delete User Tokens",
		action: "DELETE",
		resource: "user_tokens"
	},
	{
		id: "ac0f87c2-1bf8-4fc3-85b4-f12b271f9541",
		name: "Delete Users",
		action: "DELETE",
		resource: "users"
	},
	{
		id: "b00a1604-c859-4195-9687-cfcacf21e699",
		name: "Read Admin Permissions",
		action: "GET",
		resource: "admin_permissions"
	},
	{
		id: "2c4aa4fa-d0e3-4d65-b38d-53f23a8897f0",
		name: "Read Admin Roles",
		action: "GET",
		resource: "admin_roles"
	},
	{
		id: "7c9ad4b7-da73-4e72-be50-2811206e3d20",
		name: "Read Email Verifications",
		action: "GET",
		resource: "email_verifications"
	},
	{
		id: "1190c386-1202-4c30-b29c-0f26d0704238",
		name: "Read Emails",
		action: "GET",
		resource: "emails"
	},
	{
		id: "ec58ac2b-6e71-4ec2-b8ba-f32d9dcd4387",
		name: "Read Passphrase Resets",
		action: "GET",
		resource: "passphrase_resets"
	},
	{
		id: "131bbcc1-a1b8-4509-810a-55dc250c0968",
		name: "Read Passphrases",
		action: "GET",
		resource: "passphrases"
	},
	{
		id: "5b349a6c-56a1-4506-8dda-e7ec82b5f303",
		name: "Read User Tokens",
		action: "GET",
		resource: "user_tokens"
	},
	{
		id: "d88f556e-8e34-4d13-9878-00c1967c0f2b",
		name: "Read Users",
		action: "GET",
		resource: "users"
	},
	{
		id: "d3075918-4e01-4c3e-8e5e-6f8f06535e95",
		name: "Update Admin Permissions",
		action: "PUT",
		resource: "admin_permissions"
	},
	{
		id: "e9311c80-410c-4100-bd80-22a3a39acc90",
		name: "Update Admin Roles",
		action: "PUT",
		resource: "admin_roles"
	},
	{
		id: "102ee32e-13b9-4bbc-9f1b-96e7568edc2c",
		name: "Update Email Verifications",
		action: "PUT",
		resource: "email_verifications"
	},
	{
		id: "daeedabf-9b8d-49c5-be18-0d16d1148113",
		name: "Update Emails",
		action: "PUT",
		resource: "emails"
	},
	{
		id: "55bd5b58-3a48-4825-a2d3-7191ffc96339",
		name: "Update Passphrase Resets",
		action: "PUT",
		resource: "passphrase_resets"
	},
	{
		id: "c7474cae-29b1-4992-bff8-1c4206ede598",
		name: "Update Passphrases",
		action: "PUT",
		resource: "passphrases"
	},
	{
		id: "e59dcb33-24fb-458c-bb07-6b545ebfab63",
		name: "Update User Tokens",
		action: "PUT",
		resource: "user_tokens"
	},
	{
		id: "7bd086b8-801b-45d6-bc8c-c14bf546b8fe",
		name: "Update Users",
		action: "PUT",
		resource: "users"
	}
]

export const Default = {
	args: {
		adminPermissions
	},
	render: Template
}

// export const Filled = {
//     args: {
//         formData: {
//             email: faker.internet.email(),
//             passphrase: "This is a valid passphrase$",
//             passphraseConfirm: "This is a valid passphrase$",
//         }
//     },
//     render: Template
// }

// export const WithErrors = {
//     args: {
//         formData: {
//             email: "bad@email",
//             passphrase: "some passphrase",
//             passphraseConfirm: "does not match",
//         },
//     },
// }

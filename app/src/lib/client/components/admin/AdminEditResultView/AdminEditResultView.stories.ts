import Component from "."
import { faker } from "@faker-js/faker"
import type { Meta } from "@storybook/svelte"
import { AdminEditUserForm } from "$client/components"
import AdminEditAdminRolesToUserForm from "../../forms/AdminEditAdminRolesToUserForm"
import { format } from "date-fns"

const meta: Meta<typeof Component> = {
	component: Component as any,
	tags: ["autodocs"],
	argTypes: {},
	parameters: {
		mockData: [
			{
				url: "/api/admin/users/abc123-456-789-0",
				method: "GET",
				status: 200,
				response: getMockUser("abc123-456-789-0")
			}
		]
	}
}

export default meta

const Template = ({ ...args }) => ({
	Component,
	props: args
})

function getMockUser(resourceId: string): SelectUser {
	return {
		id: resourceId,
		username: faker.internet.userName(),
		isActive: faker.datatype.boolean(),
		isAdmin: faker.datatype.boolean(),
		isSuperUser: faker.datatype.boolean(),
		createdAt: format(faker.date.past(), "yyyy-MM-dd HH:mm:ss.SSS"),
		updatedAt: format(faker.date.past(), "yyyy-MM-dd HH:mm:ss.SSS"),
		verifiedAt: format(faker.date.past(), "yyyy-MM-dd HH:mm:ss.SSS"),
		emails: [
			{
				id: faker.string.uuid(),
				address: faker.internet.email(),
				isUserPrimary: true
			}
		],
		toAdminRoles: []
	}
}

export const Default = Template.bind({})

Default.args = {
	resource: "users",
	resourceId: "abc123-456-789-0",
	displayTitle: "User",
	tabs: {
		default: {
			Form: AdminEditUserForm,
			handleSubmit: async (formData) => {
				console.log("handleSubmit", formData)
			}
		}
	}
}

export const WithTabs = Template.bind({})

WithTabs.args = {
	resource: "users",
	resourceId: "abc123-456-789-0",
	displayTitle: "User",
	tabs: {
		default: {
			Form: AdminEditUserForm,
			handleSubmit: async (formData) => {
				console.log("handleSubmit", formData)
			}
		},
		adminRoles: {
			Form: AdminEditAdminRolesToUserForm,
			handleSubmit: async (formData) => {
				console.log("handleSubmit", formData)
			},
			getFormExtras: async () => ({
				adminRoles: [
					{
						id: "bf08df7a-8711-4e7b-9fe5-87529dfbe556",
						name: "Editor"
					},
					{
						id: "f42a3ed3-1133-413f-8829-536a23167fa0",
						name: "Contributor"
					},
					{
						id: "182ae78c-4801-44a1-b329-cf751d09a1be",
						name: "Customer Support"
					},
					{
						id: "c997baf2-bded-4835-82ba-536ccecf0bfa",
						name: "Administrator"
					},
					{
						id: "f06cd6c9-f812-4518-a231-83839393c70c",
						name: "Security"
					},
					{
						id: "fa81a230-6588-4915-b392-06bdd5d4a7b1",
						name: "Data Engineer"
					}
				]
			})
		}
	}
}

// for range of 10, lets add examples.example to emailAddresses with fake ids

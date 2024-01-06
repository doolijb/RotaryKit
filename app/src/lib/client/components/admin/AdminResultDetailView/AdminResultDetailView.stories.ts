import Component from "."
import { faker } from "@faker-js/faker"
import type { Meta } from "@storybook/svelte"
import type { RequestEvent } from "@sveltejs/kit"
import { AdminCreateUserForm } from "$components"

const meta: Meta<typeof Component> = {
	component: Component as any,
	tags: ["autodocs"],
	argTypes: {},
	parameters: {
		// mockData: [
		//     {
		//         url: "/api/admin/users",
		//         method: "GET",
		//         status: 200,
		//         response: handleGetUsersResponse
		//     }
		// ]
	}
}

export default meta

const Template = ({ ...args }) => ({
	Component,
	props: args
})

function getMockUser() {
    const ret = {
		id: faker.string.uuid(),
		username: faker.internet.userName(),
		isAdmin: faker.datatype.boolean(),
		isSuperUser: faker.datatype.boolean(),
		createdAt: faker.date.past().toISOString(),
		updatedAt: faker.date.past().toISOString(),
		verifiedAt: faker.date.past().toISOString(),
		emails: []
	}

	// Add between 1 and 5 emails, 1 must be primary, the rest are not, some non-primary emails can be unverified
	const emailCount = faker.datatype.number({ min: 1, max: 5 })
	let hasPrimary = false
	for (let i = 0; i < emailCount; i++) {
		const email = {
			id: faker.string.uuid(),
			address: faker.internet.email(),
			isUserPrimary: !hasPrimary,
			verifiedAt: faker.date.past().toISOString(),
		}
		ret.emails.push(email)
		hasPrimary = true
	}

	return ret
}

export const Default = Template.bind({})

Default.args = {
	resource: "users",
	displayTitle: "User",
	result: getMockUser(),
	naturalKey: "username",
}

// for range of 10, lets add examples.example to emailAddresses with fake ids

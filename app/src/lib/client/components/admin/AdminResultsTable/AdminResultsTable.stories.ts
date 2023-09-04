import Component from "."
import { faker } from "@faker-js/faker"
import type { Meta } from "@storybook/svelte"

const meta: Meta<typeof Component> = {
	component: Component as any,
	tags: ["autodocs"],
	argTypes: {}
}

export default meta

const Template = ({ ...args }) => ({
	Component,
	props: args
})

export const Default = Template.bind({})

Default.args = {
	results: [],
	orderBy: "username:asc, createdAt:desc",
	totalCount: 100,
	resultCount: 10,
	resultStart: 1,
	resultEnd: 10,
	canViewResource: true,
	canEditResource: true,
	canDeleteResource: true,
	dataHandlers: {
		emails: {
			header: "Primary Email",
			handler: (result: any) => (result.length ? result[0].address : undefined),
			getUrl: (result: any) => "http://google.com"
		}
	},
	orderedKeys: ["id", "username", "emails", "verifiedAt", "isAdmin", "isSuperUser"]
}

// for range of 10, lets add examples.example to emailAddresses with fake ids
for (let i = 0; i < 10; i++) {
	Default.args.results.push({
		id: faker.string.uuid(),
		username: faker.internet.userName(),
		isAdmin: faker.datatype.boolean(),
		isSuperUser: faker.datatype.boolean(),
		createdAt: faker.date.past().toISOString(),
		updatedAt: faker.date.past().toISOString(),
		verifiedAt: faker.date.past().toISOString(),
		emails: [
			{
				id: faker.string.uuid(),
				address: faker.internet.email(),
				isUserPrimary: true
			}
		]
	})
}

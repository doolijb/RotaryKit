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

// function getMockUsers(pageLimit: number = 25) {
//     const results: SelectUser[] = []
//     for (let i = 0; i < pageLimit; i++) {
//         results.push({
//             id: faker.string.uuid(),
//             username: faker.internet.userName(),
//             isAdmin: faker.datatype.boolean(),
//             isSuperUser: faker.datatype.boolean(),
//             createdAt: faker.date.past().toISOString(),
//             updatedAt: faker.date.past().toISOString(),
//             verifiedAt: faker.date.past().toISOString(),
//             emails: [ {
//                 id: faker.string.uuid(),
//                 address: faker.internet.email(),
//                 isUserPrimary: true
//             }]
//         })
//     }
//     return results
// }

// function handleGetUsersResponse(request): PaginatedResponse<SelectUser> {
//     const totalCount = 250
//     const pageLimit = !!request.searchParams ? parseInt(request.searchParams.get("limit", "25")) : 25
//     const currentPage = !!request.searchParams ? parseInt(request.searchParams.get("page", "1")) : 1
//     const results = getMockUsers(pageLimit)
//     const pageCount = Math.ceil(totalCount / pageLimit)
//     const nextPage = currentPage != pageCount ? currentPage + 1 : undefined
//     const previousPage = currentPage != 1 ? currentPage - 1 : undefined
//     const resultStart = (currentPage - 1) * pageLimit + 1
//     const resultEnd = Math.min(currentPage * pageLimit, totalCount)
//     const orderBy = !!request.searchParams ? request.searchParams.get("orderBy", "createdAt:desc") : "createdAt:desc"

//     console.log("nextPage", currentPage + 1)

//     return {
//         success: true,
//         results,
//         pageLimit,
//         totalCount,
//         resultCount: results.length,
//         resultStart,
//         resultEnd,
//         currentPage,
//         nextPage,
//         previousPage,
//         orderBy,
//         pageCount,
//     }
// }

export const Default = Template.bind({})

Default.args = {
	// resource: "users",
	displayTitle: "User",
	FormComponent: AdminCreateUserForm
}

// for range of 10, lets add examples.example to emailAddresses with fake ids

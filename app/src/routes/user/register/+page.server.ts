import type { RequestEvent } from "@sveltejs/kit"



/** @type {import('./$types').PageLoad} */
export function load(event) {
	return {
		title: "Register"
	}
}



async function register (event: RequestEvent) {
	

	return {
		status: 201,
		body: {
			message: "Success"
		}
	}
}

export const actions: import('./$types').Actions = {
	register
}
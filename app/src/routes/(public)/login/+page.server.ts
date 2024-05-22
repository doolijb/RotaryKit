import type { RequestEvent } from "@sveltejs/kit"
import { forms, utils } from "$shared/validation"
import { users } from "$server/providers"

/** @type {import('./$types').PageLoad} */
export function load({locals}) {

	if (locals.user) {
		return {
			status: 302,
			redirect: "/"
		}
	}

	return {
		title: "Login"
	};
}
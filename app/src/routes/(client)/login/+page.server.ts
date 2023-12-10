import type { RequestEvent } from "@sveltejs/kit"
import { forms, utils } from "@validation"
import { users } from "@providers"

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
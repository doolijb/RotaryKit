import type { RequestEvent } from "@sveltejs/kit"
import { forms, utils } from "@validation"
import { requestData } from "@requests"
import { users } from "@providers"

/** @type {import('./$types').PageLoad} */
export function load() {
	return {
		title: "Login"
	};
}

const registerForm = utils.formValidator({
    definitions: forms.userLogin,
})

async function login (event: RequestEvent) {
	const data = await requestData({request: event.request})
	const form = registerForm
	const errors = await form.test(data)
	
	if (errors) {
		return {
			status: 400,
			body: {
				errors
			}
		}
	}

	await users.auth.login({
        event, 
        username: data.username,
        passphrase: data.passphrase
    })

	return {
		status: 201,
		body: {
			message: "Success"
		}
	}
}

export const actions: import('./$types').Actions = {
	login
}
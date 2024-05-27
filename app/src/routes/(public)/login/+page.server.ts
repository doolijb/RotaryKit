import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export function load({locals}) {

	// Redirect if user is already logged in
	if (locals.user) {
		return redirect(302, '/');
	}

	return {
		title: "Login"
	};
}
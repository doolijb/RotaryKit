import { redirect } from "@sveltejs/kit"

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	if (!event.locals.user || (!event.locals.user.isAdmin && !event.locals.user.isSuperUser)) {
		return redirect(300, "/login")
	}
	return await resolve(event)
}

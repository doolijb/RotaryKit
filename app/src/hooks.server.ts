import { boot } from "$server/boot"
import { logger } from "$server/logging"
import { userAuthentication, routeGuard } from "$server/middleware"

////
// BOOT
////

if (process.env.NODE_ENV !== "build") {
	await boot({
		envDefaults: {
			USER_TOKEN_EXPIRATION_HOURS: "72"
		}
	})
}

////
// MIDDLEWARE
////

const middleware: Middleware[] = [userAuthentication, routeGuard]

////
// REQUEST HANDLER
////

/** @type {import("@sveltejs/kit").Handle} */
export async function handle({ event, resolve }) {
	for (const handler of middleware) {
		await handler(event)
	}
	const response = await resolve(event)
	logger.resolvedRequest(event, response)
	return response
}

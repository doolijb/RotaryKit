import { redirect, type RequestEvent } from "@sveltejs/kit"

const adminRoutes = {
	"/admin": "/"
}

const authRoutes = {
	"/profile": "/login"
}

const unauthRoutes = {
	"/login": "/",
	"/register": "/",
	"/forgot-password": "/"
}

function checkGuardedRoute(requestedPath: string, routes: Record<string, string>) {
	requestedPath = requestedPath.replace("/__data.json", "")
	const guardedRoute: string | undefined = Object.keys(routes).find((route) =>
		requestedPath.startsWith(route)
	)
	if (guardedRoute) {
		return redirect(302, `${routes[guardedRoute]}?next=${requestedPath}`)
	}
}

export async function routeGuard(event: RequestEvent) {
	const requestedPath = new URL(event.request.url).pathname
	if (requestedPath.startsWith("/api")) {
		return
	}
	const user = event.locals.user
	let routesToCheck = []

	if (!user) {
		routesToCheck = [authRoutes, adminRoutes]
	} else {
		routesToCheck = user.isAdmin || user.isSuperUser ? [unauthRoutes] : [adminRoutes, unauthRoutes]
	}

	for (const routes of routesToCheck) {
		const redirectResponse = checkGuardedRoute(requestedPath, routes)
		if (redirectResponse) {
			return redirectResponse
		}
	}
}

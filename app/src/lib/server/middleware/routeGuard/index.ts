import { redirect, type RequestEvent } from "@sveltejs/kit"

const adminRoutes = {
    "/admin": "/"
}

const authRoutes = {
    "/profile": "/login",
}

const unauthRoutes = {
    "/login": "/",
    "/register": "/",
}

function checkGuardedRoute(requestedPath: string, routes: Record<string, string>) {
    const guardedRoute: string | undefined = Object.keys(routes).find(route => requestedPath.startsWith(route))
    console.log("Guarded route:", guardedRoute)
    if (guardedRoute) {
        return redirect(302, `${routes[guardedRoute]}?next=${requestedPath}`)
    }
}

export async function routeGuard(event: RequestEvent) {
    const requestedPath = new URL(event.request.url).pathname
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
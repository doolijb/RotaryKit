import { unauthorizedError, forbiddenError } from "@requests"

/**
 * Must be logged in with isSuperUser or isAdmin
 */
export async function handle({ event, resolve }) {
    /**
     * Must be logged in
     */
    if (!event.locals.user.user) {
        return unauthorizedError()
    }

    /**
     * Must be staff or super user
     */
    if (!event.locals.user.isAdmin && !event.locals.user.isSuperUser) {
        return forbiddenError()
    }

    /**
     * Continue
     */
    return await resolve(event)
}
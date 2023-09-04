import type { RequestEvent } from "@sveltejs/kit"
import type { KitEvent } from "sveltekit-zero-api"
import { hasAdminPermission } from "$server/requests"
import { InternalServerError, Ok } from "sveltekit-zero-api/http"
import { logger } from "$server/logging"
import { db, schema } from "$server/database"

/**
 * Admin dashboard view to get a list of new users
 */
export async function GET (event: KitEvent<null, RequestEvent>) {

    try {

        // Check permissions
        hasAdminPermission(event, schema.users)

        const results = await db.query.users.findMany({
            columns: {
                id: true,
                username: true,
                createdAt: true,
                verifiedAt: true,
            },
            orderBy: (e, { desc }) => desc(e.createdAt),
            limit: 10,
            with: {
                emails: {
                    columns: {
                        address: true,
                    },
                    where: (e: SelectEmail, {eq}) => eq(e.isUserPrimary, true),
                    limit: 1,
                }
            }
        })

        return Ok({body: {results}})

    } catch (err) {
        logger.exception(err, event)
        return InternalServerError()
    }
}
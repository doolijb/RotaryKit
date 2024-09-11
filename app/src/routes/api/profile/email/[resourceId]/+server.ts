import { db, schema } from "$server/database"
import { BadRequest, Forbidden, InternalServerError, Ok } from "sveltekit-zero-api/http"
import type { RequestEvent } from "@sveltejs/kit"
import type { KitEvent } from "sveltekit-zero-api"
import { logger } from "$server/logging"
import { eq } from "drizzle-orm"

interface Delete {
    body?: undefined
}

/**
 *  Add an email address to the user's account
 */
export async function DELETE (event: KitEvent<Delete, RequestEvent>) {

    try {
        
        /**
         * Check if user is not logged in
         */
        if (!event.locals.user) return Forbidden()

        /**
		 * Get the email address
		 */
        const email = await db.query.emails.findFirst({
            columns: {
                id: true,
                isUserPrimary: true
            },
            where: (e, { eq, and }) => and( 
                eq(e.id, event.params.resourceId), 
                eq(e.userId, event.locals.user.id),
            )
        })

        if (!email) {
            return BadRequest({ body: { message: "Email address not found" } })
        }

        if (email.isUserPrimary) {
            return BadRequest({ body: { message: "Cannot delete primary email address" } })
        }

        /**
         * Delete the email address
         */
        await db.delete(schema.emails).where(eq(schema.emails.id, email.id))
		
        /**
         * Return the response
         */
        return Ok({ body: { success: true, message: "Deleted email address" } })

    } catch (e) {
        logger.error(e)
        return InternalServerError()
    }
}
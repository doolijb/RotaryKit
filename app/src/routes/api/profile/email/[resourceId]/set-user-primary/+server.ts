import { db } from "$server/database"
import { emails, users } from "$server/providers"
import { BadRequest, Forbidden, InternalServerError, Ok } from "sveltekit-zero-api/http"
import type { RequestEvent } from "@sveltejs/kit"
import type { KitEvent } from "sveltekit-zero-api"
import { logger } from "$server/logging"

interface Put {
    body?: undefined
}

/**
 * Validate the email verification code and mark the email as verified
 * with propagation to the user.
 */
export async function PUT (event: KitEvent<Put, RequestEvent>) {

    try {

        /**
         * Check if user is not logged in
         */
        if (!event.locals.user) return Forbidden()
        
        /** 
         * Get the email
         */
        const email = await db.query.emails.findFirst({
            columns: {
                id: true,
                verifiedAt: true,
                isUserPrimary: true
            },
            where: (e, { eq, and }) => and(
                eq(e.id, event.params.resourceId),
                eq(e.userId, event.locals.user.id)
            )
        })

        if (!email) {
            return BadRequest({ body: { message: "Email address not found" } })
        }

        if (!email.verifiedAt) {
            return BadRequest({ body: { message: "Email address not verified" } })
        }

        if (email.isUserPrimary) {
            return BadRequest({ body: { message: "Email address already primary" } })
        }

        /**
         * Set the email as primary
         */
        logger.info(`Setting email ${email.id} as primary for user ${event.locals.user.id}`)
        await db.transaction(async (tx) => {
            await emails.setUserPrimary({
                tx,
                emailId: email.id,
                userId: event.locals.user.id
            })
        })
        
        /**
         * Return the response
         */
	    return Ok({ body: { success: true, message: "Primary email address updated" } })

    } catch (e) {
        logger.error(e)
        return InternalServerError()
    }

}
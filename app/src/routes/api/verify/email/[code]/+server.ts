import { db } from "$server/database"
import { emails } from "$server/providers"
import { BadRequest, InternalServerError, Ok } from "sveltekit-zero-api/http"
import type { RequestEvent } from "@sveltejs/kit"
import type { KitEvent } from "sveltekit-zero-api"
import { logger } from "$server/logging"

interface Get {
    body?: undefined
}

/**
 * Validate the email verification code and mark the email as verified
 * with propagation to the user.
 */
export async function GET (event: KitEvent<Get, RequestEvent>) {

    try {
        
        /** 
         * Get the verification code
         */
        let verification: SelectEmailVerification | void
        await db.transaction(async (tx) => {
            verification = await emails.validateCode({
                tx,
                code: event.params.code,
                propagate: true,
            })
        })

        /**
         * Check if the verification code was valid
         */
        if (!verification) {
            return BadRequest()
        }
        
        /**
         * Return the response
         */
	    return Ok({ body: { success: true }})

    } catch (e) {
        logger.error(e)
        return InternalServerError()
    }

}
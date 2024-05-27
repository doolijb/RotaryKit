import { db } from "$server/database"
import { emails } from "$server/providers"
import { BadRequest, InternalServerError, Ok } from "sveltekit-zero-api/http"
import type { RequestEvent } from "@sveltejs/kit"
import type { KitEvent } from "sveltekit-zero-api"

interface Post {
    body?: undefined
    params: {
        code: string
    }
}

/**
 * Validate the email verification code and mark the email as verified
 * with propagation to the user.
 */
export async function POST (event: KitEvent<Post, RequestEvent>) {

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
        console.error(e)
        return InternalServerError()
    }

}
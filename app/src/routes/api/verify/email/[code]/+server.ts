import { db } from "$database"
import { emails } from "$providers"
import { BadRequest, Created, InternalServerError, Ok } from "sveltekit-zero-api/http"
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
            verification = await emails.verifications.validateCode({
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
	    return Created({ body: { success: true }})

    } catch (e) {
        console.error(e)
        return InternalServerError()
    }

}
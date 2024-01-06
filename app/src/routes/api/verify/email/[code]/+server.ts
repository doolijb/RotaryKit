import { db } from "$database"
import { emails } from "$providers"
import { Ok } from "sveltekit-zero-api/http"
import type { RequestEvent } from "@sveltejs/kit"
import type { KitEvent } from "sveltekit-zero-api"

interface Get {
    body: undefined,
    params: {
        code: string,
    }
}

/**
 * Validate the email verification code and mark the email as verified
 * with propagation to the user.
 */
export async function GET (event: KitEvent<Get, RequestEvent>) {
    /** 
     * Get the verification code
     */
    await db.transaction(async (tx) => {
        await emails.verifications.validateCode({
            tx,
            code: event.params.code,
        })
    })
    
    /**
	 * Return the response
	 */
	return Ok({ body: { success: true }})
}
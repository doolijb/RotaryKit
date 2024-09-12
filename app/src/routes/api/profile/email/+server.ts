import { db, schema } from "$server/database"
import { emails } from "$server/providers"
import { BadRequest, Created, Forbidden, InternalServerError, Ok } from "sveltekit-zero-api/http"
import type { RequestEvent } from "@sveltejs/kit"
import type { KitEvent } from "sveltekit-zero-api"
import { logger } from "$server/logging"
import { validateData } from "$server/requests"
import { AddEmailAddress as PostForm } from "$shared/validation/forms"

const postForm = PostForm.init()

interface Get {
    body?: undefined
}

interface Post {
    body: {
        email: string
    }
}

/**
 * List the user's email addresses
 */
export async function GET (event: KitEvent<Get, RequestEvent>) {

    try {
        
        /**
		 * Check if user is not logged in
		 */
		if (!event.locals.user) return Forbidden()

        /**
         * Get the user's email addresses
         */
        const emails = await db.query.emails.findMany({
            columns: {
                id: true,
                address: true,
                verifiedAt: true,
                isUserPrimary: true
            },
            where: (e, { eq }) => eq(e.userId, event.locals.user.id),
            orderBy: (e, { asc }) => asc(e.address)
        })
        
        /**
         * Return the response
         */
	    return Ok({ body: { emails }})

    } catch (e) {
        logger.error(e)
        return InternalServerError()
    }

}

/**
 *  Add an email address to the user's account
 */
export async function POST (event: KitEvent<Post, RequestEvent>) {

    try {
        
        /**
         * Check if user is not logged in
         */
        if (!event.locals.user) return Forbidden()

        /**
		 * Validate the data
		 */
		const { data, errors } = await validateData<PostForm["Data"]>({ form: postForm, event })
		if (Object.keys(errors).length) return BadRequest({ body: { errors }})

        /**
         * Check if the email address is already in use
         */
        if (await emails.exists({ address: data.email })) {
            errors["email"] = {"Unavailable": "This email address is already in use"}
            return BadRequest({ body: { errors, message: "The email address is unavailable" }})
        }

        /**
         * Add the email address to the user's account
         */
        await db.transaction(async tx => {
            const [email] = await emails.create({
                tx,
                isVerified: false,
                userId: event.locals.user.id,
                address: data.email,
                isUserPrimary: false,
                returning: { id: schema.emails.id }
            })
            await emails.sendCode({ tx, emailId:email.id })
        })
        
        /**
         * Return the response
         */
        return Created({ body: { success: true } })

    } catch (e) {
        logger.error(e)
        return InternalServerError()
    }
}
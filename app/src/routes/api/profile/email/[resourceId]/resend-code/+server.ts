import { db } from "$server/database"
import { emails, users } from "$server/providers"
import { BadRequest, Created, Forbidden, InternalServerError, Ok } from "sveltekit-zero-api/http"
import type { RequestEvent } from "@sveltejs/kit"
import type { KitEvent } from "sveltekit-zero-api"
import { logger } from "$server/logging"
import { isNull } from "drizzle-orm"

interface Post {
	body?: undefined
}

/**
 * Resend a verification code for an email address
 */
export async function POST(event: KitEvent<Post, RequestEvent>) {
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
				address: true,
				isUserPrimary: true
			},
			where: (e, { eq, and }) =>
				and(
					isNull(e.verifiedAt),
					eq(e.id, event.params.resourceId),
					eq(e.userId, event.locals.user.id)
				)
		})

		if (!email) {
			return BadRequest({ body: { message: "Email address not found" } })
		}

		/**
		 * Send the verification code
		 */
		await db.transaction(async (tx) => {
			await emails.sendCode({ tx, emailId: email.id, username: event.locals.user.username })
		})

		/**
		 * Return the response
		 */
		return Created({
			body: { success: true, message: `Verification link sent to ${email.address}` }
		})
	} catch (e) {
		logger.error(e)
		return InternalServerError()
	}
}

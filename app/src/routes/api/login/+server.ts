import { users } from "$server/providers"
import { db } from "$server/database"
import { UserLogin as PostForm } from "$shared/validation/forms"
import { validateData } from "$server/requests"
import { BadRequest, InternalServerError, Forbidden, Ok } from "sveltekit-zero-api/http"
import type { RequestEvent } from "@sveltejs/kit"
import type { KitEvent } from "sveltekit-zero-api"
import { logger } from "$server/logging"

const postForm = PostForm.init()

type Post = {
	body: PostForm["Data"]
}

/**
 * Login a user
 */
export async function POST(event: KitEvent<Post, RequestEvent>) {
	try {
		console.log(event.cookies)

		/**
		 * Check if user is already logged in
		 */
		if (event.locals.user) return Forbidden({ body: { message: "You are already logged in" } })

		/**
		 * Validate the data
		 */
		const { data, errors } = await validateData({ form: postForm, event })
		if (Object.keys(errors).length) return BadRequest({ body: { errors } })

		/**
		 * Login
		 */
		let authUser: SelectUser | void
		const email = await db.query.emails.findFirst({
			where: (e, { eq, and }) => and(eq(e.address, data.email), eq(e.isUserPrimary, true)),
			with: {
				user: true
			}
		})

		if (email) {
			if (!email.verifiedAt) {
				return BadRequest({
					body: {
						message: "Email address is not verified"
					}
				})
			}

			if (email.user) {
				if (!email.user.verifiedAt) {
					return BadRequest({
						body: {
							message: "User account is not verified"
						}
					})
				}
				if (!email.user.isActive) {
					return BadRequest({
						body: {
							message: "User account is not active"
						}
					})
				}

				await db.transaction(async (tx) => {
					authUser = await users.login({
						tx,
						event,
						userId: email.userId,
						passphrase: data.passphrase
					})
				})
			}
		}

		/**
		 * Invalid credentials
		 */
		if (!authUser) {
			return BadRequest({
				body: {
					message: "Invalid username or passphrase"
				}
			})
		}

		/**
		 * Return the response
		 */
		return Ok()
	} catch (e) {
		logger.error(e)
		return InternalServerError()
	}
}

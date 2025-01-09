import { emails } from "$server/providers"
import { db, schema } from "$server/database"
import { UserLogin as PostForm } from "$shared/validation/forms"
import { validateData } from "$server/requests"
import {
	BadRequest,
	InternalServerError,
	Forbidden,
	Ok,
	TooManyRequests
} from "sveltekit-zero-api/http"
import type { RequestEvent } from "@sveltejs/kit"
import { logger } from "$server/logging"

const postForm = PostForm.init()

type Post = {
	body: PostForm["Data"]
}

const limiter = new RateLimiter({
	// A rate is defined as [number, unit]
	IP: [10, "h"], // IP address limiter
	IPUA: [5, "m"], // IP + User Agent limiter
	cookie: {
		// Cookie limiter
		name: getShortHash("login"), // Unique cookie name for this limiter
		secret: process.env.RATE_LIMITING_SECRET, // Use $env/static/private
		rate: [2, "m"],
		preflight: true // Require preflight call (see load function)
	}
})

/**
 * Login a user
 */
export async function POST(event: KitEvent<Post, RequestEvent>) {
	try {
		/**
		 * Rate limiting
		 */

		await limiter.cookieLimiter?.preflight(event)
		if (await limiter.isLimited(event)) {
			logger.warn(`Rate limiting login attempts from ${event.getClientAddress()}`)
			return TooManyRequests({
				body: { message: "You are doing that too often. Please wait a while before trying again." }
			})
		}

		/**
		 * Check if user is already logged in
		 */

		if (event.locals.user) return Forbidden({ body: { message: "You are already logged in" } })

		/**
		 * Validate the data
		 */

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
				return new BadRequest({
					body: {
						message: "Invalid username or passphrase"
					}
				})
			}

			/**
			 * Return the response
			 */
			return new Ok()
		} catch (e) {
			logger.error(e)
			return new InternalServerError()
		}
	}
)

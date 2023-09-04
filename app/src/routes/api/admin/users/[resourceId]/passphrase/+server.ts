import type { RequestEvent } from "@sveltejs/kit"
import { hasAdminPermission, validateData } from "$server/requests"
import { db, schema } from "$server/database"
import { AdminEditUserPassphrase as PutForm } from "$shared/validation/forms"
import type { KitEvent } from "sveltekit-zero-api"
import { Ok, InternalServerError, BadRequest, Forbidden, NotFound } from "sveltekit-zero-api/http"
import { users } from "$server/providers"

const putForm = PutForm.init()

interface Put {
	body: PutForm["Data"]
}

/**
 * Admin view to update a user's passphrase
 */
export async function PUT(event: KitEvent<Put, RequestEvent>) {
	try {
		if (
			!hasAdminPermission(event, schema.users) ||
			!hasAdminPermission(event, schema.passphrases)
		) {
			return Forbidden()
		}

		/**
		 * Validate the data
		 */
		const { data, errors } = await validateData({
			form: putForm,
			event
		})
		if (errors.keys) return BadRequest({ body: { errors } })

		////
		// Get the user
		////

		const user = await db.query.users.findFirst({
			columns: {
				id: true,
				isAdmin: true,
				isSuperUser: true
			},
			where: (u, { eq }) => eq(u.id, event.params.resourceId)
		})

		if (!user) {
			return NotFound()
		}

		////
		// MAKE SURE NOT UPDATING USER HIGHER THAN SELF
		////

		if (user.isSuperUser && !event.locals.user.isSuperUser) {
			return BadRequest({ body: { message: "You do not have permission to update a super user" } })
		}

		////
		// Set the new passphrase
		////
		await users.passphrase.set({
			userId: user.id,
			passphrase: data.passphrase
		})

		/**
		 * Send confirmation email
		 */
		await users.passphrase.notifyChange({ userId: user.id })

		return Ok({ body: { message: "Passphrase updated" } })
	} catch (err) {
		console.error(err)
		return InternalServerError()
	}
}

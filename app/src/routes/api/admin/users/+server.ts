import { adminApi, hasAdminPermission, validateData } from "$server/requests"
import type { PgTableWithColumns } from "drizzle-orm/pg-core"
import { db, schema } from "$server/database"
import { emails, users } from "$server/providers"
import { BadRequest, InternalServerError, Ok } from "sveltekit-zero-api/http"
import {
	AdminCreateUser as PostForm,
	AdminCreateUserWithPermissions as PostFormWithPermissions
} from "$shared/validation/forms"
import type { RequestEvent } from "@sveltejs/kit"
import type { KitEvent } from "sveltekit-zero-api"
import { logger } from "$server/logging"

const postForm = PostForm.init()
const postFormWithPermissions = new PostFormWithPermissions()

interface Get {
	query?: GetListQueryParameters
}

interface Post {
	body: PostFormWithPermissions["Data"] | PostForm["Data"]
}

/**
 * Admin view for a list of users
 */
export async function GET(event: KitEvent<Get, RequestEvent>) {
	if (!hasAdminPermission(event, schema.users)) {
		return Forbidden()
	}

	try {
		const columns: { [key: string]: boolean } = {
			id: true,
			username: true,
			createdAt: true,
			updatedAt: true,
			verifiedAt: true,
			isAdmin: true,
			isSuperUser: true
		}

		const availableRelations: AvailableRelations = {
			emails: {
				tableName: "emails",
				columns: {
					id: true,
					address: true,
					isUserPrimary: true
				},
				where: (e: PgTableWithColumns<any>, { eq }) => eq(e["isUserPrimary"], true)
			}
		}

		return await adminApi.getListOf<SelectUser>({
			event,
			tableName: "users",
			columns,
			availableRelations
		})
	} catch (err) {
		logger.exception(err, event)
		return InternalServerError()
	}
}

/**
 * @param event
 */
export async function POST(event: KitEvent<Post, RequestEvent>) {
	try {
		if (!hasAdminPermission(event, schema.users)) {
			return Forbidden()
		}

		/**
		 * Validate the data
		 */
		let useForm: PostForm | PostFormWithPermissions = postForm
		// Check if user is superuser
		if (event.locals.user.isSuperUser) {
			useForm = postFormWithPermissions
		}
		const { data, errors } = await validateData({
			form: useForm,
			event
		})

		if (errors.keys) return BadRequest({ body: { errors, message: "Validation failed" } })

		////
		// DATABASE VALIDATION
		////

		// Check if username is already taken
		if (await users.exists({ username: data.username })) {
			errors["username"] = { Taken: "This username is already in use" }
		}

		// If email, check if email is already taken
		if (data.email) {
			if (await emails.exists({ address: data.email })) {
				errors["email"] = { Taken: "This email is already in use" }
			}
		}

		// If errors, throw an error
		if (Object.entries(errors).length > 0) {
			return BadRequest({ body: errors })
		}

		////
		// CREATE USER
		////

		let userId: SelectUser["id"]
		let result: SelectUser

		await db
			.transaction(async (tx) => {
				// Create the user
				;[{ userId }] = await users.create({
					tx,
					username: data.username,
					isVerified: data.isVerified,
					isAdmin: data["isAdmin"] || false,
					isSuperUser: data["isSuperUser"] || false,
					returning: { userId: schema.users.id }
				})

				// If passphrase, create the passphrase
				if (data.passphrase) {
					await users.passphrase.set({
						tx,
						userId,
						passphrase: data.passphrase,
						createOnly: true
					})
				}

				// If email, create the email
				if (data.email) {
					await emails.create({
						tx,
						userId,
						address: data.email,
						isUserPrimary: true,
						isVerified: data.isVerified
					})
				}
			})
			.then(async () => {
				result = await db.query.users.findFirst({
					where: (u, { eq }) => eq(u.id, userId),
					with: {
						emails: true
					}
				})
			})

		// Return the user
		return Ok({
			body: { success: true, result }
		})
	} catch (err) {
		logger.exception(err, event)
		return InternalServerError()
	}
}

import { adminApi, hasAdminPermission, validateData } from "$server/requests"
import { db, schema } from "$server/database"
import type { RequestEvent } from "@sveltejs/kit"
import type { KitEvent } from "sveltekit-zero-api"
import {Ok, BadRequest, InternalServerError, Forbidden} from 'sveltekit-zero-api/http';
import { AdminCreateAdminRole as PostForm } from "$shared/validation/forms"
import { logger } from "$server/logging"

const postForm = PostForm.init()

interface GET {
	query?: GetListQueryParameters
}

interface Post {
	body: PostForm["Data"]
}

/**
 * Admin view for a list of admin roles
 */
export async function GET(event: KitEvent<GET, RequestEvent>) {
	try {
		// Check permissions
		if (!hasAdminPermission(event, schema.adminRoles)) {
			return Forbidden()
		}

		const columns: { [key: string]: boolean } = {
			id: true,
			name: true,
			createdAt: true,
			updatedAt: true
		}

		const availableRelations: AvailableRelations = {
			toAdminPermissions: {
				columns: {
					adminPermissionId: true
				},
				with: {
					adminPermission: {
						columns: {
							id: true,
							name: true,
							action: true,
							resource: true
						}
					}
				}
			},
			toUsers: {
				columns: {
					userId: true
				},
				with: {
					user: {
						columns: {
							id: true,
							username: true
						}
					}
				}
			}
		}

		return adminApi.getListOf<SelectAdminRole>({
			event,
			tableName: "adminRoles",
			columns,
			availableRelations
		})
	} catch (err) {
		logger.exception(err, event)
		return InternalServerError()
	}
}

/**
 * Admin view to create a new admin role
 */
export async function POST(event: KitEvent<Post, RequestEvent>) {
	try {
		/**
		 * Check permissions
		 */
		if (!hasAdminPermission(event, schema.adminRoles)) {
			return Forbidden()
		}

		/**
		 * Validate the data
		 */
		const { data, errors } = await validateData<PostForm["Data"]>({ form: postForm, event })
		if (Object.entries(errors).length > 0) return BadRequest({ body: errors })

		////
		// DATABASE VALIDATION
		////

		// Check if role name is already taken
		if (await db.query.adminRoles.findFirst({ where: (r, { eq }) => eq(r.name, data.name) })) {
			errors["name"] = { Taken: "This name is already in use" }
		}

		// If errors, throw an error
		if (Object.entries(errors).length > 0) {
			return BadRequest({ body: errors })
		}

		////
		// CREATE ADMIN ROLE
		////

		let adminRoleId: SelectAdminRole["id"]
		let result: SelectAdminRole

		await db
			.transaction(async (tx) => {
				// Create the role
				;[{ adminRoleId }] = await tx
					.insert(schema.adminRoles)
					.values({ name: data.name })
					.returning({ adminRoleId: schema.adminRoles.id })

				// Add the permissions
				await tx.insert(schema.adminRolesToPermissions).values(
					Object.values(data.adminPermissions).map((adminPermissionId: string) => ({
						adminRoleId: adminRoleId,
						adminPermissionId
					}))
				)
			})
			.then(async () => {
				result = await db.query.adminRoles.findFirst({
					where: (r, { eq }) => eq(r.id, adminRoleId)
				})
			})

		// Return the user
		return Ok({ status: 201, body: { success: true, result } })
	} catch (err) {
		logger.exception(err, event)
		return InternalServerError()
	}
}

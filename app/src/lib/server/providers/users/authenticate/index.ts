import { asc, desc, eq } from "drizzle-orm"
import { db, schema } from "$server/database"
import { images } from "$server/database/migrations/schema"
import { ImageStatus } from "$shared/constants"

interface AuthenticateAndValidate {
	tx?: typeof db
	tokenId: string
	token: string
	userAgent: {
		browser: {
			name: string
		}
		os: {
			name: string
		}
	}
	validate: true
}

interface AuthenticateWithoutValidation {
	tx?: typeof db
	tokenId: string
	token: null
	userAgent: null
	validate: false
}

const adminPermissionColumns = {
	name: true,
	action: true,
	resource: true
}

/**
 * Takes a userTokenId and returns a user if it's valid
 * Use UAParser for userAgent
 */
export async function authenticate({
	tx = db,
	tokenId,
	token = null,
	userAgent = null,
	validate = true
}: AuthenticateAndValidate | AuthenticateWithoutValidation): Promise<{
	user: SelectUser
	adminPermissions?: SelectAdminPermission[]
} | null> {
	////
	// GET USER TOKEN
	////

	const userToken = await tx.query.userTokens.findFirst({
		where: (t, { and, eq, gt }) => and(eq(t.id, tokenId), gt(t.expiresAt, new Date())),
		orderBy: (t, { desc }) => desc(t.createdAt),
		with: {
			user: {
				// columns: {
				// 	id: true,
				// 	username: true,
				// 	displayName: true,
				// 	isAdmin: true,
				// 	isSuperUser: true,
				// 	bio: true,
				// },
				with: {
					emails: true,
					profileImages: {
						columns: {
							smallWebpPath: true,
							smallJpgPath: true
						},
						orderBy: [desc(images.createdAt)],
						where: (i, { eq }) => eq(i.status, ImageStatus.PUBLISHED),
						limit: 1
					},
					toAdminRoles: {
						columns: {},
						with: {
							adminRole: {
								columns: {
									name: true
								},
								with: {
									toAdminPermissions: {
										columns: {},
										with: {
											adminPermission: {
												columns: adminPermissionColumns
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	})

	////
	// NO USER TOKEN
	////

	if (!userToken) {
		return null
	}

	/////
	// VALIDATE TOKEN
	////

	const browser = userAgent.browser.name || "Unknown"
	const os = userAgent.os.name || "Unknown"

	if (validate) {
		if (userToken.token !== token || userToken.browser !== browser || userToken.os !== os) {
			// If failure, expire the token and delete it from the client
			await tx
				.update(schema.userTokens)
				.set({
					expiresAt: new Date()
				})
				.where(eq(schema.userTokens.id, tokenId))
			throw new Error("Invalid token")
		}
	}

	////
	// USER PERMISSIONS
	////

	const res = {
		user: userToken.user,
		adminPermissions: undefined
	}

	if (!res.user.isAdmin && !res.user.isSuperUser) {
		delete userToken.user.toAdminRoles
		delete userToken.user.isAdmin
		delete userToken.user.isSuperUser
	} else {
		let adminPermissions = []
		if (res.user.isSuperUser) {
			adminPermissions = await tx.query.adminPermissions.findMany({
				columns: adminPermissionColumns
			})
		} else {
			for (const toAdminRole of userToken.user.toAdminRoles) {
				for (const toAdminPermission of toAdminRole.adminRole.toAdminPermissions) {
					if (!adminPermissions.includes(toAdminPermission.adminPermission)) {
						adminPermissions.push(toAdminPermission.adminPermission)
					}
				}
			}
		}
		res.adminPermissions = adminPermissions
	}

	////
	// RETURN
	////

	return res
}

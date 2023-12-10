import { eq } from "drizzle-orm"
import { db, schema } from "@database"

interface AuthenticateAndValidate {
	tx?: typeof db
	tokenId: string
	token: string
	userAgent: { [key: string]: any }
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
export default async function authenticate({
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
		with: {
			user: {
				with: {
					emails: true,
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

	if (validate) {
		if (
			userToken.token !== token ||
			userToken.browser !== userAgent.browser.name ||
			userToken.os !== userAgent.os.name
		) {
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

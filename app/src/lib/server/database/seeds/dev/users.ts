import { db, schema } from "$server/database"
import * as providers from "$server/providers"
import { logger } from "$server/logging"
import type { UUID } from "crypto"
import { eq } from "drizzle-orm"

interface UserSeedData {
	tx?: typeof db
	user: Parameters<typeof providers.users.create>[0]
	email: Parameters<typeof providers.emails.create>[0]
	passphrase: string
}

/**
 * Seed the users table with a users for development environment.
 *
 * @param tx
 */

export default async function users(tx = db): Promise<void> {
	// Make sure env is development
	if (process.env.NODE_ENV !== "development") {
		throw new Error("This seeder can only be run in development environment.")
	}

	const passphrase = "password"

	const superuser: UserSeedData = {
		user: {
			username: "superuser",
			isVerified: true,
			isSuperUser: true,
			returning: { id: schema.users.id }
		},
		email: {
			address: "superuser@example.com",
			isVerified: true,
			isUserPrimary: true
		},
		passphrase
	}

	const adminUser: UserSeedData = {
		user: {
			username: "admin",
			isVerified: true,
			isSuperUser: false,
			returning: { id: schema.users.id },
			isAdmin: true
		},
		email: {
			address: "admin@example.com",
			isVerified: true,
			isUserPrimary: true
		},
		passphrase
	}

	const regularUser: UserSeedData = {
		user: {
			username: "user",
			isVerified: true,
			isSuperUser: false
		},
		email: {
			address: "user@example.com",
			isVerified: true,
			isUserPrimary: true
		},
		passphrase
	}

	const users: UserSeedData[] = [superuser, adminUser, regularUser]

	for (const data of users) {
		await create({ tx, user: data.user, email: data.email, passphrase: data.passphrase })
	}

	process.exit(0)
}

async function create({ tx, user, email, passphrase }: UserSeedData) {
	logger.info(`Creating user: ${user.username}`)
	if (!(await providers.users.exists({ tx, ...user }))) {
		const results: [{ id: UUID }] = await providers.users.create({
			tx,
			...user,
			returning: { id: schema.users.id }
		})
		const userId = results[0].id
		logger.info(`Success: id = ${userId}`)
		await providers.users.passphrase.set({ tx, userId, passphrase })
		if (!(await providers.emails.exists({ tx, address: email.address }))) {
			await providers.emails.create({ tx, ...email, userId })
		} else {
			// TODO: userId is not setting
			db.update(schema.emails)
				.set({ userId: userId, ...email })
				.where(eq(schema.emails.address, email.address))
		}
	} else {
		logger.info(`User ${user.username} already exists`)
	}
}

users()

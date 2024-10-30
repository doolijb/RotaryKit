import { db, schema } from "$server/database"
import { users } from "$server/providers"
import { eq } from "drizzle-orm"

/**
 * Remove a user from the database and all associated data
 */
export async function remove({
	tx = db,
	userId,
	returning
}: {
	tx?: DbTransaction | typeof db
	userId: string
	returning?: ReturningSelect
}): PromisedQueryResult<typeof returning> {
	await users.passphrase.remove({ tx, userId })
	await tx.delete(schema.emails).where(eq(schema.emails.userId, userId))

	const query = tx.delete(schema.users).where(eq(schema.users.id, userId))

	// Returning?
	if (returning) {
		query.returning(returning)
	}

	// Return result
	return await query
}

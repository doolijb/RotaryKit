import { db, schema } from "$server/database"
import { eq } from "drizzle-orm"

/**
 * Revoke a user token
 */
export async function expire({
	tx = db,
	userTokenId: tokenId,
	returning
}: {
	tx?: DbTransaction | typeof db
	userTokenId: string
	returning?: ReturningSelect
}): PromisedQueryResult<typeof returning> {
	const query = tx
		.update(schema.userTokens)
		.set({
			expiresAt: new Date()
		})
		.where(eq(schema.userTokens.id, tokenId))
		.execute()

	// Returning?
	if (returning) {
		query.returning(returning)
	}

	// Return result
	return await query
}

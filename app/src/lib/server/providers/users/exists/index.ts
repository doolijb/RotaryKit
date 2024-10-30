import { db, schema } from "$server/database"
import { eq } from "drizzle-orm"

/**
 * Returns if an username is already in use
 *
 * @param param0
 * @returns
 */
export async function exists({
	tx = db,
	username
}: {
	tx?: DbTransaction | typeof db
	username: string
}): Promise<boolean> {
	const result = await tx
		.select({
			id: true
		})
		.from(schema.users)
		.where(eq(schema.users.username, username))
	return result.length > 0
}

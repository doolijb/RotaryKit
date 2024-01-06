import { db, schema } from "$database"
import { users } from "$providers"
import { eq } from "drizzle-orm"
import type { QueryResult } from "pg"

/**
 * Remove a user from the database and all associated data
 */
export default async function remove({
    tx=db,
    userId,
    returning,
}: {
    tx?: DbTransaction | typeof db,
    userId: string,
    returning?: ReturningSelect
}): PromisedQueryResult<typeof returning> {
    await users.passphrase.remove({tx, userId})
    await users.emails.removeAll({tx, userId})

    const query = tx.delete(schema.users).where(eq(
        schema.users.id, userId
    ))

    // Returning?
    if (returning) {
        query.returning(returning)
    }

    // Return result
    return await query
}
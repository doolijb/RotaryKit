import { db, schema } from "@database"
import { eq } from "drizzle-orm"
import type { QueryResult } from "pg"

/**
 * Revoke all user tokens
 */
export default async function expireAll({
    tx=db,
    userId,
    returning,
}: {
    tx?: DbTransaction | typeof db,
    userId: string,
    returning?: ReturningSelect
}): PromisedQueryResult<typeof returning> {
    const query = tx.update(schema.userTokens).set({
        expiresAt: new Date(),
    }).where(eq(schema.userTokens.userId, userId)).execute()

    // Returning?
    if (returning) {
        query.returning(returning)
    }

    // Return result
    return await query
}
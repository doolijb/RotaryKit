import { db, schema } from "@database"
import { eq } from "drizzle-orm"
import type { QueryResult } from "pg"

export default async function remove({
    tx=db,
    userId,
    returning,
}: {
    tx?: DbTransaction | typeof db,
    userId: string,
    returning?: ReturningSelect
}): PromisedQueryResult<typeof returning> {
    const query = tx.delete(schema.passphrases).where(eq(schema.passphrases.userId, userId))

    // Returning?
    if (returning) {
        query.returning(returning)
    }

    // Return result
    return await query
}
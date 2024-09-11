import { db, schema } from "$server/database"
import { and, eq, is, ne } from "drizzle-orm"
import { PgTransaction } from "drizzle-orm/pg-core"

export async function setUserPrimary({
    tx=db,
    emailId,
    userId,
    returning
}: {
    tx?: typeof db,
    emailId: string,
    userId?: string,
    returning?: ReturningSelect
}): PromisedQueryResult<typeof returning> {

    // Unset the primary email
    const ret = await tx.update(schema.emails).set({
        isUserPrimary: false
    }).where(and(
        eq(schema.emails.isUserPrimary, true),
        eq(schema.emails.userId, userId),
        ne(schema.emails.id, emailId)
    )).returning({
        id: schema.emails.id,
        address: schema.emails.address,
        isUserPrimary: schema.emails.isUserPrimary
    })

    // Set the primary email
    const query = tx.update(schema.emails).set({
        isUserPrimary: true,
    }).where(eq(schema.emails.id, emailId))

    // Returning?
    if (returning) {
        query.returning(returning)
    }

    PgTransaction

    // Return result
    return await query
}
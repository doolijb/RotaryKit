import { db, schema } from "@database"

export default async function create({
    tx=db,
    address,
    isVerified=false,
    userId,
    isUserPrimary=false,
    returning
}: {
    tx?: typeof db,
    address: string,
    isVerified?: boolean,
    userId?: string,
    isUserPrimary?: boolean,
    returning?: ReturningSelect
}): PromisedQueryResult<typeof returning> {

    // Create email
    const query = tx.insert(schema.emails)
    .values({
        address,
        verifiedAt: isVerified ? new Date() : null,
        userId,
        isUserPrimary,
    })

    // Returning?
    if (returning) {
        query.returning(returning)
    }

    // Return result
    return await query
}
import { schema, db } from "$server/database"

/**
 * Invalidate a user's passphrase
 */
export async function invalidate({
    tx = db,
    userId
}:{
    tx: DbTransaction | typeof db,
    userId: string
}): Promise<void> {
    // Set invalidatedAt to current timestamp
    await tx.update(schema.passphrases, {
        where: {userId},
        data: {invalidatedAt: new Date()}
    })
}
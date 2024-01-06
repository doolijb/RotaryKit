import { schema, db } from "$database"

/**
 * Invalidate a user's passphrase
 */
export default async function invalidate({
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
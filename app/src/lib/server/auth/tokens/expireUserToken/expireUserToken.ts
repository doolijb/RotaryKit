import { db, schema } from "@database"
import { eq } from "drizzle-orm"

/**
 * Revoke a user token
 */
export default async function expireUserToken({userTokenId: tokenId}: {userTokenId: string}): Promise<void> {
    await db.update(schema.userTokens).set({
        expiresAt: new Date(),
    }).where(eq(schema.userTokens.id, tokenId)).execute()
}
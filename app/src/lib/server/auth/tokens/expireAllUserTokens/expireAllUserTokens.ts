import { db, schema } from "@database"
import { eq } from "drizzle-orm"

/**
 * Revoke all user tokens
 */
export default async function expireAllUserTokens({userId}: {userId: string}): Promise<void> {
    await db.update(schema.userTokens).set({
        expiresAt: new Date(),
    }).where(eq(schema.userTokens.userId, userId)).execute()
}
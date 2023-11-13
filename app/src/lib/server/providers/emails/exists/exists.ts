import { db, schema } from "@database"
import { eq } from "drizzle-orm"

/**
 * Returns if an email address is already in use
 * 
 * @param param0 
 * @returns 
 */
export default async function exists({
    tx=db,
    address,
}: {
    tx?: DbTransaction | typeof db,
    address: string,
}): Promise<boolean> {
    const result = await tx.select({
        id: true
    }).from(schema.emails).where(
        eq(schema.emails.address, address)
    )
    return result.length > 0
}
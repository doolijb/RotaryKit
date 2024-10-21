import { db, schema } from "$server/database"
import * as storage from "$server/storage"
import { v4 as uuidv4 } from "uuid"
import { ImageStatus } from "$shared/constants"
import { eq } from "drizzle-orm"

export async function create({
    tx = db,
    file,
    uploadedByUserId,
    profileImageUserId,
    bucket = process.env.STORAGE_DEFAULT_BUCKET,
    returning
}: {
    tx?: typeof db
    file: File
    uploadedByUserId: string
    profileImageUserId?: string
    bucket?: string,
    returning?: ReturningSelect
}): PromisedQueryResult<typeof returning> {

    // Generate a uuid
    let uuid: string

    while (uuid == undefined) {
        uuid = uuidv4()
        const existing = (await db
            .select()
            .from(schema.images)
            .where(eq(schema.images.id, uuid))) as SelectImage[]
        if (existing.length) uuid = undefined
    }


    const now = new Date()

    const buffers =
        await storage.image.process({image: file, largeSize: false, mediumSize: false, fit: "cover"})
    const extension = file.name.split(".").pop().toLocaleLowerCase()
    const imageValues = await storage.image.save({
        file,
        buffers,
        extension,
        uuid,
        now,
        bucket,
        uploadedByUserId,
        profileImageUserId,
    })

    const query = tx.insert(schema.images).values({
        ...imageValues,
        status: ImageStatus.PUBLISHED,
    })

    // Returning?
    if (returning) {
        query.returning(returning)
    }

    // Return result
    return await query
}
import { db, schema } from "$server/database"
import { eq } from "drizzle-orm"
import * as storage from "$server/storage"

interface ParamsWithImage {
    tx?: typeof db
    id?: undefined
    image: SelectImage
    returning?: ReturningSelect
}

interface ParamsWithId {
    tx?: typeof db
    id: string
    image?: undefined
    returning?: ReturningSelect
}

export async function remove ({
    tx = db,
    image,
    id,
    returning
}: ParamsWithId | ParamsWithImage): PromisedQueryResult<typeof returning> {

    /**
     * Get image if id is provided
     */
    if (!image && id) {
        [image] = await tx
			.select()
			.from(schema.images)
			.where(eq(schema.images.id, id)) as SelectImage[]
    } else if (!image && !id) {
        throw new Error("Must provide either image or id")
    }

    /**
     * Delete image from storage
     */
    await storage.image.delete(image)

    /**
     * Delete image from database
     */
    const query = tx.delete(schema.images).where(eq(schema.images.id, image.id))

    // Returning?
    if (returning) {
        query.returning(returning)
    }

    // Return result
    return await query
}
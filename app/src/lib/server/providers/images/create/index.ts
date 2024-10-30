import { db, schema } from "$server/database"
import * as storage from "$server/storage"
import { v4 as uuidv4 } from "uuid"
import { ImageSizes, ImageStatus } from "$shared/constants"
import { eq } from "drizzle-orm"

export async function create({
	tx = db,
	file,
	title,
	uploadedByUserId,
	profileImageUserId,
	bucket = process.env.STORAGE_DEFAULT_BUCKET,
	status = ImageStatus.PUBLISHED,
	maxSize = ImageSizes.LARGE,
	returning
}: {
	tx?: typeof db
	file: File
	title?: string
	uploadedByUserId: string
	profileImageUserId?: string
	bucket?: string
	status?: typeof ImageStatus.Option
	maxSize?: typeof ImageSizes.Option
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

	if (!title) {
		title = file.name.split(".").slice(0, -1).join(".")
	}

	const now = new Date()
	const originalSize = [ImageSizes.ORIGINAL, ImageSizes.NO_OPTIMIZATION].includes(maxSize)
	const largeSize = [ImageSizes.ORIGINAL, ImageSizes.LARGE].includes(maxSize)
	const mediumSize = largeSize || ImageSizes.MEDIUM == maxSize
	const smallSize = mediumSize || ImageSizes.SMALL == maxSize

	const buffers = await storage.image.process({
		image: file,
		originalSize,
		largeSize,
		mediumSize,
		smallSize,
		fit: "cover"
	})
	const extension = file.name.split(".").pop().toLocaleLowerCase()
	const imageValues = await storage.image.save({
		file,
		buffers,
		extension,
		uuid,
		now,
		bucket,
		uploadedByUserId
	})

	if (profileImageUserId) {
		imageValues.profileImageUserId = profileImageUserId
	}

	const query = tx.insert(schema.images).values({
		...imageValues,
		title,
		status
	} as InsertImage)

	// Returning?
	if (returning) {
		query.returning(returning)
	}

	// Return result
	return await query
}

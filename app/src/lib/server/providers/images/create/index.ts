import { db, schema } from "$server/database"
import sharp from "sharp"
// import { S3 } from "aws-sdk"

// const s3 = new S3()

const ImageStatus = {
    PROCESSING: "processing",
    PUBLISHED: "published",
    ERROR_UPLOADING: "error_uploading",
    ERROR_PROCESSING: "error_processing",
}

export async function create({
    tx = db,
    file,
    uploadedByUserId,
    profileImageUserId = null,
    returning
}: {
    tx?: typeof db,
    file: File,
    uploadedByUserId: string,
    profileImageUserId?: string,
    returning?: ReturningSelect
}): PromisedQueryResult<typeof returning> {


    // Upload original file to S3
    const originalPath = await uploadToS3(file, file.name)

    // Process image
    const { webpPath, jpgPath, webpBytes, jpgBytes } = await processImage(file)

    // Delete original image from S3 if needed
    // await deleteFromS3(originalPath)

//     // Create image record in the database
//     const query = tx.insert(schema.images)
//         .values({
//             title: file.name,
//             originalPath,
//             originalBytes: file.size,
//             webpPath,
//             webpBytes,
//             jpgPath,
//             jpgBytes,
//             uploadedByUserId,
//             profileImageUserId,
//             status: ImageStatus.PUBLISHED,
//             uploadedAt: new Date(),
//             updatedAt: new Date(),
//         })

//     // Returning?
//     if (returning) {
//         query.returning(returning)
//     }

//     // Return result
//     return await query
}

async function uploadToS3(file: File, key: string): Promise<string> {
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        Body: file,
        ContentType: file.type,
    }
    const data = await s3.upload(params).promise()
    return data.Location
}

async function processImage(file: File): Promise<{ webpPath: string, jpgPath: string, webpBytes: number, jpgBytes: number }> {
    const buffer = await file.arrayBuffer()
    const image = sharp(Buffer.from(buffer))

    // Convert to WebP
    const webpBuffer = await image.clone().webp().toBuffer()
    const webpPath = await uploadToS3(new File([webpBuffer], `${file.name}.webp`, { type: "image/webp" }), `${file.name}.webp`)

    // Convert to JPEG
    const jpgBuffer = await image.clone().jpeg().toBuffer()
    const jpgPath = await uploadToS3(new File([jpgBuffer], `${file.name}.jpg`, { type: "image/jpeg" }), `${file.name}.jpg`)

    return {
        webpPath,
        jpgPath,
        webpBytes: webpBuffer.length,
        jpgBytes: jpgBuffer.length,
    }
}
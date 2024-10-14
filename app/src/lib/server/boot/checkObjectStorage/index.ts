import { logger } from "$server/logging"
import { S3Client, HeadBucketCommand, CreateBucketCommand } from "@aws-sdk/client-s3"

/**
 * Check the S3/Minio connection and create any missing buckets
 */
export async function checkObjectStorage() {
    logger.info("• Checking object storage connection...")

    const {
        STORAGE_ACCESS_KEY_ID,
        STORAGE_SECRET_ACCESS_KEY,
        STORAGE_DEFAULT_REGION,
        STORAGE_DEFAULT_BUCKET,
        STORAGE_ENDPOINT
    } = process.env

    if (!STORAGE_ACCESS_KEY_ID || !STORAGE_SECRET_ACCESS_KEY || !STORAGE_DEFAULT_REGION || !STORAGE_DEFAULT_BUCKET || !STORAGE_ENDPOINT) {
        logger.error({message: "Missing required S3/Minio environment variables", error: null})
        process.exit(1)
    }

    const s3 = new S3Client({
        credentials: {
            accessKeyId: STORAGE_ACCESS_KEY_ID,
            secretAccessKey: STORAGE_SECRET_ACCESS_KEY,
        },
        region: STORAGE_DEFAULT_REGION,
        endpoint: STORAGE_ENDPOINT,
        forcePathStyle: true // needed for minio
    })

    const buckets = [STORAGE_DEFAULT_BUCKET, /* Add more bucket names here if needed */]

    for (const bucket of buckets) {
        try {
            await s3.send(new HeadBucketCommand({ Bucket: bucket }))
            logger.info(`Bucket exists: ${bucket}`)
        } catch (error) {
            if (error.name === 'NotFound') {
                try {
                    await s3.send(new CreateBucketCommand({ Bucket: bucket }))
                    logger.info(`Created bucket: ${bucket}`)
                } catch (createError) {
                    logger.error({ message: `Failed to create bucket: ${bucket}`, error: createError})
                    process.exit(1)
                }
            } else {
                logger.error({ message: `Error checking bucket: ${bucket}`, error})
                process.exit(1)
            }
        }
    }
}
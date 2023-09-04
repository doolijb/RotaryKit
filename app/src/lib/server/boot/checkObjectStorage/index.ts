import { logger } from "$server/logging"
import { HeadBucketCommand, CreateBucketCommand, PutBucketPolicyCommand } from "@aws-sdk/client-s3"
import { URL } from "url"
import { client } from "$server/storage"

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
		STORAGE_PRIVATE_ENDPOINT
	} = process.env

	if (
		!STORAGE_ACCESS_KEY_ID ||
		!STORAGE_SECRET_ACCESS_KEY ||
		!STORAGE_DEFAULT_REGION ||
		!STORAGE_DEFAULT_BUCKET ||
		!STORAGE_PRIVATE_ENDPOINT
	) {
		logger.error({ message: "Missing required S3/Minio environment variables", error: null })
		process.exit(1)
	}

	// Validate the endpoint URL
	let endpoint
	try {
		endpoint = new URL(STORAGE_PRIVATE_ENDPOINT)
	} catch (error) {
		logger.error({
			message: `Invalid URL for STORAGE_PRIVATE_ENDPOINT: ${STORAGE_PRIVATE_ENDPOINT}`,
			error
		})
		process.exit(1)
	}

	const buckets = [STORAGE_DEFAULT_BUCKET /* Add more bucket names here if needed */]

	for (const bucket of buckets) {
		try {
			await client.send(new HeadBucketCommand({ Bucket: bucket }))
		} catch (error) {
			if (error.name === "NotFound") {
				try {
					await client.send(new CreateBucketCommand({ Bucket: bucket }))
					const bucketPolicy = {
						Version: "2012-10-17",
						Statement: [
							{
								Sid: "PublicReadGetObject",
								Effect: "Allow",
								Principal: "*",
								Action: "s3:GetObject",
								Resource: `arn:aws:s3:::${bucket}/*`
							}
						]
					}
					await client.send(
						new PutBucketPolicyCommand({
							Bucket: bucket,
							Policy: JSON.stringify(bucketPolicy)
						})
					)
					logger.info(`Created bucket: ${bucket} with public read policy`)
				} catch (createError) {
					logger.error({ message: `Failed to create bucket: ${bucket}`, error: createError })
					process.exit(1)
				}
			} else {
				logger.error({ message: `Error checking bucket: ${bucket}`, error })
				process.exit(1)
			}
		}
	}
}

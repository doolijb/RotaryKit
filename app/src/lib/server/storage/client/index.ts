import { S3Client } from "@aws-sdk/client-s3"
import { URL } from "url"
import { logger } from "$server/logging"

const {
	STORAGE_ACCESS_KEY_ID,
	STORAGE_SECRET_ACCESS_KEY,
	STORAGE_DEFAULT_REGION,
	STORAGE_PRIVATE_ENDPOINT
} = process.env

if (
	!STORAGE_ACCESS_KEY_ID ||
	!STORAGE_SECRET_ACCESS_KEY ||
	!STORAGE_DEFAULT_REGION ||
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

const client = new S3Client({
	credentials: {
		accessKeyId: STORAGE_ACCESS_KEY_ID,
		secretAccessKey: STORAGE_SECRET_ACCESS_KEY
	},
	region: STORAGE_DEFAULT_REGION,
	endpoint: endpoint.toString(),
	forcePathStyle: process.env.STORAGE_FORCE_PATH_STYLE !== undefined ? !!process.env.STORAGE_FORCE_PATH_STYLE : true
})

export { client }

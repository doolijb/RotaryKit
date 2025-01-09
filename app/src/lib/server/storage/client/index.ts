import { S3Client } from "@aws-sdk/client-s3"
import { URL } from "url"
import { logger } from "$server/logging"

const {
	STORAGE_ACCESS_KEY_ID,
	STORAGE_SECRET_ACCESS_KEY,
	STORAGE_DEFAULT_REGION,
	STORAGE_PRIVATE_ENDPOINT,
	STORAGE_PUBLIC_ENDPOINT,
	STORAGE_FORCE_PATH_STYLE
} = process.env

if (
	STORAGE_ACCESS_KEY_ID === undefined ||
	STORAGE_SECRET_ACCESS_KEY === undefined ||
	STORAGE_DEFAULT_REGION === undefined ||
	STORAGE_PRIVATE_ENDPOINT === undefined ||
	STORAGE_PUBLIC_ENDPOINT === undefined ||
	STORAGE_FORCE_PATH_STYLE === undefined ||
	STORAGE_PRIVATE_ENDPOINT_IS_BUCKET === undefined ||
	STORAGE_PUBLIC_ENDPOINT_IS_BUCKET === undefined
) {
	const missingVariables = [
		"STORAGE_ACCESS_KEY_ID",
		"STORAGE_SECRET_ACCESS_KEY",
		"STORAGE_DEFAULT_REGION",
		"STORAGE_DEFAULT_BUCKET",
		"STORAGE_PUBLIC_ENDPOINT",
		"STORAGE_PRIVATE_ENDPOINT",
		"STORAGE_FORCE_PATH_STYLE"
	].filter((variable) => process.env[variable] === undefined)
	logger.error({ message: `Missing required S3/Minio environment variables: ${missingVariables.join(", ")}` })
	process.exit(1)
}

// Validate the endpoint URL
let endpoint
let publicEndpoint
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
	forcePathStyle: STORAGE_FORCE_PATH_STYLE === "true",
})

const publicClient = new S3Client({
	credentials: {
		accessKeyId: STORAGE_ACCESS_KEY_ID,
		secretAccessKey: STORAGE_SECRET_ACCESS_KEY
	},
	region: STORAGE_DEFAULT_REGION,
	endpoint: publicEndpoint.toString(),
	forcePathStyle: STORAGE_FORCE_PATH_STYLE === "true",
})


export { client, publicClient }

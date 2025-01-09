import { client } from "$server/storage"
import { ObjectCannedACL, PutObjectCommand } from "@aws-sdk/client-s3"
import { logger } from "$server/logging"

async function save({
	key,
	body,
	bucket = undefined,
	ACL = ObjectCannedACL.private
}: {
	key: string
	body: Buffer | ArrayBuffer | string
	bucket?: string
	ACL?: ObjectCannedACL
}) {
	logger.debug({ message: `Saving object to Storage: ${key}` })
	const command = new PutObjectCommand({
		Bucket: bucket || process.env.STORAGE_DEFAULT_BUCKET,
		Key: key,
		Body: body as Buffer,
		ACL
	})
	await client.send(command)
}

export { save }

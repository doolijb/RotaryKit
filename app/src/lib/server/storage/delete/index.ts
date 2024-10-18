import { client } from "$server/storage";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { logger } from "$server/logging";

async function del({
    bucket=undefined,
    key
}:{
    bucket?: string, 
    key: string
}) {

    logger.debug({ message: `Deleting object from Storage: ${key}` })
    const command = new DeleteObjectCommand({
        Bucket: bucket || process.env.STORAGE_DEFAULT_BUCKET,
        Key: key,
    })
    await client.send(command)
}

export { del as delete }
import { logger } from "$server/logging"
import * as storage from "$server/storage"

export async function del(image: SelectImage) {
	const { STORAGE_DEFAULT_BUCKET: bucket } = process.env

	const imagePaths = [
		image.originalPath,
		image.webpPath,
		image.jpgPath,
		image.mediumWebpPath,
		image.mediumJpgPath,
		image.smallWebpPath,
		image.smallJpgPath
	]

	imagePaths.forEach(async (path) => {
		try {
			if (image.originalPath) {
				await storage.delete({ key: path.split(`${bucket}/`).pop() })
			}
		} catch (e) {
			logger.error({ message: `Failed to delete image: ${path}`, error: e })
		}
	})
}

export { del as delete }

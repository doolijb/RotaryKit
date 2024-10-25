import * as storage from "$server/storage"

export async function save({
	file,
    buffers,
    extension,
    uuid,
    now= new Date(),
    bucket,
    uploadedByUserId,
}: {
	file: File
    buffers: {
		originalBuffer: ArrayBuffer
		webpBuffer: ArrayBuffer
		jpgBuffer: ArrayBuffer
		mediumWebpBuffer: ArrayBuffer
		mediumJpgBuffer: ArrayBuffer
		smallWebpBuffer: ArrayBuffer
		smallJpgBuffer: ArrayBuffer
	}
    extension: string
    uuid: string
    now: Date
    bucket: string
    uploadedByUserId: string
}) {
        const year = now.getFullYear()
        const month = now.getMonth() + 1
        const day = now.getDate()
        const path = `public/uploads/images/${year}/${month}/${day}`
		const baseName = `${uploadedByUserId}__${uuid}`
		const mediumBaseName = `${baseName}__medium`
		const smallBaseName = `${baseName}__small`
		const toSave = []
		const imageValues = {
			totalBytes: 0,
			createdAt: now,
			updatedAt: now,
			uploadedByUserId,
		} as {[key: string]: any}

		// Original image
		if (buffers.originalBuffer) {
			const originalKey = `${path}/${baseName}.${extension}`
			toSave.push({ key: originalKey, body: buffers.originalBuffer })
			imageValues.originalPath = `/${bucket}/${originalKey}`
			imageValues.originalBytes = buffers.originalBuffer.byteLength
			imageValues.totalBytes += imageValues.originalBytes
		}

		// WebP Optimized image
		if (buffers.webpBuffer) {
			const webpKey = `${path}/${baseName}.webp`
			const webpBytes = buffers.webpBuffer.byteLength
			toSave.push({ key: webpKey, body: buffers.webpBuffer })
			imageValues.webpPath = `/${bucket}/${webpKey}`
			imageValues.webpBytes = webpBytes
			imageValues.totalBytes += webpBytes
		}

		// JPG Optimized image
		if (buffers.jpgBuffer) {
			const jpgKey = `${path}/${baseName}.jpg`
			const jpgBytes = buffers.jpgBuffer.byteLength
			toSave.push({ key: jpgKey, body: buffers.jpgBuffer })
			imageValues.jpgPath = `/${bucket}/${jpgKey}`
			imageValues.jpgBytes = jpgBytes
			imageValues.totalBytes += jpgBytes
		}

		// WebP Optimized medium image
		if (buffers.mediumWebpBuffer) {
			const mediumWebpKey = `${path}/${mediumBaseName}.webp`
			const mediumWebpBytes = buffers.mediumWebpBuffer.byteLength
			toSave.push({ key: mediumWebpKey, body: buffers.mediumWebpBuffer })
			imageValues.mediumWebpPath = `/${bucket}/${mediumWebpKey}`
			imageValues.mediumWebpBytes = mediumWebpBytes
			imageValues.totalBytes += mediumWebpBytes
		}

		// JPG Optimized medium image
		if (buffers.mediumJpgBuffer) {
			const mediumJpgKey = `${path}/${mediumBaseName}.jpg`
			const mediumJpgBytes = buffers.mediumJpgBuffer.byteLength
			toSave.push({ key: mediumJpgKey, body: buffers.mediumJpgBuffer })
			imageValues.mediumJpgPath = `/${bucket}/${mediumJpgKey}`
			imageValues.mediumJpgBytes = mediumJpgBytes
			imageValues.totalBytes += mediumJpgBytes
		}
		

		// WebP Optimized small image
		if (buffers.smallWebpBuffer) {
			const smallWebpKey = `${path}/${smallBaseName}.webp`
			const smallWebpBytes = buffers.smallWebpBuffer.byteLength
			toSave.push({ key: smallWebpKey, body: buffers.smallWebpBuffer })
			imageValues.smallWebpPath = `/${bucket}/${smallWebpKey}`
			imageValues.smallWebpBytes = smallWebpBytes
			imageValues.totalBytes += smallWebpBytes
		}

		// JPG Optimized small image
		if (buffers.smallJpgBuffer) {
			const smallJpgKey = `${path}/${smallBaseName}.jpg`
			const smallJpgBytes = buffers.smallJpgBuffer.byteLength
			toSave.push({ key: smallJpgKey, body: buffers.smallJpgBuffer })
			imageValues.smallJpgPath = `/${bucket}/${smallJpgKey}`
			imageValues.smallJpgBytes = smallJpgBytes
			imageValues.totalBytes += smallJpgBytes
		}

		// Upload the images
		toSave.forEach(async ({ key, body }) => {
			await storage.save({ key, body })
		})

		return imageValues
}
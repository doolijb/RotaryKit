

export async function save({
    originalBuffer,
    webpBuffer,
    jpgBuffer,
    mediumWebpBuffer,
    mediumJpgBuffer,
    smallWebpBuffer,
    smallJpgBuffer,
    extension,
    uuid,
    now,
    bucket,
    uploadedByUserId,
    profileImageUserId,
}: {
    originalBuffer: Buffer
    webpBuffer: Buffer
    jpgBuffer: Buffer
    mediumWebpBuffer: Buffer
    mediumJpgBuffer: Buffer
    smallWebpBuffer: Buffer
    smallJpgBuffer: Buffer
    extension: string
    uuid: string
    now: number
    bucket: string
    uploadedByUserId: string
    profileImageUserId?: string
}) {
        const year = now.getFullYear()
        const month = now.getMonth() + 1
        const day = now.getDate()
        const path = `public/uploads/images/${year}/${month}/${day}`
		const baseName = `${event.locals.user.id}__${uuid}`
		const mediumBaseName = `${baseName}__medium`
		const smallBaseName = `${baseName}__small`
		const toSave = []
		const imageValues = {
			title: file.name.split(".").slice(0, -1).join("."),
			createdAt: now,
			updatedAt: now,
			uploadedByUserId,
			profileImageUserId,
		} as SelectImage

		// Original image
		if (originalBuffer) {
			const originalKey = `${path}/${baseName}.${extension}`
			toSave.push({ key: originalKey, body: originalBuffer })
			imageValues.originalPath = `/${bucket}/${originalKey}`
			imageValues.originalBytes = originalBuffer.byteLength
		}

		// WebP Optimized image
		if (webpBuffer) {
			const webpKey = `${path}/${baseName}.webp`
			const webpBytes = webpBuffer.byteLength
			toSave.push({ key: webpKey, body: webpBuffer })
			imageValues.webpPath = `/${bucket}/${webpKey}`
			imageValues.webpBytes = webpBytes
		}

		// JPG Optimized image
		if (jpgBuffer) {
			const jpgKey = `${path}/${baseName}.jpg`
			const jpgBytes = jpgBuffer.byteLength
			toSave.push({ key: jpgKey, body: jpgBuffer })
			imageValues.jpgPath = `/${bucket}/${jpgKey}`
			imageValues.jpgBytes = jpgBytes
		}

		// WebP Optimized medium image
		if (mediumWebpBuffer) {
			const mediumWebpKey = `${path}/${mediumBaseName}.webp`
			const mediumWebpBytes = mediumWebpBuffer.byteLength
			toSave.push({ key: mediumWebpKey, body: mediumWebpBuffer })
			imageValues.mediumWebpPath = `/${bucket}/${mediumWebpKey}`
			imageValues.mediumWebpBytes = mediumWebpBytes
		}

		// JPG Optimized medium image
		if (mediumJpgBuffer) {
			const mediumJpgKey = `${path}/${mediumBaseName}.jpg`
			const mediumJpgBytes = mediumJpgBuffer.byteLength
			toSave.push({ key: mediumJpgKey, body: mediumJpgBuffer })
			imageValues.mediumJpgPath = `/${bucket}/${mediumJpgKey}`
			imageValues.mediumJpgBytes = mediumJpgBytes
		}
		

		// WebP Optimized small image
		if (smallWebpBuffer) {
			const smallWebpKey = `${path}/${smallBaseName}.webp`
			const smallWebpBytes = smallWebpBuffer.byteLength
			toSave.push({ key: smallWebpKey, body: smallWebpBuffer })
			imageValues.smallWebpPath = `/${bucket}/${smallWebpKey}`
			imageValues.smallWebpBytes = smallWebpBytes
		}

		// JPG Optimized small image
		if (smallJpgBuffer) {
			const smallJpgKey = `${path}/${smallBaseName}.jpg`
			const smallJpgBytes = smallJpgBuffer.byteLength
			toSave.push({ key: smallJpgKey, body: smallJpgBuffer })
			imageValues.smallJpgPath = `/${bucket}/${smallJpgKey}`
			imageValues.smallJpgBytes = smallJpgBytes
		}

		// Upload the images
		toSave.forEach(async ({ key, body }) => {
			await storage.save({ key, body })
		})
}
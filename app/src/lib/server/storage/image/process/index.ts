import sharp from "sharp"
import { ImageResolutions } from "$shared/constants"

export async function process({
	image,
	fit = "contain",
	resolution = { width: ImageResolutions.LARGE[0], height: ImageResolutions.LARGE[1] },
	mediumResolution = { width: ImageResolutions.MEDIUM[0], height: ImageResolutions.MEDIUM[1] },
	smallResolution = { width: ImageResolutions.SMALL[0], height: ImageResolutions.SMALL[1] },
	jpgQuality = 40,
	webpQuality = 83,
	largeSize = true,
	mediumSize = true,
	smallSize = true,
	originalSize = false
}: {
	image: File
	fit?: "contain" | "cover" | "fill" | "inside" | "outside"
	resolution?: { width: number; height: number }
	mediumResolution?: { width: number; height: number }
	smallResolution?: { width: number; height: number }
	jpgQuality?: number
	webpQuality?: number
	largeSize?: boolean
	mediumSize?: boolean
	smallSize?: boolean
	originalSize?: boolean
}) {
	const buffer = await image.arrayBuffer()
	const imageBuffer = Buffer.from(buffer)

	const effort = 6

	const webpBuffer = largeSize
		? await sharp(imageBuffer)
				.resize(resolution.width, resolution.height, { fit })
				.flatten({ background: "#FFFFFF" })
				.webp({ quality: webpQuality, effort, smartSubsample: true, preset: "photo" })
				.toBuffer()
		: null

	const jpgBuffer = largeSize
		? await sharp(imageBuffer)
				.resize(resolution.width, resolution.height, { fit })
				.flatten({ background: "#FFFFFF" })
				.jpeg({ quality: jpgQuality })
				.toBuffer()
		: null

	const mediumWebpBuffer = mediumSize
		? await sharp(imageBuffer)
				.resize(mediumResolution.width, mediumResolution.height, { fit })
				.flatten({ background: "#FFFFFF" })
				.webp({ quality: webpQuality, effort, smartSubsample: true, preset: "photo" })
				.toBuffer()
		: null

	const mediumJpgBuffer = mediumSize
		? await sharp(imageBuffer)
				.resize(mediumResolution.width, mediumResolution.height, { fit })
				.flatten({ background: "#FFFFFF" })
				.jpeg({ quality: jpgQuality })
				.toBuffer()
		: null

	const smallWebpBuffer = smallSize
		? await sharp(imageBuffer)
				.resize(200, 200, { fit })
				.flatten({ background: "#FFFFFF" })
				.webp({ quality: webpQuality, effort, smartSubsample: true, preset: "photo" })
				.toBuffer()
		: null

	const smallJpgBuffer = smallSize
		? await sharp(imageBuffer)
				.resize(smallResolution.width, smallResolution.height, { fit })
				.flatten({ background: "#FFFFFF" })
				.jpeg({ quality: jpgQuality })
				.toBuffer()
		: null

	return {
		originalBuffer: originalSize ? buffer : null,
		webpBuffer,
		jpgBuffer,
		mediumWebpBuffer,
		mediumJpgBuffer,
		smallWebpBuffer,
		smallJpgBuffer
	}
}

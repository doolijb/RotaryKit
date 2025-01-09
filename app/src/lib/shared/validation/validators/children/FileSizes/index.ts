import { Validator } from "$shared/validation/base"
import { fileTypes } from "$shared/data"

interface FileSizesArgs {
	maxSize: number // in MB
	typeMaxSizes?: Partial<Record<keyof typeof fileTypes, number>> // in MB
}

/**
 * Validates that a file does not exceed the allowed size
 *
 * @param args: {number} args.maxSize - maximum size for all files in MB
 * @param args: {Partial<Record<keyof typeof fileTypes, number>>} args.typeMaxSizes - optional object of file types and their individual max sizes in MB
 */
export class FileSizes extends Validator {
	args: FileSizesArgs = { maxSize: 5 } // Default maxSize set to 5 MB
	badge = "File sizes"
	key = "fileSizes"
	message = () =>
		`File size must not exceed ${this.args.maxSize} MB` +
		(this.args.typeMaxSizes ? ` or individual file type limits` : "")

	constructor(args: FileSizesArgs = { maxSize: 5 }) {
		super()
		if (!args.maxSize || args.maxSize <= 0) {
			throw new Error("You must provide a maximum size greater than 0 for the files.")
		}
		if (args.typeMaxSizes) {
			for (const [type, size] of Object.entries(args.typeMaxSizes)) {
				if (size <= 0) {
					throw new Error(`The maximum size for file type ${type} must be greater than 0.`)
				}
			}
		}
		this.args = args
	}

	test = async ({ key, data }) => {
		const files: File[] = data[key]
		if (!Array.isArray(files) && !files) return true
		return files.every((file) => {
			const extension = file.name.split(".").pop()?.toLowerCase()
			const fileType = Object.keys(fileTypes).find((type) =>
				fileTypes[type].includes(extension || "")
			) as keyof typeof fileTypes | undefined
			if (!fileType) return false
			const typeMaxSize = this.args.typeMaxSizes?.[fileType]
			const maxSizeInBytes =
				(typeof typeMaxSize === "number" ? typeMaxSize : this.args.maxSize) * 1024 * 1024
			return file.size <= maxSizeInBytes
		})
	}
}

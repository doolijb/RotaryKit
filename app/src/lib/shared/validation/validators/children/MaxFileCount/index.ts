import { Validator } from "$shared/validation/base"
import { fileTypes } from "$shared/data"

interface MaxFileCountArgs {
	maxCount: number
	typeMaxCount?: Partial<Record<keyof typeof fileTypes, number>>
}

/**
 * Validates that the number of files does not exceed the allowed count
 *
 * @param args: {number} args.maxCount - maximum number of files, regardless of type
 * @param args: {Partial<Record<keyof typeof fileTypes, number>>} args.typeMaxCount - optional object of file types and their individual max counts
 */
export class MaxFileCount extends Validator {
	args: MaxFileCountArgs = { maxCount: 1 } // Default maxCount set to 1
	badge = "Max file count"
	key = "maxFileCount"
	message = () =>
		`Total number of files must not exceed ${this.args.maxCount}` +
		(this.args.typeMaxCount ? ` or individual file type limits` : "")

	constructor(args: MaxFileCountArgs = { maxCount: 1 }) {
		super()
		if (!args.maxCount || args.maxCount <= 0) {
			throw new Error("You must provide a maximum count greater than 0 for the files.")
		}
		if (args.typeMaxCount) {
			for (const [type, count] of Object.entries(args.typeMaxCount)) {
				if (count <= 0) {
					throw new Error(`The maximum count for file type ${type} must be greater than 0.`)
				}
			}
		}
		this.args = args
	}

	test = async ({ key, data }) => {
		const files: File[] = data[key]

		if (!Array.isArray(files) && !files) return true
		if (files.length > this.args.maxCount) return false

		const fileTypeCounts: Partial<Record<keyof typeof fileTypes, number>> = {}

		for (const file of files) {
			const extension = file.name.split(".").pop()?.toLowerCase() as keyof typeof fileTypes
			const fileType = Object.keys(fileTypes).find((type) =>
				fileTypes[type].includes(extension || "")
			) as keyof typeof fileTypes | undefined
			if (!fileType) return false

			fileTypeCounts[fileType] = (fileTypeCounts[fileType] || 0) + 1
			const typeMaxCount = this.args.typeMaxCount?.[fileType]
			if (typeMaxCount && fileTypeCounts[fileType]! > typeMaxCount) return false
		}

		return true
	}
}

import { Validator, Primitive } from "$shared/validation/base"
import { children as c } from "$shared/validation/validators"

/**
 * Validates that a value is an array of files
 */
class Root extends Validator {
	key = "files"
	badge = "Files"
	message = "Must be an array of files"
	isHidden = true
	test = async ({ key, data }) => {
		const value = data[key]
		if (value == null || value == undefined) return true
		if (!Array.isArray(value)) return false
		return value.every((file) => file instanceof File)
	}
}

export class Files extends Primitive<File[]> {
	Root = Root
	fileTypes = this.stageValidator(c.FileTypes) // Provide appropriate extensions
	fileSizes = this.stageValidator(c.FileSizes)
	maxFileCount = this.stageValidator(c.MaxFileCount)
}

import { validators as v } from "$shared/validation"
import { FormSchema } from "$shared/validation/base"
import { ImageSizes, ImageStatus } from "$shared/constants"

export class AdminCreateImage extends FormSchema {
	fields = {
		title: v.String.init().maxLength({ max: 100 }).minLength({ min: 5 }),
		image: v.Files.init()
			.fileSizes({ maxSize: 50 })
			.fileTypes({
				fileTypes: ["image"]
			})
			.maxFileCount({ maxCount: 1 }),
		maxSize: v.String.init().selectOptions({ options: ImageSizes.options }),
		status: v.String.init().selectOptions({ options: ImageStatus.options })
	}
	optional = {}
	fieldAttributes = {
		title: {
			label: "Title"
		},
		image: {
			label: "Image"
		},
		maxSize: {
			label: "Max size",
			defaultValue: ImageSizes.LARGE
		},
		status: {
			label: "Status",
			defaultValue: ImageStatus.PUBLISHED
		}
	}
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ObserveForm = FormDataOf<AdminCreateImage>

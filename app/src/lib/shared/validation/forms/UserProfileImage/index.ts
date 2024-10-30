import { validators as v } from "$shared/validation"
import { FormSchema } from "$shared/validation/base"

export class UserProfileImage extends FormSchema {
	fields = {
		image: v.Files.init()
			.fileSizes({ maxSize: 15 })
			.fileTypes({
				extensions: ["png", "jpg", "jpeg", "webp"]
			})
			.maxFileCount({ maxCount: 1 })
	}
	optional = {}
	fieldAttributes = {
		image: {
			label: "Profile image"
		}
	}
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ObserveForm = FormDataOf<UserProfileImage>

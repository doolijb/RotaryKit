import { validators as v, fields } from "$shared/validation"
import { FormSchema } from "$shared/validation/base"

export class AdminEditEmail extends FormSchema {
	fields = {
		address: fields.email(),
		userId: v.String.init(),
		isVerified: v.Boolean.init(),
		isUserPrimary: v.Boolean.init()
	}
	optional = {
		userId: true,
		isUserPrimary: true
	}
	fieldAttributes = {
		address: {
			label: "Email Address"
		},
		isVerified: {
			label: "Is Verified"
		},
		userId: {
			label: "User"
		},
		isUserPrimary: {
			label: "Is User Primary"
		}
	}
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ObserveForm = FormDataOf<AdminEditEmail>

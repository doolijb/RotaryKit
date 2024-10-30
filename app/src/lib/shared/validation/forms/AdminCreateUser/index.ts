import { fields, validators as v } from "$shared/validation"
import { FormSchema } from "$shared/validation/base"

export class AdminCreateUser extends FormSchema {
	fields = {
		username: fields.username(),
		email: fields.email(),
		passphrase: fields.passphrase(),
		isVerified: v.Boolean.init()
	}
	optional = {
		email: true
	}
	fieldAttributes = {
		username: {
			label: "Username"
		},
		email: {
			label: "Email"
		},
		passphrase: {
			label: "Passphrase"
		},
		isVerified: {
			label: "Is Verified"
		}
	}
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ObserveForm = AdminCreateUser["Data"]

// import { browser } from "$app/environment"
import { popupSettings } from "$shared/validation/utils"
import type { PopupSettings } from "@skeletonlabs/skeleton-svelte"

class Validator {
	static init(args = {}) {
		const validator = new this()
		validator.args = { ...validator.args, ...args }
		if (typeof validator.badge === "function") {
			validator.badge = validator.badge()
		}
		if (typeof validator.message === "function") {
			validator.message = validator.message()
		}
		validator.popup = popupSettings()
		return validator
	}
	popup?: PopupSettings
	isHidden = false
	args: object
	isSticky = false
	key: string
	badge: string | (() => string)
	message: string | (() => string)
	test: ValidatorTest
}

export { Validator }

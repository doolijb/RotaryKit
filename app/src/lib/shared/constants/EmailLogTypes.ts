export class EmailLogTypes {
	static readonly EMAIL_VERIFICATION = "Email Verification"
	static readonly PASSPHRASE_RESET = "Password Reset"
	static readonly PASSPHRASE_CHANGED = "Password Changed"

	static readonly Options:
		| typeof EmailLogTypes.EMAIL_VERIFICATION
		| typeof EmailLogTypes.PASSPHRASE_RESET
		| typeof EmailLogTypes.PASSPHRASE_CHANGED
}

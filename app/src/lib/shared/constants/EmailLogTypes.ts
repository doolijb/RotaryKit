export class EmailLogTypes {
    static readonly EMAIL_VERIFICATION = "Email Verification"
    static readonly PASSWORD_RESET = "Password Reset"
    static readonly PASSWORD_CHANGED = "Password Changed"

    static readonly Options: typeof EmailLogTypes.EMAIL_VERIFICATION | typeof EmailLogTypes.PASSWORD_RESET | typeof EmailLogTypes.PASSWORD_CHANGED
}
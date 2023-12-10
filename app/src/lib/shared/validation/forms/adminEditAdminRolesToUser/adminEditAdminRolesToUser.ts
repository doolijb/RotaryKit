import { validators } from "@validation"

export default {
    adminRoles: {
        array: {
            validator: validators.isArray
        }
    }
} as FormValidatorDefinition
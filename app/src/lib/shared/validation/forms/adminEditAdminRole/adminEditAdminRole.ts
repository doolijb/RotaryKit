import { validators } from "@validation"

export default {
    name: {
        required: {
            validator: validators.required
        }
    },
    adminPermissions: {
        required: {
            validator: validators.required
        },
        array: {
            validator: validators.isArray
        }
    }
} as FormValidatorDefinition
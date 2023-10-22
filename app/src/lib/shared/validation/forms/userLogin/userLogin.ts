import { validators } from "@validation"

export default {
    username: {
        required: {
            // We aren't validating the content here, just making sure it's present
            validator: validators.required
        }
    },
    passphrase: {
        // We aren't validating the content here, just making sure it's present
        required: {
            validator: validators.required
        }
    },
} as FormValidatorDefinition
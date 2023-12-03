import { fields, validators } from "@validation"
import deepmerge from "deepmerge"

export default {
    username: deepmerge(fields.username, {
        required: {
            validator: validators.required
        }
    }),
    email: fields.email,
    isVerified: {
        boolean: {
            validator: validators.boolean
        }
    },
    /** This is optional, a passphrase can be set later */
    passphrase: fields.passphrase,
    /**
     * This should be removed from the definition if the user is not a super user
     */
    isAdmin: {
        boolean: {
            validator: validators.boolean
        }
    },
    /**
     * This should be removed from the definition if the user is not a super user
     */
    isSuperUser: { 
        boolean: {
            validator: validators.boolean
        }
    }

} as FormValidatorDefinition
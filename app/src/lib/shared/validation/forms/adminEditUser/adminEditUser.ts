import { fields, validators } from "@validation"

export default {
    verifiedAt: {
        // date: {
        //     validator: validators.date
        // }
    },
    isActive: {
        boolean: {
            validator: validators.boolean
        }
    },
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
import { db } from "@database"
import { emails } from "@providers"

/**
 * Validate the email verification code and mark the email as verified
 * with propagation to the user.
 * 
 * @param {{code:string}} event.params
 * @returns {{success: true}}
 */
async function GET ({ 
    params 
}:{
    params: {
        code: string,
    }
}): Promise<{[key:string]: any}> {
    // Get the verification code
    await db.transaction(async (tx) => {
        await emails.verifications.validateCode({
            tx,
            code: params.code,
        })
    })
    
    return {
        success: true,
    }
}

export default {
    GET,
}
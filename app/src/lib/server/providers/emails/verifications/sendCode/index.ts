import { db, schema } from "$server/database"
import { eq } from "drizzle-orm"
import { send } from "$server/emails"
import { EmailVerificationCode } from "$client/emailTemplates"
import { EmailLogTypes } from "$shared/constants"

/**
 * Creates an email validation code if one does not already exist,
 * and sends it to the email address.
 * 
 * @param {typeof db} args.tx - The database transaction. Defaults to `db`.
 * @param {string} args.emailId - The email id to send the code to.
 * @returns {Promise<void>} The results of args.returning, or void.
 * 
 * @example
 * import { emails } from "$server/providers"
 * 
 * await emails.verification.sendCode({ emailId: emailId })
 */
export async function sendCode({
    tx=db,
    emailId,
    username=null,
}: {
    tx?: typeof db,
    emailId: string,
    username?: string,
}): Promise<void> {

    let code: string
    const expiresAt = null // TODO
    const subject= "Email Verification"

    // Check if there is already a code
    const result = await tx.query.emailVerifications.findFirst({
        where: (v, {and, eq, isNull}) => and(
            eq(v.emailId, emailId),
            isNull(v.verifiedAt),
            isNull(v.expiresAt), // TODO: Check if expired compared to now
        ),
        with: {
            email: true
        }
    })

    // If there is a code, use it or create a new one
    if (result) {
        // Create a new code
        code = result.id
    } else {
        [{code}] = await tx.insert(schema.emailVerifications).values({
            emailId: emailId,
            expiresAt
        }).returning({
            code: schema.emailVerifications.id,
        })
    }

    const [{toAddress}] = await tx.select({
        toAddress: schema.emails.address,
    }).from(schema.emails).where(eq(schema.emails.id, emailId)).limit(1)

    const transportConfig = {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        secure: process.env.NODE_ENV === "production",
    }

    if (process.env.SMTP_USER || process.env.SMTP_PASSWORD) {
        transportConfig["auth"] = {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        }
    }

    const url = process.env.APP_URL + "/verify/email/" + code

    await send({
        subject,
        to: toAddress,
        template: EmailVerificationCode,
        args: {
            url,
            name: username,
            expiresAt,
            subject
        },
        type: EmailLogTypes.EMAIL_VERIFICATION
    })
}
import { db, schema } from "@database"
import { EmailVerificationCode } from "@components"
import { render } from "svelte-email"
import nodemailer from "nodemailer"
import { eq } from "drizzle-orm"

/**
 * Creates an email validation code if one does not already exist,
 * and sends it to the email address.
 * 
 * @param {typeof db} args.tx - The database transaction. Defaults to `db`.
 * @param {string} args.emailId - The email id to send the code to.
 * @returns {Promise<void>} The results of args.returning, or void.
 * 
 * @example
 * import { emails } from "@providers"
 * 
 * await emails.verification.sendCode({ emailId: emailId })
 */
export default async function sendCode({
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
    const subject: string = "Email Verification"

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

    // Send the code
    const transporter = nodemailer.createTransport(transportConfig)

    const url = process.env.APP_URL + "/verify/email/" + code

    const html = render({
        template: EmailVerificationCode, 
        props: {
            url,
            name: username,
            expiresAt,
            subject
        } 
    })

    const options = {
        from: `"${process.env.SMTP_DISPLAY_NAME}" <${process.env.SMTP_FROM_ADDRESS}>`,
        to: toAddress,
        subject,
        html,
    }

    await transporter.sendMail(options).catch((error) => {
        console.error(error)
        throw error
    })
}